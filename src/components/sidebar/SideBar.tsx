import { Droppable, Draggable } from "@hello-pangea/dnd";
import "./sidebar.css";
import TasksType from "../../type";

interface SideBarProps {
    tasks: TasksType;
}

const SideBar: React.FC<SideBarProps> = ({ tasks }) => {
    return (
        <div className="sidebar">
            <h2>Tasks</h2>
            <Droppable droppableId="main">
                {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef}>
                        {tasks["main"].map((task, index) => (
                            <Draggable
                                key={`main-${index}`}
                                draggableId={`main-${index}`}
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

            <hr />

            <div className="sublist">
                <div className="sublist-header">Subtasks</div>
                <Droppable droppableId="sub">
                    {(provided) => (
                        <ul
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {tasks["sub"].map((task, index) => (
                                <Draggable
                                    key={`sub-${index}`}
                                    draggableId={`sub-${index}`}
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
        </div>
    );
};

export default SideBar;
