import styled from 'styled-components';

const Block = styled.section`
  margin-top: 54px !important;
`;

const Container = styled.div`
  display: flex;
  align-items: stretch;
  height: 80px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  background-color: #242526;
  color: #dfebeb;
  border-radius: 4px;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #14384c;
  padding-left: 16px;
  margin-left: 4px;
  border-radius: 4px;
  max-width: 700px;
`;

const IcaoCode = styled.h3`
  color: #43c6e7;
  font-weight: bold;
  margin: 0;
  font-size: 1.4em;
`;

const GuidanceBox = styled.div`
  width: 140px;
  height: 70px;
  background-color: black;
  margin-left: auto;
  border-radius: 4px;
  color: yellow;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10pt;
`;

const GuidanceText = styled.div`
  margin: 6px;
  text-align: left;
`;

const CircleContainerTop = styled.div`
  display: ${(props) => (props.visible ? 'flex' : 'none')};
  flex-direction: column;
  margin-right: 10px;
  margin-bottom: 20px;
`;

const CircleRed = styled.div`
  width: 14px;
  height: 14px;
  background-color: red;
  border-radius: 50%;
  margin-bottom: 4px;
`;

const CircleContainerBottom = styled.div`
  display: ${(props) => (props.visible ? 'flex' : 'none')};
  flex-direction: column;
  margin-right: 10px;
  margin-top: 28px;
`;

const CircleGreen = styled.div`
  width: 14px;
  height: 14px;
  background-color: lightgreen;
  border-radius: 50%;
  margin-bottom: 4px;
`;

const GuidanceLineOne = styled.p`
  margin: 0;
`;

const GuidanceLineTwo = styled.p`
  margin: 0;
`;

const GuidanceLineThree = styled.p`
  margin: 0;
`;

const Aerodrome = ({ guidanceInfo }) => {
  let lineOne = '';
  let lineTwo = '';
  let lineThree = '';
  let showTopCircles = false;
  let showBottomCircles = false;
  let firstLineColor = 'yellow';

  switch (guidanceInfo) {
    case 0:
      lineOne = 'REMOTE';
      lineTwo = 'DEICING';
      lineThree = '';
      break;
    case 1:
      lineOne = 'CALL';
      lineTwo = 'BRAKES SET';
      lineThree = '';
      break;
    case 2:
      lineOne = 'STOP';
      lineTwo = 'DEICING';
      lineThree = 'IN PROGRESS';
      firstLineColor = 'red';
      showTopCircles = true;
      break;
    case 3:
      lineOne = 'DEICING';
      lineTwo = 'COMPLETE';
      lineThree = '';
      showTopCircles = false;
      showBottomCircles = true;
      break;
    case 4:
      lineOne = 'REMOTE';
      lineTwo = 'DEICING';
      lineThree = '133.850';
      break;
    default: // Error state
      lineOne = 'SERVICE';
      lineTwo = 'NOT PROVIDED';
      lineThree = '';
  }

  return (
    <Block>
      <Container>
        <IconContainer>
          <img src="images/icon1.svg" alt="location"></img>
        </IconContainer>
        <Content>
          <IcaoCode>EFHK</IcaoCode>
          <GuidanceBox>
            <GuidanceText>
              <GuidanceLineOne style={{color: firstLineColor}}>{lineOne}</GuidanceLineOne>
              <GuidanceLineTwo>{lineTwo}</GuidanceLineTwo>
              <GuidanceLineThree>{lineThree}</GuidanceLineThree>
            </GuidanceText>
            <CircleContainerTop visible={showTopCircles}>
              <CircleRed />
              <CircleRed />
            </CircleContainerTop>
            <CircleContainerBottom visible={showBottomCircles}>
              <CircleGreen />
              <CircleGreen />
            </CircleContainerBottom>
          </GuidanceBox>
        </Content>
      </Container>
    </Block>
  );
};

export default Aerodrome;
