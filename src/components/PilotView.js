import React, { useState, useEffect } from 'react';
import TopMenu from './TopMenu';
import Aerodrome from './Aerodrome';
import Weather from './Weather';
import Request from './Request';
import Notes from './Notes';
import Steps from './Steps';
import { AIRCRAFT_DATA_URL } from '../utils/data';

const PilotView = ({ user }) => {
  const [callsign, setCallsign] = useState('No VATSIM Connection');
  const [guidanceInfo, setGuidanceInfo] = useState(0);
  const [stand, setStand] = useState('Unavailable');
  const [ttot, setTtot] = useState('Unavailable');
  const [hotStart, setHotStart] = useState('Unavailable');
  const [requestStatus, setRequestStatus] = useState(0);
  const [selectedTreatment, setSelectedTreatment] = useState(0);

  const [temperature, setTemperature] = useState('--');
  const [precipitation, setPrecipitation] = useState('NIL');
  const [intensity, setIntensity] = useState('NIL');

  console.log('PilotView rendered');

  // Function to fetch the aircraft data and update state
  const fetchAircraftData = async () => {
    try {
      const response = await fetch(AIRCRAFT_DATA_URL);
      const aircraftData = await response.json();
      const userAircraft = aircraftData.find((aircraft) => aircraft.cid === user.cid);

      if (userAircraft) {
        setCallsign(userAircraft.callsign);
        setGuidanceInfo(userAircraft.guidanceInfo || 0);
        setStand(userAircraft.stand || 'Unavailable');
        setTtot(userAircraft.TTOT || 'Unavailable');
        setHotStart(userAircraft.HOTStartTime || 'Unavailable');
        setRequestStatus(userAircraft.requestStatus || 0);
        setSelectedTreatment(userAircraft.selectedTreatment || 0);
        setTemperature(userAircraft.selectedWeather.temperature || 0);
        setPrecipitation(userAircraft.selectedWeather.precipitation || 'NIL');
        setIntensity(userAircraft.selectedWeather.intensity || 'NIL');
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
    <div className="main-container">
      <TopMenu callsign={callsign} />
      <Aerodrome guidanceInfo={guidanceInfo} />
      <Weather temperature={temperature} precipitation={precipitation} intensity={intensity} />
      <Request stand={stand} ttot={ttot} hotStart={hotStart} requestStatus={requestStatus} 
        callsign={callsign} cid={user.cid} selectedTreatment={selectedTreatment} 
        temperature={temperature} precipitation={precipitation} intensity={intensity} />
      <Notes />
      <Steps />
    </div>
  );
};

export default PilotView;
