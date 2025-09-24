import styled from 'styled-components';

const Block = styled.section`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Container = styled.div`
  display: flex;
  align-items: stretch;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: top;
  flex-direction: column;
  width: 80px;
  background-color: #242526;
  color: #dfebeb;
  border-radius: 4px;
  padding-top: 30px;
`;

const Content = styled.div`
  flex: 1;
  background-color: #15181d;
  padding: 20px;
  margin-left: 4px;
  max-width: 1000px;
`;

const NumberedSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  margin-left: 10px;
`;

const NumberedItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #444;
`;

const Number = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #306ec9;
  margin-right: 10px;
  margin-top: 8px;
`;

const ExplanationList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  margin-top: 10px;
  width: 100%;
`;

const ExplanationItem = styled.li`
  display: flex;
  align-items: center;
  color: #ccc;
  font-size: 11pt;
  margin-bottom: 2px;
  text-align: left;
  padding: 6px;
  font-weight: bold;
`;

const ExplanationIcon = styled.img`
  width: 16px;
  height: auto;
  margin-right: 8px;
`;

const ItalicNote = styled.span`
  font-style: italic;
  text-align: left;
  font-weight: normal;
  color: #A9A9A9;
  display: flex;
  align-items: center;
  font-size: 11pt;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
`;

const Notes = ({ theme }) => {
  return (
    <Block>
      <Container>
        <IconContainer>
          <img src="images/help.svg" alt="info" style={{width: '36px'}}/>
        </IconContainer>
        <Content>
          <NumberedSection>
            <NumberedItem>
              <Number>1</Number>
              <ExplanationList>
                <ExplanationItem>Connect to VATSIM and file your flight plan</ExplanationItem>
              </ExplanationList>
            </NumberedItem>
            <NumberedItem>
              <Number>2</Number>
              <ExplanationList>
                <ExplanationItem>Request en-route clearance from ATC via PDC or on the frequency</ExplanationItem>
              </ExplanationList>
            </NumberedItem>
            <NumberedItem>
              <Number>3</Number>
              <ExplanationList>
                <ExplanationItem>Request deicing before start-up using this application or on the frequency</ExplanationItem>
                <ExplanationItem className="pilot-text">
                  <ExplanationIcon src="images/login.svg" alt="pilot" />
                  HELSINKI DE-ICING, FINNAIR 1, REQUEST ONE STEP DEICING FOR WINGS AND STABILIZER
                </ExplanationItem>
                <ExplanationItem className="atc-text">
                  <ExplanationIcon src="images/atc.svg" alt="atc" />
                  FINNAIR 1, ROGER, DE-ICING ON REMOTE APRON 6
                </ExplanationItem>
                <ItalicNote>
                  Normally Type 4 fluid is selected only in snowy conditions or whenever Type 1 Fluid holdover time (HOT) is not enough.
                </ItalicNote>
              </ExplanationList>
            </NumberedItem>
            <NumberedItem>
              <Number>4</Number>
              <ExplanationList>
                <ExplanationItem>Taxi to Remote Deicing stand</ExplanationItem>
                <ExplanationItem className="atc-text">
                  <ExplanationIcon src="images/atc.svg" alt="atc" />
                  FINNAIR 1, TAXI TO STAND 603
                </ExplanationItem>
                <ExplanationItem className="pilot-text">
                  <ExplanationIcon src="images/login.svg" alt="pilot" />
                  TAXI TO STAND 603, FINNAIR 1
                </ExplanationItem>
                <ExplanationItem className="atc-text">
                  <ExplanationIcon src="images/atc.svg" alt="atc" />
                  FINNAIR 1, WHEN PARKING BRAKE SET, CONTACT DE-ICING 121.675
                </ExplanationItem>
                <ExplanationItem className="pilot-text">
                  <ExplanationIcon src="images/login.svg" alt="pilot" />
                  WHEN PARKING BRAKE SET, 121.675, FINNAIR 1
                </ExplanationItem>
              </ExplanationList>
            </NumberedItem>
            <NumberedItem>
              <Number>5</Number>
              <ExplanationList>
                <ExplanationItem>Deicing process</ExplanationItem>
                <ExplanationItem className="pilot-text">
                  <ExplanationIcon src="images/login.svg" alt="pilot" />
                  DE-ICING, FINNAIR 1, PARKING BRAKE SET, REQUESTING ONE STEP DE-ICING FOR WINGS AND STABILIZER, YOU MAY START SPRAYING
                </ExplanationItem>
                <ExplanationItem className="atc-text">
                  <ExplanationIcon src="images/atc.svg" alt="atc" />
                  FINNAIR 1 ON STAND 603, DE-ICING, STARTING ONE STEP PROCEDURE FOR WINGS AND STABILIZER, REPORT WHEN DE-ICING COMPLETED
                </ExplanationItem>
                <ItalicNote>
                  You may now start the deicing process in your simulator. Please report once the deicing treatment is completed. The HOT timer
                  should be started once the last treatment (Type 1 or Type 4) has started.
                </ItalicNote>
              </ExplanationList>
            </NumberedItem>
            <NumberedItem>
              <Number>6</Number>
              <ExplanationList>
                <ExplanationItem>End report</ExplanationItem>
                <ExplanationItem className="pilot-text">
                  <ExplanationIcon src="images/login.svg" alt="pilot" />
                  FINNAIR 1, STAND 601, DE-ICING COMPLETED
                </ExplanationItem>
                <ExplanationItem className="atc-text">
                  <ExplanationIcon src="images/atc.svg" alt="atc" />
                  FINNAIR 1 ON STAND 601, DE-ICING COMPLETED FOR WINGS AND TAIL WITH TYPE 1 FLUID, MIXTURE 40%, HOLDOVER TIME STARTED AT 55, POST DE- AND ANTI-ICING CHECKS ARE COMPLETED. PERSONNEL AND EQUIPMENT CLEAR OF AIRCRAFT
                </ExplanationItem>
                <ExplanationItem className="pilot-text">
                  <ExplanationIcon src="images/login.svg" alt="pilot" />
                  TYPE 1, MIXTURE 40%, HOLD OVER TIME 55, FINNAIR 1
                </ExplanationItem>
                <ExplanationItem className="atc-text">
                  <ExplanationIcon src="images/atc.svg" alt="atc" />
                  FINNAIR 1, CORRECT, FOR TAXI CONTACT TOWER 118.850
                </ExplanationItem>
                <ExplanationItem className="pilot-text">
                  <ExplanationIcon src="images/login.svg" alt="pilot" />
                  118.850, FINNAIR 1
                </ExplanationItem>
                <ItalicNote>
                  Now the deicing is completed. Make sure to follow the Holdover time (HOT) in case of snow, freezing rain or other precipitation. The Holdover time is calculated automatically with this application.
                </ItalicNote>
              </ExplanationList>
            </NumberedItem>
          </NumberedSection>
        </Content>
      </Container>
    </Block>
  );
};

export default Notes;
