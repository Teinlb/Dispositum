import React, { useState } from 'react';
import './planner.css';

const Planner: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState<number>(35);

  const nextWeek = () => setCurrentWeek(currentWeek + 1);
  const previousWeek = () => setCurrentWeek(currentWeek - 1);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="planning">
      <div className="header">
        <div className="week-selector">
          <button onClick={previousWeek} className="material-symbols-outlined">chevron_left</button>
          <h2>Week {currentWeek}</h2>
          <button onClick={nextWeek} className="material-symbols-outlined">chevron_right</button>
        </div>
        <div className="account-settings">
          <span>Username</span>
          <button>&#128100;</button>
        </div>
      </div>

      <div className="week-board">
        {days.map((day, index) => (
          <div key={index} className="week-column">
            <h3>{day}</h3>
            <div className="task">Sample Task</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Planner;
