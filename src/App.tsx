import React from "react";
import "./index.css";
import SideBar from "./components/sidebar/SideBar";
import Planner from "./components/planner/Planner";

const App: React.FC = () => {
    return (
        <div className="app">
            <SideBar />
            <Planner />
        </div>
    );
};

export default App;
