import { Droppable, Draggable } from "@hello-pangea/dnd";
import "./planner.css";
import TasksType from "../../type";

interface PlannerProps {
    tasks: TasksType;
}

const Planner: React.FC<PlannerProps> = ({ tasks }) => {
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
                <h2>Dispositum</h2>
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
                                            key={`${day}-${index}`}
                                            draggableId={`${day}-${index}`}
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
            <Droppable droppableId="delete">
              {(provided) => (
                <span
                  className="material-symbols-outlined delete"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  delete
                </span>
              )}
            </Droppable>
        </div>
    );
};

export default Planner;
