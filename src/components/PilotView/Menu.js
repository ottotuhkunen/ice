import React, { useState } from 'react';
import { LOGOUT_URL } from '../../utils/data';
import { FaInfoCircle, FaSignOutAlt, FaWifi } from "react-icons/fa";

const Menu = ({ callsign }) => {
    const [showModal, setShowModal] = useState(false);

    const handleLogout = async () => {
        try {
            const response = await fetch(LOGOUT_URL, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                window.location.href = '/';
            } else {
                console.error('Logout failed:', await response.json());
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-14 bg-gradient-to-r from-gray-900 to-slate-900 text-white flex items-center justify-between px-[14px] shadow-lg backdrop-blur-md border-b border-gray-700 z-50 transition-all duration-300">

            {/* Left Section */}
            <div className="flex items-center gap-3">
                <FaInfoCircle
                    className="text-2xl cursor-pointer hover:text-blue-400 transition-transform transform hover:scale-110 duration-200"
                    title="Open Charts"
                    onClick={() =>
                        window.open(
                            "https://wiki.vatsim-scandinavia.org/books/finnish-airports-charts/page/de-icing-procedures",
                            "_blank"
                        )
                    }
                />
            </div>

            {/* Center Section */}
            <div className="flex items-center text-lg font-semibold tracking-wide">
                <span className="text-gray-300">{callsign || "Disconnected"}</span>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
                <FaWifi className="text-2xl" title="Connection Status" />
                <FaSignOutAlt
                    className="text-2xl cursor-pointer hover:text-red-500 transition-transform transform hover:scale-110 duration-200"
                    title="Logout"
                    onClick={handleLogout}
                />
            </div>
        </div>
    );
};

export default Menu;
