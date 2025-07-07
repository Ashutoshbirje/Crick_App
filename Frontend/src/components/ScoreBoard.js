import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import { pink } from "@mui/material/colors";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Autosuggest from "react-autosuggest";
import { BATTING, OUT } from "../constants/BattingStatus";
import { BOLD, CATCH, HIT_WICKET, RUN_OUT, STUMP } from "../constants/OutType";
import MathUtil from "../util/MathUtil";
import "./ScoreBoard.css";
import { radioGroupBoxstyle } from "./ui/RadioGroupBoxStyle";
import SportsCricketIcon from "@mui/icons-material/SportsCricket"; // Import the icon
import { FaTrash } from 'react-icons/fa'; // Using react-icons for delete icon
import AutoRefresh from "../components/AutoRefresh/AutoRefresh";

const ScoreBoard = (props) => {

  const navigate = useNavigate();
  const getStoredData = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue && props.Globalstate
      ? JSON.parse(storedValue)
      : defaultValue;
  };
  const [inningNo, setInningNo] = useState(getStoredData("inningNo", 1));
  const [totalRuns, setTotalRuns] = useState(getStoredData("totalRuns", 0));
  const [wicketCount, setWicketCount] = useState(
    getStoredData("wicketCount", 0)
  );

  const [TotalWicket, setTotalWicket] = useState(
    getStoredData("wicketCount", 0)
  );

  const [totalOvers, setTotalOvers] = useState(getStoredData("totalOvers", 0));
  const [ballCount, setBallCount] = useState(getStoredData("ballCount", 0));
  const [match, setMatch] = useState(
    getStoredData("match", {
      inning1: { runs: 0, wickets: 0, overs: 0, batters: [], bowlers: [], extras: {}, recentOvers: [] },
      inning2: { runs: 0, wickets: 0, overs: 0, batters: [], bowlers: [], extras: {}, recentOvers: [] },
    })
  );
  const [isBatter1Edited, setBatter1Edited] = useState(
    getStoredData("isBatter1Edited", false)
  );
  const [isBatter2Edited, setBatter2Edited] = useState(
    getStoredData("isBatter2Edited", false)
  );
  const [isBowlerEdited, setBowlerEdited] = useState(
    getStoredData("isBowlerEdited", false)
  );
  const [batter1, setBatter1] = useState(getStoredData("batter1", {}));
  const [batter2, setBatter2] = useState(getStoredData("batter2", {}));
  const [batters, setBatters] = useState(getStoredData("batters", []));
  const [strikeValue, setStrikeValue] = useState(
    getStoredData("strikeValue", "strike")
  );
  const [bowler, setBowler] = useState(getStoredData("bowler", {}));
  const [bowlers, setBowlers] = useState(getStoredData("bowlers", []));
  const [overCount, setOverCount] = useState(getStoredData("overCount", 0));
  const [inputBowler, setInputBowler] = useState(
    getStoredData("inputBowler", "")
  );
  const [currentRunStack, setCurrentRunStack] = useState(
    getStoredData("currentRunStack", [])
  );
  const [extras, setExtras] = useState(
    getStoredData("extras", { total: 0, wide: 0, noBall: 0, Lb: 0 })
  );
  const [recentOvers, setRecentOvers] = useState(
    getStoredData("recentOvers", [])
  );
  const [recentOvers1, setRecentOvers1] = useState(
    getStoredData("recentOvers1", [])
  );
  const [runsByOver, setRunsByOver] = useState(getStoredData("runsByOver", 0));
  const [remainingBalls, setRemainingBalls] = useState(
    getStoredData("remainingBalls", 0)
  );
  const [remainingRuns, setRemainingRuns] = useState(
    getStoredData("remainingRuns", 0)
  );
  const [activeSection, setActiveSection] = useState(
    getStoredData("activeSection", "matchInfo")
  );
  const [battingOrder, setBattingOrder] = useState(
    getStoredData("battingOrder", 0)
  );
  const [isModalOpen, setModalOpen] = useState(
    getStoredData("isModalOpen", false)
  );
  const [runOutPlayerId, setRunOutPlayerId] = useState(
    getStoredData("runOutPlayerId", "")
  );
  const [hasMatchEnded, setMatchEnded] = useState(
    getStoredData("hasMatchEnded", false)
  );
  const [isNoBall, setNoBall] = useState(getStoredData("isNoBall", false));
  const [iswideball, setwideBall] = useState(
    getStoredData("iswideball", false)
  );
  const [isLb, setLb] = useState(getStoredData("isLb", false));
  const [outType, setOutType] = useState(getStoredData("outType", ""));
  const [buttonstate, setButtonstate] = useState(
    getStoredData("buttonstate", false)
  );
  const [reset, setreset] = useState(getStoredData("reset", true));
  const [scores, setScores] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [hasNameSuggested, setNameSuggested] = useState(false);
  const [isSlideOpen1, setIsSlideOpen1] = useState(false);
  const [isSlideOpen2, setIsSlideOpen2] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [matchData, setMatchData] = useState(null);
  const [liveData, setLiveData] = useState(null);


  useEffect(() => {
    const fetchMatchData = async () => {
      try {   
  // Step 1: Get the current count of live matches
    const countRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/live/count`);

    if (!countRes.ok) {
      console.error(`Failed to fetch match count: ${countRes.status} ${countRes.statusText}`);
      return;
    }

    const countData = await countRes.json();
    const count = countData.count || 0;

    if (count === 0) {
      // console.warn("No live match entries found. Skipping update.");
      return;
    }
        // Step 2: Use count as matchId to fetch the match details
        const matchRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/live/match/${count}`);
        setLiveData(matchRes.data);
      } catch (err) {
        console.error("Failed to load match data:", err.message);
      }
    };

    fetchMatchData();
  }, []);
  /// calcualtion 
  useEffect(() => {
  const fetchMatchData = async () => {
    try {
      const countRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/live/count`);
      if (!countRes.ok) return;

      const countData = await countRes.json();
      const count = countData.count || 0;
      if (count === 0) return;

      const matchRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/live/match/${count}`);
      const match = matchRes.data;

      const overCount = match.overCount || 0;
      const ballCount = match.ballCount || 0;
      const totalRuns = match.totalRuns || 0;
      const remainingRuns = match.remainingRuns || 0;
      const remainingBalls = match.remainingBalls || 0;
      const wicketCount = match.wicketCount || 0;
      const maxOver = match.totalOvers || 0;
      const inningNo = match.inningNo;
      const inning1 = match.inning1 || {};
      // const inning2 = match.inning2 || {};
      const team1 = match.scoringTeam;
      const team2 = match.chessingTeam;

      const scoringTeam = team1;
      const chessingTeam = team2;

      // Target (only applicable in 2nd innings)
      let target = inning1.runs ? inning1.runs + 1 : 0;

      // RRR
      let rrr = (remainingRuns / (remainingBalls / 6)).toFixed(2);
      rrr = isFinite(rrr) ? rrr : 0;

      // CRR
      const overs = overCount + ballCount / 6;
      let crr = (totalRuns / overs).toFixed(2);
      crr = isFinite(crr) ? crr : 0;
      
      // console.log(match)

      // Winning Message
      let winningMessage = `${inningNo === 1 ? scoringTeam : chessingTeam} needs ${remainingRuns} ${remainingRuns <= 1 ? "run" : "runs"} in ${remainingBalls} ${remainingBalls <= 1 ? "ball" : "balls"} to win`;
      
      // Use backend data (To avoid Won msg )
      // Custom wicket count 
      if (match.inningNo === 2 && match.remainingBalls <=0) {
        if (wicketCount < TotalWicket && overCount <= maxOver && totalRuns >= target) {
          winningMessage = `${chessingTeam} won by ${TotalWicket - wicketCount} wickets`;
        } else if ((wicketCount >= TotalWicket || overCount >= maxOver) && totalRuns < target - 1) {
          winningMessage = `${scoringTeam} won by ${target - totalRuns - 1} runs`;
        } else if (wicketCount < TotalWicket && overCount === maxOver && totalRuns === target - 1) {
          winningMessage = "Match Tied";
        }
      }

      setLiveData({
        ...match,
        rrr,
        crr,
        winningMessage,
        target,
      });

    } catch (err) {
      console.error("Failed to load match data:", err.message);
    }
  };

  fetchMatchData();
  }, []);
  // View Result
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/score/all`
        );
        const allScores = response.data;
        if (Array.isArray(allScores)) {
          setScores(allScores);
        }
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    fetchScores();
  }, []);
  // Local Storage 
  useEffect(() => {
    // localStorage.setItem("Admin", JSON.stringify(Admin));
    localStorage.setItem("match", JSON.stringify(match));
    localStorage.setItem("inningNo", JSON.stringify(inningNo));
    localStorage.setItem("totalRuns", JSON.stringify(totalRuns));
    localStorage.setItem("wicketCount", JSON.stringify(wicketCount));
    localStorage.setItem("TotalWicket", JSON.stringify(TotalWicket));
    localStorage.setItem("totalOvers", JSON.stringify(totalOvers));
    localStorage.setItem("ballCount", JSON.stringify(ballCount));
    localStorage.setItem("isBatter1Edited", JSON.stringify(isBatter1Edited));
    localStorage.setItem("isBatter2Edited", JSON.stringify(isBatter2Edited));
    localStorage.setItem("isBowlerEdited", JSON.stringify(isBowlerEdited));
    localStorage.setItem("batter1", JSON.stringify(batter1));
    localStorage.setItem("batter2", JSON.stringify(batter2));
    localStorage.setItem("batters", JSON.stringify(batters));
    localStorage.setItem("strikeValue", JSON.stringify(strikeValue));
    localStorage.setItem("bowler", JSON.stringify(bowler));
    localStorage.setItem("inputBowler", JSON.stringify(inputBowler));
    localStorage.setItem("currentRunStack", JSON.stringify(currentRunStack));
    localStorage.setItem("extras", JSON.stringify(extras));
    localStorage.setItem("recentOvers", JSON.stringify(recentOvers));
    localStorage.setItem("recentOvers1", JSON.stringify(recentOvers1));
    localStorage.setItem("bowlers", JSON.stringify(bowlers));
    localStorage.setItem("overCount", JSON.stringify(overCount));
    localStorage.setItem("runsByOver", JSON.stringify(runsByOver));
    localStorage.setItem("remainingBalls", JSON.stringify(remainingBalls));
    localStorage.setItem("remainingRuns", JSON.stringify(remainingRuns));
    localStorage.setItem("activeSection", JSON.stringify(activeSection));
    localStorage.setItem("battingOrder", JSON.stringify(battingOrder));
    localStorage.setItem("isModalOpen", JSON.stringify(isModalOpen));
    localStorage.setItem("runOutPlayerId", JSON.stringify(runOutPlayerId));
    localStorage.setItem("hasMatchEnded", JSON.stringify(hasMatchEnded));
    localStorage.setItem("isNoBall", JSON.stringify(isNoBall));
    localStorage.setItem("iswideball", JSON.stringify(iswideball));
    localStorage.setItem("isLb", JSON.stringify(isLb));
    localStorage.setItem("outType", JSON.stringify(outType));
    localStorage.setItem("buttonstate", JSON.stringify(buttonstate));
    localStorage.setItem("reset", JSON.stringify(reset));
  }, [
    match,
    inningNo,
    totalRuns,
    wicketCount,
    TotalWicket,
    totalOvers,
    ballCount,
    isBowlerEdited,
    isBatter2Edited,
    isBatter1Edited,
    batter2,
    batter1,
    strikeValue,
    bowler,
    inputBowler,
    currentRunStack,
    extras,
    recentOvers,
    recentOvers1,
    bowlers,
    overCount,
    batters,
    runsByOver,
    remainingBalls,
    remainingRuns,
    activeSection,
    battingOrder,
    isModalOpen,
    runOutPlayerId,
    hasMatchEnded,
    isNoBall,
    iswideball,
    isLb,
    outType,
    buttonstate,
    reset
  ]);
  // New Match
useEffect(() => {
  const fetchMatch = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/matches`);
      const data = await response.json();

      // Check if there is at least one match
      if (data.length === 0) {
        // console.warn("No match data available.");
        return;
      }

      const latestMatch = data[data.length - 1];
      setMatchData(latestMatch);
      console.log(`Total number of wicket ${latestMatch.players}`);
      setTotalWicket(latestMatch.players);

      // Check if latestMatch.newmatch exists before calling props.setNewMatch
      if (latestMatch.newmatch !== undefined) {
        props.setNewMatch(latestMatch.newmatch);
      }

      const battingTeam =
        latestMatch.decision === "bat"
          ? latestMatch.tossWinner
          : latestMatch.tossWinner === latestMatch.team1
          ? latestMatch.team2
          : latestMatch.team1;

      localStorage.setItem(
        "data",
        JSON.stringify({
          maxOver: latestMatch.maxOver || 20,
          team1: latestMatch.team1 || "Team A",
          team2: latestMatch.team2 || "Team B",
          batting: battingTeam || "Team A"
        })
      );
    } catch (error) {
      console.error("Error fetching match data:", error);
    }
  };

  fetchMatch();
}, []);


  const data = JSON.parse(localStorage.getItem("data")) || {};
  const { batting = "", team1 = "", team2 = ""} = data;
  const maxOver = parseInt(data.maxOver || "20");

  // if (!localStorage.getItem("data")) {
  //   localStorage.setItem(
  //     "data",
  //     JSON.stringify({
  //       maxOver: 20,
  //       team1: "Team A",
  //       team2: "Team B",
  //       batting: "Team A",
  //     })
  //   );
  // }

  // let data = JSON.parse(localStorage.getItem("data"));
  // const { batting, team1, team2 } = data;
  // const maxOver = parseInt(data.maxOver);
  
  // UI State
  const toggleSlide1 = () => {
    setIsSlideOpen1(!isSlideOpen1); // Toggle the slide state
  };
  const toggleSlide2 = () => {
    setIsSlideOpen2(!isSlideOpen2); // Toggle the slide state
  };
  useEffect(() => {
    // maintain state
    if (inningNo === 2) {
      if (remainingRuns <= 0 || overCount === maxOver || wicketCount === TotalWicket) {
        setButtonstate(true);
      } else {
        setButtonstate(false);
      }
    } else {
      if (overCount === maxOver || wicketCount === TotalWicket) {
        setButtonstate(true);
      } else {
        setButtonstate(false);
      }
    }
  }, [inningNo, overCount, maxOver, wicketCount, remainingRuns]);

 // Useless  
  // useEffect(() => {
  //   // console.log(matchData)
  //   console.log("Props received in ScoreBoard:", props);
  // }, [props]);

  // Time
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


