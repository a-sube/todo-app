import './index.scss';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';

import { Tasks, Task, TaskState } from './task-models';
import { generateCalendar, getDay, getMonth, tasksForADay, getYear, getTime, } from './local-utils';

import store, { ActionTypes } from './redux-code/rdx';

enum Months {
    January, February, March, April,
    May, June, July, August,
    September, October, November, December,
}

class Parent extends Component {

    state: { [key: string]: any };
    props: { [key: string]: any };
    constructor(props: any) {
        super(props);
        this.state = {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            monthString: Months[new Date().getMonth()],
            showDetails: false,
            dateToShow: 0,
            showForm: false,
        };

    }

    componentDidMount() {

    }

    incrementMonth() {
        let current = this.state.month;
        if (current < 11) {
            this.setState({ month: current + 1 });
            this.setState({ monthString: Months[current + 1] });
        } else {
            let currentYear = this.state.year;
            this.setState({ year: currentYear + 1 });
            this.setState({ month: 0 });
            this.setState({ monthString: Months[0] });
        }
    }

    decrementMonth() {
        let current = this.state.month;
        if (current > 0) {
            this.setState({ month: current - 1 });
            this.setState({ monthString: Months[current - 1] });
        } else {
            let currentYear = this.state.year;
            this.setState({ year: currentYear - 1 });
            this.setState({ month: 11 });
            this.setState({ monthString: Months[11] });
        }
    }

    showTaskDetails(date: number) {
        this.setState({ showDetails: true });
        this.setState({ dateToShow: date });
    }

    closeTaskDetails() {
        this.setState({ showDetails: false })
    }

    toggleForm() {
        const current = this.state.showForm;
        this.setState({ showForm: !current });
    }

    render() {
        const { year, month, monthString,
            showDetails, dateToShow, toggleForm, showForm } = this.state

        const tasksCurrentMonth = this.props.tasks.getCurrentMonth(
            this.state.year, this.state.month);
        const singleDayTasks =
            tasksCurrentMonth.filter((task: any) => getDay(task.date) === this.state.dateToShow)

        return (
            <div>
                <header className="header">
                    <div className="container-m">
                        <span className="app-title">Todo app</span>
                    </div>
                </header>

                <div className="container-m">

                    <div className="container-s">
                        <YearAndMonth
                            year={year}
                            month={monthString}
                            incrementMonth={this.incrementMonth.bind(this)}
                            decrementMonth={this.decrementMonth.bind(this)}

                        />
                        <WeekDays />

                        <Calendar
                            year={year}
                            month={month}
                            tasksCurrentMonth={tasksCurrentMonth}
                            showDetails={showDetails}
                            showTaskDetails={this.showTaskDetails.bind(this)}
                            closeTaskDetails={this.closeTaskDetails.bind(this)}
                            singleDayTasks={singleDayTasks}
                            dateToShow={dateToShow}
                            toggleForm={this.toggleForm.bind(this)}
                            showForm={showForm}
                            {...this.props}
                        />

                    </div>
                </div>
            </div>
        )
    }
}

const YearAndMonth = (props: any) => {

    const { year, month, incrementMonth, decrementMonth } = props;

    return (
        <div className="yearAndMonth">
            <div className="wrapper">
                <span className="btn" onClick={decrementMonth}>prev</span>
                <div>
                    <span>{month}</span>
                    <span>{year}</span>
                </div>
                <span className="btn" onClick={incrementMonth}>next</span>
            </div>
        </div>
    )
}


const WeekDays = () => (
    <div className="weekdays">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sut</span>
    </div>
)

const Calendar = (props: any) => {
    const { year, month, tasksCurrentMonth,
        showDetails, showTaskDetails, closeTaskDetails,
        singleDayTasks, dateToShow, toggleForm, showForm } = props;

    const result = generateCalendar(year, month);

    return (
        <div>
            <div className="calendar">
                {result.map((row, i) => (
                    <div className="weekdays" key={i}>
                        {row.map((col, idx) => {
                            return col ?
                                <CalendarDay
                                    key={`${col}-${idx}`} col={col} tasksForADay={tasksForADay(col, tasksCurrentMonth)} showTaskDetails={showTaskDetails}
                                />
                                :
                                <span key={`${col}-${idx}`}></span>
                        })}
                    </div>
                ))}
            </div>

            <Events
                tasksCurrentMonth={tasksCurrentMonth} showDetails={showDetails}
                closeTaskDetails={closeTaskDetails}
                singleDayTasks={singleDayTasks}
                dateToShow={dateToShow}
                year={year}
                month={month}
                toggleForm={toggleForm}
                showForm={showForm}
                {...props}
            />
        </div>

    )
}

