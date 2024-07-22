import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Vault.css";
import Swiper from "swiper/bundle";
import "swiper/swiper-bundle.css";
import dillon from "../assets/dillon.png";
/*import { client_id, client_secret } from "../misc/getAccessToken";*/

const Vault = () => {
    const navigate = useNavigate();
    const [isWheelTurning, setIsWheelTurning] = useState(false);
    const [isDoorOpening, setIsDoorOpening] = useState(false);
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [isZoomedIn, setIsZoomedIn] = useState(false);

    const playlists = JSON.parse(localStorage.getItem("profile")).playlists;

    useEffect(() => {
        console.log("Playlists:", playlists);
    }, [playlists]);

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

    const openPlaylist = (playlist) => {
        window.open(playlist, '_blank', 'noopener,noreferrer');
    };

    return (
        <div
            className={`vault-container ${isZoomedIn ? "zoom-in" : ""} ${isContentVisible ? "zoom-out" : ""}`}
        >
            {!isContentVisible ? (
                <div className="vault-door-outer" onClick={handleOpenVault}>
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
                                                backgroundImage: `url(https://unsplash.it/1920/500?image=${index + 1})`,
                                            }}
                                            data-year={`Playlist ${playlists.length - index}:`}
                                            key={index}
                                        >
                                            <div className="swiper-slide-content">
                                                <span className="timeline-year">
                                                    Playlist #
                                                    {playlists.length - index}:
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        window.open(playlist)
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
