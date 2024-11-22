import React from 'react';
import styled from 'styled-components';
import Alert from 'react-bootstrap/Alert';
import { LOGIN_URL } from '../utils/data';

const LoginPage = styled.div`
  display: flex;
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
  flex: 1;
  background: url('images/login-page.jpg');
  background-repeat: no-repeat;
  background-position: left top;
  background-size: cover;
  height: 100%;
  opacity: 40%;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ContentSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  background-color: #011328;
  color: white;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
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

const LogoTools = styled.img`
  margin-top: 20px;
  width: 240px;
  height: auto;
`;

const Login = () => {
  const handleLogin = () => {
    window.location.href = LOGIN_URL;
  };

  return (
    <LoginPage>
      <ImageSection />
      <ContentSection>
        <Logo src="images/vatsim.svg" alt="VATSIM" />
        <Title>Deicing in HEL</Title>
        <LoginButton onClick={handleLogin}>Login with VATSIM</LoginButton>

        <Alert key={'warning'} variant={'warning'} style={{width: '100%', borderRadius: '0'}}>
          <b>VATSIM Connection is required to sign in.</b><br/>
          Please connect first as a pilot to VATSIM and submit your flight plan from HEL!
        </Alert>

        <a href='https://hold.lusep.fi/'>
          <LogoTools src="images/login-atc-tools-finland.png" alt="VATSIM" />
        </a>

        
      </ContentSection>
    </LoginPage>
  );
};

export default Login;
