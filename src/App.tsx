import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

import "./index.css";
import SideBar from "./components/sidebar/SideBar";
import Planner from "./components/planner/Planner";
import TasksType from "./type";

import { auth, database } from "./firebaseConfig";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { ref, set, onValue } from "firebase/database";
import LogIn from "./components/login/LogIn";
import AccountMenu from "./components/accountmenu/AccountMenu";

const provider = new GoogleAuthProvider();

const emptyTasks = {
    main: [],
    sub: {},
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
}

const App: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function signIn() {
        signInWithPopup(auth, provider)
            .then((result) => {
                const loggedInUser = result.user;
                setUser(loggedInUser);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function logOut() {
        signOut(auth)
            .then(() => {
                setUser(null);
                setTasks(emptyTasks);
                console.log("logged out succesful");
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const [tasks, setTasks] = useState<TasksType>(emptyTasks);

    // Function to fetch tasks from Firebase
    function fetchTasksFromDatabase() {
        const tasksPath = "usrs/" + user.uid + "/tasks";
        const tasksRef = ref(database, tasksPath);
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
        if (user) {
            fetchTasksFromDatabase();
        }
    }, [user]);

    function saveTasksToDataBase() {
        const tasksPath = "usrs/" + user.uid + "/tasks";
        const tasksRef = ref(database, tasksPath);
        set(tasksRef, tasks);
    }

    function addTask(loc: string, sub?: string) {
        const newTask = prompt("Enter new task:");

        if (newTask === null) {
            return; // Exit the function without adding a task
        }

        // Create a copy of the tasks object
        const updatedTasks = { ...tasks };

        if (sub) {
            // Ensure the sublist exists before pushing
            if (!updatedTasks.sub[sub]) {
                updatedTasks.sub[sub] = [];
            }
            updatedTasks.sub[sub].push(newTask || "New Task");
        } else {
            updatedTasks[loc].push(newTask || "New Task");
        }

        // Update the tasks state
        setTasks(updatedTasks);

        saveTasksToDataBase();
    }

    function addList() {
        const newList = prompt("Enter new list:");

        if (newList === null) {
            return; // Exit the function without adding a list
        }

        // Create a copy of the tasks object
        const updatedTasks = { ...tasks };

        // Add the new list as a key with an empty array in the sub object
        updatedTasks.sub[newList || "New List"] = [];

        // Update the tasks state
        setTasks(updatedTasks);

        saveTasksToDataBase();
    }

    function removeList(list: string) {
        // Create a copy of the tasks object
        const updatedTasks = { ...tasks };

        // Check if the list exists before attempting to remove it
        if (updatedTasks.sub[list]) {
            // Remove the list from the sub object
            delete updatedTasks.sub[list];

            // Update the tasks state
            setTasks(updatedTasks);

            // Save the updated tasks to the database
            saveTasksToDataBase();
        } else {
            return;
        }
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

            // Ensure destArray is defined before adding the item to it
            if (destArray) {
                destArray.splice(destIndex, 0, removed);
            }

            // If the item is from a sublist and not placed back in a sublist, keep it in the original sublist
            if (subSource && !subDest && destId != "main") {
                sourceArray.splice(sourceIndex, 0, removed);
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
            {user ? (
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <SideBar
                        tasks={tasks}
                        addTask={addTask}
                        addList={addList}
                        removeList={removeList}
                    />
                    <Planner
                        tasks={tasks}
                        userName={user.displayName}
                        toggleMenu={toggleMenu}
                    />
                    {isMenuOpen ? (
                        <AccountMenu
                            username={user.displayName}
                            mail={user.email}
                            signOut={logOut}
                            toggleMenu={toggleMenu}
                        />
                    ) : null}
                </DragDropContext>
            ) : (
                <LogIn signIn={signIn} />
            )}
        </div>
    );
};

export default App;
