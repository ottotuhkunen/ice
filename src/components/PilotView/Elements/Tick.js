import React from 'react';
import { FaCheck } from "react-icons/fa";

const TickIcon = () => {
    return (
        <div className="w-10 h-10 flex items-center justify-center border-3 border-green-500 rounded-full m-1 cursor-pointer hover:bg-green-950">
            <FaCheck className="text-green-500 text-lg" />
        </div>
    );
};

export default TickIcon;
