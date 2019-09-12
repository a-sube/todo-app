import { TaskState } from "./task-models";

export const getMonth = (date: number) => new Date(date).getMonth();
export const getYear = (date: number) => new Date(date).getFullYear();
export const getDay = (date: number) => new Date(date).getUTCDate();
export const getTime = (date: number) => {
    const d = new Date(date);
    const re = /(\d+:\d+):\d+\s(PM|AM)/g;
    const result = re.exec(d.toLocaleTimeString()).slice(1).join(" ")
    return result;
}


export const countTask = (c: any, tasksDates: any) => {
    let count = 0;
    for (let task of tasksDates) {
        console.log(task)
        if (+task === c) count++
    }
    console.log(count)
    return count
}

export const tasksForADay = (date: number, tasks: any) => {
    const arr = [];

    for (const task of tasks) {
        if (getDay(task.date) == date) {
            arr.push(task);
        }
    }
    return arr;
}

export const getCompletedTasks = (date: number, tasksDates: any): [boolean, number] => {
    const arr = tasksDates[date];

    let count = 0;
    for (const task of arr) {
        if (task.state === TaskState.COMPLETED) {
            count++;
        }
    }
    return [!!count, count];
}

export const generateCalendar = (year: string, month: string) => {
    const date = new Date(+year, +month);
    const [d, m, y] = [date.getDay(), date.getMonth(), date.getFullYear()];

    let totalDays;

    // Jan, March, May, July
    if (m <= 6 && m % 2 === 0) { totalDays = 31; }

    // August
    if (m === 7) { totalDays = 31; }

    // October and December
    if (m > 7 && m % 2 !== 0) { totalDays = 31; }

    // February
    if (m === 1) {
        // common year
        if (y % 4 !== 0) { totalDays = 28; }

        // leap year
        else if (y % 100 === 0) { totalDays = 29; }

        // common year
        else if (y % 400 !== 0) { totalDays = 28; }

        // leap year
        else { totalDays = 29; }
    }

    // April, June, September, November
    if (!totalDays) { totalDays = 30; }

    let count = totalDays;
    let started = false;
    let result = [];
    for (let i = 0; i < 5 && count; i++) {
        let row = []
        for (let j = 0; j < 7; j++) {
            if (j === d && !started) {
                started = true;
                // console.log(j)
                row.push(totalDays - count + 1);
                count--;
            } else if (started && count > 0) {
                row.push(totalDays - count + 1);
                count--;
            } else {
                row.push(null)
            }
        }
        result.push(row)
    }
    return result;
}