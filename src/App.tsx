 import React from "react";
import TopBar from "./components/TopBar";
import HotFeed from "./components/HotFeed";
import MainRotator from "./components/MainRotator";
import ProjectQuickInfo from "./components/ProjectQuickInfo";
import FundedFeed from "./components/FundedFeed";
import Footer from "./components/Footer";

import "./styles.css";

export default function App() {
  return (
    <div className="app-container">
      <TopBar />
      <HotFeed />
      <MainRotator />
      <ProjectQuickInfo />
      <FundedFeed />
      <Footer />
    </div>
  );
}
