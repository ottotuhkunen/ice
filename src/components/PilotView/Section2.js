import React, { useEffect, useState } from 'react';
import { FaTemperatureLow, FaCloudRain, FaTimes } from "react-icons/fa";
import EditIcon from './Elements/Edit';
import IntensityHelper from "./FAATable54";

const METAR_URL = 'https://api.met.no/weatherapi/tafmetar/1.0/metar.txt?icao=EFHK';

// Weather options
const WEATHER_OPTIONS = [
    "Active Frost",
    "Freezing Fog, Freezing Mist, or Ice Crystals",
    "Snow mixed with Freezing Fog",
    "Very Light Snow, Snow Grains or Snow Pellets",
    "Light Snow, Snow Grains or Snow Pellets",
    "Moderate Snow, Snow Grains or Snow Pellets",
    "Freezing Drizzle",
    "Light Freezing Rain",
    "Moderate Snow mixed with Rain",
    "Rain on Cold-Soaked Wing",
    "NO ANTI-ICING CONDITIONS EXPECTED"
];

const INTENSITY_MAP = [
    { regex: /-/, intensity: 'Light' },
    { regex: /\+/, intensity: 'Heavy' },
];

const WeatherSection = ({ temperature, precipitation, setTemperature, setPrecipitation, requestStatus }) => {
    const [metar, setMetar] = useState('');
    const [timestamp, setTimestamp] = useState('MANUAL');
    const [editing, setEditing] = useState(false);

    // User overrides from localStorage
    const [userOverride, setUserOverride] = useState(() => {
        const saved = localStorage.getItem('weatherOverride');
        if (!saved) return null;

        try {
            const parsed = JSON.parse(saved);
            const savedTime = parsed.timestamp ? new Date(parsed.timestamp).getTime() : 0;
            if (Date.now() - savedTime > 60 * 60 * 1000) {
                localStorage.removeItem('weatherOverride');
                return null;
            }

            return {
                temperature: parsed.temperature != null ? Number(parsed.temperature) : '',
                precipitation: parsed.precipitation || '',
                timestamp: parsed.timestamp
            };
        } catch {
            localStorage.removeItem('weatherOverride');
            return null;
        }
    });

    const [editTemp, setEditTemp] = useState(userOverride?.temperature ?? '');
    const [editPrecip, setEditPrecip] = useState(userOverride?.precipitation ?? '');

    // Map METAR strings into exactly one WEATHER_OPTIONS value
    const parseWeatherType = (metarStr) => {
        const s = (metarStr || '').toUpperCase();

        // Determine intensity
        let intensityLabel = '';
        if (/\+/.test(s)) intensityLabel = 'Heavy';
        else if (/(\s|^)-/.test(s)) intensityLabel = 'Light';

        // 1️⃣ Freezing Fog / Ice Crystals
        if (/FZFG|IC|PL/.test(s)) {
            return "Freezing Fog, Freezing Mist, or Ice Crystals";
        }

        // 2️⃣ Snow mixed with Freezing Fog
        if (/(SN.*FZFG|FZFG.*SN)/.test(s)) {
            return "Snow mixed with Freezing Fog";
        }

        // 3️⃣ Freezing Drizzle
        if (/FZDZ/.test(s)) {
            return "Freezing Drizzle";
        }

        // 4️⃣ Freezing Rain (including mixed cases like FZRASN, SNFZRA, RASFZRA, etc.)
        if (/FZRA/.test(s) || /(FZRA|FZRASN|SNFZRA|FZRASG|FZRASG|FZRASG)/.test(s)) {
            return "Light Freezing Rain";
        }

        // 5️⃣ Snow mixed with Rain (SNRA)
        if (/SNRA|RASN/.test(s)) {
            return "Moderate Snow mixed with Rain";
        }

        // 6️⃣ Snow / Snow Grains / Snow Pellets
        if (/SN|SG|GS|GR/.test(s)) {
            if (intensityLabel === 'Light') return "Light Snow, Snow Grains or Snow Pellets";
            if (intensityLabel === 'Heavy') return "Moderate Snow, Snow Grains or Snow Pellets";
            return "Moderate Snow, Snow Grains or Snow Pellets";
        }

        // Default fallback
        return "NO ANTI-ICING CONDITIONS EXPECTED";
    };

    const parseTemperature = (metars) => {
        const temps = metars
            .map(metar => {
                const match = metar.match(/ (M?\d{2})\/(M?\d{2})/);
                if (!match) return null;
                const tempStr = match[1];
                return tempStr.startsWith('M') ? -parseInt(tempStr.slice(1), 10) : parseInt(tempStr, 10);
            })
            .filter(t => t !== null);

        if (temps.length === 0) return null;
        return Math.min(...temps);
    };

    const fetchMetar = async () => {
        try {
            const res = await fetch(METAR_URL);
            const text = await res.text();

            const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
            if (!lines.length) return;

            const latest = lines[lines.length - 1];
            const prev = lines[lines.length - 2] || latest;

            const timestampMatch = latest.match(/\b\d{6}Z\b/);
            const ts = timestampMatch ? timestampMatch[0] : '';

            setMetar(latest);
            setTimestamp(ts);

            const temp = parseTemperature([latest, prev]);
            const weather = parseWeatherType(latest);

            if (!userOverride) {
                setTemperature(temp);
                setPrecipitation(weather);
            }
        } catch (err) {
            console.error('Failed to fetch METAR:', err);
        }
    };

    useEffect(() => {
        if (userOverride) {
            setTemperature(userOverride.temperature);
            setPrecipitation(userOverride.precipitation);
        } else {
            fetchMetar();
        }
    }, [userOverride]);

    const handleSave = () => {
        const override = {
            temperature: editTemp ?? temperature,
            precipitation: editPrecip || precipitation,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('weatherOverride', JSON.stringify(override));
        setUserOverride(override);

        setTemperature(override.temperature);
        setPrecipitation(override.precipitation);

        setEditing(false);
    };

    const handleReset = () => {
        localStorage.removeItem('weatherOverride');
        setUserOverride(null);
        setEditTemp('');
        setEditPrecip('');
        fetchMetar();
        setEditing(false);
    };

    return (
        <div className="bg-zinc-900 rounded p-4 flex-1">
            <div className="flex-1 mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <p className={'font-semibold mb-2'}>METAR Timestamp:</p>
                        <p className={'font-bold text-blue-400 mb-2'}>{timestamp}</p>
                    </div>
                    <div className="flex items-center cursor-pointer" onClick={() => {
                        setEditTemp(userOverride?.temperature ?? temperature);
                        setEditPrecip(userOverride?.precipitation ?? precipitation);
                        setEditing(true);
                    }}>
                        <EditIcon />
                    </div>
                </div>

                <p className={'font-bold text-blue-400 mt-2'}>{metar}</p>

                <div className="flex mt-8 gap-10">
                    <div className="text-center">
                        <p className={'flex gap-2 items-center flex-nowrap font-semibold'}>
                            <FaTemperatureLow />
                            Temperature
                        </p>
                        <p className={`font-bold ${userOverride ? 'text-fuchsia-500' : 'text-blue-400'}`}>
                            {temperature !== null ? `${temperature}°C` : '—'}
                        </p>
                    </div>
                    <div>
                        <p className={'flex gap-2 items-center flex-nowrap font-semibold'}>
                            <FaCloudRain />
                            Precipitation
                        </p>
                        <p className={`${userOverride
                            ? 'text-fuchsia-500 font-bold'
                            : precipitation === 'NO ANTI-ICING CONDITIONS EXPECTED'
                                ? 'text-gray-400 text-sm'
                                : 'text-blue-400 font-bold'}`}>
                            {precipitation}
                        </p>
                    </div>
                </div>
            </div>

            {/* FAA Table 54 */}
            {["Snow mixed with Freezing Fog",
                "Very Light Snow, Snow Grains or Snow Pellets",
                "Light Snow, Snow Grains or Snow Pellets",
                "Moderate Snow, Snow Grains or Snow Pellets"
            ].includes(precipitation) && (
                <div className="mt-6 border-2 border-blue-800 rounded-lg p-4 bg-blue-800/20">
                    <p className="text-blue-500 font-semibold mb-3 text-sm">
                        The <em>Snowfall Intensities as a Function of Prevailing Visibility</em> table is required to confirm that the precipitation intensity is no greater than MODERATE.
                    </p>
                    <p className="text-blue-500 font-semibold mb-3 text-sm">
                        No holdover times exist if the reported visibility correlates to HEAVY precipitation intensity.
                    </p>

                    {/* Interactive Helper */}
                    <IntensityHelper temperature={temperature} />
                </div>
            )}

            {"Freezing Drizzle".includes(precipitation) && (
                <div className="border-2 border-blue-900 bg-blue-900/30 py-2 px-4 rounded text-sm text-blue-400 font-semibold">
                    <p className="mb-0">
                        Use light freezing rain holdover times if positive identification of freezing drizzle is not possible.
                    </p>
                </div>
            )}


            {"Moderate Snow mixed with Rain".includes(precipitation) && (
                <div className="border-2 border-blue-900 bg-blue-900/30 py-2 px-4 rounded text-sm text-blue-400 font-semibold">
                    <p className="mb-2">
                        In cases of very light or light snow mixed with light rain or drizzle, use light freezing rain holdover times.
                    </p>
                    <p className="mb-0">
                        No holdover time guidelines exist for this condition for 0°C and below
                    </p>
                </div>
            )}

            {"Rain on Cold-Soaked Wing".includes(precipitation) && (
                <div className="border-2 border-blue-900 bg-blue-900/30 py-2 px-4 rounded text-sm text-blue-400 font-semibold">
                    <p className="mb-0">
                        No holdover time guidelines exist for this condition for 0°C and below
                    </p>
                </div>
            )}

            {/* Edit Modal */}
            {editing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 select-none">
                    <div className="bg-zinc-900 p-6 rounded-lg w-96 space-y-4 relative max-h-[90vh] overflow-y-auto">
                        <h2 className="text-white font-bold text-lg">Manual Weather</h2>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-300">Temperature (°C)</label>
                            <select
                                className="w-full p-2 rounded bg-neutral-900 text-white border-1 border-neutral-500 select-none"
                                value={editTemp}
                                onChange={e => setEditTemp(Number(e.target.value))}
                            >
                                {Array.from({ length: 41 }, (_, i) => 10 - i).map(temp => (
                                    <option key={temp} value={temp}>{temp}°C</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-300">Precipitation</label>
                            <select
                                className="w-full p-2 rounded bg-neutral-900 text-white border-1 border-neutral-500 select-none"
                                value={editPrecip}
                                onChange={e => setEditPrecip(e.target.value)}
                            >
                                {WEATHER_OPTIONS.map(w => (
                                    <option key={w} value={w}>{w}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                className="border-3 border-fuchsia-500 hover:bg-fuchsia-950 text-fuchsia-500 px-4 py-2 rounded font-bold"
                                onClick={handleReset}
                            >
                                Reset
                            </button>
                            <button
                                className="border-3 border-green-500 hover:bg-green-950 text-green-500 px-4 py-2 rounded font-bold"
                                onClick={handleSave}
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

export default WeatherSection;
