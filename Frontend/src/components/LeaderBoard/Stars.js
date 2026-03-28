import { useEffect, useState } from "react";
import "./Stars.css";

const Stars = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/live/match/all")
      .then(res => res.json())
      .then(processData)
      .catch(console.error);
  }, []);

  const cleanName = (name) => name.replace(/\*/g, "").trim();

  const processData = (matches) => {
    const batterMap = {};
    const bowlerMap = {};

    matches.forEach(match => {
      const innings = [
        { data: match.inning1, team: match.scoringTeam, vs: match.chessingTeam },
        { data: match.inning2, team: match.chessingTeam, vs: match.scoringTeam }
      ];

      innings.forEach(({ data: inning, team, vs }) => {
        if (!inning) return;

        (inning.batters || []).forEach(b => {
          const name = cleanName(b.name);

          if (!batterMap[name]) {
            batterMap[name] = {
              name, team,
              runs: 0, balls: 0, innings: 0,
              fours: 0, sixes: 0,
              highScore: 0,
              fifties: 0, hundreds: 0,
              bestVs: ""
            };
          }

          const p = batterMap[name];
          p.runs += b.run;
          p.balls += b.ball;
          p.innings++;
          p.fours += b.four;
          p.sixes += b.six;

          if (b.run > p.highScore) {
            p.highScore = b.run;
            p.bestVs = vs;
          }

          if (b.run >= 100) p.hundreds++;
          else if (b.run >= 50) p.fifties++;
        });

        (inning.bowlers || []).forEach(b => {
          const name = cleanName(b.name);

          if (!bowlerMap[name]) {
            bowlerMap[name] = {
              name, team,
              wickets: 0, runs: 0, overs: 0, innings: 0
            };
          }

          const p = bowlerMap[name];
          p.wickets += b.wicket;
          p.runs += b.run;
          p.overs += b.over;
          p.innings++;
        });
      });
    });

    const batters = Object.values(batterMap).map(p => ({
      ...p,
      avg: p.innings ? (p.runs / p.innings).toFixed(2) : 0,
      strikeRate: p.balls ? ((p.runs / p.balls) * 100).toFixed(2) : 0
    }));

    const bowlers = Object.values(bowlerMap).map(p => ({
      ...p,
      avg: p.wickets ? (p.runs / p.wickets).toFixed(2) : 0,
      economy: p.overs ? (p.runs / p.overs).toFixed(2) : 0
    }));

    setStats({
      mostRuns: [...batters].sort((a,b)=>b.runs-a.runs).slice(0,5),
      highScore: [...batters].sort((a,b)=>b.highScore-a.highScore).slice(0,5),
      bestSR: [...batters].sort((a,b)=>b.strikeRate-a.strikeRate).slice(0,5),
      bestAvg: [...batters].sort((a,b)=>b.avg-a.avg).slice(0,5),
      most4s: [...batters].sort((a,b)=>b.fours-a.fours).slice(0,5),
      most6s: [...batters].sort((a,b)=>b.sixes-a.sixes).slice(0,5),
      most100s: [...batters].sort((a,b)=>b.hundreds-a.hundreds).slice(0,5),
      most50s: [...batters].sort((a,b)=>b.fifties-a.fifties).slice(0,5),

      mostWickets: [...bowlers].sort((a,b)=>b.wickets-a.wickets).slice(0,5),
      bestEco: [...bowlers].sort((a,b)=>a.economy-b.economy).slice(0,5),
      bestAvgBowl: [...bowlers].sort((a,b)=>a.avg-b.avg).slice(0,5)
    });
  };

  const renderTable = (title, list, cols) => (
    <div className="table-card">
      <h3 className="table-title">{title}</h3>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Pos</th>
              <th className="left">Player</th>
              {cols.map(c => <th key={c.key}>{c.label}</th>)}
            </tr>
          </thead>

          <tbody>
            {list?.map((p, i) => (
              <tr key={i}>
                <td>{i + 1}</td>

                <td className="left">
                  <div className="player">
                    <div className="avatar">{p.name[0]}</div>
                    <div>
                      <div className="name">{p.name}</div>
                      <div className="team">{p.team}</div>
                    </div>
                  </div>
                </td>

                {cols.map(c => (
                  <td key={c.key}>{p[c.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="stars-container">

      {renderTable("Most Runs", stats.mostRuns, [
        { key: "runs", label: "R" },
        { key: "innings", label: "Inn" },
        { key: "avg", label: "Avg" }
      ])}

      {renderTable("Highest Score", stats.highScore, [
        { key: "highScore", label: "Score" },
        { key: "balls", label: "Balls" },
        { key: "strikeRate", label: "SR" },
        { key: "bestVs", label: "VS" }
      ])}

      {renderTable("Best Strike Rate", stats.bestSR, [
        { key: "strikeRate", label: "SR" },
        { key: "innings", label: "Inn" },
        { key: "runs", label: "Runs" }
      ])}

      {renderTable("Best Average", stats.bestAvg, [
        { key: "avg", label: "Avg" },
        { key: "innings", label: "Inn" },
        { key: "runs", label: "Runs" }
      ])}

      {renderTable("Most 4s", stats.most4s, [
        { key: "fours", label: "4s" },
        { key: "innings", label: "Inn" },
        { key: "runs", label: "Runs" }
      ])}

      {renderTable("Most 6s", stats.most6s, [
        { key: "sixes", label: "6s" },
        { key: "innings", label: "Inn" },
        { key: "runs", label: "Runs" }
      ])}

      {renderTable("Most 100s", stats.most100s, [
        { key: "hundreds", label: "100s" },
        { key: "innings", label: "Inn" },
        { key: "runs", label: "Runs" }
      ])}

      {renderTable("Most 50s", stats.most50s, [
        { key: "fifties", label: "50s" },
        { key: "innings", label: "Inn" },
        { key: "runs", label: "Runs" }
      ])}

      {renderTable("Most Wickets", stats.mostWickets, [
        { key: "wickets", label: "W" },
        { key: "innings", label: "Inn" },
        { key: "overs", label: "Overs" },
        { key: "runs", label: "Runs" },
        { key: "avg", label: "Avg" }
      ])}

      {renderTable("Best Economy", stats.bestEco, [
        { key: "economy", label: "Eco" },
        { key: "overs", label: "Overs" },
        { key: "runs", label: "Runs" }
      ])}

      {renderTable("Best Bowling Average", stats.bestAvgBowl, [
        { key: "avg", label: "Avg" },
        { key: "wickets", label: "W" },
        { key: "runs", label: "Runs" }
      ])}

    </div>
  );
};

export default Stars;