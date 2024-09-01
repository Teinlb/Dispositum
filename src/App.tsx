import React, { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import "./index.css";
import SideBar from "./components/sidebar/SideBar";
import Planner from "./components/planner/Planner";

// Define mainTasks
const mainlistItems = ["Task 1", "Task 2", "Task 3", "Task 4"];
// Define subtasks
const sublistItems = ["Subtask 1", "Subtask 2", "Subtask 3"];
// Initialize tasks for each day
const initialTasksPerDay = {
    Monday: ["Task 1", "Task 2"],
    Tuesday: ["Task 3", "Task 4"],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
};

// Define a type for the tasks object
type TasksType = {
    main: string[];
    sub: string[];
    [key: string]: string[]; // This allows for any string key with an array of strings as value
};

const App: React.FC = () => {
    const [tasks, setTasks] = useState<TasksType>({
        main: mainlistItems,
        sub: sublistItems,
        ...initialTasksPerDay,
    });

    function handleOnDragEnd(result: DropResult) {
        const { source, destination } = result;

        // Check if the destination is valid
        if (!destination) return;

        // Destructure the droppableId and index from source and destination
        const { droppableId: sourceId, index: sourceIndex } = source;
        const { droppableId: destId, index: destIndex } = destination;

        // If the item is dropped in the same place
        if (sourceId === destId && sourceIndex === destIndex) return;

        // Define source and destination array
        const sourceArray = tasks[sourceId];
        const destArray = tasks[destId];

        // Ensure that sourceArray and destArray are defined
        if (!sourceArray || !destArray) return;

        // Remove the item from the source array
        const [removed] = sourceArray.splice(sourceIndex, 1);

        // Add the item to the destination array
        destArray.splice(destIndex, 0, removed);

        // Update the tasks state
        setTasks({
            ...tasks,
            [sourceId]: sourceArray,
            [destId]: destArray,
        });
    }

    return (
        <div className="app">
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <SideBar tasks={tasks} />
                <Planner tasks={tasks} />
            </DragDropContext>
        </div>
    );
};

export default App;