// Real Time Update
useEffect(() => {
  if(props.newMatch){
    updateLiveMatch();
  }
}, [
  inningNo,
  totalRuns,
  wicketCount,
  totalOvers,
  overCount,
  ballCount,
  hasMatchEnded,
  remainingRuns,
  remainingBalls,
  batter1,
  batter2,
  bowlers,
  extras,
  recentOvers,
  match
]);

const createLiveMatch = async ({
  inningNo,
  totalRuns,
  wicketCount,
  totalOvers,
  overCount,
  ballCount,
  hasMatchEnded,
  remainingRuns,
  remainingBalls,
  match,
  batter1,
  batter2,
  bowlers,
  extras,
  recentOvers
}) => {
  try {
    const countRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/live/count`);
    const matchCount = countRes.data.count;
    const newMatchId = matchCount + 1; // 👈 Keep as Number, not string

    const payload = {
      matchId: newMatchId, // 👈 Numeric ID
      inningNo:1,
      totalRuns:0,
      wicketCount:0,
      totalOvers:0,
      overCount:0,
      ballCount:0,
      hasMatchEnded:false,
      remainingRuns:0,
      remainingBalls:0,
      scoringTeam:"Team A",
      chessingTeam: "Team B",
      inning1: match.inning1,
      inning2: match.inning2,
      batter1,
      batter2,
      bowlers,
      extras,
      recentOvers,
      admin: true
    };

    const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/live/create`, payload);
    console.log("Live match created successfully:", res.data);
  } catch (err) {
    console.error("Error creating live match:", err);
  }
};

