import React, { useState } from 'react';
import './index.css';
import SideBar from './components/sidebar/SideBar';
import Planner from './components/planner/Planner';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<string[]>(["Task 1", "Task 2", "Task 3", "Task 4"]);
  const [subtasks, setSubtasks] = useState<string[]>(["Subtask 1", "Subtask 2", "Subtask 3"]);
  const [plannerTasks, setPlannerTasks] = useState<{ [key: string]: string[] }>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      // Slepen binnen dezelfde lijst
      const items = reorder(getList(source.droppableId), source.index, destination.index);
      updateList(source.droppableId, items);
    } else {
      // Slepen tussen verschillende lijsten
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );
      updateList(source.droppableId, result[source.droppableId]);
      updateList(destination.droppableId, result[destination.droppableId]);
    }
  };

  const getList = (id: string) => {
    switch (id) {
      case 'sidebarTasks':
        return tasks;
      case 'sidebarSubtasks':
        return subtasks;
      default:
        return plannerTasks[id];
    }
  };

  const updateList = (id: string, items: string[]) => {
    switch (id) {
      case 'sidebarTasks':
        setTasks(items);
        break;
      case 'sidebarSubtasks':
        setSubtasks(items);
        break;
      default:
        setPlannerTasks((prev) => ({ ...prev, [id]: items }));
        break;
    }
  };

  const reorder = (list: string[], startIndex: number, endIndex: number): string[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (
    source: string[],
    destination: string[],
    droppableSource: any,
    droppableDestination: any
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);

    const result: { [key: string]: string[] } = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app">
        <SideBar tasks={tasks} subtasks={subtasks} />
        <Planner plannerTasks={plannerTasks} />
      </div>
    </DragDropContext>
  );
};

export default App;
