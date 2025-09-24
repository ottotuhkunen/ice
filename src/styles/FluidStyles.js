import styled from 'styled-components';

export const Block = styled.section``;

export const Container = styled.div`
  display: flex;
  align-items: stretch;
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

export const Content = styled.div`
  flex: 1;
  background-color: #15181d;
  padding: 10px;
  margin-left: 4px;
  border-radius: 4px;
  max-width: 1000px;
`;

export const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const DataSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 4px;
  box-sizing: border-box;
`;

export const FluidInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 4px;
  color: white;
`;

export const AdditionalData = styled.div`
  flex: 1;
  border-radius: 4px;
  margin-left: 16px;
  margin-right: 16px;
`;

export const FluidDesc = styled.p`
  margin: 0;
  font-size: 0.9em;
  text-align: left;
  color: #A9A9A9;
`;

export const FluidType = styled.p`
  margin: 0;
  font-size: 0.9em;
  text-align: left;
  font-weight: bold;
  padding-bottom: 5px;
`;

export const ProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  width: 100%;
`;

export const ProgressText = styled.div`
  font-size: 0.8em;
  color: #A9A9A9;
  position: absolute;
  transform: translateX(-50%);
  top: -20px;
  margin-left: 6px;
`;

export const Version = styled.p`
  font-size: 8pt;
  color: #A9A9A9;
  margin-top: 10px;
  line-height: 12px;
`;

export const CautionText = styled.p`
  font-size: 8pt;
  color: #A9A9A9;
  margin-top: 10px;
  line-height: 12px;
`;