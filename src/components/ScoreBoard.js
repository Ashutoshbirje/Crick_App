import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import { pink } from '@mui/material/colors'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Modal from '@mui/material/Modal'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Autosuggest from 'react-autosuggest'
import { BATTING, OUT } from '../constants/BattingStatus'
import { BOLD, CATCH, HIT_WICKET, RUN_OUT, STUMP } from '../constants/OutType'
import MathUtil from '../util/MathUtil'
import './ScoreBoard.css'
import { radioGroupBoxstyle } from './ui/RadioGroupBoxStyle'
import SportsCricketIcon from "@mui/icons-material/SportsCricket"; // Import the icon

const ScoreBoard = (props) => {

/////

const getStoredData = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  return (storedValue && props.Globalstate) ? JSON.parse(storedValue) : defaultValue;
};

const [inningNo, setInningNo] = useState(getStoredData('inningNo', 1));
const [totalRuns, setTotalRuns] = useState(getStoredData('totalRuns', 0));
const [wicketCount, setWicketCount] = useState(getStoredData('wicketCount', 0));
const [totalOvers, setTotalOvers] = useState(getStoredData('totalOvers', 0));
const [ballCount, setBallCount] = useState(getStoredData('ballCount', 0));
const [match, setMatch] = useState(getStoredData("match", { inning1: { runs: 0, wickets: 0, overs: 0, batters: [], bowlers: [] }, inning2: { runs: 0, wickets: 0, overs: 0, batters: [], bowlers: [] } }));
const [isBatter1Edited, setBatter1Edited] = useState(getStoredData('isBatter1Edited', false))
const [isBatter2Edited, setBatter2Edited] = useState(getStoredData('isBatter2Edited', false))
const [isBowlerEdited, setBowlerEdited] = useState(getStoredData('isBowlerEdited', false))
const [batter1, setBatter1] = useState(getStoredData("batter1", {}));
const [batter2, setBatter2] = useState(getStoredData("batter2", {}));
const [batters, setBatters] = useState(getStoredData("batters", []))
const [strikeValue, setStrikeValue] = useState(getStoredData("strikeValue", 'strike'))
const [bowler, setBowler] = useState(getStoredData("bowler", {}))
const [bowlers, setBowlers] = useState(getStoredData("bowlers", []))
const [overCount, setOverCount] = useState(getStoredData('overCount', 0));
const [inputBowler, setInputBowler] = useState(getStoredData("inputBowler", ''))
const [currentRunStack, setCurrentRunStack] = useState(getStoredData("currentRunStack", []))
const [extras, setExtras] = useState(getStoredData("extras", { total: 0, wide: 0, noBall: 0 }))
const [recentOvers, setRecentOvers] = useState(getStoredData("recentOvers", []))
const [runsByOver, setRunsByOver] = useState(getStoredData("runsByOver", 0))
const [remainingBalls, setRemainingBalls] = useState(getStoredData("remainingBalls", 0))
const [remainingRuns, setRemainingRuns] = useState(getStoredData("remainingRuns", 0))
const [activeSection, setActiveSection] = useState(getStoredData("activeSection", "matchInfo"));
const [battingOrder, setBattingOrder] = useState(getStoredData("battingOrder", 0))
const [isModalOpen, setModalOpen] = useState(getStoredData('isModalOpen', false))
const [runOutPlayerId, setRunOutPlayerId] = useState(getStoredData("runOutPlayerId", ''))
const [hasMatchEnded, setMatchEnded] = useState(getStoredData('hasMatchEnded', false))
const [isNoBall, setNoBall] = useState(getStoredData('isNoBall', false))
const [iswideball, setwideBall] = useState(getStoredData('iswideball', false))
const [outType, setOutType] = useState(getStoredData("outType", ''))
const [buttonstate, setButtonstate] = useState(getStoredData("buttonstate", false));
const [reset, setreset] = useState(getStoredData("reset", true));

useEffect(() => {
  localStorage.setItem("match", JSON.stringify(match));
  localStorage.setItem('inningNo', JSON.stringify(inningNo));
  localStorage.setItem('totalRuns', JSON.stringify(totalRuns));
  localStorage.setItem('wicketCount', JSON.stringify(wicketCount));
  localStorage.setItem('totalOvers', JSON.stringify(totalOvers));
  localStorage.setItem('ballCount', JSON.stringify(ballCount));
  localStorage.setItem('isBatter1Edited', JSON.stringify(isBatter1Edited));
  localStorage.setItem('isBatter2Edited', JSON.stringify(isBatter2Edited));
  localStorage.setItem('isBowlerEdited', JSON.stringify(isBowlerEdited));
  localStorage.setItem('batter1', JSON.stringify(batter1));
  localStorage.setItem('batter2', JSON.stringify(batter2));
  localStorage.setItem('batters', JSON.stringify(batters));
  localStorage.setItem('strikeValue', JSON.stringify(strikeValue));
  localStorage.setItem('bowler', JSON.stringify(bowler));
  localStorage.setItem('inputBowler', JSON.stringify(inputBowler));
  localStorage.setItem('currentRunStack', JSON.stringify(currentRunStack));
  localStorage.setItem('extras', JSON.stringify(extras));
  localStorage.setItem('recentOvers', JSON.stringify(recentOvers));
  localStorage.setItem('bowlers', JSON.stringify(bowlers));
  localStorage.setItem('overCount', JSON.stringify(overCount));
  localStorage.setItem('runsByOver', JSON.stringify(runsByOver));
  localStorage.setItem('remainingBalls', JSON.stringify(remainingBalls));
  localStorage.setItem('remainingRuns', JSON.stringify(remainingRuns));
  localStorage.setItem('activeSection', JSON.stringify(activeSection));
  localStorage.setItem('battingOrder', JSON.stringify(battingOrder));
  localStorage.setItem('isModalOpen', JSON.stringify(isModalOpen));
  localStorage.setItem('runOutPlayerId', JSON.stringify(runOutPlayerId));
  localStorage.setItem('hasMatchEnded', JSON.stringify(hasMatchEnded));
  localStorage.setItem('isNoBall', JSON.stringify(isNoBall));
  localStorage.setItem('iswideball', JSON.stringify(iswideball));
  localStorage.setItem('outType', JSON.stringify(outType));
  localStorage.setItem('buttonstate', JSON.stringify(buttonstate)); 
  localStorage.setItem('reset', JSON.stringify(reset)); 
}, [match,inningNo, totalRuns, wicketCount, totalOvers, ballCount,isBowlerEdited,isBatter2Edited,isBatter1Edited,batter2,batter1,strikeValue,bowler,inputBowler,currentRunStack,extras,recentOvers,bowlers,overCount,batters,runsByOver,remainingBalls,remainingRuns,activeSection,battingOrder,isModalOpen,runOutPlayerId,hasMatchEnded,isNoBall,iswideball,outType,buttonstate,reset]);

