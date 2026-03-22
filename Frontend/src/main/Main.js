import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "../components/NotFound/NotFound";
import StepperContainer from "../components/StepperContainer";
import ScoreBoard from "../components/ScoreBoard";
import LandingPage from "../components/HomePage/HomePage";
import LoginSignUp from "../components/LoginSignUp/LoginSignUp";
import EditPass from "../components/Passward/EditPass";
import Form from "../components/Form/Form";
import TossFlip from "../components/TossFlip/TossFlip";
import HelpContact from "../components/Help/HelpContact";
import { Fab } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Main = () => {
  const [toss, setToss] = useState();
  const [win, setWin] = useState();
  const [Globalstate, setGlobalstate] = useState(true);
  const [newMatch, setNewMatch] = useState(false);

  const [isAdmin, setIsAdmin] = useState(() => {
    const stored = localStorage.getItem("isAdmin");
    return stored ? JSON.parse(stored) : false;
  });

  const [showScrollTop, setShowScrollTop] = useState(false);

  // ✅ REF for scroll container
  const containerRef = useRef(null);

  // ✅ Persist admin
  useEffect(() => {
    localStorage.setItem("isAdmin", JSON.stringify(isAdmin));
  }, [isAdmin]);

  // ✅ Persist new match
  useEffect(() => {
    localStorage.setItem("newMatch", JSON.stringify(newMatch));
  }, [newMatch]);

  // ✅ Load toss + winner
  useEffect(() => {
    const savedToss = localStorage.getItem("toss");
    const savedWinner = localStorage.getItem("win");
    if (savedToss) setToss(savedToss);
    if (savedWinner) setWin(savedWinner);
  }, []);

  // ✅ Save toss + winner
  useEffect(() => {
    if (toss) localStorage.setItem("toss", toss);
    if (win) localStorage.setItem("win", win);
  }, [toss, win]);

  // ✅ Scroll listener (FIXED)
  useEffect(() => {
    const container = containerRef.current;

    const handleScroll = () => {
      if (container.scrollTop > 100) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // ✅ Scroll to top
  const scrollToTop = () => {
    const container = containerRef.current;
    container?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      id="main-scroll-container"
      style={{
        height: "100vh", // 🔥 IMPORTANT: ensures scrolling works
        overflowY: "auto",
        position: "relative",
        backgroundColor: "white"
      }}
    >
      {/* ✅ Scroll-to-top button */}
      {showScrollTop && (
        <Fab
          color="primary"
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "40px",
            right: "30px",
            zIndex: 1000,
            height: "40px",
            width: "40px"
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}

      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                Admin={isAdmin}
                setIsAdmin={setIsAdmin}
                setNewMatch={setNewMatch}
              />
            }
          />
          <Route path="/Toss" element={<TossFlip />} />
          <Route
            path="/form"
            element={
              <StepperContainer
                toss={toss}
                win={win}
                setToss={setToss}
                setWin={setWin}
                Globalstate={Globalstate}
                setGlobalstate={setGlobalstate}
                newMatch={newMatch}
                setNewMatch={setNewMatch}
              />
            }
          />
          <Route
            path="/score"
            element={
              <ScoreBoard
                toss={toss}
                win={win}
                Globalstate={Globalstate}
                Admin={isAdmin}
                setAdmin={setIsAdmin}
                newMatch={newMatch}
                setNewMatch={setNewMatch}
              />
            }
          />
          <Route
            path="/LoginSignUp"
            element={
              <LoginSignUp Admin={isAdmin} setIsAdmin={setIsAdmin} />
            }
          />
          <Route path="/EditPassward" element={<EditPass />} />
          <Route path="/MatchData" element={<Form />} />
          <Route path="/help" element={<HelpContact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Main; 