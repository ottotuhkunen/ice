import React from 'react';
import {
  AircraftContainer,
  Callsign,
  InfoBlock,
  TreatmentDisplay,
  ManualButton,
  EOBT,
  TreatmentMenu,
  CloseButton,
  ConfirmButton,
  StandDisplay,
  StandMenu,
  FunctionButton,
  CompletedMark,
  getBorderStyles,
  MenuTitle
} from '../styles/ATCViewStyles';

const Aircraft = ({
  aircraft,
  treatmentOptions,
  standOptions,
  activeTreatmentMenu,
  setActiveTreatmentMenu,
  activeStandMenu,
  setActiveStandMenu,
  handleUpdate,
  updatedData,
  saveTreatmentChanges,
  saveStandChanges,
  isSending,
  user,
  treatmentMenuRef,
  standMenuRef,
  closeMenus,
  handleFunctionButtonClick,
  columnType, // "onStand", "deiceRequested" or "deiceApron"
}) => {
  const showACARS = columnType === 'deiceRequested';
  const minimizedLabel = columnType === 'onStand';

  const borderStyles = getBorderStyles(aircraft.requestStatus);

  return (
    <AircraftContainer key={aircraft.callsign} {...borderStyles}>
      <Callsign style={{ color: aircraft.lat === 60.30323 ? 'gray' : 'inherit' }}>
        {aircraft.callsign}
        <InfoBlock>
          <p style={{ fontSize: '9pt', color: 'silver', marginBottom: '0' }}>{aircraft.ATYP}</p>
          {!minimizedLabel && (
            <p style={{ fontSize: '9pt', color: 'silver', marginBottom: '0' }}>{aircraft.REG}</p>
          )}
        </InfoBlock>
      </Callsign>

      <TreatmentDisplay>
        <span style={{ color: aircraft.requestStatus > 1 ? '#32d74b' : '#ccc' }}>
          {treatmentOptions[aircraft.selectedTreatment]}
        </span>
        <ManualButton
          onClick={() =>
            setActiveTreatmentMenu(
              activeTreatmentMenu === aircraft.callsign ? null : aircraft.callsign
            )
          }
        >
          Manual Selection
        </ManualButton>
        <EOBT>EOBT {aircraft.EOBT}</EOBT>

        {showACARS && (
          <>
            <CompletedMark>
              {aircraft.ACARSSent === 1 && (
                <img
                  src="images/acars-on.svg"
                  alt="tick"
                  style={{ width: '16px', marginLeft: '-16px' }}
                />
              )}
            </CompletedMark>
            <CompletedMark>
              {aircraft.requestStatus === 5 && (
                <img
                  src="images/checkmark-atc.svg"
                  alt="tick"
                  style={{ width: '16px', marginLeft: '8px' }}
                />
              )}
            </CompletedMark>
          </>
        )}

        {activeTreatmentMenu === aircraft.callsign && (
          <TreatmentMenu ref={treatmentMenuRef}>
            <MenuTitle>{aircraft.callsign}<br/>DEICE TREATMENT</MenuTitle>
            <div className='menu-content-container'>

              {treatmentOptions.map((option, index) => (
                <div key={index}>
                  <div
                    onClick={() => handleUpdate(aircraft.callsign, 'selectedTreatment', index)}
                    className="atc-treatment-menu-content"
                    style={{
                      backgroundColor:
                        updatedData[`${aircraft.callsign}_selectedTreatment`] === index
                          ? 'darkblue'
                          : '',
                      color:
                        updatedData[`${aircraft.callsign}_selectedTreatment`] === index
                          ? 'white'
                          : '',
                    }}
                  >
                    {option}
                  </div>
                </div>
              ))}
            </div>

            <p style={{ margin: '8px', textAlign: 'center', color: '#696969', fontWeight: 'bold', fontSize: '9pt' }}>
                Do not APPLY before pilot request. The action may trigger an ACARS message.
            </p>

            <ConfirmButton
              onClick={() => {
                saveTreatmentChanges(aircraft.callsign, user.cid);
                closeMenus();
              }}
              disabled={isSending}
            >
              {isSending ? 'Saving...' : 'APPLY'}
            </ConfirmButton>
            <CloseButton onClick={closeMenus}>CANCEL</CloseButton>
          </TreatmentMenu>
        )}
      </TreatmentDisplay>

      <StandDisplay>
        {aircraft.requestStatus >= 3 ? (
          aircraft.stand !== '' ? (
            <span style={{ backgroundColor: 'green', fontWeight: 'bold', color: 'white', padding: '0px 4px' }}>
              {aircraft.stand}
            </span>
          ) : (
            <span style={{ backgroundColor: 'darkred', fontWeight: 'bold', color: 'white', padding: '0px 4px'}}>
              NIL
            </span>
          )
        ) : (
          aircraft.stand !== '' ? aircraft.stand : 'NIL'
        )}
        <ManualButton
          onClick={() =>
            setActiveStandMenu(
              activeStandMenu === aircraft.callsign ? null : aircraft.callsign
            )
          }
        >
          Select Stand
        </ManualButton>
        {activeStandMenu === aircraft.callsign && (
          <StandMenu ref={standMenuRef}>
            <MenuTitle style={{ fontWeight: 'bold' }}>{aircraft.callsign}<br/>DEICE STAND</MenuTitle>
            <div className='menu-content-container'>
              {standOptions.map((line, idx) => (
                <div key={idx}>
                  {line.map((stand) => (
                    <div
                      key={stand}
                      onClick={() => handleUpdate(aircraft.callsign, 'stand', stand)}
                      className="atc-stand-menu-content"

                      style={{
                        backgroundColor:
                          updatedData[`${aircraft.callsign}_stand`] === stand
                            ? 'darkblue'
                            : '',
                        color:
                          updatedData[`${aircraft.callsign}_stand`] === stand
                            ? 'white'
                            : '',
                      }}
                    >
                      {stand}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <ConfirmButton
              onClick={() => {
                saveStandChanges(aircraft.callsign, user.cid);
                closeMenus();
              }}
              disabled={isSending}
            >
              {isSending ? 'Saving...' : 'APPLY'}
            </ConfirmButton>
            <CloseButton onClick={closeMenus}>CANCEL</CloseButton>
          </StandMenu>
        )}
      </StandDisplay>

      {!minimizedLabel && (
        <FunctionButton
            style={{
            backgroundColor:
                aircraft.requestStatus === 1
                ? 'orange'
                : aircraft.requestStatus === 3
                ? 'green'
                : aircraft.requestStatus === 4
                ? 'darkred'
                : '',
            pointerEvents: aircraft.requestStatus === 0 ? 'none' : 'auto',
            }}
            onClick={() => handleFunctionButtonClick(aircraft)}
            disabled={aircraft.requestStatus === 0}
        >
            {(() => {
            switch (aircraft.requestStatus) {
                case 0:
                return 'NIL';
                case 1:
                return <>CONFIRM<br />REQUEST</>;
                case 2:
                return <>TAXI TO<br />{aircraft.stand || 'NIL'}</>;
                case 3:
                return <>START<br />DEICE</>;
                case 4:
                return <>MARK AS<br />COMPLETED</>;
                case 5:
                return <>VIEW<br />END REPORT</>;
                default:
                return 'NIL';
            }
            })()}
        </FunctionButton>
      )}

    </AircraftContainer>
  );
};

export default Aircraft;
