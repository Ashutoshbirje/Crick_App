import React, { useState , useEffect} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NotFound from '../components/NotFound';
import StepperContainer from '../components/StepperContainer';
import ScoreBoard from '../components/ScoreBoard';

const Main = () => {
  const [toss, setToss] = useState();
  const [win, setWin] = useState();
  const [Globalstate, setGlobalstate] = useState(true);

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const savedToss = localStorage.getItem("toss");
    const savedWinner = localStorage.getItem("win");
    if (savedToss) setToss(savedToss);
    if (savedWinner) setWin(savedWinner);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("toss", toss);
    localStorage.setItem("win", win);
  }, [toss, win]);
  
  console.log(Globalstate);

  return (
    <BrowserRouter>
      <Switch>
      {/* // Done */}
        <Route
          exact
          path='/'
          render={(props) => (
            <StepperContainer
              {...props}
              toss={toss}
              win={win}
              setToss={setToss}
              setWin={setWin}
              Globalstate={Globalstate}
              setGlobalstate={setGlobalstate}
            />
          )}
        />
      
        <Route
          exact
          path='/score'
          render={(props) => <ScoreBoard {...props} toss={toss} win={win} Globalstate={Globalstate}/>}
        />
        
      {/* // Done */}
        <Route path='*' component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default Main;
