import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import http from "http"
import { fileURLToPath } from 'url';
import path from "path"
import { Server as SocketIOServer } from 'socket.io';
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import "dotenv/config"
import orderRouter from "./routes/orderRoute.js"
import { userAdminRouter } from "./routes/useradminRoute.js"
import deliveryRouter from "./routes/deliveryRoute.js"
import promoCodeRouter from "./routes/promoCodeRoute.js"
import deliveryRateRouter from "./routes/deliveryRateRoute.js"
import redisClient from "./utils/redisClient.js";
// app config

const app = express()

const server = http.createServer(app)
const port = 4004

// app middleware


// app.use(cors())
app.set("view engine", "ejs")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname)
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: ['http://localhost:5173', "http://localhost:5174"] }))
app.use(express.json())
// app.use(express.urlencoded({ extended: false }))


// connection db


//websocket
const io = new SocketIOServer(server, {
    cors: {
        origin: ['http://localhost:5173', "http://localhost:5174"],
        methods: ['GET', 'POST'],
        credentials: true
    }
});
io.on("connection", (socket) => {
    socket.on("send_location", (data) => {
        io.emit("receive_location", { id: socket.id, ...data })
        console.log(data, socket.id)
    })

    socket.on("disconnect", () => {
        io.emit("user_disconnected", socket.id)
    })
    console.log("connected");


    socket.on('newOrder', (orderData) => {
        // بث الطلب الجديد إلى جميع العملاء المتصلين (بما في ذلك الإدمن)
        io.emit('newOrder', orderData);
        console.log(`asdasdasdasdasda ${orderData}`)
    });
    socket.on('orderStatusUpdated',
        (orderStatus) => {
            // Broadcast the updated order status to all connected clients
            io.emit('orderStatusUpdated', orderStatus);
            const { _id, newStatus, ...otherData } = orderStatus
            console.log(`Order status updated: id=${_id}, newStatus=${newStatus}`, new Date(), otherData); // Log with timestamp and potentially filtered data
            console.log(`Order status updated: id=${_id}, newStatasdus=${orderStatus.newStatus}`, new Date(), otherData); // Log with timestamp and potentially filtered data
        });


    socket.on("joinRoom", ({ token }) => {
        console.log(`Driver with token: ${token} joined.`);
        socket.join(token);
    });

    // استقبال الحدث عند تعيين الطلب
    socket.on("deliverymanSelected", ({ token, orderId, name }) => {
        console.log(`Order ${orderId} assigned to driver with token ${token}`);
        // إرسال الطلب فقط إلى الغرفة الخاصة بالسائق
        io.to(token).emit("newOrder", { name, orderId });
    });

    socket.on('updateLocation', ({ token, location }) => {
        console.log(`Location update from driver ${token}:`, location);

        // إرسال الموقع إلى العملاء المهتمين (الغرف ذات الصلة)
        io.to(token).emit('locationUpdate', location);
    });

    // عند فصل الاتصال
    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });


})


// api endpoint
app.use("/api/food", foodRouter)
app.use("/api/user", userRouter)
app.use("/images", express.static("uploads"))
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/deivery", deliveryRouter)
app.use("/api/userAdmin", userAdminRouter)
app.use("/api/promo-code", promoCodeRouter)
app.use("/api/delivery-rate", deliveryRateRouter)

const startServer = async () => {
    try {
        // await redisClient.connect();
        console.log("Redis connected ✅");

        connectDB();

        server.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });

    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
};
startServer();