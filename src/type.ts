type TasksType = {
    main: string[];
    sub: { [key: string]: string[] }; // sub is altijd aanwezig en getypeerd
    [key: string]: string[];
};

export default TasksType;
