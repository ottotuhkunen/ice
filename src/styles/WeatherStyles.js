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
  background-color: #15181d;
  padding: 10px;
  margin-left: 4px;
  border-radius: 4px;
  max-width: 1000px;
`;

export const DataContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const DataSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  padding-left: 8px;
`;

export const AdditionalDataContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 10px;
  text-align: left;
`;

export const Title = styled.p`
  margin: 0;
  margin-right: 8px;
  font-size: 0.8em;
  color: white;
`;

export const Value = styled.h4`
  margin: 0;
  font-size: 0.9em;
  color: #306ec9;
  font-weight: bold;
`;


export const ValueBig = styled.h4`
  margin: 16px 0 0;
  font-size: 1.4em;
  color: #306ec9;
  font-weight: bold;
`;

export const EditButton = styled.div`
  margin-top: 10px;
`;

export const EditImage = styled.img`
  width: 36px;
  cursor: pointer;
  border-radius: 50%;

  &:hover {
    background-color: black;
  }
`;