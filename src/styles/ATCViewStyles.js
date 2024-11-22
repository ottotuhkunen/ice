import styled from 'styled-components';

export const MenuSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  background-color: #242526;
  color: #dfebeb;
  user-select: none;
  position: fixed;
  width: 100%;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 1);
  padding: 12px;
  z-index: 10;

  img {
    cursor: pointer;
  }

  h3 {
    margin: 0;
  }
`;

export const MainSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  color: white;
  user-select: none;
  width: 100%;
  padding-top: 60px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;

  #on-stand-column h3,
  #deice-requested-column h3 {
    text-align: center;
    color: #dfebeb;
    font-size: 12pt;
    margin-bottom: 10px;
    margin-top: 20px;
    background-color: #242526;
    padding: 4px;
    width: 650px;
  }

  @media (max-width: 1300px) {

    #deice-requested-column {
      order: 1;
    }

    #on-stand-column {
      order: 2;
    }
  }
`;

export const AircraftContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 8px;
  margin-top: 10px;
  background-color: #14384c;
  width: 650px;
`;

export const Callsign = styled.div`
  font-size: 11pt;
  font-weight: bold;
  width: 110px;
  text-align: left;
`;

export const InfoBlock = styled.div`
  font-weight: normal;
`;

export const TreatmentDisplay = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  align-items: start;
  font-size: 10pt;
  width: 290px;
`;

export const ManualButton = styled.button`
  margin-top: 4px;
  padding: 4px;
  font-size: 9pt;
  background-color: #6c757d;
  color: #fff;
  border: none;
  cursor: pointer;
  min-width: 130px;

  &:hover {
    background-color: #5a6268;
  }
`;

export const StandDisplay = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  align-items: start;
  font-size: 10pt;
  width: 150px;
`;

export const FunctionButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  font-size: 8pt;
  cursor: pointer;
  width:80px;
  height: 70px;
  padding: 0;
  font-weight: bold;

  &:hover {
    background-color: #5a6268;
  }
`;

export const StandMenu = styled.div`
  position: absolute;
  background-color: #242526;
  border: 1px solid black;
  padding: 10px;
  z-index: 10;
  margin-left: -120px;
  width: 352px;
`;

export const TreatmentMenu = styled.div`
  position: absolute;
  background-color: #242526;
  border: 1px solid black;
  padding: 10px;
  z-index: 10;
`;

export const ConfirmButton = styled.button`
  background-color: green;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  margin-left: 10px;
  margin-top: 20px;
  width: 160px;

  &:hover {
    opacity: 0.8;
  }
`;

export const CloseButton = styled.button`
  background-color: darkred;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  width: 160px;

  &:hover {
    opacity: 0.8;
  }
`;

export const EOBT = styled.p`
  color: silver;
  font-size: 9pt;
  margin: 0;
  position: absolute;
  margin-left: 150px;
  margin-top: 30px;
`;

export const CompletedMark = styled.p`
  margin: 0;
  position: absolute;
  margin-left: 250px;
  margin-top: 28px;
`;

export const EndReportMenu = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #242526;
  color: white;
  border: 1px solid black;
  padding: 20px;
  width: 500px;
  text-align: center;
  z-index: 20;

  h3 {
    margin-bottom: 15px;
    font-size: 16pt;
    color: white;
  }

  p {
    margin: 4px 0px;
    font-size: 11pt;
    color: black;
    background-color: white;
    text-align: left;
    padding-left: 6px;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }
`;
