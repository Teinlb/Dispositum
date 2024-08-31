import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import './planner.css';

interface PlannerProps {
  plannerTasks: { [key: string]: string[] };
}

const Planner: React.FC<PlannerProps> = ({ plannerTasks }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="planning">
      <div className="header">
        <div className="week-selector">
          <button className="material-symbols-outlined">chevron_left</button>
          <h2>Week 35</h2>
          <button className="material-symbols-outlined">chevron_right</button>
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
            <Droppable droppableId={day}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="task-list">
                  {plannerTasks[day].map((task, index) => (
                    <Draggable key={task} draggableId={task} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="task"
                        >
                          {task}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Planner;
