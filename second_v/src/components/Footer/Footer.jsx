import React from 'react'
import "./Footer.css"
import { assets } from '../../assets/assets'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">

                <div className="footer-content-left">
                    <img src={assets.logo} alt="" />
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum beatae facere, quo at iusto nulla! Unde sequi earum praesentium minus natus odit ut nemo nihil quaerat laudantium magni, a esse?</p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.twitter_icon} alt="" />
                        <img src={assets.linkedin_icon} alt="" />
                    </div>
                </div>

                <div className="footer-content-center">
                    <h2>Company</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                    </ul>
                </div>

                <div className="footer-content-right">
                    <h2>Get in Touch</h2>
                    <ul>
                        <li>01558300711</li>
                        <li>2319648</li>
                    </ul>

                </div>

            </div>
            <hr />
            <p className="footer-copyright">Copyright 2024 Tomato.com - All Rights Reserved</p>


        </div>
    )
}

export default Footer
