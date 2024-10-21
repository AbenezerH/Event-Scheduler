// EventItem Component
const EventItem = ({ event, editEvent, deleteEvent }) => (
    <div className="event">
        <div>
            <h2 className="event-title">{event?.event_title?.charAt(0).toUpperCase() + event?.event_title?.slice(1)}</h2>
            <p><b>Event Description:</b> {event?.event_description}</p>
            <p><b>Event Location:</b> {event?.event_location}</p>
            <p><b>Event Organizer:</b> {event?.event_organizer}</p>
            <small>{new Date(event?.event_date)?.toLocaleString()}</small>
        </div>
        <div className="event-actions">
            <button onClick={() => editEvent(event)}>Edit</button>
            <button onClick={() => deleteEvent(event?.id)}>Delete</button>
        </div>
    </div>
);
export default EventItem;