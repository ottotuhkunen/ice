import React, { useEffect, useState, useRef } from 'react';
import Alert from 'react-bootstrap/Alert';
import { LOGIN_URL, COUNT_URL } from '../utils/data';
import { ReactComponent as SureWx } from '../utils/surewx.svg';

const Login = () => {
    const [count, setCount] = useState(null);
    const [currentImage, setCurrentImage] = useState(0);
    const intervalRef = useRef(null);
    const images = [
        'images/deice3.jpg',
        'images/deice-tablet.png',
        'images/deice4.jpg',
        'images/deice2.jpg',
    ];

    const startInterval = () => {
        intervalRef.current = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 8000);
    };

    useEffect(() => {
        startInterval();
        return () => clearInterval(intervalRef.current);
    }, []);

    const handleLogin = () => {
        window.location.href = LOGIN_URL;
    };

    const handleDotClick = (idx) => {
        setCurrentImage(idx);
        clearInterval(intervalRef.current);
        startInterval();
    };

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await fetch(COUNT_URL, { credentials: 'include' });
                const data = await response.json();
                setCount(data.treatmentCount);
            } catch (error) {
                console.error('Error fetching treatment count:', error);
            }
        };
        fetchCount();
    }, []);

    return (
        <div className="fixed w-full h-screen flex bg-black select-none overflow-hidden flex-col md:flex-row">

            {/* Image Section — hidden on mobile */}
            <div className="hidden md:flex relative flex-1 bg-black overflow-hidden order-1">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`Slide ${index + 1}`}
                        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                            currentImage === index ? 'opacity-70 z-10' : 'opacity-0 z-0'
                        }`}
                    />
                ))}

                {/* Dots Navigation */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleDotClick(idx)}
                            className={`w-[11px] h-[11px] rounded-full cursor-pointer transition-colors duration-300 ${
                                idx === currentImage ? 'bg-white' : 'bg-gray-600'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Content Section — full width on mobile */}
            <div className="relative flex-1 flex flex-col justify-center items-center p-8 bg-gradient-to-r from-[#011328] to-[#0e2c4f] text-white order-2 overflow-hidden">

                {/* DottedMap Background */}
                <img
                    src="images/map.png"
                    alt="Dotted Map"
                    className="absolute bottom-0 w-full z-[100] max-w-[800px] opacity-30 pointer-events-none -z-10"
                />

                {/* Logos */}
                <div className="flex items-center justify-center mb-6">
                    <img src="images/vatsim.svg" alt="VATSIM" className="w-[180px] h-auto" />
                    <img
                        src="images/logo2.svg"
                        alt="DEICE"
                        className="w-[46px] ml-6"
                    />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-[#dfebeb] tracking-wide text-center mb-6 drop-shadow-md">
                    DEICE in HEL
                </h1>

                {/* Login Button */}
                <button
                    onClick={handleLogin}
                    className="w-full bg-[#176498] hover:bg-[#0056b3] text-white py-2 text-lg font-medium rounded transition duration-200 mb-6"
                >
                    Login with VATSIM
                </button>

                {/* Alert */}
                <div className="w-full mb-6">
                    <Alert key="success" variant="info">
                        <b>Manage your de-icing!</b>
                        <br />
                        Use this application to realistically request de-icing, check fluid
                        types and calculate the holdover time for your departure from EFHK.
                    </Alert>
                </div>

                <p className=" text-center">
                    De‑icing decision support powered by real‑world operations of <a target="_blank" rel="noopener noreferrer" className="text-blue-300" href="https://surewx.com/en">SureWx</a>.
                </p>

                <SureWx className="max-w-40 w-full mb-3"/>

                <p className="text-sm text-center">For flight simulation use only</p>

                {/* Request Count */}
                <div className="flex items-center justify-center bg-black/50 px-3 py-1 rounded text-[#dfebeb] text-lg">
                    {count ?? '-'}
                    <img
                        src="images/icon3.svg"
                        alt="request"
                        className="w-[26px] ml-2 mt-[-4px]"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
