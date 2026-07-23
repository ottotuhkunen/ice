import React, { useEffect, useState, useRef } from 'react';
import fluidLimits from '../utils/fluidHoldoverTimes.json';
import { LOGOUT_URL, AIRCRAFT_DATA_URL, UPDATE_DATA_URL, SET_AREA_URL, GET_AREA_URL, WEBSOCKET_URL } from '../utils/data';
import { MenuSection, MainSection, CloseButton, EndReportMenu, MenuTitle } from '../styles/ATCViewStyles';
import { ModalBackground, ModalContent, ModalTitle, ModalButton } from '../styles/TopMenu';
import { Helmet } from 'react-helmet';
import warningSound from '../utils/notification.mp3'; 
import Aircraft from './ATCAircraft'
import EFHKDeiceMenu from './ApronSelector';

const treatmentOptions = [
  'No Treatment Requested',
  'Inspection',
  'Full A/C Type I',
  'Wings & Stab. Type I',
  'Full A/C Type I & Type IV',
  'Full A/C Type I, Wings & Stab. Type IV',
  'Wings & Stab. Type I & Type IV',
];

const standOptions = [
  ['600', '601', '602', '603', '604'],
  ['811', '812', '813', '814', '815', '816'],
  ['W44', 'W46', 'W48'],
];

const endReportTreatment = [
  '',
  'Inspection of aircraft surfaces is now complete. No visual indications of frost or ice.',
  'One-step treatment for full aircraft is now complete with Type 1 fluid, Mixture ',
  'One-step treatment for wings and stabilizers is now complete with Type 1 fluid, Mixture ',
  'Two-step treatment for wings and stabilizers is now complete with Type 4 fluid, Mixture ',
  'One-step treatment for full aircraft and two-step treatment for wings and stabilizers is now comlpete with Type 4 fluid, Mixture ',
  'Two-step treatment for wings and stabilizers is now complete with Type 4 fluid, Mixture ',
];

const METAR_URL = 'https://api.met.no/weatherapi/tafmetar/1.0/metar.txt?icao=EFHK';

const endReportDilution = (selectedAircraft, temp) => {
  if (selectedAircraft.selectedTreatment === 2  || selectedAircraft.selectedTreatment === 3){
    // Fluid Type 1
    if (temp >= 8 ) return '10 percent';
    else if (temp < 8 && temp >= 6) return '15 percent';
    else if (temp < 6 && temp >= 5) return '20 percent';
    else if (temp < 5 && temp >= 3) return '25 percent';
    else if (temp < 3 && temp >= 1) return '30 percent';
    else if (temp < 1 && temp >= -2) return '35 percent';
    else if (temp < -2 && temp >= -5) return '40 percent';
    else if (temp < -5 && temp >= -9) return '45 percent';
    else if (temp < -9 && temp >= -13) return '50 percent';
    else if (temp < -13 && temp >= -18) return '55 percent';
    else if (temp < -18 && temp >= -24) return '60 percent';
    else if (temp < -24 && temp >= -29) return '65 percent';
    else if (temp < -29 && temp >= -32.5) return '70 percent';
    else return 'XX percent';
  }
  else if (selectedAircraft.selectedTreatment > 3) {
    // Fluid Type 4
    if (temp >= -3 ) return '50 percent as the final step';
    else if (temp < -3 && temp >= -14 ) return '75 percent as the final step';
    else return '100 percent as the final step';
  }
  else {
    return '';
  }
}

const getLimits = (type, precipitation, intensity, temperature) => {
  let limits = fluidLimits[type]?.[precipitation];

  if (limits) {
    
    if (intensity && limits[intensity]) {
      limits = limits[intensity];
    }

    const temperatureKey = Object.keys(limits).find(key => {
      const ranges = key.split(', ');

      let valid = true;

      for (let range of ranges) {
        const [operator, temp] = range.split(' ');
        const tempValue = parseFloat(temp);

        if (operator === '>=') {
          if (temperature < tempValue) valid = false;
        } else if (operator === '<') {
          if (temperature >= tempValue) valid = false;
        }
      }

      return valid;
    });

    if (temperatureKey) {
      return limits[temperatureKey];
    }
  }

  return { lower: 'CLEAR', upper: 'CLEAR' };
};

