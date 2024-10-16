import { format, addMonths, subMonths } from "date-fns";
import { useState } from 'react';
import CalendarGrid from './CalendarGrid';


// Calendar Component
const Calendar = ({ events }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const prevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button onClick={prevMonth}>&lt;</button>
                <h2>{format(currentDate, 'MMMM yyyy')}</h2>
                <button onClick={nextMonth}>&gt;</button>
            </div>
            <div className="calendar-days">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="calendar-day-name">{day}</div>
                ))}
            </div>
            <CalendarGrid events={events} currentDate={currentDate} />
        </div>
    );
};

export default Calendar;