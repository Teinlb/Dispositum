import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

import "./index.css";
import SideBar from "./components/sidebar/SideBar";
import Planner from "./components/planner/Planner";
import TasksType from "./type";

import { auth, database } from "./firebaseConfig";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { ref, update, onValue } from "firebase/database";
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
};

const App: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for sidebar collapse

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

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed); // Function to toggle sidebar collapse
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
                    main: data.main || [],
                    sub: data.sub || {},
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

    function saveTasksToDataBase(updatedSections: { [key: string]: any }) {
        const path = "usrs/" + user.uid + "/tasks";
        const pathRef = ref(database, path);

        // Gebruik update om specifieke secties in tasks en sub bij te werken
        update(pathRef, updatedSections)
            .then(() => {
                console.log("Tasks updated successfully!");
            })
            .catch((error) => {
                console.error("Error updating tasks:", error);
            });
    }

    function addTask(sub?: string) {
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

            // Update the tasks state
            setTasks(updatedTasks);

            // Only save the updated sublist to the database
            saveTasksToDataBase({ [`sub/${sub}`]: updatedTasks.sub[sub] });
        } else {
            updatedTasks.main.push(newTask || "New Task");

            // Update the tasks state
            setTasks(updatedTasks);

            // Only save the updated main list to the database
            saveTasksToDataBase({ main: updatedTasks.main });
        }
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

        // Save only the updated sublist to the database
        saveTasksToDataBase({ [`sub/${newList}`]: [] });
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

            // Remove the list from the database
            saveTasksToDataBase({ [`sub/${list}`]: null }); // null to delete the list
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

        // Define source array
        let sourceArray = subSource ? tasks.sub[sourceId] : tasks[sourceId];

        // Ensure that sourceArray is defined
        if (!sourceArray) return;

        let updates = {};

        if (destId === "delete") {
            // Remove the task from the source array
            sourceArray.splice(sourceIndex, 1);

            // Update the tasks state
            setTasks((prevTasks) => ({
                ...prevTasks,
                ...(subSource
                    ? { sub: { ...prevTasks.sub, [sourceId]: sourceArray } }
                    : { [sourceId]: sourceArray }),
            }));

            // Prepare the update to remove the task from Firebase
            updates = subSource
                ? { [`sub/${sourceId}`]: sourceArray }
                : { [sourceId]: sourceArray };
        } else {
            // Define destination array
            let destArray = subDest ? tasks.sub[destId] : tasks[destId];

            // Ensure destArray is defined before adding the item to it
            if (destArray) {
                const removed = sourceArray[sourceIndex]; // Don't remove from source yet

                // Add a copy of the item to the destination array if moving out of "main"
                if (sourceId === "main" && destId !== "main") {
                    destArray.splice(destIndex, 0, { ...removed });
                } else {
                    // Move the item to the destination array (normal drag)
                    sourceArray.splice(sourceIndex, 1);
                    destArray.splice(destIndex, 0, removed);
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

                // Prepare updates for both source and destination in Firebase
                updates = {
                    ...(subSource
                        ? { [`sub/${sourceId}`]: sourceArray }
                        : { [sourceId]: sourceArray }),
                    ...(subDest
                        ? { [`sub/${destId}`]: destArray }
                        : { [destId]: destArray }),
                };
            }
        }

        // Save the updated source and destination (or delete) to the database
        saveTasksToDataBase(updates);
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
                        isCollapsed={isSidebarCollapsed}
                        toggleSidebar={toggleSidebar}
                        isSidebarCollapsed={isSidebarCollapsed}
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
