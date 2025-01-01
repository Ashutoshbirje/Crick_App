import React from 'react';
import { TextField, Button, Step, StepLabel, Stepper, Typography, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, makeStyles } from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import tennisBall from '../Images/tennis-ball.png';

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Centering the child elements horizontally
    justifyContent: 'center', // Centering the child elements vertically
    boxSizing: 'border-box', // Ensures padding does not affect width
    height: '88vh',
  },

  mainContainer1: {
    width: '100%', // Ensures the container takes up the full width of the screen
    maxWidth: '100%', // Prevents it from exceeding the width of the screen
    padding: '1rem', // Adds padding inside the container
    boxSizing: 'border-box', // Ensures padding does not affect the width
  },

  '@media (max-width: 490px)': {
    mainContainerA1:{
      padding: '5px',
      margin: '2px',
    },
    mainContainer1: {
      padding: '2px', // Adds padding inside the container
      boxSizing: 'border-box', // Ensures padding does not affect the width
      margin: '2px',
    },
  },

  mainContainer2: {
    margin: 'auto', // Centers the container horizontally
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px', // Maximum width of the second container
    width: '100%', // Makes sure the container can shrink on smaller screens
    height:'400px',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Centering the child elements horizontally
    justifyContent: 'center', // Centering the child elements vertically
  },

  '@media (max-width: 768px)': { // For smaller screens like tablets and phones
    mainContainer2: {
      padding: '1rem',
    },
  },

  '@media (max-width: 480px)': { // For very small screens (phones in portrait mode)
    mainContainer2: {
      padding: '0.5rem',
    },
  },
  
  team1: {
    width: 200,
  },

  circle: {
    backgroundColor: 'rgb(63, 81, 181)',
    height: '40px',
    width: '40px',
    borderRadius: '25px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Centering the child elements horizontally
    justifyContent: 'center',
    color: 'white',
    margin: '20px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Adds a subtle shadow to make it stand out
    transition: 'transform 0.3s ease', // Adds smooth animation on hover
    '&:hover': {
      transform: 'scale(1.1)', // Slightly enlarges the div on hover
    },
  },

  team2: {
    width: 200,
    marginBottom: '30px',
  },
  
  overs: {
    width: 200,
  },
  
  overscontainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  overcircle: {
    display: 'flex',
    justifyContent: 'center', // Centers the icon horizontally
    alignItems: 'center', // Centers the icon vertically
    height: '120px',
    width: '120px',
    borderRadius: '60px',// Makes the div circular
    margin: '20px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Adds a subtle shadow to make it stand out
    color: 'white', // Icon color
    fontSize: '2rem', // Icon size
    transition: 'transform 0.3s ease', // Adds smooth animation on hover
    '&:hover': {
      transform: 'scale(1.1)', // Slightly enlarges the div on hover
    },
  },

  radioGroup: {
    margin: '20px',
  },

  formGroup: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', 
  },

  formContainer: {
    margin: '2rem 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  backButton: {
    marginRight: theme.spacing(8),
  },

  mainContainer3: {
    margin: 'auto', // Centers the container horizontally
    border: '1px solid #ccc',
    borderRadius: '4px',
    maxWidth: '600px', // Maximum width of the second container
    width: '100%', // Makes sure the container can shrink on smaller screens
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Centering the child elements horizontally
    justifyContent: 'center', // Centering the child elements vertically
  },

}));

