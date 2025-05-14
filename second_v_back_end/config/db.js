import mongoose from "mongoose"



export const connectDB = async () => {
    mongoose.connect("mongodb://ahmadhesham797979:froGGUJtfK0DhpH6@ac-qfqlwrn-shard-00-00.flrmboq.mongodb.net:27017,ac-qfqlwrn-shard-00-01.flrmboq.mongodb.net:27017,ac-qfqlwrn-shard-00-02.flrmboq.mongodb.net:27017/?ssl=true&replicaSet=atlas-cxz9l8-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster7")
        .then(() => {
            console.log("Connection is Successful")
        }).catch(() => {
            console.log("Connection is Failed")
        })

}