import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "../components/NotFound/NotFound";
import StepperContainer from "../components/StepperContainer";
import ScoreBoard from "../components/ScoreBoard";
import LandingPage from "../components/HomePage/HomePage";
import LoginSignUp from "../components/LoginSignUp/LoginSignUp";
import EditPass from "../components/Passward/EditPass";
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

  useEffect(() => {
    localStorage.setItem("isAdmin", JSON.stringify(isAdmin));
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem("newMatch", JSON.stringify(newMatch));
  }, [newMatch]);

  useEffect(() => {
    const savedToss = localStorage.getItem("toss");
    const savedWinner = localStorage.getItem("win");
    if (savedToss) setToss(savedToss);
    if (savedWinner) setWin(savedWinner);
  }, []);

  useEffect(() => {
    localStorage.setItem("toss", toss);
    localStorage.setItem("win", win);
  }, [toss, win]);

  // ✅ Scroll-to-top visibility logic
  useEffect(() => {
    const container = document.getElementById("main-scroll-container");

    const handleScroll = () => {
      if (container.scrollTop > 100) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Scroll to top handler
  const scrollToTop = () => {
    const container = document.getElementById("main-scroll-container");
    container?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      id="main-scroll-container"
      style={{
        height: "100vh",
        overflowY: "auto",
        position: "relative",
        backgroundColor: "white"
        // width: "100%",
        // margin: "auto",
      }}
    >
      
      {/* ✅ Inline-styled Floating Scroll-to-Top Button */}
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
            element={<LoginSignUp Admin={isAdmin} setIsAdmin={setIsAdmin} />}
          />
          <Route path="/EditPassward" element={<EditPass />} />
          <Route path="/help" element={<HelpContact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Main;
