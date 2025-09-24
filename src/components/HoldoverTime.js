import React, { useState, useEffect } from 'react';
import {
  Block, Container, IconContainer, Content,
  ProgressWrapper, StartButton, HOTTimer
} from '../styles/HoldoverTimeStyles';

const HoldoverTime = () => {
  // States for time control and progress bar
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [pausedTime, setPausedTime] = useState(0); // to store paused time

  // Toggle start/stop for time counting
  const handleStart = () => {
    setIsRunning(true);
  };

  // Pause the timer
  const handlePause = () => {
    setIsRunning(false);
    setPausedTime(elapsedTime);
  };

  // Reset the timer
  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setPausedTime(0);
  };

  // Continue the timer from where it was paused
  const handleContinue = () => {
    setIsRunning(true);
  };

  // Timer effect (run the timer when the button is clicked)
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1); // Increment time every second
      }, 1000);
    } else if (!isRunning && elapsedTime > 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, elapsedTime]);

  // Format elapsed time (show minutes and seconds)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Block>
      <Container>
        <IconContainer>
          <img src="images/icon5.svg" alt='hot' />
        </IconContainer>
        <Content>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {!isRunning && elapsedTime === 0 ? (
              <StartButton onClick={handleStart}>
                START
              </StartButton>
            ) : !isRunning && elapsedTime > 0 ? (
              <>
                <StartButton onClick={handleContinue}>
                  CONTINUE
                </StartButton>
                <StartButton onClick={handleReset}>
                  RESET
                </StartButton>
              </>
            ) : (
              <StartButton onClick={handlePause}>
                PAUSE
              </StartButton>
            )}
            <ProgressWrapper>
              <HOTTimer>HOT {formatTime(elapsedTime)}</HOTTimer>
            </ProgressWrapper>
          </div>
        </Content>
      </Container>
    </Block>
  );
};

export default HoldoverTime;
