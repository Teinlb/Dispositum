import React from 'react';
import './sidebar.css';

const SideBar: React.FC = () => {
  const tasks = [
    "Task 1",
    "Task 2",
    "Task 3",
    "Task 4"
  ];

  const sublistItems = [
    "Subtask 1",
    "Subtask 2",
    "Subtask 3"
  ];

  return (
    <div className="sidebar">
      <h2>Tasks</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index} className="task">
            {task}
          </li>
        ))}
      </ul>

      <hr />

      <div className="sublist">
        <div className="sublist-header">Subtasks</div>
        <ul>
          {sublistItems.map((item, index) => (
            <li key={index} className="sublist-item">
              {item}
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  );
};

export default SideBar;
