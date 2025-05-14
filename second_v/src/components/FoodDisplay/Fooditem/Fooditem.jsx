
import React, { useContext, useState } from 'react'
import "./Fooditem.css"
import { assets } from '../../../assets/assets'
import { StoreContext } from '../../../context/StoreContext'
import axios from 'axios';
import Modal from 'react-modal';
Modal.setAppElement('#root');

const Fooditem = ({ id, name, price, description, image, addons, sizes }) => {


    const customStyles = {
        content: {
            width: "500px",
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform:
                'translate(-50%, -50%)'
        }
    };




    const [modalIsOpen, setIsOpen] = useState(false);
    const [foodData, setFoodData] = useState(null);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const items = description.split('|');
    const [selectedCompos, setSelectedCompos] = useState(items);




    const handleCloseModal = (event) => {
        event.stopPropagation();
        setIsOpen(false);
    };

    let [quantity, setQuantity] = useState(0);

    const plusOne = () => {
        setQuantity(quantity + 1);
    }
    const minusOne = () => {
        setQuantity(quantity - 1);
    }


    const handleFoodClick = async () => {
        // console.log(` im items${items}`)
        if (!modalIsOpen) { // Check if there's no existing data
            try {

                const response = await axios.get(`${url}/api/food/meal?name=${name}`);
                setFoodData(response.data);
                console.log(`hhhhhhhhhh ${response.data._id}`);
                id = response.data._id
                // console.log(foodData)


                // Add the new object to selectedFood only on successful fetch

            } catch (error) {
                console.error('Error fetching food:', error);
            } finally {
                setIsOpen(true); // Open modal regardless of success or failure
            }
        } else {
            setIsOpen(true); // Open modal with existing data
        }
    };




    const handleCheckboxChange = (event) => {
        const { value } = event.target;
        const selectedAddon = addons.find(addon => addon._id === value);

        if (selectedAddon) {
            console.log(`Selected addon: ${selectedAddon.name}`);
            console.log(`Selected addon: ${selectedAddon.price}`);
        } else {
            console.log('Addon not found');
        }
        if (selectedAddons.includes(value)) {
            setSelectedAddons(selectedAddons.filter(addon => addon !== value));
        } else {
            setSelectedAddons([...selectedAddons, value]);
        }

    };

    const handleComposChange = (event) => {
        const { value, checked } = event.target;

        if (checked) {
            setSelectedCompos([...selectedCompos, value]);

        } else {
            setSelectedCompos(selectedCompos.filter((item) => item !== value));

        }
    };



    const [selectedSize, setSelectedSize] = useState(sizes[0]);

    const handleSizeChange = (event) => {
        const selectedSize = sizes.find(size => size._id === event.target.id);
        setSelectedSize(selectedSize);
        console.log(selectedSize.name)
    };
    const { cartItems, addToCart, reamoveFromCart, setCartItems, url } = useContext(StoreContext)
    let selectedFood = {}

    const handleAddToCart = () => {

        if (foodData && selectedSize) {

            selectedFood = {
                id, // Assuming `id` is available for the food item
                name,
                price: selectedSize.price, // Assuming `price` is available in foodData
                compos: selectedCompos,
                size: selectedSize.name,
                addons: selectedAddons.map((addonId) => addons.find((addon) => addon._id === addonId)), // Find addon details from IDs
                Quantity: quantity === 0 ? quantity + 1 : quantity

            };


            addToCart(selectedFood); // Use the addToCart function from the StoreContext

            setSelectedCompos([...selectedCompos]);
            setSelectedSize({ ...selectedSize });
            setSelectedAddons([...selectedAddons]);
            setIsOpen(false); // Close the modal after adding to cart
            console.log("Selected Food:", selectedFood);
            console.log("cartItems:", cartItems);
        } else {
            console.warn('Please select a size before adding to cart.');
        }
    };
    const cheky = () => {
        console.log(cartItems);

    }


    return (
        <div className='food-item' >
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setIsOpen(false)}
                style={customStyles}
                contentLabel="Example Modal"
            >

                <button onClick={handleCloseModal} className="close-modal-button">X</button>
                <h2>{name}</h2>
                <p>{description}</p>
                {items.map((item) => (
                    <div key={item}>
                        <input
                            type="checkbox"
                            value={item}
                            checked={selectedCompos.includes(item)}
                            onChange={handleComposChange}
                        />
                        <label htmlFor={item}>{item}</label>
                    </div>
                ))}
                <h3>Size</h3>
                <div className='size-container'> {/* Wrap radio buttons in a container */}
                    {sizes.map(size => (
                        <div key={size._id}>
                            <input
                                type="radio"
                                id={size._id}
                                checked={selectedSize && selectedSize._id === size._id}
                                onChange={handleSizeChange}
                            />
                            <b className='size-name'>{size.name}</b>
                            <b className='size-price'>{`$ ${size.price}`}</b>
                        </div>
                    ))}
                </div>

                <h3>Add-ons:</h3>
                {addons.map(addon => (
                    <div key={addon._id} className='addons-container'>
                        <input
                            type="checkbox"
                            value={addon._id}
                            checked={selectedAddons.includes(addon._id)}
                            onChange={handleCheckboxChange}
                        />
                        <b className='addon-name' >{addon.name}</b>
                        <b className='addon-price'>{`$ ${addon.price}`}</b>
                    </div>


                ))}
                <button onClick={handleAddToCart} className="add-to-cart-button">
                    add to cart        </button>
                <button onClick={cheky} className="add-to-cart-button">
                    chek     </button>


            </Modal>
            <div className='food-item-img-container' >
                <img className='food-item-image' src={url + "/images/" + image} onClick={() => { handleFoodClick() }} alt="" />
                {quantity === 0 ? <img className='add' onClick={plusOne} src={assets.add_icon_white} alt='' /> : <div className='food-item-counter'>
                    <img onClick={minusOne} src={assets.remove_icon_red} alt="" />

                    <img onClick={plusOne} src={assets.add_icon_green} alt="" />
                    <p>{quantity}</p>
                </div>}



            </div>

            <div className='food-item-info' onClick={() => { handleFoodClick() }}>
                <div className='food-item-name-rating'>
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="" />
                </div>
                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">${price}</p>
            </div>
        </div>
    )
}


export default Fooditem
