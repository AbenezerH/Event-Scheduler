import EventItem from "./EventItem";


// EventList Component
const EventList = ({ events, editEvent, deleteEvent }) => (
    <div className="event-list">
        {events?.map((event) => (
            <EventItem key={event?.id} event={event} editEvent={editEvent} deleteEvent={deleteEvent} />
        ))}
    </div>
);

export default EventList;