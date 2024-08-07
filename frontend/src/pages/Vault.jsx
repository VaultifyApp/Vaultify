import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import "./Vault.css";
import Swiper from "swiper/bundle";
import axios from "axios";

/**
 * Vault page component
 */
const Vault = () => {
    const navigate = useNavigate();
    const [isWheelTurning, setIsWheelTurning] = useState(false);
    const [isDoorOpening, setIsDoorOpening] = useState(false);
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [isZoomedIn, setIsZoomedIn] = useState(false);
    const [images, setImages] = useState([]);

    const { currentUser } = useContext(AuthContext);
    const playlists = currentUser.playlists;

    useEffect(() => {
        console.log("Playlists:", playlists);
    }, [playlists]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(
                    "https://api.unsplash.com/search/photos",
                    {
                        params: { query: "green", per_page: playlists.length },
                        headers: {
                            Authorization: `Client-ID l1-Il-e6HmCC1wWoocR78p9Sssyz77o_-KKTgUcK8xk`,
                        },
                    }
                );
                setImages(response.data.results);
            } catch (error) {
                console.error("Error fetching images from Unsplash:", error);
            }
        };

        fetchImages();
    }, [playlists.length]);

    const handleOpenVault = () => {
        setIsWheelTurning(true);
        setTimeout(() => {
            setIsWheelTurning(false);
            setIsDoorOpening(true);
            setTimeout(() => {
                setIsZoomedIn(true);
                setTimeout(() => {
                    setIsContentVisible(true);
                }, 3000);
            }, 500);
        }, 700);
    };

    useEffect(() => {
        handleOpenVault(); // Automatically start the animation when the component mounts
    }, []);

    useEffect(() => {
        if (isContentVisible) {
            const timelineSwiper = new Swiper(".timeline .swiper-container", {
                direction: "vertical", // Ensure vertical direction
                loop: false,
                speed: 700,
                allowTouchMove: false, // Disable touch interactions
                mousewheel: true, // Disable mousewheel interactions
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                    renderBullet: function (index, className) {
                        const year = document
                            .querySelectorAll(".swiper-slide")
                            [index].getAttribute("data-year");
                        return `<span class="${className}">${year}</span>`;
                    },
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
            });

            const preventDefault = (e) => {
                e.preventDefault();
            };

            // Add event listeners to disable scroll events
            document
                .querySelector(".timeline .swiper-container")
                .addEventListener("wheel", preventDefault, { passive: false });
            document
                .querySelector(".timeline .swiper-container")
                .addEventListener("touchmove", preventDefault, {
                    passive: false,
                });
        }
    }, [isContentVisible]);

    return (
        <div
            className={`vault-container ${isZoomedIn ? "zoom-in" : ""} ${isContentVisible ? "zoom-out" : ""}`}
        >
            {!isContentVisible ? (
                <div className="vault-door-outer">
                    <div className="vault-hinges">
                        <div className="hinge"></div>
                        <div className="hinge"></div>
                    </div>
                    <div className="vault-viewhole"></div>
                    <div
                        className={`vault-door-inner ${isWheelTurning ? "turning" : ""} ${isDoorOpening ? "opening" : ""}`}
                    >
                        <div className="vault-inner-hinges">
                            <div className="hinge"></div>
                            <div className="hinge"></div>
                        </div>
                        <div className="vault-door-lock-wrapper">
                            <div className="vault-door-lock vault-door-circle"></div>
                            <div className="vault-door-lock vault-door-pistons">
                                <div className="piston piston1"></div>
                                <div className="piston piston2"></div>
                                <div className="piston piston3"></div>
                                <div className="piston piston4"></div>
                            </div>
                        </div>
                        <div className="vault-door-handle">
                            <div className="handle-bar bar1"></div>
                            <div className="handle-bar bar2"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="timeline-container">
                    <div className="container">
                        <h1 className="title">My Vault</h1>
                        <div className="timeline">
                            <div className="swiper-container">
                                <div className="swiper-wrapper">
                                    {playlists.map((playlist, index) => (
                                        <div
                                            className="swiper-slide"
                                            style={{
                                                backgroundImage: `url(${images[index]?.urls?.regular})`,
                                            }}
                                            data-year={`Playlist ${playlists.length - index}:`}
                                            key={index}
                                        >
                                            <div className="swiper-slide-content">
                                                <span className="timeline-year">
                                                    {playlist.title}:
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        window.open(
                                                            playlist.url
                                                        )
                                                    }
                                                >
                                                    Open in Spotify
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="swiper-button-prev"></div>
                                <div className="swiper-button-next"></div>
                                <div className="swiper-pagination"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vault;
