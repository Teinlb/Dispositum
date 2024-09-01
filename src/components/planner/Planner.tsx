import React, { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import "./planner.css";

// Define TasksType to match the one in App.tsx
type TasksType = {
    main: string[];
    sub: string[];
    [key: string]: string[];
};

interface PlannerProps {
    tasks: TasksType;
}

const Planner: React.FC<PlannerProps> = ({ tasks }) => {
    const [currentWeek, setCurrentWeek] = useState<number>(35);
    const nextWeek = () => setCurrentWeek(currentWeek + 1);
    const previousWeek = () => setCurrentWeek(currentWeek - 1);

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ] as const;

    return (
        <div className="planning">
            <div className="header">
                <div className="week-selector">
                    <button
                        onClick={previousWeek}
                        className="material-symbols-outlined"
                    >
                        chevron_left
                    </button>
                    <h2>Week {currentWeek}</h2>
                    <button
                        onClick={nextWeek}
                        className="material-symbols-outlined"
                    >
                        chevron_right
                    </button>
                </div>
                <div className="account-settings">
                    <span>Username</span>
                    <button>&#128100;</button>
                </div>
            </div>

            <div className="week-board">
                {days.map((day) => (
                    <div key={day} className="week-column">
                        <h3>{day}</h3>
                        <Droppable droppableId={day}>
                            {(provided) => (
                                <ul
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {tasks[day]?.map((task, index) => (
                                        <Draggable
                                            key={`${day}-${task}`}
                                            draggableId={`${day}-${task}`}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <li
                                                    className="task"
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Planner;
