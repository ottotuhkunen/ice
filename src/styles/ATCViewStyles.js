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
  height: 42px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 1);
  padding: 8px;
  z-index: 10;

  img {
    cursor: pointer;
  }
`;

export const MainSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  margin-top: 42px;
  bottom: 0;
  width: 100%;
  height: calc(100vh - 42px);
  background-color: #192328;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: white;
  user-select: none;
  justify-items: center;
  padding: 10px;

  .column-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    overflow: hidden;
  }

  #on-stand-column,
  #deice-requested-column {
    background-color: #273136;
    flex: 1;
    overflow: auto;
    overflow-x: hidden;
    width: 650px;
  }

  #deice-apron-column {
    background-color: #273136;
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
    width: 650px;
  }

  #on-stand-column h3,
  #deice-requested-column h3,
  #deice-apron-column h3 {
    text-align: center;
    color: #dfebeb;
    font-size: 10pt;
    font-weight: bold;
    padding: 4px;
    width: 100%;
    background-color: #3e414c;
    border: 2px solid gray;
    border-top: 1.4px solid rgb(200, 200, 200);
    border-bottom: 2px solid rgb(46, 46, 46);
    overflow-x: hidden;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  #deice-apron-column h3 {
    background-color: #60a1bd;
    color: black;
    height: 56px;
    display: flex;
    justify-content: space-between;
  }

  @media (max-width: 1330px) {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100vw;
    min-height: calc(100vh - 44px);

    #on-stand-column,
    #deice-requested-column,
    #deice-apron-column {
      width: 650px;
      height: 50%;
    }
  }
`;


export const Title = styled.h4`
  margin: 0;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 16pt;
`;

export const AircraftContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 8px;
  margin-top: 8px;
  background-color: #14384c;
  width: 650px;

  border-top: ${({ borderTop }) => borderTop};
  border-bottom: ${({ borderBottom }) => borderBottom};
  border-left: ${({ borderLeft }) => borderLeft};
  border-right: ${({ borderRight }) => borderRight};
  box-shadow: ${({ boxShadow }) => boxShadow};
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
  position: relative;
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
    opacity: 0.8 !important;
  }
`;

export const StandMenu = styled.div`
  color: black;
  text-align: left;
  position: absolute;
  background: #dedede;
  border: 2px ridge #7e7e7e;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, Helvetica, sans-serif;
  z-index: 700;

  position: fixed;
  user-select: none;
  z-index: 700;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
`;

export const TreatmentMenu = styled.div`
  color: black;
  text-align: left;
  position: absolute;
  background: #dedede;
  border: 2px ridge #7e7e7e;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, Helvetica, sans-serif;
  z-index: 700;

  position: fixed;
  user-select: none;
  z-index: 700;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 260px;
`;

export const MenuTitle = styled.p`
  color: #000;
  font-weight: bold;
  margin: 4px;
  padding: 0;
  line-height: 14pt;
  font-size: 11pt;
  user-select: none;
  text-align: center;
`;


export const ConfirmButton = styled.button`
  border: 2px outset #d7d4cc;
  color: black;
  font-weight: bold;
  cursor: pointer;
  overflow: auto;
  user-select: none;

  width: 100%;
  height: 30px;
  background: #dedede;

  &:hover {
    background-color: #a5a39e;
  }
`;

export const CloseButton = styled.button`
  border: 2px outset #d7d4cc;
  color: black;
  font-weight: bold;
  cursor: pointer;
  overflow: auto;
  user-select: none;

  width: 100%;
  height: 30px;
  background: #dedede;

  &:hover {
    background-color: #a5a39e;
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
  color: black;
  text-align: left;
  position: absolute;
  background: #dedede;
  border: 2px ridge #7e7e7e;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, Helvetica, sans-serif;
  z-index: 700;

  position: fixed;
  user-select: none;
  z-index: 700;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 340px;
`;

export const getBorderStyles = (requestStatus) => {
  switch (requestStatus) {
    case 1:
      return {
        borderTop: '4px ridge #f0d520',
        borderBottom: '4px solid #c6af1a',
        borderLeft: '12px solid #f0d520',
        borderRight: '12px solid #f0d520',
        boxShadow: '0 -1px 0 0 #fffce7, 0 1px 0 0 #000'
      };
    case 2:
    case 3:
      return {
        borderTop: '4px ridge #239B56',
        borderBottom: '4px solid #1D8348',
        borderLeft: '12px solid #239B56',
        borderRight: '12px solid #239B56',
        boxShadow: '0 -1px 0 0 #78A885, 0 1px 0 0 #000'
      };
    case 4:
      return {
        borderTop: '4px ridge #bb484a',
        borderBottom: '4px solid #ab4344',
        borderLeft: '12px solid #ab4344',
        borderRight: '12px solid #ab4344',
        boxShadow: '0 -1px 0 0 #ff989a, 0 1px 0 0 #000'
      };
    case 5:
      return {
        borderTop: '4px ridge #92b4d5',
        borderBottom: '4px solid #6b91b7',
        borderLeft: '12px solid #92b4d5',
        borderRight: '12px solid #92b4d5',
        boxShadow: '0 -1px 0 0 #ccdbe3, 0 1px 0 0 #000'
      };
    default:
      return {
        borderTop: '4px ridge #32569f',
        borderBottom: '4px solid #254075',
        borderLeft: '12px solid #32569f',
        borderRight: '12px solid #32569f',
        boxShadow: '0 -1px 1px 0 #6c9bf9, 0 1px 1px 0 #111'
      };
  }
};