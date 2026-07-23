import React from 'react';
import { FaUser, FaHeadset } from "react-icons/fa";

const steps = [
    {
        number: 1,
        title: "Connect to VATSIM",
        details: ["Connect to VATSIM and file your flight plan"],
    },
    {
        number: 2,
        title: "Request En-route Clearance",
        details: ["Request en-route clearance via PDC or on the frequency"],
    },
    {
        number: 3,
        title: "Request Deicing",
        details: [
            "Request deicing before start-up using this application or on the frequency",
            { type: "pilot", text: "HELSINKI DE-ICING, FINNAIR 1, REQUEST ONE STEP DEICING FOR WINGS AND STABILIZER" },
            { type: "atc", text: "FINNAIR 1, ROGER, DE-ICING ON REMOTE APRON 6" },
        ],
        note: "Normally Type 4 fluid is selected only in snowy conditions or whenever Type 1 Fluid holdover time (HOT) is not enough",
    },
    {
        number: 4,
        title: "Taxi to Remote Stand",
        details: [
            { type: "atc", text: "FINNAIR 1, TAXI TO STAND 603" },
            { type: "pilot", text: "TAXI TO STAND 603, FINNAIR 1" },
            { type: "atc", text: "FINNAIR 1, WHEN PARKING BRAKE SET, CONTACT DE-ICING 121.675" },
            { type: "pilot", text: "WHEN PARKING BRAKE SET, 121.675, FINNAIR 1" },
        ],
    },
    {
        number: 5,
        title: "Deicing Process",
        details: [
            { type: "pilot", text: "DE-ICING, FINNAIR 1, PARKING BRAKE SET, REQUESTING ONE STEP DE-ICING FOR WINGS AND STABILIZER, YOU MAY START SPRAYING" },
            { type: "atc", text: "FINNAIR 1 ON STAND 603, DE-ICING, STARTING ONE STEP PROCEDURE FOR WINGS AND STABILIZER, REPORT WHEN DE-ICING COMPLETED" },
        ],
        note: "You may now start the deicing process in your simulator. Please report once the deicing treatment is completed. The HOT timer should be started once the last treatment (Type 1 or Type 4) has started.",
    },
    {
        number: 6,
        title: "End Report",
        details: [
            "End report",
            { type: "pilot", text: "FINNAIR 1, STAND 601, DE-ICING COMPLETED" },
            { type: "atc", text: "FINNAIR 1 ON STAND 601, DE-ICING COMPLETED FOR WINGS AND TAIL WITH TYPE 1 FLUID, MIXTURE 40%, HOLDOVER TIME STARTED AT 55, POST DE- AND ANTI-ICING CHECKS ARE COMPLETED. PERSONNEL AND EQUIPMENT CLEAR OF AIRCRAFT" },
            { type: "pilot", text: "TYPE 1, MIXTURE 40%, HOLD OVER TIME 55, FINNAIR 1" },
            { type: "atc", text: "FINNAIR 1, CORRECT, FOR TAXI CONTACT TOWER 118.850" },
            { type: "pilot", text: "118.850, FINNAIR 1" },
        ],
        note: "Now the deicing is completed. Make sure to follow the Holdover time (HOT) in case of snow, freezing rain or other precipitation. The Holdover time is calculated automatically with this application.",
    },
];

const ProceduresSection = () => {
    return (
        <div className="bg-zinc-900 rounded-lg p-4 flex-1 text-gray-300 space-y-6">

            <div className="space-y-4 text-sm">
                {steps.map((step) => (
                    <div key={step.number} className="bg-neutral-900 p-4 rounded-lg border-1 border-neutral-500">
                        <div className="flex items-center mb-2">
                            <div className="font-bold w-7 h-7 flex items-center justify-center bg-zinc-700 text-white rounded-full mr-3">
                                {step.number}
                            </div>
                            <h3 className="text-lg mt-2 font-semibold">{step.title}</h3>
                        </div>

                        <ul className="list-disc list-inside space-y-2 ml-2">
                            {step.details.map((item, idx) => {
                                if (typeof item === "string") return <li key={idx}>{item}</li>;
                                return (
                                    <li
                                        key={idx}
                                        className={`flex items-start font-semibold text-sm space-x-3 ${item.type === "pilot" ? "text-blue-500" : "text-green-700"}`}
                                    >
                                        {item.type === "pilot" ? <FaUser className="mt-1 flex-shrink-0" /> : <FaHeadset className="mt-1 flex-shrink-0" />}
                                        <span>{item.text}</span>
                                    </li>
                                );
                            })}
                        </ul>

                        {step.note && (
                            <p className="mt-2 italic text-gray-400 text-sm border-l-2 border-gray-500 pl-2">{step.note}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProceduresSection;
