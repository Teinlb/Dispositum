type TasksType = {
    main: string[];
    sub: string[];
    [key: string]: string[]; // This allows for any string key with an array of strings as value
};

export default TasksType;
