import styled from 'styled-components';

export const Block = styled.section``;

export const Container = styled.div`
  display: flex;
  align-items: stretch;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  background-color: #242526;
  color: #dfebeb;
  border-radius: 4px;
`;

export const Content = styled.div`
  flex: 1;
  background-color: #15181d;
  padding: 10px;
  margin-left: 4px;
  border-radius: 4px;
  max-width: 1000px;
`;

export const StartButton = styled.button`
  background-color: transparent;
  border: 3px solid #FF1493;
  color: #FF1493;
  font-weight: bold;
  font-size: 1.2em;
  border-radius: 8px;
  cursor: pointer;
  width: 120px;
  margin-left: 4px;

  &:hover {
    background-color: black;
  }
`;

export const ProgressWrapper = styled.div`
  width: 100%;
`;

export const HOTTimer = styled.h4`
  width: 100%;
  color: #306ec9;
  font-weight: bold;
  margin: 0;
  padding: 0;
`;