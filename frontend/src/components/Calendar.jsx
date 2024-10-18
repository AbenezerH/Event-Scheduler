import { format, addMonths, subMonths } from "date-fns";
import CalendarGrid from './CalendarGrid';


// Calendar Component
const Calendar = ({ eventDates, currentDate, setCurrentDate }) => {

    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const prevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button onClick={prevMonth} className="calendar-btns">&lt;</button>
                <h2>{format(currentDate, 'MMMM yyyy')}</h2>
                <button onClick={nextMonth} className="calendar-btns">&gt;</button>
            </div>
            <div className="calendar-days">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="calendar-day-name">{day}</div>
                ))}
            </div>
            <CalendarGrid currentDate={currentDate} eventDates={eventDates} />
        </div>
    );
};

export default Calendar;