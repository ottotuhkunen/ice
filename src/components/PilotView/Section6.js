import React, { useState } from 'react';
import { FaMap, FaChevronCircleRight, FaTimes } from "react-icons/fa";

const NotesSection = () => {
    const [openModal, setOpenModal] = useState(null); // 'first' | 'second' | null

    const notes = [
        {
            text: "",
            link: "https://wiki.vatsim-scandinavia.org/books/finnish-airports-charts/page/de-icing-procedures",
            label: "vats.im/efhk-deice"
        },
        {
            text: "",
            link: "https://www.faa.gov/other_visit/aviation_industry/airline_operators/airline_safety/deicing/FAA_2025-26_Holdover_Tables.pdf",
            label: "FAA Holdover Time (HOT) Guidelines Winter 2025-2026"
        },
        {
            text: "The time of protection is shortened in heavy weather conditions. Holdover time may be reduced when aircraft skin temperature is lower than outside air temperature."
        },
        {
            text: "High wind velocity, jet blast or blowing snow may reduce holdover time below the lowest time stated in the range."
        },
        {
            text: "Fluids used during ground de/anti-icing do not provide in-flight icing protection."
        },
        {
            text: "This table is for departure planning only and should be used in conjunction with pre-takeoff check procedures."
        },
        {
            text: "Whenever frost or ice occurs on the lower surface of the wing in the area of the fuel tank, indicating a cold-soaked wing, the 50/50 dilutions of Type IV shall not be used for the anti-icing step because fluid freezing may occur."
        }
    ];

    const modals = {
        first: {
            title: "Remote Apron 6",
            image: "/images/apn6.png"
        },
        second: {
            title: "Remote Apron 8",
            image: "/images/apn8.png"
        }
    };

    return (
        <div className="bg-zinc-900 rounded-lg p-4 flex-1 text-gray-400">
            {/* Top Buttons */}
            <div className="flex justify-start gap-4 mb-4">
                <button
                    className="flex items-center gap-2 px-3 py-1 border-3 border-blue-500 hover:bg-blue-950 rounded text-blue-500 font-bold"
                    onClick={() => setOpenModal('first')}
                >
                    <FaMap />
                    Remote 6
                </button>
                <button
                    className="flex items-center gap-2 px-3 py-1 border-3 border-blue-500 hover:bg-blue-950 rounded text-blue-500 font-bold"
                    onClick={() => setOpenModal('second')}
                >
                    <FaMap />
                    Remote 8
                </button>
            </div>

            {/* Notes List */}
            <ul className="space-y-4 list-none pl-0">
                {notes.map((note, index) => (
                    <li key={index} className="flex items-start space-x-3 text-sm">
                        <FaChevronCircleRight className="w-4 mt-1 flex-shrink-0 text-gray-400" />
                        <div className="flex flex-col">
                            <span>
                                {note.text}{" "}
                                {note.link && (
                                    <a
                                        href={note.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 underline hover:text-blue-500"
                                    >
                                        {note.label}
                                    </a>
                                )}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Popup Modal */}
            {openModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 select-none">
                    <div className="bg-zinc-900 p-6 rounded-lg max-w-[90vw] w-[800px] space-y-4 relative max-h-[90vh] overflow-y-auto text-white">
                        <h2 className="font-bold text-lg">
                            {modals[openModal].title}
                        </h2>

                        <div className="flex justify-center">
                            <img
                                src={modals[openModal].image}
                                alt={modals[openModal].title}
                                className="max-w-full h-auto"
                            />
                        </div>

                        <button
                            className="absolute top-0 right-2 p-2 hover:text-red-500 transition-transform transform hover:scale-110 duration-200"
                            onClick={() => setOpenModal(null)}
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotesSection;
