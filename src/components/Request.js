import React, { useState, useEffect } from 'react';
import {
  Block, Container, IconContainer, Content,
  DataContainer, DataSection, Title, AdditionalDataContainer,
  RequestText, DeiceData, DeiceDataTitle, Value, RequestButton,
  Alert
} from '../styles/RequestStyles';
import Fluid from './Fluid';
import HoldoverTime from './HoldoverTime';
import { UPDATE_DATA_URL } from '../utils/data';

const Request = ({ stand, ttot, hotStart, requestStatus, callsign, cid, selectedTreatment, temperature, precipitation, intensity }) => {
  const [selected, setSelected] = useState(selectedTreatment > 0 ? selectedTreatment - 1 : null);
  const [isSending, setIsSending] = useState(false);
  const [requestSent, setRequestSent] = useState(false); // New state to track the request status

  const islocked = requestStatus !== 0 && requestStatus !== null;
  const requestApproved = requestStatus >= 2;
  const requestInProgress = requestStatus === 1;

  useEffect(() => {
    if (selectedTreatment > 0) {
      setSelected(selectedTreatment - 1);
    }
  }, [selectedTreatment]);

  const handleClick = (index) => {
    if (!islocked) {
      setSelected(index);
    }
  };

  const handleSendRequest = async () => {
    if (selected === null) return;

    setIsSending(true);
    setRequestSent(false); // Reset the requestSent state while sending the request

    try {
      const response = await fetch(UPDATE_DATA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        setRequestSent(true); // Set requestSent to true when request is successful
      } else {
        console.error('Error sending request:', result);
        alert('Failed to send request.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while sending the request.');
    } finally {
      setIsSending(false); // End loading state regardless of success or failure
    }
  };

  return (
    <>
      <Block>
        <Container>
          <IconContainer>
            <img src="images/icon3.svg" alt="request" style={{ width: '32px' }} />
          </IconContainer>
          <Content>
            <DataContainer>
              {[
                'Inspection',
                'Full Aircraft Type 1 HOT',
                'Wings & Stabilizers Type 1 HOT',
                'Full Aircraft Type 1 & Type 4',
                'Full Aircraft Type 1, Wings & Stabilizers Type 4',
                'Wings & Stabilizers Type 1 & Type 4',
              ].map((title, index) => (
                <DataSection
                  key={index}
                  islocked={islocked}
                  isSelected={selected === index}
                  onClick={() => handleClick(index)}
                >
                  <Title>{title}</Title>
                </DataSection>
              ))}
            </DataContainer>

            <AdditionalDataContainer>
              <RequestText>Deicing request:</RequestText>
              {selected !== null && !requestInProgress && !requestApproved && !requestSent && (
                <RequestButton onClick={handleSendRequest} disabled={isSending}>
                  {isSending ? 'Sending...' : 'SEND REQUEST'}
                </RequestButton>
              )}
              {(requestInProgress || requestApproved) && (
                <Value>
                  {requestApproved ? (
                    <div style={{color: '#32d74b'}}>
                      Ready <img src="images/checkmark.svg" alt="tick" style={{ width: '16px', marginLeft: '8px' }} />
                    </div>
                  ) : (
                    'Request Sent'
                  )}
                </Value>              )}
              {requestSent && !requestInProgress && !requestApproved && (
                <Value>Request Sent</Value>
              )}
            </AdditionalDataContainer>

            {requestStatus === 1 && (
              <Alert>
                If the request is not confirmed by Remote De-Icing Supervisor within a few minutes,
                please revert to voice, as ATC may not be using the software.
              </Alert>
            )}

            <DataContainer>
              <DeiceData>
                <DeiceDataTitle>Provider</DeiceDataTitle>
                <Value>{requestApproved ? 'Swissport' : 'Unavailable'}</Value>
                <Value>{requestApproved ? 'Norra' : ''}</Value>
                <Value>{requestApproved ? 'Airpro' : ''}</Value>
              </DeiceData>
              <DeiceData>
                <DeiceDataTitle>Frequency</DeiceDataTitle>
                <Value>{requestApproved ? '121.675' : 'Unavailable'}</Value>
              </DeiceData>
              <DeiceData>
                <DeiceDataTitle>Stand</DeiceDataTitle>
                <Value>{stand}</Value>
              </DeiceData>
              <DeiceData>
                <DeiceDataTitle>TTOT</DeiceDataTitle>
                <Value>{ttot}</Value>
              </DeiceData>
              <DeiceData>
                <DeiceDataTitle>HOT start</DeiceDataTitle>
                <Value>{hotStart}</Value>
              </DeiceData>
            </DataContainer>
          </Content>
        </Container>
      </Block>
      {selected !== 0 && selected !== null && <Fluid selectedTreatment={selected + 1} temperature={temperature} precipitation={precipitation} intensity={intensity} />}
      {selected !== 0 && selected !== null && <HoldoverTime />}
    </>
  );
};

export default Request;
