import styled from 'styled-components';

const Block = styled.section``;

const Container = styled.div`
  display: flex;
  align-items: stretch;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: top;
  flex-direction: column;
  width: 80px;
  background-color: #242526;
  color: #dfebeb;
  border-radius: 4px;
  padding-top: 20px;
`;

const Content = styled.div`
  flex: 1;
  background-color: #14384c;
  padding: 10px;
  margin-left: 4px;
  border-radius: 4px;
  max-width: 700px;
`;

const List = styled.ul`
  text-align: left;
  padding: 10px 16px;
  margin-left: 4px;
  border-radius: 4px;
  overflow: auto;
  font-size: 10pt;
  color: #A9A9A9;
`;

const Notes = ({ theme }) => {
  return (
    <Block>
      <Container>
        <IconContainer>
          <img src="images/icon6.svg" alt='notes'></img>
        </IconContainer>
        <Content>
          <List>
            <li>This app is for Flight Simulator Use Only on VATSIM network</li>
            <li>Link to EFHK Deicing procedures: <a href="https://wiki.vatsim-scandinavia.org/books/finnish-airports-charts/page/de-icing-procedures">vats.im/efhk-deice</a></li>
            <li>Link to Holdover Time Guidelines: <a href="https://www.faa.gov/other_visit/aviation_industry/airline_operators/airline_safety/deicing/24-25_FAA_Holdover_Tables.pdf">FAA Holdover Time (HOT) Guidelines Winter 2024-2025</a></li>
            <li>
              The time of protection will be shortened in heavy weather
              conditions. Heavy precipitation rates or high moisture content,
              high wind velocity or jet blast may reduce holdover time below
              the lowest time stated in the range. Holdover time may be reduced
              when aircraft skin temperature is lower than outside air temperature.
            </li>
            <li>Fluids used during ground de/anti-icing do not provide in-flight icing protection.</li>
            <li>This table is for departure planning only and should be used in conjunction
              with pre-takeoff check procedures.
            </li>
            <li>
              Whenever frost or ice occurs on the lower surface of the wing in the area of the fuel tank, indicating a cold-soaked wing,
              the 50/50 dilutions of Type IV shall not be used for the anti-icing step because fluid freezing may occur
            </li>
          </List>
        </Content>
      </Container>
    </Block>
  );
};

export default Notes;