const CalendarDay = (props: any) => {
    const { col, tasksForADay, showTaskDetails } = props;

    const [open, openCount] = (() => {
        let count = 0;
        for (const task of tasksForADay) {
            if (task.state === TaskState.OPEN) {
                count++;
            }
        }
        return [!!count, count]
    })()

    const [completed, completedCount] = (() => {
        let count = 0;
        for (const task of tasksForADay) {
            if (task.state === TaskState.COMPLETED) {
                count++;
            }
        }
        return [!!count, count]
    })()

    return tasksForADay.length ?
        <span className="calendar-day has-task" onClick={() => showTaskDetails(col)}>
            {col}
            {open ?
                <span className="open-task-count">{openCount}</span> :
                <span></span>}

            {completed ?
                <span className="completed-task-count">{completedCount}</span> : <span></span>}
        </span > :

        <span className="calendar-day" onClick={() => showTaskDetails(col)}>{col}</span>

}


const Events = (props: any) => {
    const { tasksCurrentMonth, showDetails,
        closeTaskDetails, singleDayTasks,
        dateToShow, year, month,
        showForm, toggleForm } = props;

    const [completed, count] = ((tasksCurrentMonth: any): [boolean, number] => {
        let count = 0;
        for (const task of tasksCurrentMonth) {
            if (task.state === TaskState.COMPLETED) {
                count++;
            }
        }
        return [!!count, count];
    })(tasksCurrentMonth)

    const btnState = showForm ? 'back' : 'add'

    return (
        <div className="events">
            <div className="events-title">Events</div>

            {
                showDetails ?
                    <div className="events-details">
                        <div className="events-tools">
                            <span className="btn" onClick={closeTaskDetails}>close</span>
                            <span>{Months[month]} {dateToShow} {year}</span>
                            <span className="btn" onClick={toggleForm}>{btnState}</span>
                        </div>

                        {
                            showForm ?
                                <EventsAddForm {...props} year={year} month={month} />
                                :
                                <EvetnsList singleDayTasks={singleDayTasks} {...props} />
                        }


                    </div>

                    :

                    <EventsMessage
                        tasksLength={tasksCurrentMonth.length}
                        completed={completed}
                        count={count}
                    />
            }

        </div>
    )

}


class EventsAddForm extends Component {

    state: { [key: string]: any };
    props: { [key: string]: any };
    formRef: any;
    constructor(props: any) {
        super(props)
        this.state = {
            title: '',
            note: '',
            time: '',
            error: '',
            success: '',
        }

        this.formRef = React.createRef();
    }

    setTitle(value: string) {
        this.setState({ error: '' });
        this.setState({ success: '' });
        this.setState({ title: value })
    }

    setNote(value: string) {
        this.setState({ error: '' });
        this.setState({ success: '' });
        this.setState({ note: value });
    }

    setTime(value: string) {
        this.setState({ error: '' });
        this.setState({ success: '' });
        this.setState({ time: value });
    }

    reset() {
        this.setState({ title: '' })
        this.setState({ note: '' });
        this.setState({ time: '' });
    }

    submit() {
        const { title, note, time } = this.state;
        if (!title || !note || !time) {
            this.setState({ error: 'Looks like some fields are missing' });
            return;
        }

        const { year, month, dateToShow } = this.props;
        const today = new Date().getTime();
        const [hours, minutes] = time.split(':');
        const taskDate = new Date(
            year, month, dateToShow, +hours, +minutes).getTime()
        if (taskDate < today) {
            this.setState({ error: 'You can\'t add event to a past' });
            return;
        }

        this.props.dispatch({ type: ActionTypes.ADD_TASK, payload: new Task(title, note, taskDate) })
        const [y, m, d, h, min] = [
            getYear(taskDate), getMonth(taskDate), getDay(taskDate),
            new Date(taskDate).getHours(), new Date(taskDate).getMinutes()
        ]

        let hrs = '';
        if (`${h}`.length < 2) hrs = `0${h}`;
        else hrs = `${h}`;

        let minS = '';
        if (`${min}`.length < 2) minS = `0${min}`;
        else minS = `${min}`;

        this.setState({
            success: `
                You've added a new event for ${Months[m]} ${d} ${y} at ${hrs}:${minS}. 
                Good luck on completion!
            ` })
        this.formRef.reset();
        this.reset();
    }

