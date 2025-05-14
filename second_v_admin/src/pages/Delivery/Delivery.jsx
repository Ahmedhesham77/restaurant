import { React, useState, useEffect } from 'react'
import { assets } from "../../assets/assets"
import "./Delivery.css"
import axios from 'axios'
const Delivery = () => {
    const [image, setImage] = useState(null);
    const [data, setData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        image
    });
    const [activeView, setActiveView] = useState('availableDeliveries'); // Initial view

    const [state, setState] = useState(true);
    const [availableDeliveries, setAvailableDeliveries] = useState([]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", image);
        formData.append("name", data.name);
        formData.append("phone", data.phone);
        formData.append("email", data.email);
        formData.append("password", data.password);
        console.log("helli")
        try {
            const response = await axios.post('http://localhost:4004/api/deivery/add', formData);
            console.log(response.data); // Handle success response
        } catch (error) {
            console.error(error);
        }
    };

    const availabelDelivery = async () => {
        try {
            const response = await axios.get("http://localhost:4004/api/deivery/deliverymen")
            console.log(response.data.data)
            setAvailableDeliveries(response.data.data);
        } catch (error) {
            console.log(error)
        }
    }
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    };

    const rendering = (view) => {
        setActiveView(view);
    };
    const renderDeliveryList = () => {

        return (
            <div className="available-deliveries">
                <h2>Available Deliveries</h2>
                {availableDeliveries.length > 0 ? (
                    <ul>
                        {availableDeliveries.map((delivery) => (
                            <li key={delivery._id}>
                                <p>Name: {delivery.name}</p>
                                <p>Plate: {delivery.password}</p>
                                {/* If 'state' field exists in your backend model */}
                                {delivery.state !== undefined && (
                                    <p>State: {delivery.state ? 'Active' : 'Inactive'}</p>
                                )}
                                {/* If 'phone' field exists in your backend model */}
                                {delivery.phone !== undefined && <p>Phone: {delivery.phone}</p>}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No available deliveries found.</p>
                )}
            </div>
        );
    };
    useEffect(() => {
        console.log(image)
    }, [image])
    const renderAddDeliveryForm = () => {
        return (
            <div className="delivery-form">
                <h2>Add Delivery</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name:</label>
                    <input name="name" type="text" id="name" onChange={handleChange} />
                    <label htmlFor="plate">Plate
                        Number:</label>
                    <input name='password' type="text" id="plate" value={data.password} onChange={handleChange} required />
                    <label htmlFor="state">State:</label>
                    <input type="checkbox" id="state" checked={data.state} onChange={handleChange} />
                    <label htmlFor="phone">Phone Number:</label>
                    <input name='phone' type="tel" id="phone" onChange={handleChange} required />
                    <label className='personalIdentity' htmlFor="image">
                        {/* <input type="file" id="image" accept="image/*" onChange={handleFileChange} /> */}
                        <label htmlFor="image">
                            <img src={image ? URL.createObjectURL(image) : assets.add_icon} alt="" />
                        </label>
                        <input onChange={(e) => {
                            setImage(e.target.files[0])
                        }} type="file" id='image' hidden />
                    </label>
                    <label htmlFor="email"> Email</label>
                    <input name='email' type="email" id='email' placeholder='Email' onChange={handleChange} />
                    <button type="submit">Add
                        Delivery</button>
                </form>
            </div>
        );
    };
    useEffect(() => {
        availabelDelivery()
    }, [])
    return (
        <>
            <aside className='sidebar'>
                <img
                    className='logo'
                    src={assets.logo}
                    alt=""
                    onClick={() => rendering("availableDeliveries")} // Show delivery list
                />
                <img
                    className='mogo'
                    src={assets.logo}
                    alt=""
                    onClick={() => rendering("addDelivery")} // Show add delivery form
                />

            </aside>
            <div>
                {activeView === 'availableDeliveries' && renderDeliveryList()}
                {activeView === 'addDelivery' && renderAddDeliveryForm()}
            </div>

        </>


    );
};

export default Delivery;

