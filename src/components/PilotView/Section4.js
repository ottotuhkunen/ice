import React, { useState, useEffect } from 'react';
import EditIcon from "./Elements/Edit";
import fluidHoldoverTimes from '../../utils/fluidHoldoverTimes.json';
import fluidHoldoverTimesAdjusted from '../../utils/fluidHoldoverTimesAdjusted.json';

const FluidSection = ({ selectedTreatment, requestStatus, hotStart, temperature, precipitation, onHotCalculated }) => {
    const [materialType, setMaterialType] = useState('aluminum');
    const [flapSlatConfig, setFlapSlatConfig] = useState('retracted');
    const totalLimit = 120; // Max minutes for scaling progress bar

    const dataSource = flapSlatConfig === 'extended'
        ? fluidHoldoverTimesAdjusted
        : fluidHoldoverTimes;

    // Convert "minutes:seconds" string to decimal minutes
    const timeStrToMinutes = (value) => {
        if (!value) return 0;

        if (typeof value === 'number') return value * 60; // number in hours -> minutes
        if (typeof value === 'string') {
            if (value.includes(':')) {
                const [min, sec] = value.split(':').map(Number);
                return min * 60 + sec;
            } else {
                return parseFloat(value) * 60;
            }
        }
        return 0;
    };

    // Get holdover times based on fluid type, material, weather, and temperature
    const getHoldoverTimes = (type, material, weatherType, outsideTemp) => {
        if (weatherType === "NO ANTI-ICING CONDITIONS EXPECTED") {
            return { lower: null, upper: null, missing: false, noGuidelines: true };
        }

        const entries = dataSource[type]?.[material] || dataSource[type]?.['any'];

        if (!entries) return { lower: null, upper: null, missing: true, noGuidelines: false };

        const match = entries.find(e =>
            outsideTemp >= e.tempRange.min && outsideTemp < e.tempRange.max
        );
        if (!match) return { lower: null, upper: null, missing: true, noGuidelines: false };

        const times = match.weather[weatherType];
        if (!times) return { lower: null, upper: null, missing: true, noGuidelines: false };

        return {
            lower: times.min,
            upper: times.max,
            notes: times.notes || null,
            missing: false,
            noGuidelines: false
        };
    };

    // Convert holdover times to progress percentages
    const setProgress = (lower, upper) => {
        const lowerMinutes = timeStrToMinutes(lower);
        const upperMinutes = timeStrToMinutes(upper);
        return {
            lowerPercentage: (lowerMinutes / totalLimit) * 100,
            upperPercentage: (upperMinutes / totalLimit) * 100
        };
    };

    const renderProgress = (lowerLimit, upperLimit, { missing, noGuidelines } = {}) => {
        if (noGuidelines) {
            return <p className="text-gray-400 flex-1">No holdover time guidelines exist</p>;
        }

        if (missing) {
            return <p className="flex-1 text-red-500 border-2 border-red-900 bg-red-900/40 py-2 px-4 rounded text-center font-semibold text-sm">
                HOT unavailable for these conditions
            </p>;
        }

        if (!lowerLimit || !upperLimit) {
            return <p className="text-gray-400 flex-1">No holdover time guidelines exist</p>;
        }

        const lowerMinutes = Math.round(timeStrToMinutes(lowerLimit));
        const upperMinutes = Math.round(timeStrToMinutes(upperLimit));
        const { lowerPercentage, upperPercentage } = setProgress(lowerLimit, upperLimit);

        return (
            <div className="flex-1">
                <p className="text-white text-sm font-semibold mb-2" style={{ whiteSpace: 'nowrap' }}>
                    {lowerMinutes === upperMinutes
                        ? `${lowerMinutes} min`
                        : `${lowerMinutes} - ${upperMinutes} min`}
                </p>
                <div className="relative w-full h-6 bg-gray-700 rounded overflow-hidden">
                    <div className="absolute h-6 bg-green-600" style={{ width: `${lowerPercentage}%` }}></div>
                    <div
                        className="absolute h-6 bg-yellow-600"
                        style={{ left: `${lowerPercentage}%`, width: `${upperPercentage - lowerPercentage}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    // Determine limits for Type 1 and Type 4
    let lowerLimitType1, upperLimitType1, lowerLimitType4, upperLimitType4;

    const type1Limits = getHoldoverTimes('type1', materialType, precipitation, temperature);
    lowerLimitType1 = type1Limits.lower;
    upperLimitType1 = type1Limits.upper;

    const type4Limits = getHoldoverTimes('type4', 'any', precipitation, temperature);
    lowerLimitType4 = type4Limits.lower;
    upperLimitType4 = type4Limits.upper;

    useEffect(() => {
        let hotValue = 0;

        if ([2, 3].includes(selectedTreatment)) {
            if (!type1Limits.missing && !type1Limits.noGuidelines && type1Limits.lower)
                hotValue = timeStrToMinutes(type1Limits.lower) / 60; // return hours if needed, or keep as minutes
        } else if (selectedTreatment > 3) {
            if (!type4Limits.missing && !type4Limits.noGuidelines && type4Limits.lower)
                hotValue = timeStrToMinutes(type4Limits.lower) / 60;
        }

        if (typeof onHotCalculated === 'function') {
            onHotCalculated(hotValue);
        }
    }, [selectedTreatment, type1Limits, type4Limits]);

    return (
        <div className="bg-zinc-900 rounded-lg p-6 space-y-6 flex-1">

            <div className={"flex items-end gap-3"}>
                {/* Material selection */}
                <div className="flex items-baseline flex-col flex-1">
                    <p className={"mb-1 text-sm text-gray-400"}>Predominant Surface Material</p>
                    <select
                        className="w-full p-2 rounded bg-neutral-900 text-white border-1 border-neutral-500 select-none"
                        value={materialType}
                        onChange={(e) => setMaterialType(e.target.value)}
                    >
                        <option value="aluminum">Aluminum</option>
                        <option value="composites">Composites</option>
                    </select>
                </div>

                {/* Flaps/Slats Configuration */}
                <div className="flex items-baseline flex-col flex-1">
                    <p className={"mb-1 text-sm text-gray-400"}>Wing Configuration</p>
                    <select
                        className="w-full p-2 rounded bg-neutral-900 text-white border-1 border-neutral-500 select-none"
                        value={flapSlatConfig}
                        onChange={(e) => setFlapSlatConfig(e.target.value)}
                    >
                        <option value="retracted">Flaps / Slats Retracted</option>
                        <option value="extended">Flaps / Slats Extended</option>
                    </select>
                </div>

                <div className="flex items-center cursor-not-allowed [&_*]:cursor-not-allowed">
                    <EditIcon />
                </div>
            </div>

            {/* Type 1 */}
            {[2, 3, 4, 5, 6].includes(selectedTreatment) && materialType && (
                <div className="flex items-center justify-start gap-4">
                    <div className="flex w-52 p-2 rounded border-2 border-neutral-500">
                        <div>
                            <p className="font-bold text-white mb-2">TYPE 1</p>
                            <p className="text-gray-400 text-sm">CLARIANT SAFEWING MP I 1938 ECO (80)</p>
                        </div>
                    </div>
                    {renderProgress(lowerLimitType1, upperLimitType1, type1Limits)}
                </div>
            )}

            {/* Type 4 */}
            {[4, 5, 6].includes(selectedTreatment) && materialType && (
                <div className="flex items-center justify-start gap-4">
                    <div className="flex w-52 p-2 rounded border-2 border-neutral-500">
                        <div>
                            <p className="font-bold text-white mb-2">TYPE 4</p>
                            <p className="text-gray-400 text-sm">
                                CLARIANT SAFEWING MP IV LAUNCH {["Moderate Snow mixed with Rain", "Rain on Cold-Soaked Wing"].includes(precipitation)
                                ? "100/0"
                                : temperature >= -3
                                    ? "50/50"
                                    : temperature > -14
                                        ? "75/25"
                                        : "100/0"}
                            </p>
                        </div>
                    </div>
                    {renderProgress(lowerLimitType4, upperLimitType4, type4Limits)}
                </div>
            )}

            {/* Fluid Notes */}
            {(selectedTreatment > 1) && (
                <div className="mt-4 space-y-4">
                    {/* Type 1 Notes */}
                    {selectedTreatment > 1 ? (
                        type1Limits?.notes && (
                            <p className="text-blue-500 border-2 border-blue-900 bg-blue-900/40 py-2 px-4 rounded font-semibold text-sm">
                                <span className="block">{type1Limits.notes}</span>
                            </p>
                        )
                    ) : null}

                    {/* Type 4 Notes */}
                    {selectedTreatment > 3 ? (
                        type4Limits?.notes && (
                            <p className="text-blue-500 border-2 border-blue-900 bg-blue-900/40 py-2 px-4 rounded font-semibold text-sm">
                                <span className="block">{type4Limits.notes}</span>
                            </p>
                        )
                    ) : null}

                    {/* HOT Adjusted Note */}
                    {flapSlatConfig === "extended" ? (
                        <p className="text-blue-500 border-2 border-blue-900 bg-blue-900/40 py-2 px-4 rounded font-semibold text-sm">
                            <span className="block">Holdover times have been adjusted to 76% for use when flaps/slats are deployed prior to de/anti-icing.</span>
                        </p>
                    ) : null}

                </div>
            )}

            {/* End Report */}
            {(requestStatus > 4) && (
                <div className="flex flex-col">
                    <p className="font-semibold mb-2">Received Treatment Code</p>
                    <p className="font-bold text-blue-400 font-mono">
                        {(() => {
                            // Type I or Type IV?
                            if ([2, 3].includes(selectedTreatment)) {
                                // --- TYPE I ---
                                let ratio;
                                let started = hotStart + " UTC";
                                if (started === "Unavailable UTC") { started = "00:00";}
                                if (temperature >= 8) ratio = '10';
                                else if (temperature < 8 && temperature >= 6) ratio = '15';
                                else if (temperature < 6 && temperature >= 5) ratio = '20';
                                else if (temperature < 5 && temperature >= 3) ratio = '25';
                                else if (temperature < 3 && temperature >= 1) ratio = '30';
                                else if (temperature < 1 && temperature >= -2) ratio = '35';
                                else if (temperature < -2 && temperature >= -5) ratio = '40';
                                else if (temperature < -5 && temperature >= -9) ratio = '45';
                                else if (temperature < -9 && temperature >= -13) ratio = '50';
                                else if (temperature < -13 && temperature >= -18) ratio = '55';
                                else if (temperature < -18 && temperature >= -24) ratio = '60';
                                else if (temperature < -24 && temperature >= -29) ratio = '65';
                                else if (temperature < -29 && temperature >= -32.5) ratio = '70';
                                else ratio = 'XX';

                                return `TYPE I/${ratio} ${started} CLARIANT SAFEWING MP I 1938 ECO (80)`;
                            }

                            // --- TYPE IV ---
                            else if (selectedTreatment > 3) {
                                let mix;
                                let started = hotStart;
                                if (["Moderate Snow mixed with Rain", "Rain on Cold-Soaked Wing"].includes(precipitation)) mix = "100";
                                else if (temperature >= -3) mix = "50";
                                else if (temperature > -14) mix = "75";
                                else mix = "100/0";
                                if (started === "Unavailable") { started = "00:00";}

                                return `TYPE IV/${mix} ${started} CLARIANT SAFEWING MP IV LAUNCH`;
                            }
                            return '';
                        })()}
                    </p>
                </div>
            )}

        </div>
    );
};

export default FluidSection;
