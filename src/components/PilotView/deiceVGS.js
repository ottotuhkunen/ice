import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const DeiceVGS = ({ requestStatus }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (requestStatus > 1) {
            setVisible(true);
        }
    }, [requestStatus]);

    if (!visible) return null;

    const handleClose = () => setVisible(false);

    return (
        <div className="fixed bottom-4 right-4 z-10 select-none text-gray-300">
            {/* Base container */}
            <div className="select-none relative bg-black p-0.5 rounded w-[200px] shadow-lg border-2 border-neutral-500 font-mono font-bold">

                {/* Case 2 */}
                {requestStatus === 2 && (
                    <div className="flex flex-col justify-center space-y-0 text-yellow-400 bg-black text-center w-full h-[80px]">
                        <p className="text-sm mb-0">REMOTE</p>
                        <p className="text-sm">DEICING</p>
                        <p className="text-sm">133.850</p>
                    </div>
                )}

                {/* Case 3 */}
                {requestStatus === 3 && (
                    <div className="flex flex-col justify-center space-y-0 text-yellow-400 bg-black text-center w-full h-[80px]">
                        <p className="text-xl mb-0">CALL</p>
                        <p className="text-sm">BRAKES SET</p>
                    </div>
                )}

                {/* Case 4 */}
                {requestStatus === 4 && (
                    <div className="flex justify-around bg-black text-center w-full h-[80px]">
                        <div className="flex flex-col justify-center space-y-0 text-yellow-400">
                            <p className="text-2xl mb-0 text-red-600">STOP</p>
                            <p className="text-base">DEICING</p>
                            <p className="text-sm">IN PROGRESS</p>
                        </div>
                        <div>
                            <div className={"bg-red-600 rounded-full w-4 h-4 mt-2"}></div>
                            <div className={"bg-red-600 rounded-full w-4 h-4 mt-1"}></div>
                        </div>
                    </div>
                )}

                {/* Case 5 */}
                {requestStatus === 5 && (
                    <div className="flex justify-around bg-black text-center w-full h-[80px]">
                        <div className="flex flex-col justify-center space-y-0 text-yellow-400">
                            <p className="text-lg mb-0">DEICING</p>
                            <p className="text-lg">COMPLETE</p>
                        </div>
                        <div className="flex flex-col justify-end">
                            <div className={"bg-green-600 rounded-full w-4 h-4 mb-1"}></div>
                            <div className={"bg-green-600 rounded-full w-4 h-4 mb-2"}></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeiceVGS;

/*
<button
    className="absolute top-0 right-0 p-2 hover:text-red-500 transition-transform transform hover:scale-110 duration-200"
    onClick={handleClose}
>
    <FaTimes size={24} />
</button>
 */
