import axios from 'axios'
import React, { useEffect, useState } from 'react'
import "./Order.css"
import { toast } from 'react-toastify'
import Modal from "react-modal"
import io from "socket.io-client"
const socket = io('ws://localhost:4004', {
    withCredentials: true,
    autoConnect: () => {
        console.log('Socket.IO client connected!');
        // Perform actions after successful connection
    },
    disconnect: () => {
        console.log('Socket.IO client disconnected!');
        // Handle disconnection gracefully
    },
});
const Orders = ({ url }) => {
    const [orders, setOrders] = useState([])
    const [orderData, setOrderData] = useState({}); // State to store order details
    const [orderID, setOrderID] = useState("")
    const [orderStatus, setOrderStatus] = useState("")
    const [openModal, setOpenModal] = useState(false);
    const [availableDeliverymen, setAvailableDeliverymen] = useState([]);

    const [selectedDeliveryman, setSelectedDeliveryman] = useState('');
    const printModalContent = () => {
        const modalContent = document.getElementById('modal-content');
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(modalContent.outerHTML);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    };
    const guestDetails = ["phone", "state", "street", "email"]
    const guestName = ["firstName", "lastName"]

    const fetchAllOrders = async () => {
        const response = await axios.get(url + "/api/order/list")
        if (response.data.success) {
            setOrders(response.data.data);
            console.log(response.data.data)

        }
        else {
            toast.error("Error")
        }


    }
    useEffect(() => {
        socket.on("newOrder", async () => {
            try {
                // جلب الطلب الأخير من قاعدة البيانات
                const response = await axios.get(`${url}/api/order/latest`);

                if (response.data.success) {
                    const latestOrder = response.data.order; // الطلب الأخير من قاعدة البيانات

                    // تحديث قائمة الطلبات بالطلب الجديد
                    setOrders((prevOrders) => [...prevOrders, latestOrder]);
                } else {
                    console.error("Failed to fetch latest order:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching latest order:", error);
            }
        });

        return () => {
            socket.off("newOrder"); // إزالة الاستماع عند إلغاء الاشتراك
        };
    }, []);

    const news = async (order) => {
        const response = await axios.post(url + "/api/order/oneorder", { _id: order._id })
        console.log(order)

        try {
            if (response.data.success) {
                // const orderData = response.data.data; // Access the order data object

                setOrderData(response.data.data); // Store order data in state
                setOpenModal(true);


            } else {
                console.error(response.data.message); // Handle potential errors
            }
        }
        catch (error) {
            console.error(error); // Log errors for debugging
        }
    };
    const handleModalClose = () => setOpenModal(false); // Function to close the modal
    useEffect(() => {
        fetchAllOrders()

    }, [])

    const availableDeliveries = async () => {
        try {
            const response = await axios.get("http://localhost:4004/api/deivery/deliverymen");
            const filteredDeliverymen = response.data.data.filter(deliveryman => deliveryman.state === true); // Filter for active deliverymen
            setAvailableDeliverymen(filteredDeliverymen);
        } catch (error) {
            console.error("Error fetching deliverymen:", error);
        }
    };

    useEffect(() => {
        availableDeliveries(); // Fetch deliverymen on component mount

    }, []);
    // const [selectedStatus, setSelectedStatus] = useState({});
    const handleStatusChange = async (orderId, newStatus) => {
        console.log(newStatus, orderId)
        setOrderID(orderId)
        setOrderStatus(newStatus)
        try {
            // Call your backend API endpoint to update order status
            const response = await axios.post("http://localhost:4004/api/order/updatestatus", { _id: orderId, status: newStatus });
            // setSelectedStatus({status:newStatus})
            socket.emit('orderStatusUpdated', { _id: orderId, newStatus });

            if (response.data.data) {
                // Update the order data in your frontend state (if applicable)
                console.log('Order status updated successfully!');
                // ... update your frontend state (optional) ...
            } else {
                console.error('Error updating order status:', response.data.message);
                // Handle errors (e.g., display an error message to the user)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors (e.g., display an error message to the user)
        }
    };


    const handleDeliverymanChange = async (orderId, selectedDeliverymanId) => {
        setSelectedDeliveryman(selectedDeliverymanId); // Update selected deliveryman state

        try {
            const selectedDeliverymanData = availableDeliverymen.find(
                (deliveryman) => deliveryman._id === selectedDeliverymanId

            );

            if (!selectedDeliverymanData) {
                console.log(selectedDeliverymanId)
                console.error('Selected deliveryman not found in available list');
                return; // Exit early if no matching deliveryman found
            }

            let name // Extract the name
            name = selectedDeliverymanData.name;
            let orderNum = orderId
            console.log(name)


            const response = await axios.post("http://localhost:4004/api/order/selectdelivery", {
                _id: orderId,
                deliveryMen: selectedDeliverymanId, // Use deliveryMan with the name property
                deliveryMenName: name

            });

            const assignOrder = await axios.post("http://localhost:4004/api/deivery/assignorder", {
                deliveryManId: selectedDeliverymanId, orderId
            })
            if (assignOrder.data.data) {
                console.log(assignOrder.data.data)
                socket.emit("deliverymanSelected", {
                    token: selectedDeliverymanData.token, // إرسال التوكن
                    orderId,
                    name: selectedDeliverymanData.name
                });

            }


            if (response.data.data) {
                console.log('Order status updated successfully!');
                // Update the order data in your frontend state (if applicable)
                // ... update your frontend state (optional) ...
            } else {
                console.error('Error updating order status:', response.data.message);
                // Handle errors (e.g., display an error message to the user)
            }

        } catch (error) {
            console.error('Error updating order status:', error);
            // Handle errors (e.g., display an error message to the user)
        }

        // Send data to server only if a valid deliveryman is selected:

    };
    useEffect(() => {
        socket.on("orderStatusUpdated", ({ _id, newStatus }) => {
            // البحث عن الطلب المراد تحديثه وتحديث حالته
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === _id ? { ...order, status: newStatus } : order
                )
            );
        });

        return () => {
            socket.off('orderStatusUpdated'); // إزالة الاستماع عند إلغاء الاشتراك
        };
    }, [socket]);
    return (
        <div className='order add'>
            <h3>Order Page</h3>

            <div className="order-list">
                {orders.map((order, index) => (
                    <div key={index} className="order-item">
                        <div onClick={() => news(order)}>
                            <p className='order-item-firstName' >
                                {order.address.firstName}
                            </p>

                            <p className="order-item-phoneNumber">
                                {order.address.phone}
                            </p>



                            <p>
                                {order.payment === false ? "not Paid" : "paid"}
                            </p>
                            {order.status === "onTheWay" ? (<button>Track order</button>) : (<p>Complete</p>)}
                        </div>
                        <select name="status" id="status" onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                            <option value={order.status}>{order.status}</option>
                            <option value="complete">complete</option>
                            <option value="on the way">on the way</option>
                        </select>
                        <select
                            name="availableDeliveries"
                            id="availableDeliveries"
                            onChange={(e) => handleDeliverymanChange(order._id, e.target.value)}>

                            <option value="">
                                {order.deliveryMenName && order.deliveryMenName !== "not specific"
                                    ? order.deliveryMenName
                                    : "-- Select Deliveryman --"}
                            </option>
                            {availableDeliverymen.map((deliveryman) => (


                                <option key={deliveryman._id} value={deliveryman._id} >
                                    {deliveryman.name}
                                </option>

                            )
                            )}
                        </select>
                    </div>
                ))}
            </div>
            <Modal
                id='modal-content'
                isOpen={openModal}
                onRequestClose={handleModalClose}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)', // Customize modal overlay opacity
                    },
                    content: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '400px', // Adjust modal width as needed
                        // overflow: "visible",
                        height: "90vh",
                        backgroundColor: 'white', // Customize modal background color
                        padding: '20px', // Customize modal content padding
                        border: '1px solid #ccc', // Add a border for styling
                    },
                }}
            >
                {orderData && openModal === true && (
                    <>
                        <h2>Order Details</h2>
                        <h3 className='paymentMethod'>{`payment method :${orderData.paymentMethod}`}</h3>
                        <h4>guestName</h4>
                        <div className='guestName'>
                            {guestName.map((key, index) => (
                                <p key={index}>
                                    {` ${orderData.address[key]}`}
                                </p>
                            ))}
                        </div>
                        <h4>guestDetails</h4>
                        <div className='guestDetails'>
                            {guestDetails.map((key, index) => (
                                <p key={index}>
                                    {orderData.address[key]}
                                </p>
                            ))}
                        </div>

                        <h4>order Details</h4>
                        <div className='orderDetails'>

                            {orderData.items.map((item, index) => (
                                <div key={index}>
                                    <h4>name</h4>
                                    <p> {item["Quantity"] + " x " + item["name"] + " " + item["size"]}</p>
                                    <h4>composDetails</h4>
                                    <div className='composDetails'>
                                        {item.compos.map((compo, index) => (
                                            <div key={index} className='composContainer'> <p className='compo'>{compo}</p></div>

                                        ))}
                                    </div>
                                    <h4>addonsDetails</h4>
                                    <div className='addonsDetails'>
                                        {item.addons.map((addon, index) => (
                                            <div key={index} className='addonsContainer'> <p className='addon'>{addon.name}</p></div>

                                        ))}
                                    </div>

                                </div>

                            ))}
                        </div>

                        {/* {Object.keys(orderData).map((key, index) => (
                            <p key={index}>{`${key}: ${orderData[key]}`}</p>
                        ))} */}
                        <button onClick={handleModalClose}>Close</button>
                        <button onClick={() => printModalContent()}>Print</button>
                    </>
                )}
            </Modal>

        </div >

    )
}

export default Orders
