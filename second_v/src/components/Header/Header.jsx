import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { assets } from "../../assets/assets";
import Navbar from "../Navbar/Navbar";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "./Header.css";


const Header = () => {
    const [showLogin, setShowLogin] = useState(false)

    const parentRef = useRef(null);


    return (
        <section className="main-banner" id="home" ref={parentRef} >


            {/* <div
                id="pattermnImg"
                className="banner-img"

            >
                <CanvasAnimation parentRef={parentRef} />
                </div> */}
            {/* <div className="js-parallax-scene" ref={sceneRef}>
                <div className="banner-shape-1" data-depth="0.30" ref={berryRef}>
                    <img src="src/assets/berry.png" alt="Berry" />
                </div>
                <div className="banner-shape-2" data-depth="0.25" ref={leafRef}>
                    <img src="src/assets/leaf.png" alt="Leaf" />
                </div>
            </div> */}
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                speed={500}
                pagination={{
                    clickable: true,
                }}
                navigation={false}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
            >
                {/* Navbar يجب أن يكون هنا */}
                <div className="navbar-wrapper">
                    <Navbar setShowLogin={setShowLogin} />
                </div>

                <SwiperSlide>
                    <img src={assets.sufra} alt="" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={assets.sufra} alt="" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={assets.sufra} alt="" />
                </SwiperSlide>
            </Swiper>

        </section>
    );
};

export default Header;
