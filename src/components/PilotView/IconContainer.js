import React from 'react';
import { FaMapMarkerAlt, FaCloudRain, FaFlask, FaStopwatch, FaTruck, FaClipboardList, FaInfoCircle } from "react-icons/fa";

const ICONS = {
    pin: FaMapMarkerAlt,
    rain: FaCloudRain,
    deicer: FaTruck,
    flask: FaFlask,
    timer: FaStopwatch,
    notes: FaClipboardList,
    info: FaInfoCircle
};

const IconContainer = ({ iconName }) => {
    const IconComponent = ICONS[iconName];

    return (
        <div className="select-none bg-zinc-900 text-2xl text-gray-300 flex items-center pt-8 flex-col gap-2 w-14 md:w-20 min-h-20 mr-2 rounded">
            {iconName === "truck" ? (
                <img src="/images/icon3.svg" alt="truck icon" className="w-7 h-7" />
            ) : IconComponent ? (
                <IconComponent />
            ) : null}
            {iconName === "flask" && (
                <div className="text-xs text-gray-400 text-center">
                    FAA<br/>
                    2025-2026
                </div>
            )}
        </div>
    );
};

export default IconContainer;
