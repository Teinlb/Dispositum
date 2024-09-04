import { Droppable, Draggable } from "@hello-pangea/dnd";
import "./sidebar.css";
import TasksType from "../../type";

interface SideBarProps {
    tasks: TasksType;
    addTask: (loc: string, sub?: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ tasks, addTask }) => {
    return (
        <div className="sidebar">
            <h2>Tasks</h2>
            <Droppable droppableId="main">
                {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef}>
                        {tasks.main.map((task, index) => (
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
                        <li
                            className="task add"
                            onClick={() => addTask("main")}
                        >
                            +
                        </li>
                    </ul>
                )}
            </Droppable>

            <hr />
            {Object.keys(tasks.sub).map((list) => (
                <div className="sublist" key={list}>
                    <div className="sublist-header">{list}</div>
                    <Droppable droppableId={`sub-${list}`}>
                        {(provided) => (
                            <ul
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {tasks.sub[list].map(
                                    (task: string, index: number) => (
                                        <Draggable
                                            key={`sub-${list}-${index}`}
                                            draggableId={`sub-${list}-${index}`}
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
                                    )
                                )}
                                {provided.placeholder}
                                <li
                                    className="task add"
                                    onClick={() => addTask("sub", list)}
                                >
                                    +
                                </li>
                            </ul>
                        )}
                    </Droppable>
                </div>
            ))}
        </div>
    );
};

export default SideBar;
