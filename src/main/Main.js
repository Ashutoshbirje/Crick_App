import React, { useState , useEffect} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NotFound from '../components/NotFound';
import ScoreBoard from '../components/ScoreBoard';
import StepperContainer from '../components/StepperContainer';

const Main = () => {
  const [toss, setToss] = useState(() => {
    // Retrieve the stored 'toss' value or default to an empty string
    return localStorage.getItem('toss') || ' ';
  });

  const [win, setWin] = useState(() => {
    // Retrieve the stored 'win' value or default to an empty string
    return localStorage.getItem('win') || ' ';
  });

  useEffect(() => {
    // Persist 'toss' and 'win' in localStorage when they change
    localStorage.setItem('toss', toss);
  }, [toss]);

  useEffect(() => {
    localStorage.setItem('win', win);
  }, [win]);


  return (
    <BrowserRouter>
      <Switch>
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
            />
          )}
        />
        <Route
          exact
          path='/score'
          render={(props) => <ScoreBoard {...props} toss={toss} win={win} />}
        />
        <Route path='*' component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default Main;