/////

  // const [extras, setExtras] = useState({ total: 0, wide: 0, noBall: 0 })
  // const [match, setMatch] = useState({ inning1: { batters: [], bowlers: [] }, inning2: { batters: [], bowlers: [] } })
  // const [inningNo, setInningNo] = useState(1)
  // const [totalRuns, setTotalRuns] = useState(0)
  // const [wicketCount, setWicketCount] = useState(0)
  // const [totalOvers, setTotalOvers] = useState(0)
  // const [ballCount, setBallCount] = useState(0)
  // const [currentRunStack, setCurrentRunStack] = useState([])
  // const [runsByOver, setRunsByOver] = useState(0)
  // const [batters, setBatters] = useState([])
  // const [overCount, setOverCount] = useState(0)
  // const [recentOvers, setRecentOvers] = useState([])
  // const [batter1, setBatter1] = useState({})
  // const [batter2, setBatter2] = useState({})
  // const [battingOrder, setBattingOrder] = useState(0)
  // const [isBatter1Edited, setBatter1Edited] = useState(false)
  // const [isBatter2Edited, setBatter2Edited] = useState(false)
  // const [isBowlerEdited, setBowlerEdited] = useState(false)
  // const [bowler, setBowler] = useState({})
  // const [bowlers, setBowlers] = useState([])
  // const [inputBowler, setInputBowler] = useState('')
  // const [isModalOpen, setModalOpen] = useState(false)
  // const [outType, setOutType] = useState('')
  // const [runOutPlayerId, setRunOutPlayerId] = useState('')
  // const [remainingBalls, setRemainingBalls] = useState(0)
  // const [remainingRuns, setRemainingRuns] = useState(0)
  // const [strikeValue, setStrikeValue] = React.useState('strike')
  // const [isNoBall, setNoBall] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [hasNameSuggested, setNameSuggested] = useState(false)
  // const [hasMatchEnded, setMatchEnded] = useState(false)
  const [isSlideOpen1, setIsSlideOpen1] = useState(false);
  const [isSlideOpen2, setIsSlideOpen2] = useState(false);
  // const [activeSection, setActiveSection] = useState("matchInfo");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  
  let data = JSON.parse(localStorage.getItem('data'))
  const { batting, team1, team2 } = data
  const maxOver = parseInt(data.maxOver)
  const history = useHistory()
  const toggleSlide1 = () => {
    setIsSlideOpen1(!isSlideOpen1); // Toggle the slide state
  };
  const toggleSlide2 = () => {
    setIsSlideOpen2(!isSlideOpen2); // Toggle the slide state
  };

  useEffect(() => {
    console.log('Props received in ScoreBoard:', props);
  }, [props]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const formattedTime = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup
  }, []);

  // useEffect(() => {
  //   const endInningButton = document.getElementById('end-inning');
  //   if (endInningButton) {
  //     endInningButton.disabled = true;
  //   }
  // }, []);
  
  useEffect(() => {
    // main tain state

    if (inningNo === 2) {
      if (remainingRuns <= 0 || overCount === maxOver || wicketCount === 10) {
        setButtonstate(true);
      } else {
        setButtonstate(false);
      }
    } else {
      if (overCount === maxOver || wicketCount === 10) {
        setButtonstate(true);
      } else {
        setButtonstate(false);
      }
    }
    
  }, [inningNo,overCount, maxOver,wicketCount,remainingRuns])


  //  Handle the all effect
  const handleEndInning = (e) => {

    const endInningButton = document.getElementById('end-inning')
    if (endInningButton.textContent === 'Reset') {
     history.push('/')
    } else {

      // set data in Scorebord after press on end-inning and scorecard
      // real - time add kar sakte heai
      if (batter1.id !== undefined) {
        const { id, name, run, ball, four, six, strikeRate, onStrike } = batter1
        batters.push({
          id,
          name,
          run,
          ball,
          four,
          six,
          strikeRate,
          onStrike,
          battingOrder: batter1.battingOrder,
          battingStatus: BATTING,
        })
      }
      if (batter2.id !== undefined) {
        batters.push({
          id: batter2.id,
          name: batter2.name,
          run: batter2.run,
          ball: batter2.ball,
          four: batter2.four,
          six: batter2.six,
          strikeRate: batter2.strikeRate,
          onStrike: batter2.onStrike,
          battingOrder: batter2.battingOrder,
          battingStatus: BATTING,
        })
      }
      if (bowler.id !== undefined) {
        const currentDisplayOver = Math.round((ballCount === 6 ? 1 : ballCount * 0.1) * 10) / 10
        let isMaidenOver = true
        let countWicket = 0
        let countNoBall = 0
        let countWide = 0
        const deliveries = ['1', '2', '3', '4', '6', 'wd']
        for (let delivery of currentRunStack) {
          delivery = delivery.toString()
          if (deliveries.includes(delivery) || delivery.includes('nb')) {
            isMaidenOver = false
          }
          if (delivery === 'W') {
            countWicket++
          }
          if (delivery.includes('nb')) {
            countNoBall++
          }
          if (delivery.includes('wd')) {
            countWide++
          }
        }
        if (ballCount !== 6) {
          isMaidenOver = false
        }
        const index = bowlers.findIndex((blr) => {
          return blr.id === bowler.id
        })
        if (index !== -1) {
          const existingBowler = bowlers[index]
          const { maiden, wicket, noBall, wide, over } = existingBowler
          const bowlerTotalOver = over + ballCount / 6
          existingBowler.over = existingBowler.over + currentDisplayOver
          existingBowler.maiden = isMaidenOver ? maiden + 1 : maiden
          existingBowler.run = existingBowler.run + runsByOver
          existingBowler.wicket = wicket + countWicket
          existingBowler.noBall = noBall + countNoBall
          existingBowler.wide = wide + countWide
          existingBowler.economy = Math.round((existingBowler.run / bowlerTotalOver) * 100) / 100
          bowlers[index] = existingBowler
          setBowlers(bowlers)
        } else {
          if (ballCount !== 6) {
            bowlers.push({
              id: bowler.id,
              name: bowler.name,
              over: currentDisplayOver,
              maiden: isMaidenOver ? 1 : 0,
              run: runsByOver,
              wicket: countWicket,
              noBall: countNoBall,
              wide: countWide,
              economy: Math.round((runsByOver / (ballCount / 6)) * 100) / 100,
            })
            setBowlers(bowlers)
          }
        }
      }

      if (inningNo === 1) {
        setMatch((state) => {
          const totalFours = batters.map((batter) => batter.four).reduce((prev, next) => prev + next)
          const totalSixes = batters.map((batter) => batter.four).reduce((prev, next) => prev + next)
          return {
            ...state,
            inning1: {
              runs: totalRuns,
              wickets: wicketCount,
              runRate: crr,
              overs: totalOvers,
              four: totalFours,
              six: totalSixes,
              extra: extras,
              batters,
              bowlers,
            },
          }
        })
        setInningNo(2)
        setCurrentRunStack([])
        setTotalRuns(0)
        setExtras({ total: 0, wide: 0, noBall: 0 })
        setRunsByOver(0)
        setWicketCount(0)
        setTotalOvers(0)
        setBallCount(0)
        setOverCount(0)
        setRecentOvers([])
        setBatter1({})
        setBatter2({})
        setBatters([])
        setBowlers([])
        setBattingOrder(0)
        setInputBowler('')
        setBowler({})
        setRemainingBalls(maxOver * 6)
        setRemainingRuns(totalRuns + 1)
        const bowlerNameElement = document.querySelector('.react-autosuggest__input')
       /////
        if (bowlerNameElement) {
          bowlerNameElement.value = '';
          bowlerNameElement.disabled = false;
        }
       /////
        // bowlerNameElement.value = ''
        // bowlerNameElement.disabled = false
        const batter1NameElement = document.getElementById('batter1Name')
       /////
        if (batter1NameElement) {
          batter1NameElement.value = '';
          batter1NameElement.disabled = false
        }
       /////
        // batter1NameElement.value = ''
        // batter1NameElement.disabled = false
        const batter2NameElement = document.getElementById('batter2Name')
        if (batter2NameElement) {
          batter2NameElement.value = '';
          batter2NameElement.disabled = false
        }
        // batter2NameElement.value = ''
        // batter2NameElement.disabled = false
        setStrikeValue('strike')
        
        ////
        // endInningButton.disabled = true;
        ////

      } else {

        setMatch((state) => {
          const totalFours = batters.map((batter) => batter.four).reduce((prev, next) => prev + next)
          const totalSixes = batters.map((batter) => batter.four).reduce((prev, next) => prev + next)
          return {
            ...state,
            inning2: {
              runs: totalRuns,
              wickets: wicketCount,
              runRate: crr,
              overs: totalOvers,
              four: totalFours,
              six: totalSixes,
              extra: extras,
              batters,
              bowlers,
            },
          }
        })
        // ek state mentain kar
        setreset(false)
        endInningButton.textContent = 'Reset'
        setMatchEnded(true)
      }

    }
  }

  const endMatch = () => {
    disableAllScoreButtons(); // Assuming this is defined elsewhere
    
    // const endInningButton = document.getElementById('end-inning');
    // if (buttonstate && endInningButton.textContent === 'Score Board') {
    //   if(endInningButton){
    //     endInningButton.disabled = false;
    //   }
    // }
    // setreset(true);
  };
  
  // Keypad blur
  const handleBatter1Blur = (e) => {
    let name = e.target.value
    name = name.charAt(0).toUpperCase() + name.slice(1)
    e.target.value = name
    e.target.disabled = true
    if (isBatter1Edited) {
      setBatter1((state) => ({
        ...state,
        name: name,
      }))
      setBatter1Edited(false)
    } else {
      const randomNo = MathUtil.getRandomNo()
      setBatter1({
        id: name + randomNo,
        name: name,
        run: 0,
        ball: 0,
        four: 0,
        six: 0,
        strikeRate: 0,
        onStrike: strikeValue === 'strike' ? true : false,
        battingOrder: battingOrder + 1,
        battingStatus: BATTING,
      })
      setBattingOrder(battingOrder + 1)
    }
  }
  // Keypad blur
  const handleBatter2Blur = (e) => {
    let name = e.target.value
    name = name.charAt(0).toUpperCase() + name.slice(1)
    e.target.value = name
    e.target.disabled = true
    if (isBatter2Edited) {
      setBatter2((state) => ({
        ...state,
        name: name,
      }))
      setBatter2Edited(false)
    } else {
      const randomNo = MathUtil.getRandomNo()
      setBatter2({
        id: name + randomNo,
        name: name,
        run: 0,
        ball: 0,
        four: 0,
        six: 0,
        strikeRate: 0,
        onStrike: strikeValue === 'non-strike' ? true : false,
        battingOrder: battingOrder + 1,
        battingStatus: BATTING,
      })
      setBattingOrder(battingOrder + 1)
    }
  }
  // Keypad blur
  const handleBowlerBlur = (e) => {
    let name = e.target.value
    if (name !== '') {
      name = name.charAt(0).toUpperCase() + name.slice(1)
      setInputBowler(name)
      e.target.value = name
      e.target.disabled = true
      if (isBowlerEdited) {
        setBowler((state) => ({
          ...state,
          name: name,
        }))
        setBowlerEdited(false)
      } else {
        if (hasNameSuggested) {
          setNameSuggested(false)
        } else {
          const randomNo = MathUtil.getRandomNo()
          const id = name + randomNo
          setBowler({
            id,
            name,
          })
        }
      }
    }
  }

  const onSuggestionsFetchRequested = (param) => {
    const inputValue = param.value.trim().toLowerCase()
    const suggestionArr = inputValue.length === 0 ? [] : bowlers.filter((bowlerObj) => bowlerObj.name.toLowerCase().includes(inputValue))
    setSuggestions(suggestionArr)
  }

  const getSuggestionValue = (suggestion) => {
    setBowler({
      id: suggestion.id,
      name: suggestion.name,
    })
    setNameSuggested(true)
    return suggestion.name
  }

  // Keypad blur
  const inputProps = {
    value: inputBowler,
    onChange: (e, { newValue }) => {
      setInputBowler(newValue)
    },
    onBlur: handleBowlerBlur,
  }

  const overCompleted = (runsByOverParam, currentRunStackParam) => {
    const bowlerNameElement = document.querySelector('.react-autosuggest__input')
    if (overCount + 1 === maxOver) {
      const endInningButton = document.getElementById('end-inning')
      if(endInningButton){
        endInningButton.disabled = false
      }
    } else {
      bowlerNameElement.disabled = false
    }
    disableAllScoreButtons()
    setRecentOvers((state) => [
      ...state,
      { overNo: overCount + 1, bowler: bowler.name, runs: runsByOverParam, stack: currentRunStackParam },
    ])
    setInputBowler('')
    setBowler({})
    setCurrentRunStack([])
    setRunsByOver(0)
    setBallCount(0)
    setOverCount(overCount + 1)
    const index = bowlers.findIndex((blr) => blr.id === bowler.id)
    let isMaidenOver = true
    let countWicket = 0
    let countNoBall = 0
    let countWide = 0
    const deliveries = ['1', '2', '3', '4', '6', 'wd']
    for (let delivery of currentRunStackParam) {
      delivery = delivery.toString()
      if (deliveries.includes(delivery) || delivery.includes('nb')) {
        isMaidenOver = false
      }
      if (delivery === 'W') {
        countWicket++
      }
      if (delivery.includes('nb')) {
        countNoBall++
      }
      if (delivery.includes('wd')) {
        countWide++
      }
    }
    if (index !== -1) {
      const existingBowler = bowlers[index]
      const { over, maiden, run, wicket, noBall, wide } = existingBowler
      existingBowler.over = over + 1
      existingBowler.maiden = isMaidenOver ? maiden + 1 : maiden
      existingBowler.run = run + runsByOverParam
      existingBowler.wicket = wicket + countWicket
      existingBowler.noBall = noBall + countNoBall
      existingBowler.wide = wide + countWide
      existingBowler.economy = Math.round((existingBowler.run / existingBowler.over) * 100) / 100
      bowlers[index] = existingBowler
      setBowlers(bowlers)
    } else {
      setBowlers((state) => [
        ...state,
        {
          id: bowler.id,
          name: bowler.name,
          over: 1,
          maiden: isMaidenOver ? 1 : 0,
          run: runsByOverParam,
          wicket: countWicket,
          noBall: countNoBall,
          wide: countWide,
          economy: runsByOverParam,
        },
      ])
    }
  }

  const newBatter1 = () => {
    const batter1NameElement = document.getElementById('batter1Name')
    batter1NameElement.value = ''
    batter1NameElement.disabled = false
    const { id, name, run, ball, four, six, strikeRate, onStrike } = batter1
    setBatters((state) => [
      ...state,
      {
        id,
        name,
        run,
        ball,
        four,
        six,
        strikeRate,
        onStrike,
        battingOrder: batter1.battingOrder,
        battingStatus: OUT,
      },
    ])
    setBatter1({})
  }

  const newBatter2 = () => {
    const batter2NameElement = document.getElementById('batter2Name')
    batter2NameElement.value = ''
    batter2NameElement.disabled = false
    const { id, name, run, ball, four, six, strikeRate, onStrike } = batter2
    setBatters((state) => [
      ...state,
      {
        id,
        name,
        run,
        ball,
        four,
        six,
        strikeRate,
        onStrike,
        battingOrder: batter2.battingOrder,
        battingStatus: OUT,
      },
    ])
    setBatter2({})
  }
  
  // About Edit the batter1 name
  const editBatter1Name = () => {
    if (overCount !== maxOver && wicketCount !== 10 && !hasMatchEnded) {
      const batter1NameElement = document.getElementById('batter1Name')
      batter1NameElement.disabled = false
      setBatter1Edited(true)
    }
  }

  // About Edit the batter2 name
  const editBatter2Name = () => {
    if (overCount !== maxOver && wicketCount !== 10 && !hasMatchEnded) {
      const batter2NameElement = document.getElementById('batter2Name')
      batter2NameElement.disabled = false
      setBatter2Edited(true)
    }
  }
  // About Edit the bowler name
  const editBowlerName = () => {
    if (overCount !== maxOver && wicketCount !== 10 && !hasMatchEnded) {
      const bowlerNameElement = document.querySelector('.react-autosuggest__input')
      bowlerNameElement.disabled = false
      setBowlerEdited(true)
    }
  }

  const undoWicket = (isNoBallParam) => {
    if (!isNoBallParam) {
      setBallCount(ballCount - 1)
      setTotalOvers(Math.round((totalOvers - 0.1) * 10) / 10)
    }
    setWicketCount(wicketCount - 1)
    const batter = batters[batters.length - 1]

    // if(true){
        // work on this
    // } else {
      batter.ball = batter.ball - 1
    // }

    const { id, name, run, ball, four, six, strikeRate, onStrike } = batter
    if (batter1.name === undefined || batter1.onStrike) {
      const batter1NameElement = document.getElementById('batter1Name')
      batter1NameElement.value = batter.name
      batter1NameElement.disabled = true
      setBatter1({
        id,
        name,
        run,
        ball,
        four,
        six,
        strikeRate,
        onStrike,
        battingOrder: batter.battingOrder,
        battingStatus: BATTING,
      })
      if (!batter.onStrike) {
        changeStrikeRadio()
        setBatter2((state) => ({
          ...state,
          onStrike: true,
        }))
      }
    } else if (batter2.name === undefined || batter2.onStrike) {
      const batter2NameElement = document.getElementById('batter2Name')
      batter2NameElement.value = batter.name
      batter2NameElement.disabled = true
      setBatter2({
        id,
        name,
        run,
        ball,
        four,
        six,
        strikeRate,
        onStrike,
        battingOrder: batter.battingOrder,
        battingStatus: BATTING,
      })
      if (!batter.onStrike) {
        changeStrikeRadio()
        setBatter1((state) => ({
          ...state,
          onStrike: true,
        }))
      }
    }
    batters.pop()
    setBatters(batters)
  }

