import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import './sidebar.css';

interface SideBarProps {
  tasks: string[];
  subtasks: string[];
}

const SideBar: React.FC<SideBarProps> = ({ tasks, subtasks }) => {
  return (
    <div className="sidebar">
      <h2>Tasks</h2>
      <Droppable droppableId="sidebarTasks">
        {(provided) => (
          <ul ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <Draggable key={task} draggableId={task} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="task"
                  >
                    {task}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>

      <hr />

      <div className="sublist">
        <div className="sublist-header">Subtasks</div>
        <Droppable droppableId="sidebarSubtasks">
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps}>
              {subtasks.map((item, index) => (
                <Draggable key={item} draggableId={item} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="sublist-item"
                    >
                      {item}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default SideBar;
