// Done
import React  from 'react';
import { AppBar, Box, Container, Toolbar, Typography } from '@material-ui/core';
import HorizontalStepper from './HorizontalStepper';

const StepperContainer = ({ toss, win, setToss, setWin, Globalstate, setGlobalstate }) => {

  return (
    <div>
      <AppBar position="fixed">
      <Toolbar
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h6">Welcome</Typography>
    </Toolbar>
      </AppBar>
      <Container>
        <Box marginTop={10}>
          <HorizontalStepper 
            toss={toss} 
            win={win} 
            setToss={setToss} 
            setDecision={setWin} 
            Globalstate={Globalstate}
            setGlobalstate={setGlobalstate}
          />
        </Box>
      </Container>
    </div>
  );
};

export default StepperContainer;
