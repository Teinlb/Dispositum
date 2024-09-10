import { Droppable, Draggable } from "@hello-pangea/dnd";
import "./sidebar.css";
import TasksType from "../../type";

interface SideBarProps {
    tasks: TasksType;
    addTask: (sub?: string) => void;
    addList: () => void;
    removeList: (list: string) => void;
    isCollapsed: boolean;
    toggleSidebar: () => void;
    isSidebarCollapsed: boolean;
}

const SideBar: React.FC<SideBarProps> = ({
    tasks,
    addTask,
    addList,
    removeList,
    isCollapsed,
    toggleSidebar,
    isSidebarCollapsed

}) => {
    return (
        <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
            <button onClick={toggleSidebar} className="toggle-sidebar-btn material-symbols-outlined">
                {isSidebarCollapsed ? "chevron_right" : "chevron_left"}
            </button>
            {!isCollapsed && (
                <>
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
                                <li className="task add" onClick={() => addTask("")}>
                                    +
                                </li>
                            </ul>
                        )}
                    </Droppable>

                    <hr />

                    {Object.keys(tasks.sub).map((list) => (
                        <div className="sublist" key={list}>
                            <div className="sublist-header">
                                <h3>{list}</h3>
                                <span
                                    className="material-symbols-outlined removeList"
                                    onClick={() => removeList(list)}
                                >
                                    close
                                </span>
                            </div>
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
                                            onClick={() => addTask(list)}
                                        >
                                            +
                                        </li>
                                    </ul>
                                )}
                            </Droppable>
                        </div>
                    ))}

                    <hr />

                    <div className="task addList" onClick={addList}>
                        Add List
                    </div>
                </>
            )}
        </div>
    );
};

export default SideBar;
