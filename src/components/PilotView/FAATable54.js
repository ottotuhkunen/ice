import React, {  useState } from 'react';
import { FaLessThanEqual, FaGreaterThanEqual } from "react-icons/fa";
import {LiaEnvelopeSquareSolid} from "react-icons/lia";

const IntensityHelper = ({ temperature }) => {
    const [timeOfDay, setTimeOfDay] = useState(null);
    const [visibility, setVisibility] = useState(null);
    const [result, setResult] = useState(null);

    const data = [
        { vis: 400, values: { day: { cold: "Heavy", warm: "Heavy" }, night: { cold: "Heavy", warm: "Heavy" } } },
        { vis: 800, values: { day: { cold: "Moderate", warm: "Heavy" }, night: { cold: "Heavy", warm: "Heavy" } } },
        { vis: 1200, values: { day: { cold: "Moderate", warm: "Moderate" }, night: { cold: "Moderate", warm: "Heavy" } } },
        { vis: 1600, values: { day: { cold: "Light", warm: "Moderate" }, night: { cold: "Moderate", warm: "Moderate" } } },
        { vis: 2000, values: { day: { cold: "Light", warm: "Moderate" }, night: { cold: "Moderate", warm: "Moderate" } } },
        { vis: 2400, values: { day: { cold: "Light", warm: "Moderate" }, night: { cold: "Moderate", warm: "Moderate" } } },
        { vis: 2800, values: { day: { cold: "Very Light", warm: "Light" }, night: { cold: "Light", warm: "Light" } } },
        { vis: 3200, values: { day: { cold: "Very Light", warm: "Light" }, night: { cold: "Very Light", warm: "Light" } } },
        { vis: 4000, values: { day: { cold: "Very Light", warm: "Very Light" }, night: { cold: "Very Light", warm: "Very Light" } } },
        { vis: 4800, values: { day: { cold: "Very Light", warm: "Very Light" }, night: { cold: "Very Light", warm: "Very Light" } } },
        { vis: 5600, values: { day: { cold: "Very Light", warm: "Very Light" }, night: { cold: "Very Light", warm: "Very Light" } } }
    ];

    const handleVisibility = (vis) => {
        setVisibility(vis);
        if (timeOfDay) determineResult(timeOfDay, vis);
    };

    const handleTime = (time) => {
        setTimeOfDay(time);
        if (visibility) determineResult(time, visibility);
    };

    const determineResult = (time, vis) => {
        const cold = temperature <= -1;
        const row = data.find((d) => vis <= d.vis);
        if (!row) return setResult(null);
        const intensity = cold
            ? row.values[time].cold
            : row.values[time].warm;
        setResult(intensity);
    };

    const intensityColor =
        result === "Very Light"
            ? "text-green-400"
            : result === "Light"
                ? "text-yellow-400"
                : result === "Moderate"
                    ? "text-orange-400"
                    : result === "Heavy"
                        ? "text-red-500"
                        : "text-gray-300";

    return (
        <div className="space-y-3">
            {/* Step 1: Day/Night */}
            <div>
                <p className="text-sm text-gray-300 mb-2">Select Time of Day:</p>
                <div className="flex gap-2">
                    {["day", "night"].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => handleTime(opt)}
                            className={`p-2 w-20 rounded bg-neutral-700 text-white border-1 border-neutral-500 select-none ${
                                timeOfDay === opt
                                    ? "bg-blue-600 text-white"
                                    : "bg-neutral-900 hover:bg-neutral-800 text-gray-300"
                            }`}
                        >
                            {opt === "day" ? "Day" : "Night"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Step 2: Visibility */}
            {timeOfDay && (
                <div>
                    <p className="text-sm text-gray-300 mb-2">Select Visibility (meters):</p>
                    <div className="flex flex-wrap gap-2">
                        {[400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 4000, 4800, 5600].map((v, i, arr) => {
                            const isFirst = i === 0;
                            const isLast = i === arr.length - 1;
                            return (
                                <button
                                    key={v}
                                    onClick={() => handleVisibility(v)}
                                    className={`flex items-center gap-1 justify-center p-2 w-20 rounded bg-neutral-700 text-white border-1 border-neutral-500 select-none ${
                                        visibility === v
                                            ? "bg-blue-600 text-white"
                                            : "bg-neutral-900 hover:bg-neutral-800 text-gray-300"
                                    }`}
                                >
                                    {isFirst ? (
                                        <>
                                            <FaLessThanEqual className={'w-3'} /> {v}
                                        </>
                                    ) : isLast ? (
                                        <>
                                            <FaGreaterThanEqual className={'w-3'} /> {v}
                                        </>
                                    ) : (
                                        v
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Step 3: Result */}
            {result && (
                result === "Heavy" ? (
                    <p className="mt-3 font-bold text-red-500">
                        Result: <span className="underline">Heavy</span> precipitation intensity. No holdover time guidelines exist.
                    </p>
                ) : (
                    <p className={`mt-3 font-bold ${intensityColor}`}>
                        Result: Use <span className="underline">{result}</span> precipitation intensity.
                    </p>
                )
            )}
        </div>
    );
};

export default IntensityHelper;