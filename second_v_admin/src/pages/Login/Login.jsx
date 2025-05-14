import { React, useEffect, useState } from 'react'
import "./Login.css"
import { assets } from '../../assets/assets'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [currState, setCurrState] = useState(false)
    const navigate = useNavigate()


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let response;
            if (currState === false) {
                // تسجيل الدخول للمستخدم العادي
                response = await axios.post(`${props.url}/api/userAdmin/login`, { email, password });
            } else if (currState === true) {
                // تسجيل الدخول لعامل التوصيل
                response = await axios.post(`${props.url}/api/deivery/login`, { email, password });
            }

            if (response?.data?.success) {
                // جلب التوكن من الاستجابة
                const token = response.data.token;

                if (token) {
                    // تحقق من وجود توكن في localStorage
                    const existingToken = localStorage.getItem('token');

                    if (existingToken) {
                        // تحديث التوكن الموجود
                        console.log('Token exists, updating...');
                        localStorage.setItem('token', token);
                    } else {
                        // إضافة التوكن إذا لم يكن موجودًا
                        console.log('No token found, saving new token...');
                        localStorage.setItem('token', token);
                    }
                }

                // توجيه المستخدم بناءً على الحالة
                if (currState === false) {
                    navigate('/orders');
                } else if (currState === true) {
                    navigate('/deliverypage');
                }
            } else {
                console.log(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };


    return (
        <div className='loginContainer'>
            <div className='login'>
                <div className="login-popup-container">
                    <form onSubmit={handleSubmit} >
                        {currState === false ? <p>user</p> : <p>delivery</p>}
                        <div className="login-popup-title">
                            <img src={assets.cross_icon} alt="" />
                        </div>
                        <div className="login-popup-inputs">
                            <input value={email} onChange={(event) => setEmail(event.target.value)} name='email' type="email" placeholder='Your Email' required />
                            <input value={password} onChange={(event) => setPassword(event.target.value)} name='password' type="password" placeholder='Your Password' required />
                        </div>
                        <div className="login-popup-condition">
                            <input type="checkbox" required />
                            <p>By continuing , i agree to the terms of use & privacy policy</p>
                        </div>
                        <button type='submit'> Login</button>
                    </form>
                    <button onClick={() => setCurrState(!currState)}>Click me!</button>
                </div>

            </div>
        </div>
    )
}

export default Login