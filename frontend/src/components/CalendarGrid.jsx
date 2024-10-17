import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, addDays, isSameDay } from "date-fns";


// CalendarGrid Component
const CalendarGrid = ({ events, currentDate }) => {
    const startOfMonthVar = startOfMonth(currentDate);
    const endOfMonthVar = endOfMonth(currentDate);
    const startDateVar = startOfWeek(startOfMonthVar);
    const endDateVar = endOfWeek(endOfMonthVar);

    const dateFormat = "d";
    const rows = [];
    let day = startDateVar;

    const formatEventTime = (dateTime) => {
        return format(new Date(dateTime), "HH:mm");
    };

    while (day <= endDateVar) {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const cloneDay = day;
            const eventsForDay = events?.filter(event =>
                isSameDay(cloneDay, new Date(event.dateTime))
            );
            days.push(
                <div
                    className={`calendar-day ${!isSameMonth(day, currentDate) ? 'different-month' : ''} ${isSameDay(day, Date()) ? 'today' : ''}`}
                    key={day}
                >
                    <div className="calendar-day-header">{format(day, dateFormat)}</div>
                    {eventsForDay?.map(event => (
                        <div key={event.id} className="calendar-event" title={event.description}>
                            {formatEventTime(event.dateTime)} {event.title}
                        </div>
                    ))}
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div className="calendar-row" key={day}>
                {days}
            </div>
        );
    }

    return <div className="calendar-grid">{rows}</div>;
};

export default CalendarGrid;