const toRadians = (degrees) => (degrees * Math.PI) / 180;
const calculateDistanceNM = (lat1, lon1, lat2, lon2) => {
  const R = 3440.065; // Earth's radius in nautical miles
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const HELSINKI_COORDS = { lat: 60 + 19 / 60, lon: 24 + 57.53 / 60 };

const ATCView = ({ user }) => {
  const [aircraftData, setAircraftData] = useState([]);
  const [activeTreatmentMenu, setActiveTreatmentMenu] = useState(null);
  const [activeStandMenu, setActiveStandMenu] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [endReportMenuOpen, setEndReportMenuOpen] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [isPasswordFieldVisible, setPasswordFieldVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [selectedApron, setSelectedApron] = useState("AP6");
  const [temperature, setTemperature] = useState('');

    const parseTemperature = (metars) => {
        const temps = metars
            .map(metar => {
                const match = metar.match(/ (M?\d{2})\/(M?\d{2})/);
                if (!match) return null;
                const tempStr = match[1];
                return tempStr.startsWith('M')
                    ? -parseInt(tempStr.slice(1), 10)
                    : parseInt(tempStr, 10);
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
            const temp = parseTemperature([latest, prev]);
            setTemperature(temp);
        } catch (err) {
            console.error('Failed to fetch METAR:', err);
        }
    };

    useEffect(() => {
        fetchMetar();
        const interval = setInterval(fetchMetar, 6 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const treatmentMenuRef = useRef();
  const standMenuRef = useRef();

  const prevAircraftDataRef = useRef([]);
  const audio = new Audio(warningSound);

  useEffect(() => {
    fetch(GET_AREA_URL)
    .then((response) => response.json())
    .then((data) => {
      setSelectedApron(data.selectedArea);
    });
  }, []);

  const fetchAndUpdateData = async () => {
    console.log('Updating data');
    try {
      const response = await fetch(AIRCRAFT_DATA_URL);
      const data = await response.json();

      // Filter aircraft within 3 NM of Helsinki Airport
      const filteredData = data.filter((aircraft) => {
        const { lat, lon } = aircraft;
        const distance = calculateDistanceNM(lat, lon, HELSINKI_COORDS.lat, HELSINKI_COORDS.lon);
        return distance <= 3; // Include only aircraft within 3 NM
      });
  
      // Sort data by EOBT
      const sortedData = [...filteredData].sort((a, b) => a.EOBT.localeCompare(b.EOBT));
  
      // Update state only if there are changes
      setAircraftData((prevData) => {
        if (JSON.stringify(prevData) !== JSON.stringify(sortedData)) {
          return sortedData;
        }
        return prevData; // Prevent unnecessary renders
      });
    } catch (error) {
      console.error('Error fetching aircraft data:', error);
    }
  };

  const saveSelectedApron = async (apron) => {
    try {
      setSelectedApron(apron);
      const response = await fetch(SET_AREA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ area: apron }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save apron selection');
      }
      console.log('Apron selection saved');
    } catch (error) {
      console.error('Error saving apron selection:', error);
    }
  };

  useEffect(() => {
    // Check for new aircraft with requestStatus === 1 that wasn't in that state before
    const newRequests = aircraftData.filter((aircraft) => {
      const prevAircraft = prevAircraftDataRef.current.find((a) => a.cid === aircraft.cid);
      return aircraft.requestStatus === 1 && (!prevAircraft || prevAircraft.requestStatus !== 1);
    });

    if (newRequests.length > 0 && audioEnabled) {
      audio.play().catch((err) => console.error('Audio playback failed:', err));
    }

    // Update the previous aircraft data with the current data
    prevAircraftDataRef.current = aircraftData;

  }, [aircraftData, audioEnabled]);

  const handleLogout = async () => {
    try {
      const response = await fetch(LOGOUT_URL, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        console.error('Logout failed:', await response.json());
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  const handleUpdate = (callsign, field, value) => {
    setUpdatedData((prev) => ({
      ...prev,
      [`${callsign}_${field}`]: value,
    }));
  };

  const pingAircraft = async (callsign, password) => {
    if (!password) return { success: false };
    const pingUrl = `https://www.hoppie.nl/acars/system/connect.html?logon=${password}&from=SUREWX&to=SUREWX&type=ping&packet=${callsign}`;

    try {
      const response = await fetch(pingUrl);
      const text = await response.text();
  
      if (text.trim().includes(callsign)) {
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Ping failed:', error);
      return { success: false };
    }
  };
  
  const sendTelexMessage = async (callsign, reg, password, precipitation, intensity, temperature) => {
    if (!password) return false;

    console.log('Sending Telex message.');

    const type1Limits = getLimits('type1', precipitation, intensity, temperature);
    const type4Limits = getLimits('type4', precipitation, intensity, temperature);
    
    const type4Dilution = () => {
      if (temperature >= -3) return "50/50";
      else if (temperature >= -14) return "75/25";
      else return "100/0";
    }

    const now = new Date(Date.now() - 5 * 60 * 1000); // Subtract 5 minutes
    const utcYear = now.getUTCFullYear().toString().slice(-2); // Last 2 digits of year
    const utcMonth = String(now.getUTCMonth() + 1).padStart(2, '0'); // Month (1-12)
    const utcDate = String(now.getUTCDate()).padStart(2, '0'); // Day of the month
    const utcHours = String(now.getUTCHours()).padStart(2, '0'); // Hours (0-23)
    const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0'); // Minutes (0-59)
    
    const formattedTime = `${utcYear}${utcMonth}${utcDate}${utcHours}${utcMinutes}Z`;    

    let formattedPrecip = '';
    if (precipitation === 'Freezing Fog, Freezing Mist, or Ice Crystals') {
      formattedPrecip += "FREEZING FOG DETECTED";
    }
    else if (precipitation === 'Snow mixed with Freezing Fog') {
      if (intensity === 'Heavy') formattedPrecip = "SNOW WITH FREEZING FOG DETECTED";
      else formattedPrecip = "HEAVY SNOW PRECIPITATION RATE EXCEEDED";
    }
    else if (precipitation === 'Snow, Snow Grains or Snow Pellets') {
      if (intensity === 'Heavy') formattedPrecip = "SNOW/SNOW GRAINS/SNOW PELLETS DETECTED";
      else formattedPrecip = "HEAVY SNOW PRECIPITATION RATE EXCEEDED";
    }
    else if (precipitation === 'Freezing Drizzle') {
      formattedPrecip += "FREEZING DRIZZLE DETECTED";
    }
    else if (precipitation === 'Freezing Rain') {
      formattedPrecip += "FREEZING RAIN DETECTED";
      if (intensity === 'Heavy') formattedPrecip = "FREEZING RAIN DETECTED";
      else formattedPrecip = "HEAVY FZRA PRECIPITATION RATE EXCEEDED";
    }
    else {
      formattedPrecip = "CLEAR";
    }

    let formattedTemp = temperature.toString().replace('-', 'M') + '.0C';

    const message = `
      SUREWX REPORT EFHK
      AIRCRAFT ${reg || callsign}

      HOTDR WX EFHK
      ${formattedTime}
      ${formattedPrecip} ${formattedTemp}

      ${formattedPrecip === "CLEAR" 
        ? "NO PRECIP DETECTED" 
        : `TYPE 1 HOT: ${type1Limits.lower || '//'} MIN
          TYPE 4 HOT: ${type4Limits.lower || '//'} MIN`
      }
      CLARIANT SAFEWING MP IV LAUNCH ${type4Dilution() || '100/0'}
    `;
  
    const telexUrl = `https://www.hoppie.nl/acars/system/connect.html?logon=${password}&from=SUREWX&to=${callsign}&type=telex&packet=${encodeURIComponent(
      message
    )}`;
  
    try {
      const response = await fetch(telexUrl, { method: 'POST' });
      const text = await response.text();
      return text.trim().startsWith('ok');
    } catch (error) {
      console.error('Telex message failed:', error);
      return false;
    }
  };

  const saveTreatmentChanges = async (callsign, cid) => {
    const updatedTreatment = updatedData[`${callsign}_selectedTreatment`];
    if (updatedTreatment === undefined) {
      return;
    }
  
    setIsSending(true);
  
    const previousData = [...aircraftData];
    setAircraftData((prevData) =>
      prevData.map((aircraft) =>
        aircraft.callsign === callsign
          ? { ...aircraft, selectedTreatment: updatedTreatment }
          : aircraft
      )
    );
  
    try {

      if (updatedTreatment === 0) {
        
        const requestBody = {
          callsign,
          cid,
          selectedTreatment: updatedTreatment,
          ACARSSent: 0,
          requestStatus: 0,
          guidanceInfo: 0,
          HOTStartTime: ''
        }

        const response = await fetch(UPDATE_DATA_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(requestBody),
        });
        return;
      }
      else { // requestBody.requestStatus = 2;

        const requestBody = {
          callsign,
          cid,
          selectedTreatment: updatedTreatment,
          requestStatus: 2
        }

        // TELEX
        const pingResult = await pingAircraft(callsign, password);
        if (!pingResult.success) {
          console.warn('Ping failed or aircraft is not online.');
          requestBody.ACARSSent = 0;
        } else {
          const reg = aircraftData.find((a) => a.callsign === callsign)?.REG || '';
          const precipitation = '';
          const intensity = '';
          await sendTelexMessage(callsign, reg, password, precipitation, intensity, temperature);
          requestBody.ACARSSent = 1;
        }

        const response = await fetch(UPDATE_DATA_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          setAircraftData(previousData); // Revert changes if request fails
        }
      }

    } catch (error) {
      setAircraftData(previousData); // Revert changes in case of an error
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const saveStandChanges = async (callsign, cid) => {
    const updatedStand = updatedData[`${callsign}_stand`];
    if (updatedStand === undefined) {
      return;
    }
    setIsSending(true);

    const previousData = [...aircraftData];
    setAircraftData((prevData) =>
      prevData.map((aircraft) =>
        aircraft.callsign === callsign
          ? { ...aircraft, stand: updatedStand }
          : aircraft
      )
    );

    try {
      const response = await fetch(UPDATE_DATA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          callsign,
          cid,
          stand: updatedStand,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setAircraftData(previousData);
      }
    } catch (error) {
      setAircraftData(previousData);
    } finally {
      setIsSending(false);
    }
  };

  const handleFunctionButtonClick = async (aircraft) => {
    if (aircraft.requestStatus === 1) {
      const response = await fetch(UPDATE_DATA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          callsign: aircraft.callsign,
          cid: user.cid,
          requestStatus: 2,
        }),
      });
    } else if (aircraft.requestStatus === 2) {
      const response = await fetch(UPDATE_DATA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          callsign: aircraft.callsign,
          cid: user.cid,
          requestStatus: 3,
          guidanceInfo: 1,
        }),
      });
    } else if (aircraft.requestStatus === 3) {
      const response = await fetch(UPDATE_DATA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          callsign: aircraft.callsign,
          cid: user.cid,
          requestStatus: 4,
          guidanceInfo: 2,
          HOTStartTime: new Date().toISOString().slice(11, 16),
        }),
      });
    } else if (aircraft.requestStatus === 4) {
      const response = await fetch(UPDATE_DATA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          callsign: aircraft.callsign,
          cid: user.cid,
          requestStatus: 5,
          guidanceInfo: 3,
          HOTStartTime: new Date().toISOString().slice(11, 16),
        }),
      });
      setSelectedAircraft(aircraft);
      setEndReportMenuOpen(true);
    } else if (aircraft.requestStatus === 5) {
      setSelectedAircraft(aircraft);
      setEndReportMenuOpen(true);
    }
  };

  const closeEndReportMenu = () => {
    setEndReportMenuOpen(false);
  };

  const closeMenus = () => {
    setActiveTreatmentMenu(null);
    setActiveStandMenu(null);
  };

  const handleHoppieClick = () => {
  
    if (isPasswordFieldVisible) {
      setPasswordFieldVisible(false);
    } else {
      setPasswordFieldVisible(true);
    }
  };

  const handlePasswordChange = (event) => {
    console.log("password changed");
    setPassword(event.target.value);
  };

  const handleSavePassword = () => {
    setPasswordFieldVisible(false);
  };

  useEffect(() => {
    fetchAndUpdateData(); // Initial fetch
  
    // Connect to WebSocket
    const socket = new WebSocket(WEBSOCKET_URL);
  
    socket.onopen = () => {
      console.log('WebSocket connected');
    };
  
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'aircraft-updated') {
        console.log('Aircraft update received:', msg.callsign);
        fetchAndUpdateData(); // Trigger update immediately
      }
    };
  
    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };
  
    // Optional fallback polling every 60s (for resilience)
    const fallbackInterval = setInterval(fetchAndUpdateData, 60000);
  
    return () => {
      socket.close();
      clearInterval(fallbackInterval);
    };
  }, []);  

  useEffect(() => {
    // Function to handle clicks outside of the menu
    const handleClickOutside = (event) => {
      if (
        treatmentMenuRef.current &&
        !treatmentMenuRef.current.contains(event.target) ||
        standMenuRef.current &&
        !standMenuRef.current.contains(event.target)
      ) {
        closeMenus();
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onStandAircraft = aircraftData.filter((aircraft) => aircraft.requestStatus === 0);
  const deiceRequestedAircraft = aircraftData.filter(
    (aircraft) =>
      (aircraft.requestStatus === 1 || aircraft.requestStatus === 2) &&
      aircraft.isInRange === false
  );
  const deiceApronAircraft = aircraftData.filter((aircraft) =>
    (aircraft.requestStatus === 3 || aircraft.requestStatus === 4) ||
    (aircraft.requestStatus >= 2 && aircraft.isInRange === true)
  );

  return (
    <>
    <Helmet>
      <meta name="viewport" content="width=device-width, initial-scale=0.6" />
    </Helmet>
    <div className="main-container">
      <MenuSection>
        <a href="https://vatsim-scandinavia.org/" target="_blank" rel="noopener noreferrer">
          <img src="images/vatsca.svg" alt="Vatsca" style={{width: '86px', marginTop: '2px'}}/>
        </a>
          <EFHKDeiceMenu
              selectedApron={selectedApron}
              saveSelectedApron={saveSelectedApron}
              closeMenus={closeMenus}
              isSending={isSending}
              user={user}
          />

        {isPasswordFieldVisible && (
          <div className="password-field">
            <label htmlFor="service-password"></label>
            <input
              type="password"
              id="service-password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Hoppie Code"
            />
            <button onClick={handleSavePassword}>Save</button>
          </div>
          )}

          <div className={"flex items-center"}>
            <a href="https://wiki.vatsim-scandinavia.org/books/special-procedures/page/efhk-de-icing" target="_blank" rel="noopener noreferrer">
              <img style={{ marginRight: '12px', width: '22px' }} src="images/files.svg" alt="Files" />
            </a>
            <img
              src={audioEnabled ? 'images/speaker-on.svg' : 'images/speaker-off.svg'}
              alt="Audio"
              style={{ marginRight: '10px', width: '22px' }}
              onClick={() => setAudioEnabled((prev) => !prev)}
            />
            <img
              src={password ? "images/acars-on.svg" : "images/acars-off.svg"}
              alt="ACARS"
              onClick={handleHoppieClick}
              style={{ marginRight: '10px', width: '22px' }}
            />
            <img onClick={() => setShowModal(true)} style={{ width: '24px' }} src="images/logout.svg" alt="Logout" />
          </div>
      </MenuSection>

      <MainSection>
        <div className="column-group">
          <div id="on-stand-column">
            <h3>ON STAND / NO REQUEST</h3>
            {onStandAircraft.map((aircraft) => (
              <Aircraft
                key={aircraft.callsign}
                aircraft={aircraft}
                treatmentOptions={treatmentOptions}
                standOptions={standOptions}
                activeTreatmentMenu={activeTreatmentMenu}
                setActiveTreatmentMenu={setActiveTreatmentMenu}
                activeStandMenu={activeStandMenu}
                setActiveStandMenu={setActiveStandMenu}
                handleUpdate={handleUpdate}
                updatedData={updatedData}
                saveTreatmentChanges={saveTreatmentChanges}
                saveStandChanges={saveStandChanges}
                isSending={isSending}
                user={user}
                treatmentMenuRef={treatmentMenuRef}
                standMenuRef={standMenuRef}
                closeMenus={closeMenus}
                handleFunctionButtonClick={handleFunctionButtonClick}
                columnType="onStand"
              />
            ))}
          </div>
          <div id="deice-requested-column">
            <h3>DEICE REQUEST</h3>
            {deiceRequestedAircraft.map((aircraft) => (
              <Aircraft
                key={aircraft.callsign}
                aircraft={aircraft}
                isDeiceRequested={true}
                treatmentOptions={treatmentOptions}
                standOptions={standOptions}
                activeTreatmentMenu={activeTreatmentMenu}
                setActiveTreatmentMenu={setActiveTreatmentMenu}
                activeStandMenu={activeStandMenu}
                setActiveStandMenu={setActiveStandMenu}
                treatmentMenuRef={treatmentMenuRef}
                standMenuRef={standMenuRef}
                handleUpdate={handleUpdate}
                saveTreatmentChanges={saveTreatmentChanges}
                saveStandChanges={saveStandChanges}
                isSending={isSending}
                updatedData={updatedData}
                user={user}
                closeMenus={closeMenus}
                handleFunctionButtonClick={handleFunctionButtonClick}
                columnType="deiceRequested"
              />
            ))}
          </div>
        </div>
        <div id="deice-apron-column">
          <h3 className='deice-apron-title'>
            <img src='images/slippery.png'></img>
            <div>
              <p style={{margin: 0}}>REMOTE DE-ICING | {selectedApron}</p>
              <p style={{fontWeight: 'normal', fontSize: '9pt', margin: 0}}>De-icing Operator on 121.675</p>
              <p style={{fontWeight: 'normal', fontSize: '9pt', margin: 0}}>
                {selectedApron === 'AP6' ? 'Proceed via GC1 or DC1' : 'Proceed via AV1 or VS1'}
              </p>
            </div>
            <div>133.850</div>
          </h3>
          {deiceApronAircraft.map((aircraft) => (
            <Aircraft
              key={aircraft.callsign}
              aircraft={aircraft}
              isDeiceRequested={true}
              treatmentOptions={treatmentOptions}
              standOptions={standOptions}
              activeTreatmentMenu={activeTreatmentMenu}
              setActiveTreatmentMenu={setActiveTreatmentMenu}
              activeStandMenu={activeStandMenu}
              setActiveStandMenu={setActiveStandMenu}
              treatmentMenuRef={treatmentMenuRef}
              standMenuRef={standMenuRef}
              handleUpdate={handleUpdate}
              saveTreatmentChanges={saveTreatmentChanges}
              saveStandChanges={saveStandChanges}
              isSending={isSending}
              updatedData={updatedData}
              user={user}
              closeMenus={closeMenus}
              handleFunctionButtonClick={handleFunctionButtonClick}
              columnType="deiceApron"
            />
          ))}
        </div>
      </MainSection>

      {endReportMenuOpen && selectedAircraft && (
        <EndReportMenu>
          <MenuTitle>End Report</MenuTitle>
          <div className='menu-content-container'>
            <p>
              {selectedAircraft.callsign} 
              {selectedAircraft.REG && ` (or ${selectedAircraft.REG}) `} 
              on stand {selectedAircraft.stand || 'N/A'}
            </p>
            <p>{endReportTreatment[selectedAircraft.selectedTreatment]} {endReportDilution(selectedAircraft, temperature)}</p>
            <p>
              Holdover time started at{" "}
              {selectedAircraft.HOTStartTime ? (
                new Date(
                  Date.UTC(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate(),
                    ...selectedAircraft.HOTStartTime.split(":").map(Number)
                  )
                ).toLocaleTimeString("en-GB", {
                  timeZone: "Europe/Helsinki",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              ) : (
                "N/A"
              )}{" "}
              local time
            </p>
            <p>Post de- and anti-icing checks completed</p><
              p>Personnel and equipment clear of aircraft</p>
          </div>

          <CloseButton onClick={closeEndReportMenu}>Close</CloseButton>
        </EndReportMenu>
      )}

      {showModal && (
        <ModalBackground>
          <ModalContent>
            <ModalTitle>Confirm Logout</ModalTitle>
            <p>Are you sure you want to log out?</p>
            <div>
              <ModalButton confirm onClick={handleLogout}>
                Logout
              </ModalButton>
              <ModalButton onClick={() => setShowModal(false)}>Cancel</ModalButton>
            </div>
          </ModalContent>
        </ModalBackground>
      )}
    </div>
    </>
  );
};

export default ATCView;

/*
    <div class="overlay">
      <div class="overlay-text">Preparing for the next season</div>
    </div>

    Below Helmet
 */