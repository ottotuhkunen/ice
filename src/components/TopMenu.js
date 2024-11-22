import React, { useState } from 'react';
import styled from 'styled-components';
import { LOGOUT_URL } from '../utils/data';

const MenuSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #242526;
  color: #dfebeb;
  user-select: none;
  height: 46px;
  position: fixed;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 1);
  padding: 0 16px;
  max-width: 700px;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  z-index: 10;
`;

const Text = styled.div`
  font-size: 14pt;
  cursor: pointer;
`;

const Callsign = styled.h2`
  margin: 0;
  font-size: 16pt;
`;

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

const TopMenu = ({ callsign }) => {
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch(LOGOUT_URL, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        console.error('Logout failed:', await response.json());
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
      <MenuSection>
        <Text>
          <a
            href="https://wiki.vatsim-scandinavia.org/books/finnish-airports-charts/page/de-icing-procedures"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="images/files.svg" alt="Files"/>
          </a>
        </Text>
        <Callsign>{callsign}</Callsign>
        <Text onClick={() => setShowModal(true)}>
          <img src="images/logout.svg" alt="Logout" style={{width: '28px'}}/>
        </Text>
      </MenuSection>

      {showModal && (
        <ModalBackground>
          <ModalContent>
            <ModalTitle>Confirm Logout</ModalTitle>
            <p>Are you sure you want to log out?</p>
            <div>
              <ModalButton confirm onClick={handleLogout}>
                Logout
              </ModalButton>
              <ModalButton onClick={() => setShowModal(false)}>Cancel</ModalButton>
            </div>
          </ModalContent>
        </ModalBackground>
      )}
    </>
  );
};

export default TopMenu;
