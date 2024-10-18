import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, addDays, isSameDay } from "date-fns";


// CalendarGrid Component
const CalendarGrid = ({ currentDate, eventDates, }) => {
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
            const eventsForDay = eventDates?.filter(event =>
                isSameDay(cloneDay, new Date(event.event_date))
            );
            days.push(
                <div
                    className={`calendar-day ${!isSameMonth(day, currentDate) ? 'different-month' : ''} ${isSameDay(day, Date()) ? 'today' : ''}`}
                    key={day}
                >
                    <div className="calendar-day-header">{format(day, dateFormat)}</div>
                    {eventsForDay?.sort((a, b) => new Date(a.event_date) - new Date(b.event_date)).map((event, index) => (
                        <div key={event.id + ' ' + index} className="calendar-event" title={event.event_description}>
                            {formatEventTime(event.event_date)} {event.event_title}
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