////////////
const updateLiveMatch = async () => {
  try {
    // Step 1: Get the current count of live matches
    const countRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/live/count`);

    if (!countRes.ok) {
      console.error(`Failed to fetch match count: ${countRes.status} ${countRes.statusText}`);
      return;
    }

    const countData = await countRes.json();
    const count = countData.count || 0;

    if (count === 0) {
      console.warn("No live match entries found. Skipping update.");
      return;
    }

    // Use count as the matchId
    const matchId = parseInt(count, 10);

    if (isNaN(matchId)) {
      console.warn("Invalid match ID derived from count:", count);
      return;
    }

    const updatePayload = {
      inningNo,
      totalRuns,
      wicketCount,
      totalOvers,
      scoringTeam: scoringTeam,
      chessingTeam: chessingTeam,
      overCount,
      ballCount,
      hasMatchEnded,
      remainingRuns,
      remainingBalls,
      batter1,
      batter2,
      bowlers,
      extras,
      recentOvers,
      inning1: match.inning1,
      inning2: match.inning2,
    };

    console.log("Updating match with ID (from count):", matchId);

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/live/match/${matchId}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatePayload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Error updating match:", result.message || result);
    } else {
      console.log("Match updated successfully:", result);
    }
  } catch (err) {
    console.error("Error in updateLiveMatch:", err.message || err);
  }
};

/////////////

  // Settings
  const handleClick = async (type) => {

      try {
    let newMatchValue = null;

    switch (type) {
      case "new":
        newMatchValue = false;
        break;
      // case "logout":
      //   newMatchValue = true;
      //   break;
      default:
        break;
    }

      if (newMatchValue !== null && matchData?._id) {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/matches/${matchData._id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newmatch: newMatchValue }),
      });

      props.setNewMatch(newMatchValue);
    }

    switch (type) {
      case "new":
        // props.setNewMatch(true);
         await createLiveMatch({
          inningNo,
          totalRuns,
          wicketCount,
          totalOvers,
          overCount,
          ballCount,
          hasMatchEnded,
          remainingRuns,
          remainingBalls,
          match,
          batter1,
          batter2,
          bowlers,
          extras,
          recentOvers
        });

        navigate("/form", { state: { newMatch: true } });
        break;
      case "edit":
        navigate("/EditPassward");
        break;
      case "help":
        navigate("/help");
        break;
      case "logout":
        localStorage.removeItem("token");
        // props.setNewMatch(false);
        props.setAdmin(false);
        navigate("/");
        break;
      default:
        break;
    }
  } catch (error) {
      console.error("Error updating newmatch value:", error);
  }
  };

  // Edit Match
  // const handleEndInning1 = async (e) => {
  // try {
  //   console.log("Press");
  //   if (matchData?._id) {
  //     console.log(matchData._id)
  //     await fetch(`${process.env.REACT_APP_API_BASE_URL}/matches/${matchData._id}/toggle`, {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ newmatch: false }),
  //     });
  //     props.setNewMatch(false);
  //   }
  //   navigate("/score");
  //   } catch (error) {
  //   console.error("Error ending inning and updating newmatch:", error);
  //   }
  // };

  const handleEndInning1 = async (e) => {
  try {
    // console.log("Press");
    // setBatter1({});
    // setBatter2({});
    // setBowlers([]);
    // setRecentOvers([]);

    // 1. Check and delete latest unended match
    if (liveData && liveData.hasMatchEnded === false) {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/live/delete/latest-unended`, {
        method: "DELETE",
      });
      console.log("Deleted latest unended match");
    }

    // 2. Update the match state in DB (optional if needed)
    if (matchData?._id) {
      console.log("Match ID:", matchData._id);
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/matches/${matchData._id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newmatch: false }),
      });
      props.setNewMatch(false);
    }

    // 3. Navigate to score page
    navigate("/score");
  } catch (error) {
    console.error("Error ending inning and deleting unended match:", error);
  }
  };

  // New Result
  const handleSave = async () => {
    // Extract only the serializable fields from inning1 and inning2
    const plainInning1 = {
      runs: inning1.runs,
      wickets: inning1.wickets,
      overs: inning1.overs.toString(), // Convert overs to string if needed
    };

    const plainInning2 = {
      runs: inning2.runs,
      wickets: inning2.wickets,
      overs: inning2.overs.toString(),
    };

    const scoreData = {
      scoringTeam,
      chessingTeam,
      inning1: plainInning1,
      inning2: plainInning2,
      winnerCard3: winningMessage,
      maxOver,
      date: currentDate,
    };

    if (matchData?._id) {
      console.log("Match ID:", matchData._id);
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/matches/${matchData._id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newmatch: false }),
      });
      props.setNewMatch(false);
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/score/save`,
        scoreData
      );
      
      // alert('Score saved successfully!');
    } catch (error) {
      console.error("Error saving score:", error);
      // alert('Failed to save score');
    }
  };
 
const handleDelete = async (id) => {
  console.log('Deleting ID:', id);
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/score/delete/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Success:', data.message);
      window.location.reload(); // 🔄 This reloads the entire page

      // Optionally, refresh your list or update UI here
    } else {
      console.error('Deletion failed:', data.message || 'Unknown error');
    }
  } catch (error) {
    console.error('Server error during deletion:', error);
  }
};

  // Live Score and scoreboard
  const handleEndInning = (e) => {
    const endInningButton = document.getElementById("end-inning");
    if(endInningButton.textContent !== "live"){
    if (endInningButton.textContent === "Save") {
      // Add here logic for save data in databsae
      handleSave();
      handleEndInning1();
      // window.location.reload(); // Refresh the page
      // endInningButton.textContent = "Reset";
      // console.log("Press");
    } else {
      // set data in Scorebord after press on end-inning and scorecard
      // real - time add kar sakte heai
      if (batter1.id !== undefined) {
        batters.push({
          id: batter1.id,
          name: batter1.name + " *",
          run: batter1.run,
          ball: batter1.ball,
          four: batter1.four,
          six: batter1.six,
          strikeRate: batter1.strikeRate,
          onStrike: batter1.onStrike,
          battingOrder: batter1.battingOrder,
          battingStatus: BATTING,
        });
      }
      if (batter2.id !== undefined) {
        batters.push({
          id: batter2.id,
          name: batter2.name + " *",
          run: batter2.run,
          ball: batter2.ball,
          four: batter2.four,
          six: batter2.six,
          strikeRate: batter2.strikeRate,
          onStrike: batter2.onStrike,
          battingOrder: batter2.battingOrder,
          battingStatus: BATTING,
        });
      }
      if (bowler.id !== undefined) {
        const currentDisplayOver =
          Math.round((ballCount === 6 ? 1 : ballCount * 0.1) * 10) / 10;
        let isMaidenOver = true;
        let countWicket = 0;
        let countNoBall = 0;
        let countWide = 0;
        const deliveries = ["1", "2", "3", "4", "6", "wd"];
        for (let delivery of currentRunStack) {
          delivery = delivery.toString();
          if (deliveries.includes(delivery) || delivery.includes("nb")) {
            isMaidenOver = false;
          }
          if (delivery === "W") {
            countWicket++;
          }
          if (delivery.includes("nb")) {
            countNoBall++;
          }
          if (delivery.includes("wd")) {
            countWide++;
          }
        }
        if (ballCount !== 6) {
          isMaidenOver = false;
        }
        const index = bowlers.findIndex((blr) => {
          return blr.id === bowler.id;
        });
        if (index !== -1) {
          const existingBowler = bowlers[index];
          const { maiden, wicket, noBall, wide, over } = existingBowler;
          const bowlerTotalOver = over + ballCount / 6;
          existingBowler.over = existingBowler.over + currentDisplayOver;
          existingBowler.maiden = isMaidenOver ? maiden + 1 : maiden;
          existingBowler.run = existingBowler.run + runsByOver;
          existingBowler.wicket = wicket + countWicket;
          existingBowler.noBall = noBall + countNoBall;
          existingBowler.wide = wide + countWide;
          existingBowler.economy =
            Math.round((existingBowler.run / bowlerTotalOver) * 100) / 100;
          bowlers[index] = existingBowler;
          setBowlers(bowlers);
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
            });
            setBowlers(bowlers);
          }
        }
      }

      if (inningNo === 1) {
        setMatch((state) => {
          const totalFours = batters
            .map((batter) => batter.four)
            .reduce((prev, next) => prev + next);
          const totalSixes = batters
            .map((batter) => batter.four)
            .reduce((prev, next) => prev + next);
          return {
            ...state,
            inning1: {
              runs: totalRuns,
              wickets: wicketCount,
              runRate: crr,
              overs: totalOvers,
              four: totalFours,
              six: totalSixes,
              extras,
              batters,
              bowlers,
              recentOvers,
            },
          };
        });
        var data = recentOvers;
        setRecentOvers1(data);
        setInningNo(2);
        setCurrentRunStack([]);
        setTotalRuns(0);
        setExtras({ total: 0, wide: 0, noBall: 0, Lb: 0});
        setRunsByOver(0);
        setWicketCount(0);
        setTotalOvers(0);
        setBallCount(0);
        setOverCount(0);
        setRecentOvers([]);
        setBatter1({});
        setBatter2({});
        setBatters([]);
        setBowlers([]);
        setBattingOrder(0);
        setInputBowler("");
        setBowler({});
        setRemainingBalls(maxOver * 6);
        setRemainingRuns(totalRuns + 1);
        const bowlerNameElement = document.querySelector(
          ".react-autosuggest__input"
        );
        /////
        if (bowlerNameElement) {
          bowlerNameElement.value = "";
          bowlerNameElement.disabled = false;
        }
        /////
        // bowlerNameElement.value = ''
        // bowlerNameElement.disabled = false
        const batter1NameElement = document.getElementById("batter1Name");
        /////
        if (batter1NameElement) {
          batter1NameElement.value = "";
          batter1NameElement.disabled = false;
        }
        /////
        // batter1NameElement.value = ''
        // batter1NameElement.disabled = false
        const batter2NameElement = document.getElementById("batter2Name");
        if (batter2NameElement) {
          batter2NameElement.value = "";
          batter2NameElement.disabled = false;
        }
        // batter2NameElement.value = ''
        // batter2NameElement.disabled = false
        setStrikeValue("strike");

        ////
        // endInningButton.disabled = true;
        ////
      } else {
        setMatch((state) => {
          const totalFours = batters
            .map((batter) => batter.four)
            .reduce((prev, next) => prev + next);
          const totalSixes = batters
            .map((batter) => batter.four)
            .reduce((prev, next) => prev + next);
          return {
            ...state,
            inning2: {
              runs: totalRuns,
              wickets: wicketCount,
              runRate: crr,
              overs: totalOvers,
              four: totalFours,
              six: totalSixes,
              extras,
              batters,
              bowlers,
              recentOvers,
            },
          };
        });
        // ek state mentain kar
        endInningButton.textContent = "Save";
        setreset(false);
        setMatchEnded(true);
      }
    }
    }
    
  };

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
    let name = e.target.value;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    e.target.value = name;
    if (!name || name.trim().length === 0) return;
    e.target.disabled = true;
    if (isBatter1Edited) {
      setBatter1((state) => ({
        ...state,
        name: name,
      }));
      setBatter1Edited(false);
    } else {
      const randomNo = MathUtil.getRandomNo();
      setBatter1({
        id: name + randomNo,
        name: name,
        run: 0,
        ball: 0,
        four: 0,
        six: 0,
        strikeRate: 0,
        onStrike: strikeValue === "strike" ? true : false,
        battingOrder: battingOrder + 1,
        battingStatus: BATTING,
      });
      setBattingOrder(battingOrder + 1);
    }
  };
  // Keypad blur
  const handleBatter2Blur = (e) => {
    let name = e.target.value;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    e.target.value = name;
    if (!name || name.trim().length === 0) return;
    e.target.disabled = true;
    if (isBatter2Edited) {
      setBatter2((state) => ({
        ...state,
        name: name,
      }));
      setBatter2Edited(false);
    } else {
      const randomNo = MathUtil.getRandomNo();
      setBatter2({
        id: name + randomNo,
        name: name,
        run: 0,
        ball: 0,
        four: 0,
        six: 0,
        strikeRate: 0,
        onStrike: strikeValue === "non-strike" ? true : false,
        battingOrder: battingOrder + 1,
        battingStatus: BATTING,
      });
      setBattingOrder(battingOrder + 1);
    }
  };
  // Keypad blur
  const handleBowlerBlur = (e) => {
    let name = e.target.value;
    if (!name || name.trim().length === 0) return;
    if (name !== "") {
      name = name.charAt(0).toUpperCase() + name.slice(1);
      setInputBowler(name);
      e.target.value = name;
      e.target.disabled = true;
      if (isBowlerEdited) {
        setBowler((state) => ({
          ...state,
          name: name,
        }));
        setBowlerEdited(false);
      } else {
        if (hasNameSuggested) {
          setNameSuggested(false);
        } else {
          const randomNo = MathUtil.getRandomNo();
          const id = name + randomNo;
          setBowler({
            id,
            name,
          });
        }
      }
    }
  };

  const onSuggestionsFetchRequested = (param) => {
    const inputValue = param.value.trim().toLowerCase();
    const suggestionArr =
      inputValue.length === 0
        ? []
        : bowlers.filter((bowlerObj) =>
            bowlerObj.name.toLowerCase().includes(inputValue)
          );
    setSuggestions(suggestionArr);
  };

  const getSuggestionValue = (suggestion) => {
    setBowler({
      id: suggestion.id,
      name: suggestion.name,
    });
    setNameSuggested(true);
    return suggestion.name;
  };

  // Keypad blur
  const inputProps = {
    value: inputBowler,
    onChange: (e, { newValue }) => {
      setInputBowler(newValue);
    },
    onBlur: handleBowlerBlur,
  };

  const overCompleted = (runsByOverParam, currentRunStackParam) => {
    const bowlerNameElement = document.querySelector(
      ".react-autosuggest__input"
    );
    if (overCount + 1 === maxOver) {
      const endInningButton = document.getElementById("end-inning");
      if (endInningButton) {
        endInningButton.disabled = false;
      }
    } else {
      bowlerNameElement.disabled = false;
    }
    disableAllScoreButtons();
    setRecentOvers((state) => [
      ...state,
      {
        overNo: overCount + 1,
        bowler: bowler.name,
        runs: runsByOverParam,
        stack: currentRunStackParam,
      },
    ]);
    setInputBowler("");
    setBowler({});
    setCurrentRunStack([]);
    setRunsByOver(0);
    setBallCount(0);
    setOverCount(overCount + 1);
    const index = bowlers.findIndex((blr) => blr.id === bowler.id);
    let isMaidenOver = true;
    let countWicket = 0;
    let countNoBall = 0;
    let countWide = 0;
    const deliveries = ["1", "2", "3", "4", "6", "wd"];
    for (let delivery of currentRunStackParam) {
      delivery = delivery.toString();
      if (deliveries.includes(delivery) || delivery.includes("nb")) {
        isMaidenOver = false;
      }
      if (delivery === "W") {
        countWicket++;
      }
      if (delivery.includes("nb")) {
        countNoBall++;
      }
      if (delivery.includes("wd")) {
        countWide++;
      }
    }
    if (index !== -1) {
      const existingBowler = bowlers[index];
      const { over, maiden, run, wicket, noBall, wide } = existingBowler;
      existingBowler.over = over + 1;
      existingBowler.maiden = isMaidenOver ? maiden + 1 : maiden;
      existingBowler.run = run + runsByOverParam;
      existingBowler.wicket = wicket + countWicket;
      existingBowler.noBall = noBall + countNoBall;
      existingBowler.wide = wide + countWide;
      existingBowler.economy =
        Math.round((existingBowler.run / existingBowler.over) * 100) / 100;
      bowlers[index] = existingBowler;
      setBowlers(bowlers);
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
      ]);
    }
  };

  const newBatter1 = () => {
    const batter1NameElement = document.getElementById("batter1Name");
    batter1NameElement.value = "";
    batter1NameElement.disabled = false;
    const { id, name, run, ball, four, six, strikeRate, onStrike } = batter1;
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
    ]);
    setBatter1({});
  };

  const newBatter2 = () => {
    const batter2NameElement = document.getElementById("batter2Name");
    batter2NameElement.value = "";
    batter2NameElement.disabled = false;
    const { id, name, run, ball, four, six, strikeRate, onStrike } = batter2;
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
    ]);
    setBatter2({});
  };

  // About Edit the batter1 name
  const editBatter1Name = () => {
    if (overCount !== maxOver && wicketCount !== TotalWicket && !hasMatchEnded) {
      const batter1NameElement = document.getElementById("batter1Name");
      batter1NameElement.disabled = false;
      setBatter1Edited(true);
    }
  };

  // About Edit the batter2 name
  const editBatter2Name = () => {
    if (overCount !== maxOver && wicketCount !== TotalWicket && !hasMatchEnded) {
      const batter2NameElement = document.getElementById("batter2Name");
      batter2NameElement.disabled = false;
      setBatter2Edited(true);
    }
  };

  // About Edit the bowler name
  const editBowlerName = () => {
    if (overCount !== maxOver && wicketCount !== TotalWicket && !hasMatchEnded) {
      const bowlerNameElement = document.querySelector(
        ".react-autosuggest__input"
      );
      bowlerNameElement.disabled = false;
      setBowlerEdited(true);
    }
  };

  const undoWicket = (isNoBallParam) => {
    if (!isNoBallParam) {
      setBallCount(ballCount - 1);
      setTotalOvers(Math.round((totalOvers - 0.1) * 10) / 10);
    }
    setWicketCount(wicketCount - 1);
    const batter = batters[batters.length - 1];

    // if(true){
    // work on this
    // } else {
    batter.ball = batter.ball - 1;
    // }

    const { id, name, run, ball, four, six, strikeRate, onStrike } = batter;
    if (batter1.name === undefined || batter1.onStrike) {
      const batter1NameElement = document.getElementById("batter1Name");
      batter1NameElement.value = batter.name;
      batter1NameElement.disabled = true;
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
      });
      if (!batter.onStrike) {
        changeStrikeRadio();
        setBatter2((state) => ({
          ...state,
          onStrike: true,
        }));
      }
    } else if (batter2.name === undefined || batter2.onStrike) {
      const batter2NameElement = document.getElementById("batter2Name");
      batter2NameElement.value = batter.name;
      batter2NameElement.disabled = true;
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
      });
      if (!batter.onStrike) {
        changeStrikeRadio();
        setBatter1((state) => ({
          ...state,
          onStrike: true,
        }));
      }
    }
    batters.pop();
    setBatters(batters);
  };

  //////

  // Handle wicket delivery in batsman account
  const handleCurrentBall = (run) => {
    // console.log("Added Entry to batter1");

    if (!isNoBall) {
      if (batter1.onStrike) {
        setBatter1((state) => {
          const updatedRun = state.run + run;
          const updatedBall = state.ball + 1;
          const sr = Math.round((updatedRun / updatedBall) * 100 * 100) / 100;
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            strikeRate: sr,
          };
        });
      } else {
        setBatter2((state) => {
          const updatedRun = state.run + run;
          const updatedBall = state.ball + 1;
          const sr = Math.round((updatedRun / updatedBall) * 100 * 100) / 100;
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            strikeRate: sr,
          };
        });
      }
    }
    if(inningNo === 2){
      if(!isNoBall){
        setRemainingBalls(remainingBalls-1);
      }
    }
  };

  //////

  // Base Logic
  const undoRun = (run, isNoBallParam, iswideballParam, isLbParam) => {
    if (isNoBallParam || iswideballParam) {
      setTotalRuns(totalRuns - (run + 1));
      setRunsByOver(runsByOver - (run + 1));
    } else {
      setTotalRuns(totalRuns - run);
      setRunsByOver(runsByOver - run);
      setBallCount(ballCount - 1);
      setTotalOvers(Math.round((totalOvers - 0.1) * 10) / 10);
      if(!isLbParam){
       currentRunStack.pop();
       setCurrentRunStack(currentRunStack);
      }
    }
    if (batter1.onStrike) {
      if (run % 2 === 0) {
        setBatter1((state) => {
          const updatedRun = (!iswideballParam && !isLbParam)?((state.run>=run) ? state.run - run : 0):state.run;
          const updatedBall = (!isNoBallParam && !iswideballParam && state.ball > 0) ? state.ball - 1 : state.ball;
          const updatedSr = updatedBall !== 0 ? updatedRun / updatedBall : 0;
          const sr =
            Math.round(isNaN(updatedSr) ? 0 : updatedSr * 100 * 100) / 100;
          let four = state.four;
          if (run === 4) {
            four = (four >=1) ? four - 1 : four;
          }
          let six = state.six;
          if (run === 6) {
            six = (six>=1)?six - 1:six;
          }
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            four: four,
            six: six,
            strikeRate: sr,
          };
        });
      } else {
        changeStrikeRadio();
        switchBatterStrike();
        setBatter2((state) => {
          const updatedRun = (!iswideballParam && !isLbParam)?((state.run>=run) ? state.run - run : 0):state.run;
          const updatedBall = (!isNoBallParam && !iswideballParam && state.ball > 0) ? state.ball - 1 : state.ball;
          const updatedSr = updatedBall !== 0 ? updatedRun / updatedBall : 0;
          const sr =
            Math.round(isNaN(updatedSr) ? 0 : updatedSr * 100 * 100) / 100;
          let four = state.four;
          if (run === 4) {
            four = (four >=1) ? four - 1 : four;
          }
          let six = state.six;
          if (run === 6) {
            six = (six>=1)?six - 1:six;
          }
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            four: four,
            six: six,
            strikeRate: sr,
          };
        });
      }
    } else if (batter2.onStrike) {
      if (run % 2 === 0) {
        setBatter2((state) => {
          const updatedRun = (!iswideballParam && !isLbParam)?((state.run>=run) ? state.run - run : 0):state.run;
          const updatedBall = (!isNoBallParam && !iswideballParam && state.ball > 0) ? state.ball - 1 : state.ball;
          const updatedSr = updatedBall !== 0 ? updatedRun / updatedBall : 0;
          const sr =
            Math.round(isNaN(updatedSr) ? 0 : updatedSr * 100 * 100) / 100;
          let four = state.four;
          if (run === 4) {
            four = (four >=1) ? four - 1 : four;
          }
          let six = state.six;
          if (run === 6) {
            six = (six>=1)?six - 1:six;
          }
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            four: four,
            six: six,
            strikeRate: sr,
          };
        });
      } else {
        changeStrikeRadio();
        switchBatterStrike();
        setBatter1((state) => {
          const updatedRun = (!iswideballParam && !isLbParam)?((state.run>=run) ? state.run - run : 0):state.run;
          const updatedBall = (!isNoBallParam && !iswideballParam && state.ball > 0) ? state.ball - 1 : state.ball;
          const updatedSr = updatedBall !== 0 ? updatedRun / updatedBall : 0;
          const sr =
            Math.round(isNaN(updatedSr) ? 0 : updatedSr * 100 * 100) / 100;
          let four = state.four;
          if (run === 4) {
            four = (four >=1) ? four - 1 : four;
          }
          let six = state.six;
          if (run === 6) {
            six = (six>=1)?six - 1:six;
          }
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            four: four,
            six: six,
            strikeRate: sr,
          };
        });
      }
    }
  };

  const undoDelivery = () => {
    if (currentRunStack.length > 0) {
      const last = currentRunStack[currentRunStack.length - 1];
      if (typeof last === "number") {
        console.log("num backup");
        const run = parseInt(last);
        undoRun(run, false);
        /////
        if (inningNo === 2) {
          setRemainingBalls(remainingBalls + 1);
          setRemainingRuns(remainingRuns + run);
        }
        /////
      } else {
        currentRunStack.pop();
        setCurrentRunStack(currentRunStack);
        if (last === "W") {
          console.log("wicket backup");
          undoWicket(false);
          if (inningNo === 2) {
            setRemainingBalls(remainingBalls + 1);
          }
        } else {
          const firstTwoChars = last.slice(0, 2);
          const run = parseInt(last.substr(last.length - 1));
          if (firstTwoChars === "wd") {
            console.log("Wide backup");
            /////
            if (inningNo === 2) {
              // setRemainingBalls(remainingBalls + 1);
              setRemainingRuns(remainingRuns + run + 1);
            }
            /////
            // setTotalRuns(totalRuns - 1);
            setExtras((state) => ({
              ...state,
              total: state.total - (run+1),
              wide: state.wide - 1,
              Lb: state.Lb - run
            }));
            /////
            if (isNaN(run)) {
              setTotalRuns(totalRuns - 1);
              setRunsByOver(runsByOver - 1);
              if (last !== "nb") {
                undoWicket(true);
              }
            } else {
              undoRun(run, false, true, false);
            }
          } else if (firstTwoChars === "Lb") {
            console.log("Legbye backup", run);
            /////
            if (inningNo === 2) {
              setRemainingBalls(remainingBalls + 1);
              setRemainingRuns(remainingRuns + run);
            }
            /////
            setTotalRuns(totalRuns - run);
            setExtras((state) => ({
              ...state,
              total: state.total - run,
              Lb: state.Lb - run,
            }));
            /////
            if (isNaN(run)) {
              setTotalRuns(totalRuns - run);
              setRunsByOver(runsByOver - run);
            } else {
              undoRun(run, false, false, true);
            }
          } else {
            console.log("No ball backup");
            /////
            if (inningNo === 2) {
              // setRemainingBalls(remainingBalls + 1);
              if (isNaN(run)){
                setRemainingRuns(remainingRuns + 1);
              } else {
                setRemainingRuns(remainingRuns + run + 1);
              }
            }
            /////
            // setTotalRuns(totalRuns - 1);
            setExtras((state) => ({
              ...state,
              total: state.total - 1,
              noBall: state.noBall - 1,
            }));
            /////
            if (isNaN(run)) {
              setTotalRuns(totalRuns - 1);
              setRunsByOver(runsByOver - 1);
              if (last !== "nb") {
                undoWicket(true);
              }
            } else {
              undoRun(run, true, false, false);
            }
          }
        }
      }
    }
  };

  // Strick Rotation
  const handleStrikeChange = (e) => {
    changeStrikeRadio(e.target.value);
    if (e.target.value === "strike") {
      switchBatterStrike("batter1");
    } else {
      switchBatterStrike("batter2");
    }
  };

  // Strick Rotation
  const changeStrikeRadio = (strikeParam) => {
    if (strikeParam === undefined) {
      setStrikeValue(strikeValue === "strike" ? "non-strike" : "strike");
    } else {
      setStrikeValue(strikeParam);
    }
  };

  // Strick Rotation
  const switchBatterStrike = (strikeParam) => {
    if (strikeParam === undefined) {
      setBatter1((state) => ({
        ...state,
        onStrike: !state.onStrike,
      }));
      setBatter2((state) => ({
        ...state,
        onStrike: !state.onStrike,
      }));
    } else {
      if (strikeParam === "batter1") {
        setBatter1((state) => ({
          ...state,
          onStrike: true,
        }));
        setBatter2((state) => ({
          ...state,
          onStrike: false,
        }));
      } else if (strikeParam === "batter2") {
        setBatter1((state) => ({
          ...state,
          onStrike: false,
        }));
        setBatter2((state) => ({
          ...state,
          onStrike: true,
        }));
      }
    }
  };

  const handleRun = (run) => {
    if (isNoBall) {
      console.log("No");
      setCurrentRunStack((state) => [...state, "nb" + run]);
      removeNoBallEffect();
    } else if (iswideball) {
      console.log("wide");
      setCurrentRunStack((state) => [...state, "wd" + run]);
      removeWideBallEffect();
    } else if (isLb) {
      console.log("Legby");
      setExtras((state) => ({
        ...state,
        total: state.total + run,
        Lb: state.Lb + run,
      }));
      setBallCount(ballCount + 1);
      setCurrentRunStack((state) => [...state, "Lb" + run]);
      removeLbEffect();
    } else {
      console.log("simple");
      setBallCount(ballCount + 1);
      setCurrentRunStack((state) => [...state, run]);
    }

    setTotalRuns(totalRuns + run);
    setRunsByOver(runsByOver + run);
    
    if (inningNo === 2) {
      if (!isNoBall && !iswideball) {
        setRemainingBalls(remainingBalls - 1);
      }
      setRemainingRuns(remainingRuns - run);
    }

    /////////
    if(iswideball){
     console.log("Legby");
      setExtras((state) => ({
        ...state,
        total: state.total + run,
        Lb: state.Lb + run,
      }));
    }

    if (ballCount === 5) {
      if (isNoBall || iswideball) {
        if (run % 2 !== 0) {
          changeStrikeRadio();
        }
      } else {
        setTotalOvers(overCount + 1);
        const arr = [...currentRunStack];
        arr.push(run);
        overCompleted(runsByOver + run, arr);
        if (run % 2 === 0) {
          changeStrikeRadio();
        }
      }
    } else {
      if (!isNoBall && !iswideball) {
        setTotalOvers(Math.round((totalOvers + 0.1) * 10) / 10);
      }

      if (run % 2 !== 0) {
        changeStrikeRadio();
      }
    }

    if (batter1.onStrike) {
      setBatter1((state) => {
        const updatedRun = !isLb && !iswideball ? state.run + run :state.run;
        var updatedBall =
          !isNoBall && !iswideball ? state.ball + 1 : state.ball;
        // const updatedBall = state.ball + 1
        const sr =
          updatedBall > 0
            ? Math.round((updatedRun / updatedBall) * 100 * 100) / 100
            : 0;
        let four = state.four;
        if (run === 4) {
          four = !isLb && !iswideball ? four + 1 : four;
        }
        let six = state.six;
        if (run === 6) {
          six = !isLb && !iswideball ? six + 1 : six;
        }
        return {
          ...state,
          run: updatedRun,
          ball: updatedBall,
          four: four,
          six: six,
          strikeRate: sr,
        };
      });
      if (isNoBall) {
        if (run % 2 !== 0) {
          switchBatterStrike();
        }
      } else {
        if (
          (ballCount === 5 && run % 2 === 0) ||
          (ballCount !== 5 && run % 2 !== 0)
        ) {
          switchBatterStrike();
        }
      }
    } else {
      setBatter2((state) => {
        const updatedRun = !isLb && !iswideball ? state.run + run :state.run;
        var updatedBall =
          !isNoBall && !iswideball ? state.ball + 1 : state.ball;

        // const updatedBall = state.ball + 1
        const sr =
          updatedBall > 0
            ? Math.round((updatedRun / updatedBall) * 100 * 100) / 100
            : 0;
        let four = state.four;
        if (run === 4) {
          four = !isLb && !iswideball ? four + 1 : four;
        }
        let six = state.six;
        if (run === 6) {
          six = !isLb && !iswideball ? six + 1 : six;
        }
        return {
          ...state,
          run: updatedRun,
          ball: updatedBall,
          four: four,
          six: six,
          strikeRate: sr,
        };
      });
      if (
        (ballCount === 5 && run % 2 === 0) ||
        (ballCount !== 5 && run % 2 !== 0)
      ) {
        switchBatterStrike();
      }
    }
  };

  const handleNoBall = () => {
    if(isNoBall === false && iswideball === false && isLb === false){
    if (inningNo === 2) {
      setRemainingRuns(remainingRuns - 1);
    }
    setTotalRuns(totalRuns + 1);
    setRunsByOver(runsByOver + 1);
    setExtras((state) => ({
      ...state,
      total: state.total + 1,
      noBall: state.noBall + 1,
    }));
    }
    addNoBallEffect();
  };
  
  const addNoBallEffect = () => {
    const scoreTypesButtons = document.querySelectorAll(".INACTIVE");
    console.log(scoreTypesButtons);
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].classList.add("score-types-button-noball");
    }
    setTimeout(() => {
    disableScoreButtons(".ACTIVE");
    }, 0);

    setNoBall(true);
  };

  const removeNoBallEffect = () => {
    const scoreTypesButtons = document.querySelectorAll(".INACTIVE");
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].classList.remove("score-types-button-noball");
    }
    enableScoreButtons(".ACTIVE");////
    setNoBall(false);
  };

  const handleWide = () => {
    
    if (isNoBall) {
      setCurrentRunStack((state) => [...state, "nb"]);
      removeNoBallEffect();
    } else {
      if (inningNo === 2) {
        setRemainingRuns(remainingRuns - 1);
      }
      // setCurrentRunStack((state) => [...state, 'wd'])
      setTotalRuns(totalRuns + 1);
      setRunsByOver(runsByOver + 1);
      setExtras((state) => ({
        ...state,
        total: state.total + 1,
        wide: state.wide + 1,
      }));
      addWideBallEffect();
    }
  };

  const addWideBallEffect = () => {
    const scoreTypesButtons = document.querySelectorAll(".INACTIVE1");
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].classList.add("score-types-button-noball");
    }
    setTimeout(() => {
    disableScoreButtons(".ACTIVE1");
    }, 0);
    setwideBall(true);
  };

  const removeWideBallEffect = () => {
    const scoreTypesButtons = document.querySelectorAll(".INACTIVE1");
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].classList.remove("score-types-button-noball");
    }
    enableScoreButtons(".ACTIVE1");////
    setwideBall(false);
  };
  
  //////
  const handleLb = () => {
    if (isNoBall) {
      setCurrentRunStack((state) => [...state, "nb"]);
      removeNoBallEffect();
    } 
    addLbEffect();
  };

  const addLbEffect = () => {
    const scoreTypesButtons = document.querySelectorAll(".INACTIVE1");
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].classList.add("score-types-button-noball");
    }
    setTimeout(() => {
    disableScoreButtons(".ACTIVE1");
    }, 0);
    setLb(true);
  };

  const removeLbEffect = () => {
    const scoreTypesButtons = document.querySelectorAll(".INACTIVE1");
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].classList.remove("score-types-button-noball");
    }
    enableScoreButtons(".ACTIVE1");////
    setLb(false);
  };
  //////
  const handleWicket = (isRunOut, playerId) => {
    setRunOutPlayerId("");
    if (ballCount === 5) {
      if (isNoBall) {
        removeNoBallEffect();
        if (isRunOut) {
          setCurrentRunStack((state) => [...state, "nbW"]);
          setWicketCount(wicketCount + 1);
          disableAllScoreButtons();
        } else {
          setCurrentRunStack((state) => [...state, "nb"]);
        }
      } else {
        setTotalOvers(overCount + 1);
        const arr = [...currentRunStack];
        arr.push("W");
        overCompleted(runsByOver, arr);
        setWicketCount(wicketCount + 1);
        disableAllScoreButtons();
      }
    } else {
      if (isNoBall) {
        removeNoBallEffect();
        if (isRunOut) {
          setCurrentRunStack((state) => [...state, "nbW"]);
          setWicketCount(wicketCount + 1);
          disableAllScoreButtons();
        } else {
          setCurrentRunStack((state) => [...state, "nb"]);
        }
      } else {
        setBallCount(ballCount + 1);
        setCurrentRunStack((state) => [...state, "W"]);
        setTotalOvers(Math.round((totalOvers + 0.1) * 10) / 10);
        setWicketCount(wicketCount + 1);
        disableAllScoreButtons();
      }
    }
    if (isRunOut) {
      if (batter1.id === playerId) {
        newBatter1();
        changeStrikeRadio("strike");
        switchBatterStrike("batter1");
      } else {
        newBatter2();
        changeStrikeRadio("non-strike");
        switchBatterStrike("batter2");
      }
    } else {
      if (!isNoBall) {
        if (batter1.onStrike) {
          newBatter1();
        } else {
          newBatter2();
        }
      }
    }
    if (isNoBall) {
      if (isRunOut && wicketCount + 1 === TotalWicket) {
        const endInningButton = document.getElementById("end-inning");
        endInningButton.disabled = false;
        const bowlerNameElement = document.querySelector(
          ".react-autosuggest__input"
        );
        bowlerNameElement.disabled = true;
        const batter1NameElement = document.getElementById("batter1Name");
        batter1NameElement.disabled = true;
        const batter2NameElement = document.getElementById("batter2Name");
        batter2NameElement.disabled = true;
        setInputBowler("");
      }
    } else {
      if (wicketCount + 1 === TotalWicket) {
        const endInningButton = document.getElementById("end-inning");
        endInningButton.disabled = false;
        const bowlerNameElement = document.querySelector(
          ".react-autosuggest__input"
        );
        bowlerNameElement.disabled = true;
        const batter1NameElement = document.getElementById("batter1Name");
        batter1NameElement.disabled = true;
        const batter2NameElement = document.getElementById("batter2Name");
        batter2NameElement.disabled = true;
        setInputBowler("");
      }
    }
  };

  const handleCloseModal = () => {
    if (outType !== "") {
      if (outType === RUN_OUT) {
        if (runOutPlayerId !== "") {
          handleWicket(true, runOutPlayerId);
        }
      } else {
        handleWicket(false, "");
      }
    }
    setModalOpen(false);
    setOutType("");
    setRunOutPlayerId("");
  };

  const handleOutTypeChange = (e) => {
    const outTypeValue = e.target.value;
    setOutType(outTypeValue);
    if (outTypeValue === RUN_OUT) {
      const runOutPlayerElement = document.getElementById("run-out-player");
      runOutPlayerElement.classList.remove("hide");
      const runOutPlayerErrorElement = document.getElementById(
        "run-out-player-error"
      );
      runOutPlayerErrorElement.classList.remove("hide");
    }
  };

  const handleRunOutPlayerChange = (e) => {
    const playerId = e.target.value;
    const runOutPlayerErrorElement = document.getElementById(
      "run-out-player-error"
    );
    runOutPlayerErrorElement.classList.add("hide");
    setRunOutPlayerId(playerId);
  };

  // INACTIVE KEYPAD
  const disableAllScoreButtons = () => {
    const scoreTypesButtons = document.querySelectorAll(".score-types-button");
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].disabled = true;
    }
  };

  // ACTIVE KEYPAD
  const enableAllScoreButtons = () => {
    const scoreTypesButtons = document.querySelectorAll(".score-types-button");
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].disabled = false;
    }
  };

const disableScoreButtons = (className) => {
  const scoreTypesButtons = document.querySelectorAll(className);
  for (let i = 0; i < scoreTypesButtons.length; i++) {
    scoreTypesButtons[i].disabled = true;
  }
};

const enableScoreButtons = (className) => {
  const scoreTypesButtons = document.querySelectorAll(className);
  for (let i = 0; i < scoreTypesButtons.length; i++) {
    scoreTypesButtons[i].disabled = false;
  }
};

  if (
    batter1.name !== undefined &&
    batter2.name !== undefined &&
    inputBowler !== ""
  ) {
    enableAllScoreButtons();
  }

  let rrr = (remainingRuns / (remainingBalls / 6)).toFixed(2);
  rrr = isFinite(rrr) ? rrr : 0;
  const overs = overCount + ballCount / 6;
  let crr = (totalRuns / overs).toFixed(2);
  crr = isFinite(crr) ? crr : 0;

  const inning1 = match.inning1;
  const inning2 = match.inning2;

  const scoringTeam = batting === team1 ? team1 : team2;
  const chessingTeam = scoringTeam === team1 ? team2 : team1;

  let winningMessage = `${
    inningNo === 1 ? scoringTeam : chessingTeam
  } needs ${remainingRuns} ${
    remainingRuns <= 1 ? "run" : "runs"
  } in ${remainingBalls} ${remainingBalls <= 1 ? "ball" : "balls"} to win`;

  if (inningNo === 2) {
    var target = inning1.runs + 1;
    if (wicketCount < TotalWicket && overCount <= maxOver && totalRuns >= target) {
      winningMessage = `${chessingTeam} won by ${TotalWicket - wicketCount} wickets`;
      endMatch();
    }
    if ((wicketCount >= TotalWicket || overCount >= maxOver) && totalRuns < target - 1) {
      winningMessage = `${scoringTeam} won by ${target - totalRuns - 1} runs`;
      endMatch();
    }
    if (wicketCount < TotalWicket && overCount === maxOver && totalRuns === target - 1) {
      winningMessage = "Match Tied";
      endMatch();
    }
  }

const tossContent = (
  <>
    {matchData && (
      <p>
        {matchData.tossWinner} won the toss & chose {matchData.decision}
      </p>
    )}
    {/* <p>
      {tossWinner} won the toss & chose {decision}
    </p> */}
  </>
);

  // Notice
  const welcomeContent = (
    <>
      <div></div>
      <div>Welcome to TPL</div>
      <div></div>
    </>
  );

  // Notice overCount === maxOver wicketCount === 10 cnd for innning completed
  const firstInningCompletedContent = (
    <>
      {overCount === maxOver && <div>1st inning completed</div>}
      {wicketCount === TotalWicket && <div>All Out</div>}
      <div>Please click "End Inning" button</div>
    </>
  );

  const firstInningCompletedContent1 = (
    <>
      {liveData && matchData && liveData.overCount === matchData.maxOver && <div>1st inning completed</div>}
      <div>Break Time</div>
    </>
  );

  // Notice
const remainingRunsContent = (
      <>
        <div>Target: {target}</div>
        <div>{winningMessage}</div>
        <div>RRR: {isNaN(rrr) ? 0 : rrr}</div>
      </>
);

const remainingRunsContent3 = (
      <>
        <div>{winningMessage}</div>
        {(liveData && !liveData.hasMatchEnded) ? <div>Please click "ScoreCard" button</div> : <div>Please click "Save" button</div> }
      </>
);

const remainingRunsContent1 = (
      <>
        <div>Target: {liveData?.target}</div>
        <div>{liveData?.winningMessage}</div>
        <div>RRR: {isNaN(liveData?.rrr) ? 0 : liveData?.rrr}</div>
      </>
);

const remainingRunsContent2 = (
      <>
        <div>Target: {liveData?.target}</div>
        <div>Match Ended</div>
        <div>RRR: {isNaN(liveData?.rrr) ? 0 : liveData?.rrr}</div>
      </>
);

  const winnerCard3 = (
    <>
      <p>{winningMessage}</p>
    </>
  );

  const winnerCard31 = (
    <>
      <p>{liveData?.winningMessage}</p>
    </>
  );

  const winnerCard2 = (
    <>
      <p>Break Time</p>
    </>
  );

  return (
    // main container
    <div className="container">
      {!props.Admin && props.newMatch && (<AutoRefresh />)}
      {/* Title Heading */}
      {!props.newMatch && (
        // Show match title and buttons if newmatch is true
        <AppBar position="fixed">
          <Toolbar
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">WELCOME</Typography>
          </Toolbar>
        </AppBar>
      )}

      {props.newMatch && (
        <div className="inning">
          <div className="tag">
            <div className="TitleTag">
              <div>
                {team1} vs {team2}
              </div>
            </div>
            <div>
              {/* User */}
              {!props.Admin && props.newMatch && <div className="Active">LIVE</div>}
              {props.newMatch && props.Admin &&  (
                <button id="end-inning" onClick={handleEndInning}>
                  {(liveData && !liveData.hasMatchEnded) ? inningNo === 1 ? (overCount === maxOver || wicketCount === TotalWicket ? "End Inning" : "live")  : ((overCount === maxOver || target <= totalRuns || wicketCount === TotalWicket || remainingBalls === 0 || remainingRuns === 0) ? "Score Board" : "live"): "Save"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notice */}
      <div
        id="badge"
        className="badge badge-flex"
        style={{ marginTop: props.newMatch ? "0" : "64px" }}
      > 
        {props.Admin ? (props.newMatch
          ? inningNo === 2
            ? (remainingBalls === 0 ? remainingRunsContent3 : remainingRunsContent )
            : overCount === maxOver || wicketCount === TotalWicket
            ? firstInningCompletedContent
            : welcomeContent
          : welcomeContent):(liveData && matchData && props.newMatch ? (liveData.inningNo === 2 ? (liveData.remainingBalls === 0 ? remainingRunsContent2 : remainingRunsContent1 ): (liveData.overCount === matchData.maxOver || liveData.wicketCount === TotalWicket  ? firstInningCompletedContent1: welcomeContent)): welcomeContent)}
      </div>
      
      {/* edit*/}
      <div className="score-container">
        {/* Wicket Types */}
        <div>
          <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={radioGroupBoxstyle}>
              <FormControl
                component="fieldset"
                sx={{
                  display: "flex",
                  flexDirection: "column", // Ensure radio buttons are stacked vertically
                  alignItems: "center",
                  justifyContent: "center",
                  margin: 2,
                }}
              >
                <RadioGroup
                  row
                  aria-label="wicket"
                  name="row-radio-buttons-group"
                  onChange={handleOutTypeChange}
                  sx={{
                    display: "flex",
                    flexDirection: "column", // Ensure radio buttons are stacked vertically
                    alignItems: "flex-start",
                    justifyContent: "center",
                    marginBottom: 2,
                  }}
                >
                  <FormControlLabel
                    value={CATCH}
                    control={
                      <Radio
                        sx={{
                          "&.Mui-checked": {
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
                          "&.Mui-checked": {
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
                          "&.Mui-checked": {
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
                          "&.Mui-checked": {
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
                          "&.Mui-checked": {
                            color: pink[600],
                          },
                        }}
                      />
                    }
                    label={RUN_OUT}
                  />
                  <select
                    defaultValue=""
                    id="run-out-player"
                    className="run-out-player hide"
                    onChange={handleRunOutPlayerChange}
                  >
                    <option value="" disabled>
                      select option
                    </option>
                    <option value={batter1.id}>{batter1.name}</option>
                    <option value={batter2.id}>{batter2.name}</option>
                  </select>
                </RadioGroup>
                <div
                  id="run-out-player-error"
                  className="run-out-player-error hide"
                >
                  Please select run out player name
                </div>
              </FormControl>
            </Box>
          </Modal>
        </div>
        {/* Navigation */}
        <div className="tabs">
          <button
            className={`tab ${
              activeSection === "matchInfo" ? "active-tab" : ""
            }`}
            onClick={() => setActiveSection("matchInfo")}
          >
            Match
          </button>
          <button
            className={`tab ${
              activeSection === "liveScore" ? "active-tab" : ""
            }`}
            onClick={() => setActiveSection("liveScore")}
          >
            Live Score
          </button>
          <button
            className={`tab ${
              activeSection === "scoreCard" ? "active-tab" : ""
            }`}
            onClick={() => setActiveSection("scoreCard")}
          >
            Scorecard
          </button>
          <button
            className={`tab ${activeSection === "result" ? "active-tab" : ""}`}
            onClick={() => setActiveSection("result")}
          >
            Results
          </button>
          {props.Admin && (
            <button
              className={`tab ${
                activeSection === "setting" ? "active-tab" : ""
              }`}
              onClick={() => setActiveSection("setting")}
            >
              Settings
            </button>
          )}
        </div>
        {/* All section */}
        <div>
          {(activeSection === "matchInfo" ||
            activeSection === "liveScore" ||
            activeSection === "scoreCard" ) &&
            activeSection !== "result" &&
            activeSection !== "setting" &&
            !props.newMatch && (
              <div className="Imgdiv">
                <img
                  className="NoMatchLive"
                  src="/images/Photo7.jpg"
                  alt="No match available"
                />
              </div>
            )}

          {/*Section 1 :  Match Info */}
          {activeSection === "matchInfo" && matchData && liveData && props.newMatch && (
  <div id="matchinfo">
    <div className="container1">
      <div className="info-container">
        <table className="info-table">
          <tbody>
            <tr>
              <td className="label1">Info</td>
              <td className="label1"></td>
            </tr>
            <tr>
              <td className="label">Match</td>
              <td className="value">
                {matchData.team1} vs {matchData.team2}
              </td>
            </tr>
            <tr>
              <td className="label">Inning</td>
              {/* <td className="value">{inningNo === 1 ? "1st" : "2nd"}</td> */}
              <td className="value">{liveData.inningNo === 1 ? "1st" : "2nd"}</td>
            </tr>
            <tr>
              <td className="label">Series</td>
              <td className="value">TPL</td>
            </tr>
            <tr>
              <td className="label">Match Type</td>
              <td className="value">Underarm turf cricket</td>
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
              <td className="value">
                {matchData.tossWinner} won & chose {matchData.decision}
              </td>
            </tr>
            <tr>
              <td className="label1">Venue Guide</td>
              <td className="label1"></td>
            </tr>
            <tr>
              <td className="label">Stadium</td>
              <td className="value">Mira Road, Mumbai</td>
            </tr>
            <tr>
              <td className="label">City</td>
              <td className="value">Mumbai</td>
            </tr>
            <tr>
              <td className="label">Country</td>
              <td className="value">India</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
          )}

          {/*Section 2 :  Live Score */}
          {activeSection === "liveScore" && matchData && liveData && props.newMatch && (
              <div id="liveScore">
                {/* User panel */}
                <div className="score-container1">
                  <div className="Tag">
                    <div className="First">
                      <div className="Data"><div className="Circle"></div>
                      <div className="upcoming">Live</div> </div>
                    </div>
                  </div>

                  <div className="team-score1">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {scoringTeam}
                      {liveData.inningNo === 1 && (
                        <SportsCricketIcon
                          style={{
                            marginLeft: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        /> // Bat symbol for scoring team
                      )}
                    </div>
                    {props.Admin ? <span className="score1">
                      {inningNo === 1 ? totalRuns : inning1.runs}-
                      {inningNo === 1 ? wicketCount : inning1.wickets} (
                      {inningNo === 1 ? totalOvers : inning1.overs})
                    </span>:<span className="score1">
                      `{liveData.inningNo === 1 ? liveData.totalRuns : liveData.inning1.runs}-
                      {liveData.inningNo === 1 ? liveData.wicketCount : liveData.inning1.wickets} (
                      {liveData.inningNo === 1 ? liveData.totalOvers : liveData.inning1.overs})
                    </span>}
                  </div>

                  <div className="team-score1">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {chessingTeam}
                      {liveData.inningNo !== 1 && (
                        <SportsCricketIcon style={{ marginLeft: "8px" }} /> // Bat symbol for chasing team
                      )}
                    </div>
                    {props.Admin ? <span className="score1">
                      {inningNo === 1
                        ? `0-0 (0)`
                        : `${hasMatchEnded ? inning2.runs : totalRuns}-${
                            hasMatchEnded ? inning2.wickets : wicketCount
                          } (${hasMatchEnded ? inning2.overs : totalOvers})`}
                    </span> :<span className="score1">
                      {liveData.inningNo === 1
                        ? `0-0 (0)`
                        : `${liveData.hasMatchEnded ? liveData.inning2.runs : liveData.totalRuns}-${
                            liveData.hasMatchEnded ? liveData.inning2.wickets : liveData.wicketCount
                          } (${liveData.hasMatchEnded ? liveData.inning2.overs : liveData.totalOvers})`}
                    </span>}
                  </div>

                  <div className="line"></div>

                  <div className="result">
                    {props.Admin ? (inningNo === 2
                      ? winnerCard3
                      : overCount === maxOver || wicketCount === TotalWicket
                      ? winnerCard2
                      : tossContent) : (liveData.inningNo === 2
                      ? winnerCard31
                      : liveData.overCount === matchData.maxOver || liveData.wicketCount === TotalWicket
                      ? winnerCard2
                      : tossContent)}
                  </div>
                </div>
                {/* Admin panel */}
                {props.Admin && (
                  <div>
                    {/*Score Line*/}
                    <div className="score">
                      <div>
                        {inningNo === 1 ? scoringTeam : chessingTeam} :{" "}
                        {totalRuns}/{wicketCount} ({totalOvers}/{maxOver})
                      </div>
                      <div>CRR : {isNaN(crr) ? 0 : crr}</div>
                    </div>
                    {/* Batter */}
                    <div className="batting-container">
                      <table>
                        <thead>
                          <tr>
                            <td className="score-types">
                              <div className="batter">Batter</div>
                            </td>
                            <td className="score-types text-center">R</td>
                            <td className="score-types text-center">B</td>
                            <td className="score-types text-center">4s</td>
                            <td className="score-types text-center">6s</td>
                            <td className="score-types text-center">SR</td>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Batter 1 */}
                          <tr>
                            <td className="score-types">
                              <span id="strike">
                                <Radio
                                  size="small"
                                  checked={strikeValue === "strike"}
                                  value="strike"
                                  onChange={handleStrikeChange}
                                  name="radio-buttons"
                                  inputProps={{ "aria-label": "strike" }}
                                  style={{ padding: "0 4px 0 2px" }}
                                />
                              </span>
                              <input
                                type="text"
                                value={batter1.name}
                                id="batter1Name"
                                className="batter-name"
                                onBlur={handleBatter1Blur}
                              />
                              <IconButton
                                color="primary"
                                className="icon-button"
                                onClick={editBatter1Name}
                              >
                                <EditIcon className="icon-size" />
                              </IconButton>
                            </td>
                            <td className="score-types text-center">
                              {batter1.run === undefined ? 0 : batter1.run}
                            </td>
                            <td className="score-types text-center">
                              {batter1.ball === undefined ? 0 : batter1.ball}
                            </td>
                            <td className="score-types text-center">
                              {batter1.four === undefined ? 0 : batter1.four}
                            </td>
                            <td className="score-types text-center">
                              {batter1.six === undefined ? 0 : batter1.six}
                            </td>
                            <td className="score-types text-center">
                              {batter1.strikeRate === undefined
                                ? 0
                                : batter1.strikeRate}
                            </td>
                          </tr>
                          {/* Batter 2 */}
                          <tr>
                            <td className="score-types">
                              <span id="non-strike">
                                <Radio
                                  size="small"
                                  checked={strikeValue === "non-strike"}
                                  value="non-strike"
                                  onChange={handleStrikeChange}
                                  name="radio-buttons"
                                  inputProps={{ "aria-label": "non-strike" }}
                                  style={{ padding: "0 4px 0 2px" }}
                                />
                              </span>
                              <input
                                type="text"
                                value={batter2.name}
                                id="batter2Name"
                                className="batter-name"
                                onBlur={handleBatter2Blur}
                              />
                              <IconButton
                                color="primary"
                                className="icon-button"
                                onClick={editBatter2Name}
                              >
                                <EditIcon className="icon-size" />
                              </IconButton>
                            </td>
                            <td className="score-types text-center">
                              {batter2.run === undefined ? 0 : batter2.run}
                            </td>
                            <td className="score-types text-center">
                              {batter2.ball === undefined ? 0 : batter2.ball}
                            </td>
                            <td className="score-types text-center">
                              {batter2.four === undefined ? 0 : batter2.four}
                            </td>
                            <td className="score-types text-center">
                              {batter2.six === undefined ? 0 : batter2.six}
                            </td>
                            <td className="score-types text-center">
                              {batter2.strikeRate === undefined
                                ? 0
                                : batter2.strikeRate}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {/* Bowler */}
                    <div className="bowler-container">
                      <div className="bowler">
                        <div className="One">
                          Bowler
                          <Autosuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={
                              onSuggestionsFetchRequested
                            }
                            onSuggestionsClearRequested={() => {
                              setSuggestions([]);
                            }}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={(suggestion) => (
                              <div>{suggestion.name}</div>
                            )}
                            inputProps={inputProps}
                          />
                          <IconButton
                            color="primary"
                            className="icon-button"
                            onClick={editBowlerName}
                          >
                            <EditIcon className="icon-size" />
                          </IconButton>
                        </div>
                        <div className="Options">
                        {/* <div className="Two1">
                          <div>EDIT</div>
                          <IconButton
                            color="blue"
                            className="icon-button"
                            onClick={enableScoreButtons(".score-types-button")}
                          >
                             <EditIcon className="icon-size1" />
                          </IconButton>
                        </div> */}
                        <div className="Two">
                          <div>UNDO</div>
                          <IconButton
                            color="warning"
                            className="icon-button"
                            onClick={undoDelivery}
                          >
                            <DeleteIcon className="delete-icon-size" />
                          </IconButton>
                        </div>
                        </div>

                      </div>
                      <div className="bowler-runs">
                        {currentRunStack.map((run, i) => (
                          <div key={i}>{run}</div>
                        ))}
                      </div>
                    </div>
                    {/* Keypad */}
                    <div className="score-types-container">
                      <table>
                        <tbody>
                          <tr>
                            <td
                              className="score-types"
                              onClick={() => handleRun(0)}
                            >
                              <button className="INACTIVE INACTIVE1 score-types-button" disabled>
                                0
                              </button>
                            </td>
                            <td
                              className="score-types"
                              onClick={() => handleRun(1)}
                            >
                              <button className="INACTIVE INACTIVE1 score-types-button" disabled>
                                1
                              </button>
                            </td>
                            <td
                              className="score-types"
                              onClick={() => handleRun(2)}
                            >
                              <button className="INACTIVE INACTIVE1 score-types-button" disabled>
                                2
                              </button>
                            </td>
                            <td className="score-types" onClick={() => {handleNoBall()}}>
                              <button className="ACTIVE ACTIVE1 score-types-button" disabled>
                                nb
                              </button>
                            </td>
                            <td
                              className="score-types"
                              onClick={() => {
                                setModalOpen(true);
                                handleCurrentBall(0);
                              }}
                            >
                              <button className="INACTIVE ACTIVE1 score-types-button" disabled>
                                W
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td
                              className="score-types"
                              onClick={() => handleRun(3)}
                            >
                              <button className="INACTIVE INACTIVE1 score-types-button" disabled>
                                3
                              </button>
                            </td>
                            <td
                              className="score-types"
                              onClick={() => handleRun(4)}
                            >
                              <button className="INACTIVE INACTIVE1 score-types-button" disabled>
                                4
                              </button>
                            </td>
                            <td
                              className="score-types"
                              onClick={() => handleRun(6)}
                            >
                              <button className="INACTIVE INACTIVE1 score-types-button" disabled>
                                6
                              </button>
                            </td>
                            <td className="score-types" onClick={handleWide}>
                              <button className="ACTIVE ACTIVE1 score-types-button" disabled>
                                wd
                              </button>
                            </td>
                            <td className="score-types" onClick={handleLb}>
                              <button className="ACTIVE ACTIVE1 score-types-button" disabled>
                                lb
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {/* Extra Run */}
                    <div className="extras-container">
                      <div>Extras</div>
                      <div className="extra">
                        <div>Total: {extras.total}</div>
                        <div>Wd: {extras.wide}</div>
                        <div>Nb: {extras.noBall}</div>
                        <div>Lb: {extras.Lb}</div>
                      </div>
                    </div>
                    {/* Recent Over */}
                    <div className="recent-over-container">
                      <div className="recent-over-text">Recent Overs</div>
                      <div className="recent-over-details">
                        <table>
                          <thead className="Recent1">
                            <tr>
                              <th>Over</th>
                              <th>Bowler</th>
                              <th>Summary</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody className="Recent2">
                            {recentOvers.map((recentOver, i) => (
                              <tr key={i}>
                                <td className="text-center">
                                  {recentOver.overNo}
                                </td>
                                <td className="text-center">
                                  {recentOver.bowler}
                                </td>
                                <td>
                                  <div className="recent-over-runs">
                                    {recentOver.stack.map((run, index) => (
                                      <div key={index}>{run}</div>
                                    ))}
                                  </div>
                                </td>
                                <td className="recent-over-total-run">
                                  <div>{recentOver.runs}</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
          )}
          
          {/*Section 3 :  Score Card*/}
          {activeSection === "scoreCard" && liveData && props.newMatch && (
            <div id="scoreCard">
              {/* Scorecard */}
              <div className="score-board-container">
                <div className="score-board-text text-center">Score Board</div>
                {/* Inning1 Starts here */}
                <div>
                  <div className="score-board-innings" onClick={toggleSlide1}>
                    <div>{scoringTeam} ( 1st Innings )</div>
                    {/* <div>
                      {inningNo === 1 ? totalRuns : inning1.runs}-
                      {inningNo === 1 ? wicketCount : inning1.wickets} (
                      {inningNo === 1 ? totalOvers : inning1.overs} Ov)
                    </div> */}
                       {props.Admin ? <div>
                      {inningNo === 1 ? totalRuns : inning1.runs}-
                      {inningNo === 1 ? wicketCount : inning1.wickets} (
                      {inningNo === 1 ? totalOvers : inning1.overs} Ov)
                      </div>:<div>
                      {liveData.inningNo === 1 ? liveData.totalRuns : liveData.inning1.runs}-
                      {liveData.inningNo === 1 ? liveData.wicketCount : liveData.inning1.wickets} (
                      {liveData.inningNo === 1 ? liveData.totalOvers : liveData.inning1.overs} Ov)
                     </div>}
                  </div>
                  {isSlideOpen1 && liveData.inningNo === 2 && (
                    <div className="sliding-panel">
                      {/* batting 1 */}
                      <div className="sb-batting">
                        <table>
                          <thead>
                            <tr>
                              <td className="score-types padding-left">
                                <div className="sb">Batter</div>
                              </td>
                              <td className="score-types text-center data">
                                R
                              </td>
                              <td className="score-types text-center data">
                                B
                              </td>
                              <td className="score-types text-center data">
                                4s
                              </td>
                              <td className="score-types text-center data">
                                6s
                              </td>
                              <td className="score-types text-center data">
                                SR
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            {liveData.inning1.batters.map((batter, i) => {
                              return (
                                <tr key={i}>
                                  <td className="score-types padding-left">
                                    <div className="sb">{batter.name}</div>
                                  </td>
                                  <td className="score-types text-center data">
                                    {batter.run}
                                  </td>
                                  <td className="score-types text-center data">
                                    {batter.ball}
                                  </td>
                                  <td className="score-types text-center data">
                                    {batter.four}
                                  </td>
                                  <td className="score-types text-center data">
                                    {batter.six}
                                  </td>
                                  <td className="score-types text-center data">
                                    {batter.strikeRate}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      {/* bowling 1 */}
                      <div className="sb-bowling">
                        <table>
                          <thead>
                            <tr>
                              <td className="score-types padding-left">
                                <div className="sb">Bowler</div>
                              </td>
                              <td className="score-types text-center data">
                                O
                              </td>
                              <td className="score-types text-center data">
                                M
                              </td>
                              <td className="score-types text-center data">
                                R
                              </td>
                              <td className="score-types text-center data">
                                W
                              </td>
                              {/* <td className='score-types text-center'>NB</td>
                    <td className='score-types text-center'>WD</td> */}
                              <td className="score-types text-center data">
                                ECO
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            {liveData.inning1.bowlers.map((blr, i) => {
                              // noBall, wide,
                              const {
                                name,
                                over,
                                maiden,
                                run,
                                wicket,
                                economy,
                              } = blr;
                              return (
                                <tr key={i}>
                                  <td className="score-types padding-left">
                                    <div className="sb">{name}</div>
                                  </td>
                                  <td className="score-types text-center data">
                                    {over}
                                  </td>
                                  <td className="score-types text-center data">
                                    {maiden}
                                  </td>
                                  <td className="score-types text-center data">
                                    {run}
                                  </td>
                                  <td className="score-types text-center data">
                                    {wicket}
                                  </td>
                                  {/* <td className='score-types text-center'>{noBall}</td>
                        <td className='score-types text-center'>{wide}</td> */}
                                  <td className="score-types text-center data">
                                    {economy}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      {/* Extra */}
                      <div className="extras-container">
                        <div>Extras</div>
                        <div className="extra">
                          <div>
                            Total:{" "}
                            {liveData.inningNo === 1
                              ? liveData.extras.total
                              : liveData.inning1.extras.total}
                          </div>
                          <div>
                            Wd:{" "}
                            {liveData.inningNo === 1 ? liveData.extras.wide : liveData.inning1.extras.wide}
                          </div>
                          <div>
                            Nb:
                            {liveData.inningNo === 1
                              ? liveData.extras.noBall
                              : liveData.inning1.extras.noBall}
                          </div>
                          <div>
                            Lb:{liveData.inningNo === 1 ? liveData.extras.Lb : liveData.inning1.extras.Lb}
                          </div>
                        </div>
                      </div>
                      {/* Run Rate */}
                      <div className="extras-container">
                        <div>Run Rate</div>
                        <div className="extra">
                          <div>{liveData.inningNo === 1 ? liveData.crr : liveData.inning1.runRate}</div>
                        </div>
                      </div>
                      {/* Total */}
                      <div className="extras-container">
                        <div>Total</div>
                        <div className="extra">
                          {/* <div>
                            {inningNo === 1 ? totalRuns : inning1.runs}-
                            {inningNo === 1 ? wicketCount : inning1.wickets} (
                            {inningNo === 1 ? totalOvers : inning1.overs} Ov)
                          </div> */}
                           {props.Admin ? <div>
                      {inningNo === 1 ? totalRuns : inning1.runs}-
                      {inningNo === 1 ? wicketCount : inning1.wickets} (
                      {inningNo === 1 ? totalOvers : inning1.overs} Ov)
                      </div>:<div>
                      {liveData.inningNo === 1 ? liveData.totalRuns : liveData.inning1.runs}-
                      {liveData.inningNo === 1 ? liveData.wicketCount : liveData.inning1.wickets} (
                      {liveData.inningNo === 1 ? liveData.totalOvers : liveData.inning1.overs} Ov)
                     </div>}
                        </div>
                      </div>
                      {/* Recent Over */}
                      <div className="recent-over-container">
                        <div className="recent-over-text">Recent Overs</div>
                        <div className="recent-over-details">
                          <table>
                            <thead className="Recent1">
                              <tr>
                                <th>Over</th>
                                <th>Bowler</th>
                                <th>Summary</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody className="Recent2">
                              {liveData.inning1.recentOvers.map((recentOver1, i) => (
                                <tr key={i}>
                                  <td className="text-center">
                                    {recentOver1.overNo}
                                  </td>
                                  <td className="text-center">
                                    {recentOver1.bowler}
                                  </td>
                                  <td>
                                    <div className="recent-over-runs">
                                      {recentOver1.stack.map((run, index) => (
                                        <div key={index}>{run}</div>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="recent-over-total-run">
                                    <div>{recentOver1.runs}</div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Inning2 Starts here */}
                <div>
                  <div className="score-board-innings" onClick={toggleSlide2}>
                    <div>{chessingTeam} ( 2nd Innings )</div>
                    <div>
                      {/* {inningNo === 1
                        ? "0-0 (0 Ov)"
                        : `${hasMatchEnded ? inning2.runs : totalRuns}-${
                            hasMatchEnded ? inning2.wickets : wicketCount
                          } (${hasMatchEnded ? inning2.overs : totalOvers} Ov)`}
                        */}
                        {props.Admin ? 
                      <div>{inningNo === 1
                        ? `0-0 (0 Ov)`
                        : `${hasMatchEnded ? inning2.runs : totalRuns}-${
                            hasMatchEnded ? inning2.wickets : wicketCount
                          } (${hasMatchEnded ? inning2.overs : totalOvers} Ov)`}
                      </div>:<div>
                      {liveData.inningNo === 1
                        ? `0-0 (0 Ov)`
                        : `${liveData.hasMatchEnded ? liveData.inning2.runs : liveData.totalRuns}-${
                            liveData.hasMatchEnded ? liveData.inning2.wickets : liveData.wicketCount
                          } (${liveData.hasMatchEnded ? liveData.inning2.overs : liveData.totalOvers} Ov)`}
                      </div>}
                      {/* {hasMatchEnded ? inning2.runs : totalRuns}-{hasMatchEnded ? inning2.wickets : wicketCount} (
                  {hasMatchEnded ? inning2.overs : totalOvers} Ov) */}
                    </div>
                  </div>
                  {isSlideOpen2 && liveData.hasMatchEnded && (
                    <div className="sliding-panel">
                      {/* batting 2 */}
                      <div className="sb-batting">
                        <table>
                          <thead className="sb-bat">
                            <tr>
                              <td className="score-types padding-left">
                                <div className="sb">Batter</div>
                              </td>
                              <td className="score-types text-center data">
                                R
                              </td>
                              <td className="score-types text-center data">
                                B
                              </td>
                              <td className="score-types text-center data">
                                4s
                              </td>
                              <td className="score-types text-center data">
                                6s
                              </td>
                              <td className="score-types text-center data">
                                SR
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            {liveData.inning2.batters.map((batter, i) => {
                              return (
                                <tr key={i}>
                                  <td className="score-types padding-left">
                                    <div className="sb">{batter.name}</div>
                                  </td>
                                  <td className="score-types text-center data">
                                    {batter.run}
                                  </td>
                                  <td className="score-types text-center data">
                                    {batter.ball}
                                  </td>
                                  <td className="score-types text-center data">
                                    {batter.four}
                                  </td>
                                  <td className="score-types text-center data">
                                    {batter.six}
                                  </td>
                                  <td className="score-types text-center data">
                                    {batter.strikeRate}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      {/* bowling 2 */}
                      <div className="sb-bowling">
                        <table>
                          <thead>
                            <tr>
                              <td className="score-types padding-left">
                                <div className="sb">Bowler</div>
                              </td>
                              <td className="score-types text-center data">
                                O
                              </td>
                              <td className="score-types text-center data">
                                M
                              </td>
                              <td className="score-types text-center data">
                                R
                              </td>
                              <td className="score-types text-center data">
                                W
                              </td>
                              {/* <td className='score-types text-center'>NB</td>
                      <td className='score-types text-center'>WD</td> */}
                              <td className="score-types text-center data">
                                ECO
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            {liveData.inning2.bowlers.map((blr, i) => {
                              // noBall, wide
                              const {
                                name,
                                over,
                                maiden,
                                run,
                                wicket,
                                economy,
                              } = blr;
                              return (
                                <tr key={i}>
                                  <td className="score-types padding-left">
                                    <div className="sb">{name}</div>
                                  </td>
                                  <td className="score-types text-center data">
                                    {over}
                                  </td>
                                  <td className="score-types text-center data">
                                    {maiden}
                                  </td>
                                  <td className="score-types text-center data">
                                    {run}
                                  </td>
                                  <td className="score-types text-center data">
                                    {wicket}
                                  </td>
                                  {/* <td className='score-types text-center'>{noBall}</td>
                          <td className='score-types text-center'>{wide}</td> */}
                                  <td className="score-types text-center data">
                                    {economy}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      {/* Extra */}
                      <div className="extras-container">
                        <div>Extras</div>
                        <div className="extra">
                          <div>
                            Total: {liveData.hasMatchEnded ? liveData.inning2.extras.total : 0}
                          </div>
                          <div>
                            Wd: {liveData.hasMatchEnded ? liveData.inning2.extras.wide : 0}
                          </div>
                          <div>
                            Nb:{liveData.hasMatchEnded ? liveData.inning2.extras.noBall : 0}
                          </div>
                          <div>Lb:{liveData.hasMatchEnded ? liveData.inning2.extras.Lb : 0}</div>
                        </div>
                      </div>
                      {/* Run Rate */}
                      <div className="extras-container">
                        <div>Run Rate</div>
                        <div className="extra">
                          <div> {liveData.inningNo === 1 ? "0" : liveData.inning2.runRate}</div>
                        </div>
                      </div>
                      {/* Total */}
                      <div className="extras-container">
                        <div>Total</div>
                        <div className="extra">
                          <div>
                            {/* {inningNo === 1
                              ? "0-0 (0 Ov)"
                              : `${hasMatchEnded ? inning2.runs : totalRuns}-${
                                  hasMatchEnded ? inning2.wickets : wicketCount
                                } (${
                                  hasMatchEnded ? inning2.overs : totalOvers
                                } Ov)`} */}
                                 {props.Admin ? 
                      <div>{inningNo === 1
                        ? `0-0 (0 Ov)`
                        : `${hasMatchEnded ? inning2.runs : totalRuns}-${
                            hasMatchEnded ? inning2.wickets : wicketCount
                          } (${hasMatchEnded ? inning2.overs : totalOvers})`}
                      </div>:<div>
                      {liveData.inningNo === 1
                        ? `0-0 (0 Ov)`
                        : `${liveData.hasMatchEnded ? liveData.inning2.runs : liveData.totalRuns}-${
                            liveData.hasMatchEnded ? liveData.inning2.wickets : liveData.wicketCount
                          } (${liveData.hasMatchEnded ? liveData.inning2.overs : liveData.totalOvers})`}
                      </div>}
                            {/* {hasMatchEnded ? inning2.runs : totalRuns}-{hasMatchEnded ? inning2.wickets : wicketCount} (
                  {hasMatchEnded ? inning2.overs : totalOvers} Ov) */}
                          </div>
                        </div>
                      </div>
                      {/* Recent Over */}
                      <div className="recent-over-container">
                        <div className="recent-over-text">Recent Overs</div>
                        <div className="recent-over-details">
                          <table>
                            <thead className="Recent1">
                              <tr>
                                <th>Over</th>
                                <th>Bowler</th>
                                <th>Summary</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody className="Recent2">
                              {liveData.inning2.recentOvers.map((recentOver, i) => (
                                <tr key={i}>
                                  <td className="text-center">
                                    {recentOver.overNo}
                                  </td>
                                  <td className="text-center">
                                    {recentOver.bowler}
                                  </td>
                                  <td>
                                    <div className="recent-over-runs">
                                      {recentOver.stack.map((run, index) => (
                                        <div key={index}>{run}</div>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="recent-over-total-run">
                                    <div>{recentOver.runs}</div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/*Section 4 :  Result */}
          {activeSection === "result" && scores.length > 0 && scores.map((score, index) => (
              <div className="score-container1" key={index}>
               {props.Admin && (
  <>
    <div className="delete-container">
      <FaTrash className="delete-icon" onClick={() => handleDelete(score._id)} />
    </div>
    <div className="line"></div>
  </>
)}

                
                {/* Live Tag */}
                <div className="Tag">
                  <div className="First">
                    <div className="upcoming">
                      MATCH {scores.length - index}
                    </div>
                    <div className="Date">{score.date}</div>
                  </div>
                </div>

                {/* Scoring Team */}
                <div className="team-score1">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {score.scoringTeam}
                  </div>
                  <span className="score1">
                    {score.inning1.runs}-{score.inning1.wickets} (
                    {score.inning1.overs}/{score.maxOver})
                  </span>
                </div>

                {/* Chasing Team */}
                <div className="team-score1">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {score.chessingTeam}
                    <SportsCricketIcon style={{ marginLeft: "8px" }} />
                  </div>
                  <span className="score1">
                    {score.inning2.runs}-{score.inning2.wickets} (
                    {score.inning2.overs}/{score.maxOver})
                  </span>
                </div>

                <div className="line"></div>

                {/* Match Result */}
                <div className="result">{score.winnerCard3}</div>
              </div>
          ))}

          {/*Section 5 :  settings */}
          {activeSection === "setting" && props.Admin && (
            <div>
              <div
                className="score-board-settings"
                onClick={() => handleClick("new")}
              >
                NEW MATCH 
              </div>
              {props.newMatch && (
                <div className="score-board-settings" onClick={handleEndInning1}>
                  RESET
                </div>
              )}
              <div
                className="score-board-settings"
                onClick={() => handleClick("edit")}
              >
                {/* edit */}
                EDIT PASSWORD
              </div>
              <div
                className="score-board-settings"
                onClick={() => handleClick("help")}
              >
                HELP
              </div>
              <div
                className="score-board-settings"
                onClick={() => handleClick("help")}
              >
                CONTACT
              </div>
              <div
                className="score-board-settings1"
                onClick={() => handleClick("logout")}
              >
                LOGOUT
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default ScoreBoard;
