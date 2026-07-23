import React from 'react';
import { FaPen } from "react-icons/fa";

const EditIcon = () => {
    return (
        <div className="w-10 h-10 flex items-center justify-center border-3 border-fuchsia-500 rounded-full m-1 cursor-pointer hover:bg-fuchsia-950">
            <FaPen className="text-fuchsia-500 text-lg" />
        </div>
    );
};

export default EditIcon;
