import React, { useState, useEffect } from 'react';

const TimerSection = ({ holdoverTime }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0); // seconds
    const [pausedTime, setPausedTime] = useState(0);

    const totalHoldoverMinutes = holdoverTime * 60;

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

    // Timer control functions
    const handleStart = () => setIsRunning(true);
    const handlePause = () => {
        setIsRunning(false);
        setPausedTime(elapsedTime);
    };
    const handleReset = () => {
        setIsRunning(false);
        setElapsedTime(0);
        setPausedTime(0);
    };
    const handleContinue = () => setIsRunning(true);

    // Timer effect
    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
        } else {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isRunning]);

    // Format time as mm:ss
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Progress bar calculation
    const elapsedPercentage = Math.min((elapsedTime / (totalHoldoverMinutes * 60)) * 100, 100);

    return (
        <div className="bg-zinc-900 rounded-lg p-6 space-y-6 flex-1">
            <div className="flex items-center gap-6 select-none">
                <div className="w-52 flex h-[110px] items-center">
                    {!isRunning && elapsedTime === 0 ? (
                        <button
                            onClick={handleStart}
                            className="w-full h-[42px] border-3 border-fuchsia-500 hover:bg-fuchsia-950 rounded text-fuchsia-500 font-bold text-lg"
                        >
                            START
                        </button>
                    ) : !isRunning && elapsedTime > 0 ? (
                        <div className="flex-1 flex flex-col gap-3">
                            <button
                                onClick={handleContinue}
                                className="w-full h-[42px] border-3 border-fuchsia-500 hover:bg-fuchsia-950 rounded text-fuchsia-500 font-bold text-lg"
                            >
                                CONTINUE
                            </button>
                            <button
                                onClick={handleReset}
                                className="w-full h-[42px] border-3 border-red-500 hover:bg-red-950 rounded text-red-500 font-bold text-lg"
                            >
                                RESET
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handlePause}
                            className="w-full h-[42px] border-3 border-fuchsia-500 hover:bg-fuchsia-950 rounded text-fuchsia-500 font-bold text-lg"
                        >
                            PAUSE
                        </button>
                    )}
                </div>

                <div className="flex-1">
                    {/* Progress Bar */}
                    <div className="relative w-full h-6 mb-2 bg-green-600 rounded overflow-hidden">
                        <div
                            className="absolute h-6 bg-red-600 transition-all duration-300"
                            style={{ width: `${elapsedPercentage}%` }}
                        ></div>
                    </div>

                    <div className="flex  justify-between text-sm font-bold">
                        <span>{formatTime(elapsedTime)} min</span>
                        <span>HOT {timeStrToMinutes(holdoverTime)} min</span>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default TimerSection;
