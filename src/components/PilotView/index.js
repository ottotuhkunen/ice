import React, { useState, useEffect } from 'react';
import { AIRCRAFT_DATA_URL } from '../../utils/data';
import Menu from './Menu';
import IconContainer from './IconContainer';
import LocationSection from './Section1';
import WeatherSection from "./Section2";
import OrderSection from "./Section3";
import FluidSection from "./Section4";
import TimerSection from "./Section5";
import NotesSection from "./Section6";
import ProceduresSection from "./Section7";
import DeiceVGS from "./deiceVGS";

const PilotView = ({ user }) => {
    const [callsign, setCallsign] = useState('Disconnected');
    const [stand, setStand] = useState('Unavailable');
    const [ttot, setTtot] = useState('Unavailable');
    const [hotStart, setHotStart] = useState('Unavailable');
    const [requestStatus, setRequestStatus] = useState(0);
    const [selectedTreatment, setSelectedTreatment] = useState(0);
    const [temperature, setTemperature] = useState('');
    const [precipitation, setPrecipitation] = useState('');
    const [userTreatment, setUserTreatment] = useState(null);
    const [hot, setHot] = useState(0);

    // Function to fetch the aircraft data and update state
    const fetchAircraftData = async () => {
        try {
            const response = await fetch(AIRCRAFT_DATA_URL);
            const aircraftData = await response.json();
            const userAircraft = aircraftData.find((aircraft) => aircraft.cid === user.cid);

            if (userAircraft) {
                setCallsign(userAircraft.callsign);
                setStand(userAircraft.stand || 'Unavailable');
                setTtot(userAircraft.TTOT || 'Unavailable');
                setHotStart(userAircraft.HOTStartTime || 'Unavailable');
                setRequestStatus(userAircraft.requestStatus || 0);
                setSelectedTreatment(userAircraft.selectedTreatment || 0);
            }
        } catch (error) {
            console.error('Error fetching aircraft data:', error);
        }
    };

    useEffect(() => {
        if (user && user.cid) {
            fetchAircraftData();

            const intervalId = setInterval(() => {
                fetchAircraftData();
            }, 10000);

            return () => clearInterval(intervalId);
        }
    }, [user]);

    return (
        <>
            <Menu callsign={callsign} />
            <div className="mt-14 flex p-2 pb-0 bg-neutral-950 text-white items-stretch">
                <IconContainer iconName={'pin'}/>
                <LocationSection/>
            </div>
            <div className="flex p-2 pb-0 bg-neutral-950 text-white items-stretch">
                <IconContainer iconName={'rain'}/>
                <WeatherSection
                    temperature={temperature}
                    precipitation={precipitation}
                    setTemperature={setTemperature}
                    setPrecipitation={setPrecipitation}
                    requestStatus={requestStatus}
                />
            </div>
            <div className="flex p-2 pb-0 bg-neutral-950 text-white items-stretch">
                <IconContainer iconName={'truck'}/>
                <OrderSection stand={stand} ttot={ttot} hotStart={hotStart} requestStatus={requestStatus}
                              callsign={callsign} cid={user.cid} selectedTreatment={selectedTreatment}
                              onSelectedChange={(value) => setUserTreatment(value)}/>
            </div>

            {userTreatment !== 0 && userTreatment !== null &&
                <div className="flex p-2 pb-0 bg-neutral-950 text-white items-stretch">
                    <IconContainer iconName={'flask'}/>
                    <FluidSection selectedTreatment={userTreatment + 1} requestStatus={requestStatus} hotStart={hotStart} temperature={temperature} precipitation={precipitation} onHotCalculated={(value) => setHot(value)} />
                </div>
            }

            {userTreatment !== 0 && userTreatment !== null &&
                <div className="flex p-2 pb-0 bg-neutral-950 text-white items-stretch">
                    <IconContainer iconName={'timer'}/>
                    <TimerSection holdoverTime={hot}/>
                </div>
            }

            <div className="flex p-2 pb-0 bg-neutral-950 text-white items-stretch">
                <IconContainer iconName={'notes'}/>
                <NotesSection/>
            </div>
            <div className="flex p-2 bg-neutral-950 text-white items-stretch">
                <IconContainer iconName={'info'}/>
                <ProceduresSection/>
            </div>

            <DeiceVGS requestStatus={requestStatus} />
        </>
    );
};

export default PilotView;
