import React, { useContext } from 'react'
import "./FoodDisplay.css"
import StoreContextProvider, { StoreContext } from '../../context/StoreContext'
import Fooditem from './Fooditem/Fooditem'
const FoodDisplay = ({ category }) => {

    const { food_list } = useContext(StoreContext)
    console.log(food_list)
    return (

        <div className='food-display' id='food-display'>
            <h2>Top diches near You !</h2>

            <div className='food-display-list'>

                {
                    food_list.map((item, index) => {
                        let defPrice = item.sizes.map((size) => {
                            if (size.name === "Xl" || size.name === "xl" || size.name === "Xl ") {
                                return size.price
                            }
                            else {
                                console.log("noSize");

                            }
                        })


                        if (category === "All" || category === item.category) {


                            return <Fooditem key={index} id={item._id} name={item.name} description={item.description} price={defPrice} image={item.image} addons={item.addons} sizes={item.sizes} />
                        }
                    })}
            </div>
        </div>


    )
}

export default FoodDisplay
// const addToCart = (selectedFood) => {
//     // هنا نضيف الكائن مباشرة إلى cartItems بدون أي فحص مسبق
//     setCartItems((prevCartItems) => ({
//         ...prevCartItems,
//         [selectedFood.id]: selectedFood,
//     }));
// };
