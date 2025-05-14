import React, { useState } from 'react'
import "./Add.css"
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'

const Add = (props) => {

    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        category: "Salad",
        sizes: [], // Array to store size objects
        addons: [], // Array to store add-on objects
    });




    const onChangeHandler = (event) => {
        const { name, value } = event.target;

        if (name === 'price') {
            // Handle price input as a number
            setData(data => ({ ...data, [name]: Number(value) }));
        } else {
            setData(data => ({ ...data, [name]: value }));
        }
    };

    const handleSizeChange = (index, event) => {
        const { name, value } = event.target;

        const updatedSizes = [...data.sizes];
        updatedSizes[index][name] = value; // Update specific size property

        setData(data => ({ ...data, sizes: updatedSizes }));
    };

    const handleAddOnChange = (index, event) => {
        const { name, value } = event.target;

        const updatedAddons = [...data.addons];
        updatedAddons[index][name] = value; // Update specific add-on property

        setData(data => ({ ...data, addons: updatedAddons }));
    };

    const handleAddSize = (event) => {
        setData(data => ({
            ...data,
            sizes: [...data.sizes, { name: '', price: 0 }] // Add new empty size object
        }));
        event.preventDefault()
    };

    const handleRemoveSize = (index) => {
        const updatedSizes = [...data.sizes];
        updatedSizes.splice(index, 1); // Remove size at the specified index
        updatedSizes[index] = { name: "", price: 0 }
        setData(data => ({ ...data, sizes: updatedSizes }));
    };

    const handleAddAddOn = (event) => {
        setData(data => ({
            ...data,
            addons: [...data.addons, { name: '', price: 0 }] // Add new empty add-on object
        }));
        event.preventDefault()
    };

    const handleRemoveAddOn = (index) => {
        const updatedAddons = [...data.addons];
        updatedAddons.splice(index, 1); // Remove add-on at the specified index

        setData(data => ({ ...data, addons: updatedAddons }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);

        formData.append("category", data.category);
        formData.append("price", data.price);
        // Assuming a single base price
        formData.append("image", image);

        // Add sizes and add-ons as JSON strings within the request body
        formData.append("sizes", JSON.stringify(data.sizes));
        formData.append("addons", JSON.stringify(data.addons));


        const response = await axios.post(`${props.url}/api/food/add`, formData);

        if (response.data.success) {
            setData({
                name: "",
                description: "",
                price: "",
                category: "Salad",
                sizes: [],
                addons: []
            })
            setImage(false)
            toast.success(response.data.message)
        } else {
            toast.error(response.data.message)
        }
        // ... handle response as before
    };

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden />
                </div>

                <div className="add-product-details">
                    <div className="add-product-name flex-col">
                        <p>Product name</p>
                        <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' />
                    </div>
                    <div className="add-product-description flex-col">
                        <p>Product description</p>
                        <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write content here'> </textarea>
                    </div>
                    <div className="add-category flex-col">
                        <p>Product category</p>

                        <select onChange={onChangeHandler} name="category" >
                            <option value="Salad">Salad</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure veg">Pure veg</option>
                            <option value="Noodels">Noodels</option>
                        </select>
                    </div>

                    <div className="add-sizes">
                        <p>Product sizes</p>
                        {data.sizes.map((size, index) => (
                            <div key={index} className="size-item">
                                <input type="text" name="name" value={size.name} onChange={(e) => handleSizeChange(index, e)} placeholder="Size name" />
                                <input type="number" name="price" value={size.price} onChange={(e) => handleSizeChange(index, e)} placeholder="Size price" />
                                <button onClick={() => handleRemoveSize(index)}>Remove</button>
                            </div>
                        ))}
                        <button onClick={handleAddSize}>Add size</button>
                    </div>
                    <div className="add-addons">
                        <p>Product addons</p>
                        {data.addons.map((addon, index) => (
                            <div key={index} className="addon-item">
                                <input type="text" name="name" value={addon.name} onChange={(e) => handleAddOnChange(index, e)} placeholder="Add-on name" />
                                <input type="number" name="price" value={addon.price} onChange={(e) => handleAddOnChange(index, e)} placeholder="Add-on price" />
                                <button onClick={() => handleRemoveAddOn(index)}>Remove</button>
                            </div>
                        ))}
                        <button onClick={handleAddAddOn}>Add add-on</button>
                    </div>


                </div>
                <button type='submit' className='add-btn'>ADD</button>
            </form>

        </div>
    )
}

export default Add
