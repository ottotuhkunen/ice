import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import fluidLimits from '../utils/fluidLimits.json';
import {
  Block, Container, IconContainer, Content,
  DataContainer, DataSection, FluidInfo, AdditionalData,
  FluidDesc, FluidType, ProgressWrapper, ProgressText,
  Version
} from '../styles/FluidStyles';

const Fluid = ({ selectedTreatment, temperature, precipitation, intensity }) => {
  const totalLimit = 100;

  // Function to get the lower and upper limits from the JSON file
  const getLimits = (type, precipitation, intensity, temperature) => {
    let limits = fluidLimits[type]?.[precipitation];
  
    if (limits) {
      // If intensity is specified, use the corresponding intensity limits
      if (intensity && limits[intensity]) {
        limits = limits[intensity];
      }
  
      // Loop through temperature ranges and find the correct one
      const temperatureKey = Object.keys(limits).find(key => {
        const ranges = key.split(', ');
        // Parse the range(s)
        let valid = true;
  
        for (let range of ranges) {
          const [operator, temp] = range.split(' ');
          const tempValue = parseFloat(temp); // Convert the temperature part to a number
  
          if (operator === '>=') {
            if (temperature < tempValue) valid = false;
          } else if (operator === '<') {
            if (temperature >= tempValue) valid = false;
          }
        }
  
        return valid;
      });
  
      if (temperatureKey) {
        return limits[temperatureKey];
      }
    }
  
    return { lower: null, upper: null }; // No limits found, return null
  };
  

  const setProgress = (lower, upper) => {
    // Calculate the progress bar percentages
    const lowerPercentage = (lower / totalLimit) * 100;
    const upperPercentage = (upper / totalLimit) * 100;
    return { lowerPercentage, upperPercentage };
  };

  const renderProgress = (lowerLimit, upperLimit) => {
    if (lowerLimit === null || upperLimit === null) {

      return (
        <div>
          <span style={{color: 'white'}}>No holdover time guidelines exist</span>
        </div>
      );
    }

    const { lowerPercentage, upperPercentage } = setProgress(lowerLimit, upperLimit);

    return (
      <ProgressWrapper>
        {lowerLimit && upperLimit ? (
          <>
            <ProgressText style={{ left: `${(lowerPercentage + upperPercentage) / 2}%` }}>
              {`${lowerLimit}-${upperLimit} min`}
            </ProgressText>
          </>
        ) : (
          <>
            <ProgressText style={{ left: `${lowerPercentage}%` }}>
              {`${lowerLimit} min`}
            </ProgressText>
            <ProgressText style={{ left: `${upperPercentage}%` }}>
              {`${upperLimit} min`}
            </ProgressText>
          </>
        )}
        <ProgressBar style={{ width: '100%', position: 'relative', backgroundColor: '#505050' }}>
          <ProgressBar variant="success" now={lowerPercentage} key={1} label="" />
          <ProgressBar variant="warning" now={upperPercentage - lowerPercentage} key={2} label="" />
        </ProgressBar>
      </ProgressWrapper>
    );
  };

  // Get the limits based on the selected treatment
  let lowerLimitType1, upperLimitType1, lowerLimitType4, upperLimitType4;

  if (selectedTreatment === 2 || selectedTreatment === 3 || selectedTreatment >= 4) {
    const type1Limits = getLimits('type1', precipitation, intensity, temperature);
    lowerLimitType1 = type1Limits.lower;
    upperLimitType1 = type1Limits.upper;
  }

  if (selectedTreatment === 4 || selectedTreatment === 5 || selectedTreatment === 6) {
    const type4Limits = getLimits('type4', precipitation, intensity, temperature);
    lowerLimitType4 = type4Limits.lower;
    upperLimitType4 = type4Limits.upper;
  }

  return (
    <Block>
      <Container>
        <IconContainer>
          <img src="images/icon4.svg" alt="fluid" />
          <Version>FAA<br />2024-2025</Version>
        </IconContainer>
        <Content>
          <DataContainer>
            {(selectedTreatment === 2 || selectedTreatment === 3 || selectedTreatment >= 4) && (
              <DataSection>
                <FluidInfo>
                  <FluidType>TYPE 1</FluidType>
                  <FluidDesc>CLARIANT SAFEWING MP I 1938 ECO (80)</FluidDesc>
                </FluidInfo>
                <AdditionalData>
                  {renderProgress(lowerLimitType1, upperLimitType1)}
                </AdditionalData>
              </DataSection>
            )}

            {(selectedTreatment === 4 || selectedTreatment === 5 || selectedTreatment === 6) && (
              <DataSection>
                <FluidInfo>
                  <FluidType>TYPE 4</FluidType>
                  <FluidDesc>
                    {temperature >= -3
                      ? "CLARIANT SAFEWING MP IV LAUNCH 50/50"
                      : temperature >= -14
                      ? "CLARIANT SAFEWING MP IV LAUNCH 75/25"
                      : "CLARIANT SAFEWING MP IV LAUNCH 100/0"}
                  </FluidDesc>
                </FluidInfo>
                <AdditionalData>
                  {renderProgress(lowerLimitType4, upperLimitType4)}
                </AdditionalData>
              </DataSection>
            )}
          </DataContainer>
        </Content>
      </Container>
    </Block>
  );
};

export default Fluid;
