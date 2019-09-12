import { getMonth, getYear } from "./local-utils";

let ID = 1;

export enum TaskState {
    OPEN = "OPEN",
    COMPLETED = "COMPLETED",
}

// single TODO
export class Task {
    constructor(
        public title: string,
        public note: string,
        public date: number, // new Date(2019, 9, 1, 12, 30).getTime()
        public state?: string,
        public id?: number,
    ) {
        if (!this.state) this.state = TaskState.OPEN;
        this.id = ID++;
    }
}


export class Tasks {
    tasks: { [key: string]: Task };
    constructor(tasks?: { [key: string]: Task }) {
        this.tasks = tasks ? tasks : {};
    }

    add(task: Task): Tasks {
        this.tasks[`${task.id}`] = task;
        return new Tasks({...this.tasks});
    }

    remove(id: number) {
        delete this.tasks[`${id}`];
        return new Tasks({...this.tasks});
    }

    setCompleted(id: number): Tasks {
        this.tasks[`${id}`].state = TaskState.COMPLETED;
        return new Tasks({...this.tasks});
    }

    getCurrentMonth(year: number, month: number): Task[] {
        const result: Task[] = [];

        for (const id in this.tasks) {
            const task = this.tasks[id];
            if (task.date && (
                getYear(task.date) === year && 
                getMonth(task.date) == month)) {
                result.push(task);
            }
        }

        return result;
    }
}