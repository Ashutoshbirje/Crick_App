import React  from 'react';
import { AppBar, Box, Container, Toolbar, Typography } from '@material-ui/core';
import HorizontalStepper from './HorizontalStepper';

const StepperContainer = ({ toss, win, setToss, setWin }) => {

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">Multi Step Form</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box marginTop={10}>
          {/* Pass tossWinner and decision as props */}
          <HorizontalStepper 
            toss={toss} 
            win={win} 
            setToss={setToss} 
            setDecision={setWin} 
          />
        </Box>
      </Container>
    </div>
  );
};

export default StepperContainer;