const HorizontalStepper = ({toss, win,setToss, setDecision }) => {
  const history = useHistory();
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [isSubmitting, setSubmitting] = React.useState(false);

  const steps = ['Team', 'Overs', 'Toss', 'Decision'];

  const initialValues = {
    team1: '',
    team2: '',
    maxOver: '',
    tossWinner: '',
    decision: '',
  };

  const validationSchema = [
    Yup.object().shape({
      team1: Yup.string().required('Team Name is required'),
      team2: Yup.string().required('Team Name is required'),
    }),
    Yup.object().shape({
      maxOver: Yup.string().required('Overs are required'),
    }),
    Yup.object().shape({
      tossWinner: Yup.string().required('Toss winner is required'),
    }),
    Yup.object().shape({
      decision: Yup.string().required('Decision is required'),
    }),
  ];

  const currentValidationSchema = validationSchema[activeStep];

  function isLastStep() {
    return activeStep === steps.length - 1;
  }

  return (
    <div className={classes.main}>
      {/* Part A (Slider) */}
      <div className={classes.mainContainer1}>
        <Stepper activeStep={activeStep} className={classes.mainContainerA1} orientation="horizontal">
          {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
          ))}
        </Stepper>
      </div>
      {/* Part B (Form) */}
      <div className={classes.mainContainer2}>
        <Formik
          enableReinitialize
          validationSchema={currentValidationSchema}
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            if (isLastStep()) {
              setSubmitting(true);
              const batting = values.decision === 'bat' ? values.tossWinner : values.tossWinner === values.team1 ? values.team2 : values.team1;
              const data = { ...values, batting };
              localStorage.setItem('data', JSON.stringify(data));
              history.push('/score', { batting });
              setSubmitting(false);
            } else {
              setActiveStep((prev) => prev + 1);
            }
            actions.setTouched({});
            actions.setSubmitting(false);
          }}
        >
          {(props) => {
            const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = props;
            return (
              <form onSubmit={handleSubmit}>
                <div className={classes.formContainer}>
                  {activeStep === 0 && (
                     // team selection
                    <>
                    {/* Team A */}
                      <TextField
                        id="team1"
                        name="team1"
                        label="Team 1 Name*"
                        value={values.team1}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={errors.team1 && touched.team1 && errors.team1}
                        error={errors.team1 && touched.team1}
                        className={classes.team1}
                      />
                    {/* Circle */}
                      <div className={classes.circle} ><Typography>VS</Typography></div>
                    {/* Team B */}
                      <TextField
                        id="team2"
                        name="team2"
                        label="Team 2 Name*"
                        value={values.team2}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={errors.team2 && touched.team2 && errors.team2}
                        error={errors.team2 && touched.team2}
                        className={classes.team2}
                      />
                    </>
                  )}
                  {activeStep === 1 && (
                    // Number of over 
                    <div className={classes.overscontainer}>
                    <TextField
                      id="maxOver"
                      name="maxOver"
                      label="Overs*"
                      value={values.maxOver}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={errors.maxOver && touched.maxOver && errors.maxOver}
                      error={errors.maxOver && touched.maxOver}
                      className={classes.overs}
                    />
<div className={classes.overcircle}>
  <img src={tennisBall} alt="Tennis Ball" style={{ width: '130px', height: '130px' }} />
</div>

                    </div>
                  )}
                  {activeStep === 2 && (
                    // Toss
                    <FormControl component="fieldset" className={classes.formGroup}>
                      <FormLabel component="legend">Who won the toss?</FormLabel>
                      <RadioGroup
                        name="tossWinner"
                        value={values.tossWinner}
                        onChange={(e) => {
                          setFieldValue('tossWinner', e.target.value);  // Set Formik field value
                          setToss(e.target.value);  // Update Toss prop with selected team
                        }}
                        className={classes.radioGroup}
                     >
                        <FormControlLabel value={values.team1} control={<Radio />} label={values.team1} />
                        <FormControlLabel value={values.team2} control={<Radio />} label={values.team2} />
                      </RadioGroup>
                    </FormControl>
                    
                  )}
                  {activeStep === 3 && (
                    // Decision
                    <FormControl component="fieldset"  className={classes.formGroup}>
                      <FormLabel component="legend">{`${values.tossWinner} won the toss & choose`}</FormLabel>
                      <RadioGroup
                        name="decision"
                        value={values.decision}
                        onChange={(e) => {
                          setFieldValue('decision', e.target.value);
                          setDecision(e.target.value);  // Update Toss prop with selected team
                        }}
                        className={classes.radioGroup}
                      >
                        <FormControlLabel value="bat" control={<Radio />} label="Bat" />
                        <FormControlLabel value="ball" control={<Radio />} label="Ball" />
                      </RadioGroup>
                    </FormControl>
                  )}
                  <div>
                    <Button
                      variant="contained"
                      disabled={activeStep === 0}
                      onClick={() => setActiveStep((prev) => prev - 1)}
                      className={classes.backButton}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isLastStep() ? 'Start' : 'Next'}
                    </Button>
                  </div>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
      {/* Part C (About) */}
      <div className={classes.mainContainer3}>
          <p>IPL</p>
      </div>
    </div>
  );
};

export default HorizontalStepper;
