import React, { useState, useEffect } from 'react';
import {FaCheck, FaWifi} from "react-icons/fa";
import { UPDATE_DATA_URL } from '../../utils/data';
import EditIcon from "./Elements/Edit";

const treatmentOptions = [
    'Inspection',
    'Full Aircraft Type 1 HOT',
    'Wings & Stabilizers Type 1 HOT',
    'Full Aircraft Type 1 & Type 4',
    'Full Aircraft Type 1, Wings & Stabilizers Type 4',
    'Wings & Stabilizers Type 1 & Type 4',
];

const OrderSection = ({ stand, ttot, hotStart, requestStatus, callsign, cid, selectedTreatment, onSelectedChange }) => {
    const [selected, setSelected] = useState(selectedTreatment > 0 ? selectedTreatment - 1 : null);
    const [isSending, setIsSending] = useState(false);
    const [requestSent, setRequestSent] = useState(false);

    const isLocked = requestStatus !== 0 && requestStatus !== null;
    const requestApproved = requestStatus >= 2;
    const requestInProgress = requestStatus === 1;

    useEffect(() => {
        if (selectedTreatment > 0) setSelected(selectedTreatment - 1);
    }, [selectedTreatment]);

    useEffect(() => {
        if (onSelectedChange) {
            onSelectedChange(selected);
        }
    }, [selected, onSelectedChange]);

    const handleSendRequest = async () => {
        if (selected === null) return;

        setIsSending(true);
        setRequestSent(false);

        try {
            const response = await fetch(UPDATE_DATA_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    callsign,
                    cid,
                    selectedTreatment: selected + 1,
                    requestStatus: 1,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Request sent successfully.');
                setRequestSent(true);
            } else {
                console.error('Error sending request:', result);
                alert('Failed to send request.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while sending the request.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="bg-zinc-900 p-6 rounded-lg space-y-6 flex-1">

            <div className="flex items-center space-x-4">
                <select
                    className="w-full p-2 rounded bg-neutral-900 text-white border-1 border-neutral-500 select-none"
                    value={selected !== null ? selected : ""}
                    onChange={(e) => !isLocked && setSelected(parseInt(e.target.value))}
                    disabled={isLocked}
                >
                    <option value="" disabled>Select a Treatment</option>
                    {treatmentOptions.map((option, index) => (
                        <option key={index} value={index}>{option}</option>
                    ))}
                </select>
                <div className="flex items-center cursor-not-allowed [&_*]:cursor-not-allowed">
                    <EditIcon />
                </div>
            </div>

            <div>
                {selected !== null && !requestInProgress && !requestApproved && !requestSent && (
                    callsign === "Disconnected" ? (
                        <p className="mt-0 text-sm text-red-500 border-2 border-red-900 bg-red-900/40 py-2 px-4 rounded font-semibold inline-block">
                            Connect to VATSIM and file your flight plan first
                        </p>
                    ) : (
                        <button
                            onClick={handleSendRequest}
                            disabled={isSending}
                            className="px-4 py-1 border-3 border-blue-500 hover:bg-blue-950 rounded text-blue-500 font-bold text-lg disabled:opacity-50"
                        >
                            {isSending ? 'Sending...' : 'SEND REQUEST'}
                        </button>
                    )
                )}

                {(requestInProgress || requestApproved) && (
                    <p className="mt-2 text-green-500 flex items-center font-bold">
                        {requestApproved ? 'Ready' : 'Request Sent'}
                        {requestApproved && <FaCheck className="ml-2" />}
                    </p>
                )}

                {requestSent && !requestInProgress && !requestApproved && (
                    <p className="mt-2 text-yellow-400 flex items-center font-bold">
                        Request Sent
                        <FaWifi className="ml-2" />
                    </p>
                )}
            </div>

            {requestStatus === 1 && (
                <p className="mt-0 text-sm text-orange-400 border-2 border-orange-800 bg-orange-700/20 py-2 px-4 rounded font-semibold inline-block">
                    If the request is not confirmed by Remote De-Icing Supervisor within a few minutes, please revert to voice.
                </p>
            )}

            <div className="flex items-start gap-x-14 gap-y-6 flex-wrap">
                <div className="flex flex-col">
                    <p className="font-semibold mb-2">Provider</p>
                    <p className="font-bold text-blue-400 mb-0">{requestApproved ? 'Swissport' : 'Unavailable'}</p>
                    {requestApproved && <p className="font-bold mb-0 text-blue-400">Norra</p>}
                    {requestApproved && <p className="font-bold mb-0 text-blue-400">Airpro</p>}
                </div>
                <div className="flex flex-col">
                    <p className="font-semibold mb-2">Frequency</p>
                    <p className="font-bold text-blue-400">{requestApproved ? '121.675' : 'Unavailable'}</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-semibold mb-2">Stand</p>
                    <p className="font-bold text-blue-400">{stand}</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-semibold mb-2">TTOT</p>
                    <p className="font-bold text-blue-400">{ttot}</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-semibold mb-2">HOT start</p>
                    <p className="font-bold text-blue-400">{hotStart}</p>
                </div>
            </div>
        </div>
    );
};

export default OrderSection;
