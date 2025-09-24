import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import Alert from 'react-bootstrap/Alert';
import { LOGIN_URL, COUNT_URL } from '../utils/data';

const LoginPage = styled.div`
  display: flex;
  position: fixed;
  width: 100%;
  height: 100vh;
  background-color: black;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageSection = styled.div`
  position: relative;
  flex: 1;
  background-color: black;
  height: 100%;
  user-select: none;
  overflow: hidden;

  @media (max-width: 800px) {
    display: block;
    width: 100%;
    flex: none;
    order: 2;
  }
`;

const ContentSection = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  background: linear-gradient(to right, #011328, #0e2c4f);
  color: white;
  z-index: 1;
  min-height: 100vh;
  overflow: hidden;

  @media (max-width: 800px) {
    width: 100%;
    flex: none;
    order: 1;
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
  color: #dfebeb;
  font-weight: 700;

  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
`;

const LoginButton = styled.button`
  background-color: #176498;
  color: white;
  padding: 6px;
  border: none;
  font-size: 12pt;
  cursor: pointer;
  margin-bottom: 20px;
  width: 100%;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 1rem;
  }
`;

const Logo = styled.img`
  margin-top: 20px;
  width: 180px;
  height: auto;
`;

const RequestCount = styled.h3`
  font-size: 16pt;
  margin: 0;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 6px 10px;
  color: #dfebeb;
  width: 100px;
`;

const DottedMap = styled.img`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  max-width: 800px;
  opacity: 0.3;
  pointer-events: none;
  z-index: -1;
  left: 50%;
  transform: translateX(-50%);
`;


const Login = () => {
  const [count, setCount] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const intervalRef = useRef(null);
  const images = ['images/deice3.jpg', 'images/deice-tablet.png', 'images/deice4.jpg', 'images/deice2.jpg'];

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length);
    }, 8000); // 8s
  };

  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleLogin = () => {
    window.location.href = LOGIN_URL;
  };

  const handleDotClick = (idx) => {
    setCurrentImage(idx);
    clearInterval(intervalRef.current);
    startInterval();
  };

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch(COUNT_URL, {
          credentials: 'include',
        });
        const data = await response.json();
        setCount(data.treatmentCount);
      } catch (error) {
        console.error('Error fetching treatment count:', error);
      }
    };

    fetchCount();
  }, []);

  return (
    <LoginPage>
      <ImageSection bgImage={'images/map.png'}>
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: currentImage === index ? 0.7 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: currentImage === index ? 1 : 0,
              pointerEvents: 'none',
            }}
          />
        ))}

        <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
          {images.map((_, idx) => (
            <div
              key={idx}
              onClick={() => handleDotClick(idx)}
              style={{
                width: 11,
                height: 11,
                borderRadius: '50%',
                background: idx === currentImage ? '#fff' : '#484b4c',
                cursor: 'pointer',
                transition: 'background 0.3s',
                pointerEvents: 'all',
                zIndex: 999
              }}
            />
          ))}
        </div>
      </ImageSection>

      <ContentSection>
        <DottedMap src='images/map.png'></DottedMap>

        <div style={{ display: 'inline', alignItems: 'center'}}>
          <Logo src="images/vatsim.svg" alt="VATSIM"/>
          <Logo src="images/logo.svg" alt="DEICE" style={{width: '42px', marginLeft: '20px'}}/>
        </div>

        <Title>DEICE in HEL</Title>
        <LoginButton onClick={handleLogin}>Login with VATSIM</LoginButton>

        <Alert key={'success'} variant={'success'} style={{width: '100%', borderRadius: '0'}}>
          <b>Manage your de-icing!</b><br/>
          Use this application to realistically request de-icing, check fluid types and calculate the holdover time
          for your departure from EFHK.
        </Alert>

        <p className='slogan-text'>De-icing requests since 2024</p>

        <RequestCount>
          {count} <img src="images/icon3.svg" alt="request" style={{ width: '26px', marginLeft: '10px', marginTop: '-4px' }} />
        </RequestCount>
        
      </ContentSection>
    </LoginPage>
  );
};

export default Login;
