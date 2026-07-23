import styled from 'styled-components';

export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #242526;
  color: #dfebeb;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  width: 300px;
`;

export const ModalTitle = styled.h3`
  margin-bottom: 16px;
`;

export const ModalButton = styled.button`
  background-color: ${(props) => (props.confirm ? '#ff4d4f' : '#4caf50')};
  color: white;
  padding: 6px;
  margin: 0 10px;
  border: none;
  cursor: pointer;
  width: 100px;

  &:hover {
    opacity: 0.9;
  }
`;