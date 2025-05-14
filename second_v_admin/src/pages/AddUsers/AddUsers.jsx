import { React, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import axios from 'axios'
const AddUsers = (props) => {
    const [image, setImage] = useState(null);

    const [data, setData] = useState({
        name: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        image
    });
    const [access, setAccess] = useState(false);



    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData();
        formData.append("image", image);
        formData.append("name", data.name);
        formData.append("lastName", data.lastName);
        formData.append("phone", data.phone);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("access", access)
        if (image) {

            console.log(image)
        }



        try {
            const response = await axios.post(props.url + "/api/userAdmin" + `/register`, formData);
            console.log(response.data); // Handle success response
        }
        catch (error) {
            console.error(error); // Handle errors
        }
    };

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    };
    const handleToggleAccess = () => {
        setAccess(!access)


    };


    return (
        <div className='signUpForm'>
            <form onSubmit={handleSubmit}>
                <div className="identity-img-container">
                    <h2>Add personal Identity</h2>
                    <label className='personalIdentity' htmlFor="image">
                        {/* <input type="file" id="image" accept="image/*" onChange={handleFileChange} /> */}
                        <label htmlFor="image">
                            <img src={image ? URL.createObjectURL(image) : assets.add_icon} alt="" />
                        </label>
                        <input onChange={(e) => {
                            setImage(e.target.files[0])
                        }} type="file" id='image' hidden />
                    </label>
                </div>

                <div className="multi-fields">
                    <input name='email' type="email" placeholder='Email' onChange={handleChange} />
                    <input name='password' type="password" value={data.password} placeholder='password' onChange={handleChange} />
                    <input name='phone' type="text" placeholder='Phone' required onChange={handleChange} />
                </div>
                <div className="multi-fields">
                    <input name='name' type="text" placeholder='First Name' required onChange={handleChange} />
                    <input name='lastName' type="text" placeholder='Last Name' required onChange={handleChange} />
                </div>
                <div className="access-toggle">
                    <input type="checkbox" id="access" checked={access} onClick={handleToggleAccess} />
                    <label htmlFor="access">Grant access</label>
                </div>
                <button type='submit'>Sign up</button>
            </form>
        </div>
    )
}

export default AddUsers
