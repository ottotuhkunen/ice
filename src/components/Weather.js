import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import {
  Block, Container, IconContainer, Content, Value,
  DataContainer, DataSection, Title, AdditionalDataContainer,
  ValueBig, EditButton, EditImage
} from '../styles/WeatherStyles';

const Weather = ({ temperature, precipitation, intensity }) => {
  const [metarData, setMetarData] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [isLate, setIsLate] = useState(false);

  const fetchMetar = async () => {
    try {
      const response = await fetch('https://metar.vatsim.net/EFHK');
      const metar = await response.text();

      const parts = metar.split(' ');
      if (parts.length > 2) {
        const rawTimestamp = parts[1];
        const metarInfo = parts.slice(2).join(' ');

        setMetarData(metarInfo);

        const utcTime = rawTimestamp.slice(2, 6);
        setTimestamp(utcTime);

        // Check if the timestamp is more than 30 minutes late
        const currentUTC = new Date();
        const utcMinutes = currentUTC.getUTCMinutes();
        const utcHours = currentUTC.getUTCHours();

        const metarHours = parseInt(utcTime.slice(0, 2), 10);
        const metarMinutes = parseInt(utcTime.slice(2, 4), 10);

        const currentTotalMinutes = utcHours * 60 + utcMinutes;
        const metarTotalMinutes = metarHours * 60 + metarMinutes;

        setIsLate(currentTotalMinutes - metarTotalMinutes > 30);
      }
    } catch (error) {
      console.error('Error fetching METAR data:', error);
    }
  };

  useEffect(() => {
    // Fetch METAR data immediately on component mount
    fetchMetar();

    // Set up an interval to fetch METAR every 2 minutes
    const intervalId = setInterval(() => {
      fetchMetar();
    }, 2 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Block>
      <Container>
        <IconContainer>
          <img src="images/icon2.svg" alt="weather-icon"></img>
        </IconContainer>
        <Content>
          <AdditionalDataContainer>
            <Title>METAR Timestamp: </Title>
            <Value style={{ color: isLate ? 'red' : '#43c6e7' }}>{timestamp}Z</Value>
          </AdditionalDataContainer>
          <AdditionalDataContainer>
            <Value>{metarData}</Value>
          </AdditionalDataContainer>

          <DataContainer style={{ marginTop: '20px', marginBottom: '20px' }}>
            <DataSection>
              <Title>
                <img src='images/temp.svg' alt='temp'></img> Temperature
              </Title>
              <ValueBig>{temperature}°C</ValueBig>
            </DataSection>

            {/* Conditional rendering for Precipitation and Snowfall Intensity */}
            {precipitation === 'NIL' ? (
              <DataSection>
                <Title><img src='images/precip.svg' alt='precip'></img> Precipitation</Title>
                <Title style={{ marginTop: '16px' }}>NO ANTI-ICING CONDITIONS EXPECTED</Title>
              </DataSection>
            ) : (
              <>
                <DataSection>
                  <Title><img src='images/precip.svg' alt='precip'></img> Precipitation</Title>
                  <Value style={{ marginTop: '16px' }}>{precipitation}</Value>
                </DataSection>
                <DataSection>
                  <Title><img src='images/intensity.svg' alt='intensity'></img> Snowfall Intensity</Title>
                  <Value style={{ marginTop: '16px' }}>{intensity}</Value>
                </DataSection>
              </>
            )}
          </DataContainer>
        </Content>
      </Container>
    </Block>
  );
};

export default Weather;


/*

BELOW LAST </DataContainer> ABOVE

<DataContainer style={{ marginBottom: '10px', marginTop: '10px' }}>
  <DataSection>
    <EditButton>
      <EditImage src='images/edit.svg' alt='edit'></EditImage>
    </EditButton>
  </DataSection>
  <DataSection>
    <EditButton>
      <EditImage src='images/edit.svg' alt='edit'></EditImage>
    </EditButton>
  </DataSection>
  <DataSection>
    <EditButton>
      <EditImage src='images/edit.svg' alt='edit'></EditImage>
    </EditButton>
  </DataSection>
</DataContainer>

*/