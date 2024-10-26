import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, addDays, isSameDay } from "date-fns";

const colors = [
    "#5F9EA0", "#FF8C00", "#32CD32", "#DC143C", "#9370DB", "#8B4513", "#DDA0DD",
    "#696969", "#BDB76B", "#4682B4", "#B0C4DE", "#FFD700", "#98FB98", "#FA8072",
    "#C71585", "#D3D3D3", "#FFDAB9", "#87CEFA", "#FFE4C4", "#AFEEEE"
];

const getColorForEvent = (eventTitle, colorMap) => {
    if (!colorMap[eventTitle]) {
        const index = Object.keys(colorMap).length % colors.length;
        colorMap[eventTitle] = colors[index];
    }
    return colorMap[eventTitle];
};

// CalendarGrid Component
const CalendarGrid = ({ currentDate, eventDates }) => {
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

    const colorMap = {};

    while (day <= endDateVar) {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const cloneDay = day;
            const eventsForDay = eventDates?.filter(event =>
                isSameDay(cloneDay, new Date(event.event_date))
            );
            days.push(
                <div
                    className={`calendar-day ${!isSameMonth(day, currentDate) ? 'different-month' : ''} ${isSameDay(day, new Date()) ? 'today' : ''}`}
                    key={day}
                >
                    <div className="calendar-day-header">{format(day, dateFormat)}</div>
                    {eventsForDay?.sort((a, b) => new Date(a.event_date) - new Date(b.event_date)).map((event, index) => (
                        <div
                            key={event?.event_id + ' ' + index}
                            className="calendar-event"
                            title={event.event_description}
                            style={{ backgroundColor: getColorForEvent(event.event_title, colorMap) }}
                        >
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