//////

  // Handle wicket delivery in batsman account
  const handleCurrentBall = (run) => {

    // console.log("Added Entry to batter1");
    
    if(!isNoBall){
      if (batter1.onStrike) {
        setBatter1((state) => {
          const updatedRun = state.run + run
          const updatedBall = state.ball + 1
          const sr = Math.round((updatedRun / updatedBall) * 100 * 100) / 100
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            strikeRate: sr,
          }
        })
      } else {
        setBatter2((state) => {
          const updatedRun = state.run + run
          const updatedBall = state.ball + 1
          const sr = Math.round((updatedRun / updatedBall) * 100 * 100) / 100
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            strikeRate: sr,
          }
        })
      }
    } 
  }

//////

  // Base Logic
  const undoRun = (run, isNoBallParam) => {
    if (isNoBallParam) {
      setTotalRuns(totalRuns - (run + 1))
      setRunsByOver(runsByOver - (run + 1))
    } else {
      setTotalRuns(totalRuns - run)
      setRunsByOver(runsByOver - run)
      setBallCount(ballCount - 1)
      setTotalOvers(Math.round((totalOvers - 0.1) * 10) / 10)
      currentRunStack.pop()
      setCurrentRunStack(currentRunStack)
    }
    if (batter1.onStrike) {
      if (run % 2 === 0) {
        setBatter1((state) => {
          const updatedRun = state.run - run
          const updatedBall = (state.ball > 0) ? state.ball - 1 : 0 
          const updatedSr = (updatedBall !== 0) ? updatedRun / updatedBall : 0
          const sr = Math.round(isNaN(updatedSr) ? 0 : updatedSr * 100 * 100) / 100
          let four = state.four
          if (run === 4) {
            four = four - 1
          }
          let six = state.six
          if (run === 6) {
            six = six - 1
          }
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            four: four,
            six: six,
            strikeRate: sr,
          }
        })
      } else {
        changeStrikeRadio()
        switchBatterStrike()
        setBatter2((state) => {
          const updatedRun = state.run - run
          const updatedBall = (state.ball > 0) ? state.ball - 1 : 0 
          const updatedSr = (updatedBall !== 0) ? updatedRun / updatedBall : 0
          const sr = Math.round(isNaN(updatedSr) ? 0 : updatedSr * 100 * 100) / 100
          let four = state.four
          if (run === 4) {
            four = four - 1
          }
          let six = state.six
          if (run === 6) {
            six = six - 1
          }
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            four: four,
            six: six,
            strikeRate: sr,
          }
        })
      }
    } else if (batter2.onStrike) {
      if (run % 2 === 0) {
        setBatter2((state) => {
          const updatedRun = state.run - run
          const updatedBall = (state.ball > 0) ? state.ball - 1 : 0 
          const updatedSr = (updatedBall !== 0) ? updatedRun / updatedBall : 0
          const sr = Math.round(isNaN(updatedSr) ? 0 : updatedSr * 100 * 100) / 100
          let four = state.four
          if (run === 4) {
            four = four - 1
          }
          let six = state.six
          if (run === 6) {
            six = six - 1
          }
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            four: four,
            six: six,
            strikeRate: sr,
          }
        })
      } else {
        changeStrikeRadio()
        switchBatterStrike()
        setBatter1((state) => {
          const updatedRun = state.run - run
          const updatedBall = (state.ball > 0) ? state.ball - 1 : 0 
          const updatedSr = (updatedBall !== 0) ? updatedRun / updatedBall : 0
          const sr = Math.round(isNaN(updatedSr) ? 0 : updatedSr * 100 * 100) / 100
          let four = state.four
          if (run === 4) {
            four = four - 1
          }
          let six = state.six
          if (run === 6) {
            six = six - 1
          }
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            four: four,
            six: six,
            strikeRate: sr,
          }
        })
      }
    }
  }

  const undoDelivery = () => {
    if (currentRunStack.length > 0) {
      const last = currentRunStack[currentRunStack.length - 1]
      if (typeof last === 'number') {
        console.log("num backup")
        const run = parseInt(last)
        undoRun(run, false)
        /////
        if(inningNo === 2 ){
          setRemainingBalls(remainingBalls+1)
          setRemainingRuns(remainingRuns+run)
        }
        /////
      } else {
        currentRunStack.pop()
        setCurrentRunStack(currentRunStack)
        if (last === 'wd') {
          console.log("Wide backup")
          setTotalRuns(totalRuns - 1)
          setExtras((state) => ({
            ...state,
            total: state.total - 1,
            wide: state.wide - 1,
          }))
        } else if (last === 'W') {
          console.log("wicket backup")
          undoWicket(false)
          if(inningNo === 2 ){
            setRemainingBalls(remainingBalls+1)
          }
        } else {
          console.log("No ball backup")
          const lastChar = last.substr(last.length - 1)
          const run = parseInt(lastChar)
          /////
        /////
        if(inningNo === 2 ){
          setRemainingBalls(remainingBalls+1)
          setRemainingRuns(remainingRuns+run+1)
        }
        /////
          const firstTwoEntries = last.slice(0, 2);
          if(firstTwoEntries === 'wd'){
            setExtras((state) => ({
              ...state,
              total: state.total - 1,
              wide: state.wide - 1,
            }))
          } else {
            setExtras((state) => ({
              ...state,
              total: state.total - 1,
              noBall: state.noBall - 1,
            }))
          }
          if (isNaN(run)) {
            setTotalRuns(totalRuns - 1)
            setRunsByOver(runsByOver - 1)
            if (last !== 'nb') {
              undoWicket(true)
            }
          } else {
            undoRun(run, true)
          }
        }
      }
    }
  }

  // Strick Rotation 
  const handleStrikeChange = (e) => {
    changeStrikeRadio(e.target.value)
    if (e.target.value === 'strike') {
      switchBatterStrike('batter1')
    } else {
      switchBatterStrike('batter2')
    }
  }

  // Strick Rotation 
  const changeStrikeRadio = (strikeParam) => {
    if (strikeParam === undefined) {
      setStrikeValue(strikeValue === 'strike' ? 'non-strike' : 'strike')
    } else {
      setStrikeValue(strikeParam)
    }
  }

  // Strick Rotation 
  const switchBatterStrike = (strikeParam) => {
    if (strikeParam === undefined) {
      setBatter1((state) => ({
        ...state,
        onStrike: !state.onStrike,
      }))
      setBatter2((state) => ({
        ...state,
        onStrike: !state.onStrike,
      }))
    } else {
      if (strikeParam === 'batter1') {
        setBatter1((state) => ({
          ...state,
          onStrike: true,
        }))
        setBatter2((state) => ({
          ...state,
          onStrike: false,
        }))
      } else if (strikeParam === 'batter2') {
        setBatter1((state) => ({
          ...state,
          onStrike: false,
        }))
        setBatter2((state) => ({
          ...state,
          onStrike: true,
        }))
      }
    }
  }

  const handleRun = (run) => {

    if (isNoBall) {
      console.log("No")
      setCurrentRunStack((state) => [...state, 'nb' + run])
      removeNoBallEffect()
    } else if (iswideball) {
      console.log("wide")
      setCurrentRunStack((state) => [...state, 'wd' + run])
      removeWideBallEffect()
    } else {
      console.log("simple")
      setBallCount(ballCount + 1)
      setCurrentRunStack((state) => [...state, run])
    }
    setTotalRuns(totalRuns + run)
    setRunsByOver(runsByOver + run)
    if (inningNo === 2) {
      if (!isNoBall || !iswideball) {
        setRemainingBalls(remainingBalls - 1)
      }
      setRemainingRuns(remainingRuns - run)
    }
    if (ballCount === 5) {
      if (isNoBall || iswideball) {
        if (run % 2 !== 0) {
          changeStrikeRadio()
        }
      } else {
        setTotalOvers(overCount + 1)
        const arr = [...currentRunStack]
        arr.push(run)
        overCompleted(runsByOver + run, arr)
        if (run % 2 === 0) {
          changeStrikeRadio()
        }
      }
    } else {
      if (!isNoBall && !iswideball ) {
        setTotalOvers(Math.round((totalOvers + 0.1) * 10) / 10)
      }
      // if (!iswideball) {
      //   setTotalOvers(Math.round((totalOvers + 0.1) * 10) / 10)
      // }
      if (run % 2 !== 0) {
        changeStrikeRadio()
      }
    }

    if (batter1.onStrike) {
      setBatter1((state) => {
        const updatedRun = state.run + run
        var updatedBall = (!isNoBall && !iswideball) ? state.ball + 1 : state.ball
        // const updatedBall = state.ball + 1
        const sr = Math.round((updatedRun / updatedBall) * 100 * 100) / 100
        let four = state.four
        if (run === 4) {
          four = four + 1
        }
        let six = state.six
        if (run === 6) {
          six = six + 1
        }
        return {
          ...state,
          run: updatedRun,
          ball: updatedBall,
          four: four,
          six: six,
          strikeRate: sr,
        }
      })
      if (isNoBall) {
        if (run % 2 !== 0) {
          switchBatterStrike()
        }
      } else {
        if ((ballCount === 5 && run % 2 === 0) || (ballCount !== 5 && run % 2 !== 0)) {
          switchBatterStrike()
        }
      }
    } else {
      setBatter2((state) => {
        const updatedRun = state.run + run
        var updatedBall = (!isNoBall && !iswideball) ? state.ball + 1 : state.ball

        // const updatedBall = state.ball + 1
        const sr = Math.round((updatedRun / updatedBall) * 100 * 100) / 100
        let four = state.four
        if (run === 4) {
          four = four + 1
        }
        let six = state.six
        if (run === 6) {
          six = six + 1
        }
        return {
          ...state,
          run: updatedRun,
          ball: updatedBall,
          four: four,
          six: six,
          strikeRate: sr,
        }
      })
      if ((ballCount === 5 && run % 2 === 0) || (ballCount !== 5 && run % 2 !== 0)) {
        switchBatterStrike()
      }
    }

  }
  
  const handleNoBall = () => {
    if (inningNo === 2) {
      setRemainingRuns(remainingRuns - 1)
    }
    setTotalRuns(totalRuns + 1)
    setRunsByOver(runsByOver + 1)
    setExtras((state) => ({
      ...state,
      total: state.total + 1,
      noBall: state.noBall + 1,
    }))
    addNoBallEffect()
  }

  const addNoBallEffect = () => {
    const scoreTypesButtons = document.querySelectorAll('.score-types-button')
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].classList.add('score-types-button-noball')
    }
    setNoBall(true)
  }

  const removeNoBallEffect = () => {
    const scoreTypesButtons = document.querySelectorAll('.score-types-button')
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].classList.remove('score-types-button-noball')
    }
    setNoBall(false)
  }

  const handleWide = () => {
    if (isNoBall) {
      setCurrentRunStack((state) => [...state, 'nb'])
      removeNoBallEffect()
    } else {
      if (inningNo === 2) {
        setRemainingRuns(remainingRuns - 1)
      }
      // setCurrentRunStack((state) => [...state, 'wd'])
      setTotalRuns(totalRuns + 1)
      setRunsByOver(runsByOver + 1)
      setExtras((state) => ({
        ...state,
        total: state.total + 1,
        wide: state.wide + 1,
      }))
    }
    addWideBallEffect()
  }

  const addWideBallEffect = () => {
    const scoreTypesButtons = document.querySelectorAll('.score-types-button')
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].classList.add('score-types-button-noball')
    }
    setwideBall(true)
  }

  const removeWideBallEffect = () => {
    const scoreTypesButtons = document.querySelectorAll('.score-types-button')
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].classList.remove('score-types-button-noball')
    }
    setwideBall(false)
  }

  const handleWicket = (isRunOut, playerId) => {
    setRunOutPlayerId('')
    if (ballCount === 5) {
      if (isNoBall) {
        removeNoBallEffect()
        if (isRunOut) {
          setCurrentRunStack((state) => [...state, 'nbW'])
          setWicketCount(wicketCount + 1)
          disableAllScoreButtons()
        } else {
          setCurrentRunStack((state) => [...state, 'nb'])
        }
      } else {
        setTotalOvers(overCount + 1)
        const arr = [...currentRunStack]
        arr.push('W')
        overCompleted(runsByOver, arr)
        setWicketCount(wicketCount + 1)
        disableAllScoreButtons()
      }
    } else {
      if (isNoBall) {
        removeNoBallEffect()
        if (isRunOut) {
          setCurrentRunStack((state) => [...state, 'nbW'])
          setWicketCount(wicketCount + 1)
          disableAllScoreButtons()
        } else {
          setCurrentRunStack((state) => [...state, 'nb'])
        }
      } else {
        setBallCount(ballCount + 1)
        setCurrentRunStack((state) => [...state, 'W'])
        setTotalOvers(Math.round((totalOvers + 0.1) * 10) / 10)
        setWicketCount(wicketCount + 1)
        disableAllScoreButtons()
      }
    }
    if (isRunOut) {
      if (batter1.id === playerId) {
        newBatter1()
        changeStrikeRadio('strike')
        switchBatterStrike('batter1')
      } else {
        newBatter2()
        changeStrikeRadio('non-strike')
        switchBatterStrike('batter2')
      }
    } else {
      if (!isNoBall) {
        if (batter1.onStrike) {
          newBatter1()
        } else {
          newBatter2()
        }
      }
    }
    if (isNoBall) {
      if (isRunOut && wicketCount + 1 === 10) {
        const endInningButton = document.getElementById('end-inning')
        endInningButton.disabled = false
        const bowlerNameElement = document.querySelector('.react-autosuggest__input')
        bowlerNameElement.disabled = true
        const batter1NameElement = document.getElementById('batter1Name')
        batter1NameElement.disabled = true
        const batter2NameElement = document.getElementById('batter2Name')
        batter2NameElement.disabled = true
        setInputBowler('')
      }
    } else {
      if (wicketCount + 1 === 10) {
        const endInningButton = document.getElementById('end-inning')
        endInningButton.disabled = false
        const bowlerNameElement = document.querySelector('.react-autosuggest__input')
        bowlerNameElement.disabled = true
        const batter1NameElement = document.getElementById('batter1Name')
        batter1NameElement.disabled = true
        const batter2NameElement = document.getElementById('batter2Name')
        batter2NameElement.disabled = true
        setInputBowler('')
      }
    }
  }

  const handleCloseModal = () => {
    if (outType !== '') {
      if (outType === RUN_OUT) {
        if (runOutPlayerId !== '') {
          handleWicket(true, runOutPlayerId)
        }
      } else {
        handleWicket(false, '')
      }
    }
    setModalOpen(false)
    setOutType('')
    setRunOutPlayerId('')
  }

  const handleOutTypeChange = (e) => {
    const outTypeValue = e.target.value
    setOutType(outTypeValue)
    if (outTypeValue === RUN_OUT) {
      const runOutPlayerElement = document.getElementById('run-out-player')
      runOutPlayerElement.classList.remove('hide')
      const runOutPlayerErrorElement = document.getElementById('run-out-player-error')
      runOutPlayerErrorElement.classList.remove('hide')
    }
  }

  const handleRunOutPlayerChange = (e) => {
    const playerId = e.target.value
    const runOutPlayerErrorElement = document.getElementById('run-out-player-error')
    runOutPlayerErrorElement.classList.add('hide')
    setRunOutPlayerId(playerId)
  }
 
  // INACTIVE KEYPAD
  const disableAllScoreButtons = () => {
    const scoreTypesButtons = document.querySelectorAll('.score-types-button')
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].disabled = true
    }
  }
  // ACTIVE KEYPAD
  const enableAllScoreButtons = () => {
    const scoreTypesButtons = document.querySelectorAll('.score-types-button')
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].disabled = false
    }
  }

  if (batter1.name !== undefined && batter2.name !== undefined && inputBowler !== '') {
    enableAllScoreButtons()
  }

  let rrr = (remainingRuns / (remainingBalls / 6)).toFixed(2)
  rrr = isFinite(rrr) ? rrr : 0
  const overs = overCount + ballCount / 6
  let crr = (totalRuns / overs).toFixed(2)
  crr = isFinite(crr) ? crr : 0

  const inning1 = match.inning1
  const inning2 = match.inning2

  const scoringTeam = batting === team1 ? team1 : team2
  const chessingTeam = scoringTeam === team1 ? team2 : team1

  let winningMessage = `${inningNo === 1 ? scoringTeam : chessingTeam} needs ${remainingRuns} ${
    remainingRuns <= 1 ? 'run' : 'runs'
  } in ${remainingBalls} ${remainingBalls <= 1 ? 'ball' : 'balls'} to win`
  
  if (inningNo === 2) {
    var target = inning1.runs + 1
    if (wicketCount < 10 && overCount <= maxOver && totalRuns >= target) {
      winningMessage = `${chessingTeam} won by ${10 - wicketCount} wickets`
      endMatch()
    }
    if ((wicketCount >= 10 || overCount >= maxOver) && totalRuns < target - 1) {
      winningMessage = `${scoringTeam} won by ${target - totalRuns - 1} runs`
      endMatch()
    }
    if (wicketCount < 10 && overCount === maxOver && totalRuns === target - 1) {
      winningMessage = 'Match Tied'
      endMatch()
    }
  }

  const tossContent = (
    <>
      <p>{props.toss} won the toss & choose {props.win}</p>
    </>
  )

  // Notice
  const welcomeContent = (
    <>
      <div></div>
      <div>Welcome to IPL</div>
      <div></div>
    </>
  )

  // Notice overCount === maxOver wicketCount === 10 cnd for innning completed
  const firstInningCompletedContent = (
    <>
      {overCount === maxOver && <div>1st inning completed</div>}
      {wicketCount === 10 && <div>All Out</div>}
      <div>Please click "End Inning" button</div>
    </>
  )

  // Notice
  const remainingRunsContent = (
    <>
      <div>Target: {target}</div>
      <div>{winningMessage}</div>
      <div>RRR: {isNaN(rrr) ? 0 : rrr}</div>
    </>
  )

  const winnerCard3= (
    <>
      <p>{winningMessage}</p>
    </>
  )

  const winnerCard2 = (
    <>
      <p>Break Time</p>
    </>
  )

  return (
    // main container
    <div className='container'>
      {/* Title Heading */}
      <div className='inning'>
        <div className='TitleTag'>
        <div>
          {team1} vs {team2} 
        </div>

        </div>
        <div>

        {/* <button id='end-inning' onClick={handleEndInning}>
          {inningNo === 1 ? 'End Inning' : 'Score Board'}
        </button> */}

        {!buttonstate && <div className='Active'>
          LIVE
        </div>}
          {/* ///// */}
          {buttonstate && <button id='end-inning' onClick={handleEndInning}>
          {reset === true ? (inningNo === 1 ? 'End Inning' : 'Score Board') : 'Reset'}
          </button>} 
          {/* ///// */}
        </div>
      </div>


      {/* Notice */}
      <div id='badge' className='badge badge-flex'>
        {inningNo === 2 ? remainingRunsContent : overCount === maxOver || wicketCount === 10 ? firstInningCompletedContent : welcomeContent}
      </div>
      {/* edit*/}
      <div className='score-container'>
        {/* Wicket Types */}
        <div >
          <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={radioGroupBoxstyle} >
              <FormControl component='fieldset'
                sx={{
                  display: 'flex',
                  flexDirection: 'column', // Ensure radio buttons are stacked vertically
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 2,
                }}>
                <RadioGroup
                  row
                  aria-label='wicket'
                  name='row-radio-buttons-group'
                  onChange={handleOutTypeChange}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column', // Ensure radio buttons are stacked vertically
                    alignItems: 'flex-start',
                    justifyContent:'center',
                    marginBottom: 2,
                  }} 
                >
                  <FormControlLabel
                    value={CATCH}
                    control={
                      <Radio
                        sx={{
                          '&.Mui-checked': {
                            color: pink[600],
                          },
                        }}
                      />
                    }
                    label={CATCH}
                  />
                  <FormControlLabel
                    value={STUMP}
                    control={
                      <Radio
                        sx={{
                          '&.Mui-checked': {
                            color: pink[600],
                          },
                        }}
                      />
                    }
                    label={STUMP}
                  />
                  <FormControlLabel
                    value={HIT_WICKET}
                    control={
                      <Radio
                        sx={{
                          '&.Mui-checked': {
                            color: pink[600],
                          },
                        }}
                      />
                    }
                    label={HIT_WICKET}
                  />
                  <FormControlLabel
                    value={BOLD}
                    control={
                      <Radio
                        sx={{
                          '&.Mui-checked': {
                            color: pink[600],
                          },
                        }}
                      />
                    }
                    label={BOLD}
                  />
                  <FormControlLabel
                    value={RUN_OUT}
                    control={
                      <Radio
                        sx={{
                          '&.Mui-checked': {
                            color: pink[600],
                          },
                        }}
                      />
                    }
                    label={RUN_OUT}
                  />
                  <select defaultValue='' id='run-out-player' className='run-out-player hide' onChange={handleRunOutPlayerChange}>
                    <option value=''  disabled>
                      select option
                    </option>
                    <option value={batter1.id}>{batter1.name}</option>
                    <option value={batter2.id}>{batter2.name}</option>
                  </select>
                </RadioGroup>
                <div id='run-out-player-error' className='run-out-player-error hide'>
                  Please select run out player name
                </div>
              </FormControl>
            </Box>
          </Modal>
        </div>
        {/* Navigation */}
        <div className="tabs">
        <button className={`tab ${activeSection === "matchInfo" ? "active-tab" : ""}`} onClick={() => setActiveSection("matchInfo")}>Match Info</button>
        <button className={`tab ${activeSection === "liveScore" ? "active-tab" : ""}`} onClick={() => setActiveSection("liveScore")}>Live Score</button>
        <button className={`tab ${activeSection === "scoreCard" ? "active-tab" : ""}`} onClick={() => setActiveSection("scoreCard")}>Scorecard</button>
        <button className={`tab ${activeSection === "result" ? "active-tab" : ""}`} onClick={() => setActiveSection("result")}>Results</button>
        </div>

        {/* All section */}
        <div>
           {/*Section 1 :  Match Info */}
        {activeSection === "matchInfo" && <div id="matchinfo">   
          <div className="container1">
          <div className="info-container">
            <table className="info-table">
              <tbody>
                <tr>
                  <td className="label1">Info</td>
                  <td className="label1" ></td>
                </tr>
                <tr>
                  <td className="label">Match</td>
                  <td className="value">
                  {team1} vs {team2}             
                   </td>
                </tr>
                <tr>
                  <td className="label">Inning</td>
                  <td className="value">
                  {inningNo === 1 ? '1st' : '2nd'}         
                   </td>
                </tr>
                <tr>
                  <td className="label">Series</td>
                  <td className="value">VPL</td>
                </tr>
                <tr>
                  <td className="label">Match Type</td>
                  <td className="value">UnderArm</td>
                </tr>
                <tr>
                  <td className="label">Date</td>
                  <td className="value">{currentDate}</td>
                </tr>
                <tr>
                  <td className="label">Time</td>
                  <td className="value">{currentTime}</td>
                </tr>
                <tr>
                  <td className="label">Toss</td>
                  <td className="value">{props.toss} won & choose {props.win} </td>
                </tr>
                <tr >
                  <td className="label1" >Venue Guide</td>
                  <td className="label1" ></td>
                </tr>
                <tr>
                  <td className="label">Stadium</td>
                  <td className="value">Vijaydurg fort</td>
                </tr>
                <tr>
                  <td className="label">City</td>
                  <td className="value">Vijaydurg</td>
                </tr>
                <tr>
                  <td className="label">Country</td>
                  <td className="value">India</td>
                </tr>
              </tbody>
            </table>
          </div>
          </div></div>}

           {/*Section 2 :  Live Score */}
        {activeSection === "liveScore" && <div id="liveScore">        
         
          {/* User panel */}
         <div className="score-container1">
      
         <div className='Tag'>
         <div className='First'>
          <div className="Circle"></div>
          <div className="upcoming">Live</div>
         </div>
         </div>

         <div className="team-score1">
          <div style={{display: "flex", alignItems: "center",justifyContent: "center"  }}>
          {scoringTeam}
         {inningNo === 1 && (
    <SportsCricketIcon style={{ marginLeft: "8px", display: "flex", alignItems: "center",justifyContent: "center"  }}/> // Bat symbol for scoring team
  )}
          </div>

         <span className="score1">{inningNo === 1 ? totalRuns : inning1.runs}-{inningNo === 1 ? wicketCount : inning1.wickets} (
          {inningNo === 1 ? totalOvers : inning1.overs})</span>
         </div>

         <div className="team-score1">
          <div style={{display: "flex", alignItems: "center",justifyContent: "center"  }}>
          {chessingTeam}
        {inningNo !== 1 && (
    <SportsCricketIcon style={{ marginLeft: "8px" }} /> // Bat symbol for chasing team
  )}
          </div>
        <span className="score1">
        {inningNo === 1
        ? '0-0 (0)'
        : `${hasMatchEnded ? inning2.runs : totalRuns}-${
          hasMatchEnded ? inning2.wickets : wicketCount
        } (${hasMatchEnded ? inning2.overs : totalOvers})`}
        </span>
         </div>

         <div className='line'></div>

         <div className="result">{inningNo === 2 ? winnerCard3 : overCount === maxOver || wicketCount === 10 ? winnerCard2 : tossContent}</div>
      
         
         </div>

          {/* Admin panel */}
<div className='score'>
  <div>
    {inningNo === 1 ? scoringTeam : chessingTeam} : {totalRuns}/{wicketCount} ({totalOvers})
  </div>
  <div>CRR : {isNaN(crr) ? 0 : crr}</div>
</div>
{/* Batter */}
<div className='batting-container'>
  <table>
    <thead>
      <tr>
        <td className='score-types'><div className='batter'>Batter</div></td>
        <td className='score-types text-center'>R</td>
        <td className='score-types text-center'>B</td>
        <td className='score-types text-center'>4s</td>
        <td className='score-types text-center'>6s</td>
        <td className='score-types text-center'>SR</td>
      </tr>
    </thead>
    <tbody>
      {/* Batter 1 */}
      <tr>
        <td className='score-types'>
          <span id='strike'>
            <Radio
              size='small'
              checked={strikeValue === 'strike'}
              value='strike'
              onChange={handleStrikeChange}
              name='radio-buttons'
              inputProps={{ 'aria-label': 'strike' }}
              style={{ padding: '0 4px 0 2px' }}
            />
          </span>
          <input type='text' value={batter1.name} id='batter1Name' className='batter-name' onBlur={handleBatter1Blur} />
          <IconButton color='primary' className='icon-button' onClick={editBatter1Name}>
            <EditIcon className='icon-size' />
          </IconButton>
        </td>
        <td className='score-types text-center'>{batter1.run === undefined ? 0 : batter1.run}</td>
        <td className='score-types text-center'>{batter1.ball === undefined ? 0 : batter1.ball}</td>
        <td className='score-types text-center'>{batter1.four === undefined ? 0 : batter1.four}</td>
        <td className='score-types text-center'>{batter1.six === undefined ? 0 : batter1.six}</td>
        <td className='score-types text-center'>{batter1.strikeRate === undefined ? 0 : batter1.strikeRate}</td>
      </tr>
      {/* Batter 2 */}
      <tr>
        <td className='score-types'>
          <span id='non-strike'>
            <Radio
              size='small'
              checked={strikeValue === 'non-strike'}
              value='non-strike'
              onChange={handleStrikeChange}
              name='radio-buttons'
              inputProps={{ 'aria-label': 'non-strike' }}
              style={{ padding: '0 4px 0 2px' }}
            />
          </span>
          <input type='text' value={batter2.name} id='batter2Name' className='batter-name' onBlur={handleBatter2Blur} />
          <IconButton color='primary' className='icon-button' onClick={editBatter2Name}>
            <EditIcon className='icon-size' />
          </IconButton>
        </td>
        <td className='score-types text-center'>{batter2.run === undefined ? 0 : batter2.run}</td>
        <td className='score-types text-center'>{batter2.ball === undefined ? 0 : batter2.ball}</td>
        <td className='score-types text-center'>{batter2.four === undefined ? 0 : batter2.four}</td>
        <td className='score-types text-center'>{batter2.six === undefined ? 0 : batter2.six}</td>
        <td className='score-types text-center'>{batter2.strikeRate === undefined ? 0 : batter2.strikeRate}</td>
      </tr>
    </tbody>
  </table>
</div>
{/* Bowler */}
<div className='bowler-container'>
  <div className='bowler'>
    <div className='One'>
    Bowler
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={() => {
        setSuggestions([])
      }}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={(suggestion) => <div>{suggestion.name}</div>}
      inputProps={inputProps}
    />
    <IconButton color='primary' className='icon-button' onClick={editBowlerName}>
      <EditIcon className='icon-size' />
    </IconButton>
    </div>
    <div className='Two'> 
    <div>UNDO</div>
    <IconButton color='warning' className='icon-button' onClick={undoDelivery}>
      <DeleteIcon className='delete-icon-size' />
    </IconButton>
    </div>
  </div>
  <div className='bowler-runs'>
    {currentRunStack.map((run, i) => (
      <div key={i}>{run}</div>
    ))}
  </div>
</div>
{/* Keypad */}
<div className='score-types-container'>
  <table>
    <tbody>
      <tr>
        <td className='score-types' onClick={() => handleRun(0)}>
          <button className='score-types-button' disabled>
            0
          </button>
        </td>
        <td className='score-types' onClick={() => handleRun(1)}>
          <button className='score-types-button' disabled>
            1
          </button>
        </td>
        <td className='score-types' onClick={() => handleRun(2)}>
          <button className='score-types-button' disabled>
            2
          </button>
        </td>
        <td className='score-types' onClick={handleNoBall}>
          <button className='score-types-button' disabled>
            nb
          </button>
        </td>
        <td rowSpan='2' className='score-types' onClick={() => {setModalOpen(true); handleCurrentBall(0)}}>
          <button className='score-types-button' disabled>
            W
          </button>
        </td>
      </tr>
      <tr>
        <td className='score-types' onClick={() => handleRun(3)}>
          <button className='score-types-button' disabled>
            3
          </button>
        </td>
        <td className='score-types' onClick={() => handleRun(4)}>
          <button className='score-types-button' disabled>
            4
          </button>
        </td>
        <td className='score-types' onClick={() => handleRun(6)}>
          <button className='score-types-button' disabled>
            6
          </button>
        </td>
        <td className='score-types' onClick={handleWide}>
          <button className='score-types-button' disabled>
            wd
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
{/* Extra Run */}
<div className='extras-container'>
  <div>Extras</div>
  <div className='extra'>
  <div>Total: {extras.total}</div>
  <div>Wd: {extras.wide}</div>
  <div>NB: {extras.noBall}</div>
  </div>
</div>
{/* Recent Over */}
<div className='recent-over-container'>
  <div className='recent-over-text'>Recent Overs</div>
  <div className='recent-over-details'>
    <table>
    <thead className='Recent1'>
    <tr>
      <th>Over</th>
      <th>Bowler</th>
      <th>Summary</th>
      <th>Total</th>
    </tr>
  </thead>
      <tbody className='Recent2'>
        {recentOvers.map((recentOver, i) => (
          <tr key={i}>
            <td className='text-center'>{recentOver.overNo}</td>
            <td className='text-center'>{recentOver.bowler}</td>
            <td>
              <div className='recent-over-runs'>
                {recentOver.stack.map((run, index) => (
                  <div key={index}>{run}</div>
                ))}
              </div>
            </td>
            <td className='recent-over-total-run'>
              <div>{recentOver.runs}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
         </div></div>}

           {/*Section 3 :  Score Card*/}
        {activeSection === "scoreCard" && <div id="scoreCard">        
          {/* Scorecard */}
        <div className='score-board-container'>
          <div className='score-board-text text-center'>Score Board</div>
          {/* Inning1 Starts here */}
          <div>
            <div className='score-board-innings' onClick={toggleSlide1}>
              <div>{scoringTeam}  ( 1st Innings )</div>
              <div>
                {inningNo === 1 ? totalRuns : inning1.runs}-{inningNo === 1 ? wicketCount : inning1.wickets} (
                {inningNo === 1 ? totalOvers : inning1.overs} Ov)
              </div>
            </div>
          {isSlideOpen1 && (
          <div className="sliding-panel">
            {/* batting 1 */}
            <div className='sb-batting'>
              <table>
                <thead>
                  <tr>
                    <td className='score-types padding-left'><div className='sb'>Batter</div></td>
                    <td className='score-types text-center data'>R</td>
                    <td className='score-types text-center data'>B</td>
                    <td className='score-types text-center data'>4s</td>
                    <td className='score-types text-center data'>6s</td>
                    <td className='score-types text-center data'>SR</td>
                  </tr>
                </thead>
                <tbody>
                  {inning1.batters.map((batter, i) => {
                    return (
                      <tr key={i}>
                        <td className='score-types padding-left'><div className='sb'>{batter.name}</div></td>
                        <td className='score-types text-center data'>
                          {batter.run}
                        </td>
                        <td className='score-types text-center data'>
                          {batter.ball}
                        </td>
                        <td className='score-types text-center data'>{batter.four}</td>
                        <td className='score-types text-center data'>{batter.six}</td>
                        <td className='score-types text-center data'>{batter.strikeRate}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {/* bowling 1 */}
            <div className='sb-bowling'>
              <table>
                <thead>
                  <tr>
                    <td className='score-types padding-left'><div className='sb'>Bowler</div></td>
                    <td className='score-types text-center data'>O</td>
                    <td className='score-types text-center data'>M</td>
                    <td className='score-types text-center data'>R</td>
                    <td className='score-types text-center data'>W</td>
                    {/* <td className='score-types text-center'>NB</td>
                    <td className='score-types text-center'>WD</td> */}
                    <td className='score-types text-center data'>ECO</td>
                  </tr>
                </thead>
                <tbody>
                  {inning1.bowlers.map((blr, i) => {
                    // noBall, wide,
                    const { name, over, maiden, run, wicket, economy } = blr
                    return (
                      <tr key={i}>
                        <td className='score-types padding-left'><div className='sb'>{name}</div></td>
                        <td className='score-types text-center data'>{over}</td>
                        <td className='score-types text-center data'>{maiden}</td>
                        <td className='score-types text-center data'>{run}</td>
                        <td className='score-types text-center data'>{wicket}</td>
                        {/* <td className='score-types text-center'>{noBall}</td>
                        <td className='score-types text-center'>{wide}</td> */}
                        <td className='score-types text-center data'>{economy}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {/* Extra */}
            <div className='extras-container'>
              <div>Extras</div>
              <div className='extra'>
                <div>Total: {inningNo === 1 ? extras.total : inning1.extra.total}</div>
                <div>Wd: {inningNo === 1 ? extras.wide : inning1.extra.wide}</div>
                <div>Nb:{inningNo === 1 ? extras.noBall : inning1.extra.noBall}</div>
              </div>
            </div>
            {/* Run Rate */}
            <div className='extras-container'>
              <div>Run Rate</div>
              <div className='extra'>
                <div>{inningNo === 1 ? crr : inning1.runRate}</div>
              </div>
            </div>
            {/* Total */}
            <div className='extras-container'>
              <div>Total</div>
              <div className='extra'>
                <div>{inningNo === 1 ? totalRuns : inning1.runs}-{inningNo === 1 ? wicketCount : inning1.wickets} (
                  {inningNo === 1 ? totalOvers : inning1.overs} Ov)</div>
              </div>
            </div>
          </div>
          )}

          </div>
          {/* Inning2 Starts here */}
          {/* {inningNo === 2 && ( */}
          <div>
              <div className='score-board-innings' onClick={toggleSlide2}>
                <div>{chessingTeam} ( 2nd Innings )</div>
                <div>
                {inningNo === 1
        ? '0-0 (0 Ov)'
        : `${hasMatchEnded ? inning2.runs : totalRuns}-${
  hasMatchEnded ? inning2.wickets : wicketCount
} (${hasMatchEnded ? inning2.overs : totalOvers} Ov)`
}
      
                  {/* {hasMatchEnded ? inning2.runs : totalRuns}-{hasMatchEnded ? inning2.wickets : wicketCount} (
                  {hasMatchEnded ? inning2.overs : totalOvers} Ov) */}
                </div>
              </div>
              {isSlideOpen2 && (
        <div className="sliding-panel">
              {/* batting 2 */}
              <div className='sb-batting'>
                <table>
                  <thead className='sb-bat'>
                    <tr>
                      <td className='score-types padding-left'><div className='sb'>Batter</div></td>
                      <td className='score-types text-center data'>R</td>
                      <td className='score-types text-center data'>B</td>
                      <td className='score-types text-center data'>4s</td>
                      <td className='score-types text-center data'>6s</td>
                      <td className='score-types text-center data'>SR</td>
                    </tr>
                  </thead>
                  <tbody>
                    {inning2.batters.map((batter, i) => {
                      return (
                        <tr key={i}>
                          <td className='score-types padding-left'><div className='sb'>{batter.name}</div></td>
                          <td className='score-types text-center data'>
                            {batter.run}
                          </td>
                          <td className='score-types text-center data'>
                            {batter.ball}
                          </td>
                          <td className='score-types text-center data'>{batter.four}</td>
                          <td className='score-types text-center data'>{batter.six}</td>
                          <td className='score-types text-center data'>{batter.strikeRate}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {/* bowling 2 */}
              <div className='sb-bowling'>
                <table>
                  <thead>
                    <tr>
                      <td className='score-types padding-left'><div className='sb'>Bowler</div></td>
                      <td className='score-types text-center data'>O</td>
                      <td className='score-types text-center data'>M</td>
                      <td className='score-types text-center data'>R</td>
                      <td className='score-types text-center data'>W</td>
                      {/* <td className='score-types text-center'>NB</td>
                      <td className='score-types text-center'>WD</td> */}
                      <td className='score-types text-center data'>ECO</td>
                    </tr>
                  </thead>
                  <tbody>
                    {inning2.bowlers.map((blr, i) => {
                      // noBall, wide
                      const { name, over, maiden, run, wicket, economy } = blr
                      return (
                        <tr key={i}>
                          <td className='score-types padding-left'><div className='sb'>{name}</div></td>
                          <td className='score-types text-center data'>{over}</td>
                          <td className='score-types text-center data'>{maiden}</td>
                          <td className='score-types text-center data'>{run}</td>
                          <td className='score-types text-center data'>{wicket}</td>
                          {/* <td className='score-types text-center'>{noBall}</td>
                          <td className='score-types text-center'>{wide}</td> */}
                          <td className='score-types text-center data'>{economy}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {/* Extra */}
              <div className='extras-container'>
              <div>Extras</div>
              <div className='extra'>
                <div>Total: {hasMatchEnded ? inning2.extra.total : extras.total}</div>
                <div>Wd: {hasMatchEnded ? inning2.extra.wide : extras.wide}</div>
                <div>Nb:{hasMatchEnded ? inning2.extra.noBall : extras.noBall}</div>
              </div>
              </div>
              {/* Run Rate */}
              <div className='extras-container'>
              <div>Run Rate</div>
              <div className='extra'>
                <div> {inningNo === 2 ? crr : inning2.runRate}</div>
              </div>
              </div>
              {/* Total */}
              <div className='extras-container'>
              <div>Total</div>
              <div className='extra'>
                <div> 
                {inningNo === 1
        ? '0-0 (0 Ov)'
        : `${hasMatchEnded ? inning2.runs : totalRuns}-${
  hasMatchEnded ? inning2.wickets : wicketCount
} (${hasMatchEnded ? inning2.overs : totalOvers} Ov)`
}
                  {/* {hasMatchEnded ? inning2.runs : totalRuns}-{hasMatchEnded ? inning2.wickets : wicketCount} (
                  {hasMatchEnded ? inning2.overs : totalOvers} Ov) */}
                </div>
              </div>
              </div>
        </div>
      )}

          </div>
          {/* )} */}
         </div></div>}

           {/*Section 4 :  Result */}
        {activeSection === "result" && <div id="matchinfo1">   
          work in progress (Ashutosh Birje@)
         </div>}

        </div>
      </div>
    </div>
  )
}

export default ScoreBoard
