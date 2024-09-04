type TasksType = {
    main: string[];
    sub: { [key: string]: string[] }; // sub is een object met specifieke string array properties
    Monday: string[];
    Tuesday: string[];
    Wednesday: string[];
    Thursday: string[];
    Friday: string[];
    Saturday: string[];
    Sunday: string[];
};

export default TasksType;
