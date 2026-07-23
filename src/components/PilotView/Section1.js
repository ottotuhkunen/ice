import React, { useState } from 'react';
import TickIcon from './Elements/Tick';
import EditIcon from './Elements/Edit';
import {FaTimes} from "react-icons/fa";

const LocationSection = () => {
    const [editing, setEditing] = useState(false);
    const [aerodrome, setAerodrome] = useState('EFHK');

    return (
        <div className="flex items-center justify-between bg-zinc-900 rounded p-4 flex-1">
            <h3 className={'text-blue-400 font-bold flex m-0 items-center'}>EFHK</h3>
            <div className="flex items-center" >
                <TickIcon />
                <div onClick={() => { setEditing(true) }}>
                    <EditIcon />
                </div>
            </div>

            {/* Edit Modal */}
            {editing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 select-none">
                    <div className="bg-zinc-900 p-6 rounded-lg w-96 space-y-4 relative max-h-[90vh] overflow-y-auto">
                        <h2 className="text-white font-bold text-lg">Location Selection</h2>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-300">Aerodrome (ICAO)</label>
                            <select
                                className="w-full p-2 rounded bg-neutral-900 text-white border-1 border-neutral-500 select-none"
                                value={aerodrome}
                            >
                                <option key={'EFHK'} value={'EFHK'}>EFHK - Helsinki Vantaa</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                className="border-3 border-green-500 hover:bg-green-950 text-green-500 px-4 py-2 rounded font-bold"
                                onClick={() => setEditing(false)}
                            >
                                Save
                            </button>
                        </div>

                        <button
                            className="absolute top-0 right-2 p-2 hover:text-red-500 transition-transform transform hover:scale-110 duration-200"
                            onClick={() => setEditing(false)}
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default LocationSection;
