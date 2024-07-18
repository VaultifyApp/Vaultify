import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Vault.css";
import Swiper from "swiper/bundle";
import "swiper/swiper-bundle.css";
import dillon from "../assets/dillon.png";

const Vault = () => {
    const navigate = useNavigate();
    const [isWheelTurning, setIsWheelTurning] = useState(false);
    const [isDoorOpening, setIsDoorOpening] = useState(false);
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [isZoomedIn, setIsZoomedIn] = useState(false);

    const playlists = [
        {
            timestamp: "3rd May 2020 7:00 PM",
            title: "Morning Chill",
            description: "Relaxing morning tunes",
            link: "https://open.spotify.com/playlist/3zteNmnoKFGtzwRTpNhC8u",
            image: dillon,
        },
        {
            timestamp: "19th May 2020 3:00 PM",
            title: "Workout Mix",
            description: "Energetic workout music",
            link: "https://open.spotify.com/playlist/2",
            image: "https://i.scdn.co/image/ab67616d0000b2732c5e6f10f5e3e5761f0d22",
        },
        {
            timestamp: "17th June 2020 7:00 PM",
            title: "Evening Jazz",
            description: "Smooth jazz for the evening",
            link: "https://open.spotify.com/playlist/3",
            image: "https://i.scdn.co/image/ab67616d0000b2733c7e6f10f5e3e5761f0d33",
        },
    ];

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
                speed: 1600,
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
                breakpoints: {
                    768: {
                        direction: "horizontal", // Change to horizontal on larger screens
                    },
                },
            });
        }
    }, [isContentVisible]);

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
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div
                                            className="swiper-slide"
                                            style={{
                                                backgroundImage: `url(https://unsplash.it/1920/500?image=1${i})`,
                                            }}
                                            data-year={`201${i}`}
                                            key={i}
                                        >
                                            <div className="swiper-slide-content">
                                                <span className="timeline-year">
                                                    201{i}
                                                </span>
                                                <h4 className="timeline-title">
                                                    Your Playlist
                                                </h4>
                                                <p className="timeline-text">
                                                    text text.
                                                </p>
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