    render() {
        // selected date on calendar
        const { year, month, dateToShow } = this.props;
        const { error, success } = this.state;
        const today = new Date().getTime();
        const calendarDay = new Date(year, month, dateToShow, 23, 59).getTime();

        if (calendarDay > today) {
            return (
                <div className="events-form">
                    <form ref={(el) => this.formRef = el}>
                        {error ?
                            <div className="message error">{error}</div>
                            :
                            <div></div>
                        }
                        {success ?
                            <div className="message success">{success}</div>
                            :
                            <div></div>
                        }
                        <label htmlFor="title">Title:</label>
                        <input id="title" type="text" name="title" onKeyUp={(evt) => this.setTitle(evt.currentTarget.value)}
                        />

                        <label htmlFor="note">Note:</label>
                        <textarea id="note" name="note" rows={3} onKeyUp={(evt) => this.setNote(evt.currentTarget.value)} />

                        <label htmlFor="time">Time:</label>
                        <input type="time" id="time" name="time"
                            min="00:00" max="23:59" onChange={(evt) => this.setTime(evt.currentTarget.value)}
                        />

                        <div className="button-wrapper">
                            <span className="btn-submit" onClick={() => this.submit()}>submit</span>
                        </div>
                    </form>
                </div>
            )
        } else {
            return (
                <div className="events-form">
                    <div className="message error">You can't add event to a past</div>
                </div >
            )
        }

    }

}

let EvetnsList = (props: any) => {
    const { singleDayTasks, dispatch } = props;
    const count = singleDayTasks.length;
    const events = count > 1 ? 'events' : 'event';
    const removeTask = (task: Task) => {
        dispatch({ type: ActionTypes.REMOVE_TASK, payload: task.id });
    }
    const setCompleted = (task: Task) => {
        dispatch({ type: ActionTypes.SET_COMPLETED, payload: task.id });
    }
    return (
        <div className="events-list">
            {
                count ?
                    <div>
                        <div className="message">You have {count} {events}</div>
                        <div className="list">
                            <ul>
                                {singleDayTasks.map((task: any) => {
                                    return (
                                        <li key={task.id} className="list-item">
                                            <span className="list-item-header">
                                                <span className="list-item-date">{getTime(task.date)}</span>
                                                <span className="list-item-title">{task.title}</span>
                                                <span>state:

                                                {
                                                        task.state === TaskState.OPEN ?
                                                            <span className="list-item-status open">open</span>
                                                            :
                                                            <span className="list-item-status completed">completed</span>
                                                    }
                                                </span>

                                            </span>

                                            <span className="list-item-body">
                                                <span>{task.note}</span>
                                            </span>

                                            <span className="list-item-footer">
                                                <span className="buttons-wrapper">
                                                    <span className="list-item-btn remove" onClick={() => removeTask(task)}>remove</span>
                                                    {
                                                        task.state === TaskState.OPEN ?
                                                            <span className="list-item-btn mark-as-comleted" onClick={() => setCompleted(task)}>mark as completed</span>
                                                            :
                                                            <span></span>
                                                    }
                                                </span>


                                            </span>

                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                    :
                    <div className="message">No events</div>
            }
        </div>
    )
}


const EventsMessage = (props: any) => {
    const { completed, count, tasksLength } = props;
    const events = tasksLength ? 'events' : 'event';

    const message = tasksLength ?
        `You have ${tasksLength} ${events} this month` :
        `No events`;

    return (
        <div className="events-window">
            <div className="message">{message}</div>
            {completed ? <div className="message">{count} of them completed</div> : <span></span>}
        </div>

    )
}



const mapStateToProps = (state: Tasks) => ({ tasks: state })

// EvetnsList = connect(mapDispatchToProps)(EvetnsList);
const Parentt = connect(mapStateToProps)(Parent);

render(
    <Provider store={store}>
        <Parentt />
    </Provider>,
    document.getElementById('root'),
)