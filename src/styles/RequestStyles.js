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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #14384c;
  padding: 10px;
  margin-left: 4px;
  border-radius: 4px;
  max-width: 700px;
`;

export const DataContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;

  @media (max-width: 650px) {
    flex-wrap: wrap;
  }
`;

export const DataSection = styled.div`
  flex: 1 1 calc(33.33% - 10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px;
  margin: 5px;
  border: 1px solid gray;
  border-radius: 4px;
  cursor: ${({ islocked }) => (islocked ? 'default' : 'pointer')};
  box-sizing: border-box;
  background-color: ${({ islocked, isSelected }) =>
    isSelected ? '#0f2a39' : islocked ? '#14384c' : 'transparent'};
  border: ${({ isSelected }) => (isSelected ? '3px solid #43c6e7' : '1px solid gray')};
  opacity: ${({ islocked }) => (islocked ? 0.6 : 1)};

  @media (max-width: 600px) {
    flex: 1 1 calc(50% - 10px);
  }

  &:hover {
    background-color: ${({ islocked }) => (islocked ? '' : '#0f2a39')};
  }
`;

export const Title = styled.p`
  margin: 0;
  font-size: 0.9em;

  color: white;
`;

export const Alert = styled.p`
  margin: 0;
  margin-left: 20px;
  margin-bottom: 10px;
  font-size: 9pt;
  font-style: italic;
  text-align: left;

  color: white;
`;

export const AdditionalDataContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 10px;
  text-align: left;
`;

export const RequestText = styled.p`
  margin: 0;
  font-size: 0.9em;
  text-align: left;
  font-weight: bold;
  color: white;
  margin-right: 8px;
`;

export const DeiceData = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 4px;
  margin: 2px;
  text-align: left;
  padding: 10px;
`;

export const DeiceDataTitle = styled.p`
  margin: 0;
  margin-bottom: 5px;
  font-size: 0.9em;
  color: white;
`;

export const Value = styled.h4`
  margin: 0;
  font-size: 0.9em;
  color: #43c6e7;
  font-weight: bold;
`;

export const RequestButton = styled.h4`
  margin: 0;
  font-size: 0.9em;
  color: #ff1493;
  font-weight: bold;
  border: 3px solid #ff1493;
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
  width: 160px;
  text-align: center;

  &:hover {
    background-color: black;
  }
`;