import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import "./index.css";
import SideBar from "./components/sidebar/SideBar";
import Planner from "./components/planner/Planner";
import TasksType from "./type";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDdWGqzDnm7VEufy2ihfdXwb-LLiZ9Fx2s",
    authDomain: "dispositum-8de9c.firebaseapp.com",
    projectId: "dispositum-8de9c",
    storageBucket: "dispositum-8de9c.appspot.com",
    messagingSenderId: "1085414473168",
    appId: "1:1085414473168:web:adfef3324e737ef00d4dd5",
    databaseURL:
        "https://dispositum-8de9c-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

const App: React.FC = () => {
    const [tasks, setTasks] = useState<TasksType>({
        main: [],
        sub: {},
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
    });

    // Function to fetch tasks from Firebase
    function fetchTasksFromDatabase() {
        const tasksRef = ref(database, "tasks");
        onValue(tasksRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setTasks({
                    main: data.main || ["Task 1"],
                    sub: data.sub || {
                        "List 1": ["Task 1", "Task 2"],
                        "List 2": ["Task 1"],
                    },
                    Monday: data.Monday || [],
                    Tuesday: data.Tuesday || [],
                    Wednesday: data.Wednesday || [],
                    Thursday: data.Thursday || [],
                    Friday: data.Friday || [],
                    Saturday: data.Saturday || [],
                    Sunday: data.Sunday || [],
                });
            }
        });
    }

    useEffect(() => {
        fetchTasksFromDatabase();
    }, []);

    function saveTasksToDataBase() {
        const tasksRef = ref(database, "tasks");
        set(tasksRef, tasks);
    }

    function addTask(loc: string, sub?: string) {
        const newTask = prompt("Enter new task:");

        // Check if the user cancelled the prompt
        if (newTask === null) {
            return; // Exit the function without adding a task
        }

        // If the user pressed Enter without typing anything, use "New Task"
        if (sub) {
            tasks.sub[sub].push(newTask || "New Task");
        } else {
            tasks[loc].push(newTask || "New Task");
        }

        saveTasksToDataBase();
    }

    function handleOnDragEnd(result: DropResult) {
        const { source, destination } = result;

        // Check if the destination is valid
        if (!destination) return;

        // Destructure the droppableId and index from source and destination
        let { droppableId: sourceId, index: sourceIndex } = source;
        let { droppableId: destId, index: destIndex } = destination;

        // If the item is dropped in the same place
        if (sourceId === destId && sourceIndex === destIndex) return;

        let subSource = false;
        let subDest = false;

        if (sourceId.startsWith("sub-")) {
            subSource = true;
            sourceId = sourceId.slice(4); // Remove "sub-" prefix
        }
        if (destId.startsWith("sub-")) {
            subDest = true;
            destId = destId.slice(4); // Remove "sub-" prefix
        }

        // Define source and destination array
        let sourceArray = subSource ? tasks.sub[sourceId] : tasks[sourceId];
        let destArray = subDest ? tasks.sub[destId] : tasks[destId];

        // Ensure that sourceArray is defined
        if (!sourceArray) return;

        // Handle the deletion of the task if dropped in the delete area
        if (destId === "delete") {
            // Remove the item from the source array
            sourceArray.splice(sourceIndex, 1);
        } else {
            // Remove the item from the source array
            const [removed] = sourceArray.splice(sourceIndex, 1);
            console.log(sourceId, destId);
            // Ensure destArray is defined before adding the item to it
            if (destArray) {
                destArray.splice(destIndex, 0, removed);
            }

            // If the item is from a sublist and not placed back in a sublist, keep it in the original sublist
            if (subSource && !subDest && destId != "main") {
                sourceArray.splice(sourceIndex, 0, removed);
                console.log("test");
            }
        }

        // Update the tasks state
        setTasks((prevTasks) => ({
            ...prevTasks,
            ...(subSource
                ? { sub: { ...prevTasks.sub, [sourceId]: sourceArray } }
                : { [sourceId]: sourceArray }),
            ...(subDest
                ? { sub: { ...prevTasks.sub, [destId]: destArray } }
                : { [destId]: destArray }),
        }));

        saveTasksToDataBase();
    }

    return (
        <div className="app">
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <SideBar tasks={tasks} addTask={addTask} />
                <Planner tasks={tasks} />
            </DragDropContext>
        </div>
    );
};

export default App;
