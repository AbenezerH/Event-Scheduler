// EventItem Component
const EventItem = ({ event, editEvent, deleteEvent }) => (
    <div className="event">
        <div>
            <h3>{event?.event_title}</h3>
            <p>{event?.event_description}</p>
            <small>{new Date(event?.event_date)?.toLocaleString()}</small>
        </div>
        <div className="event-actions">
            <button onClick={() => editEvent(event)}>Edit</button>
            <button onClick={() => deleteEvent(event?.id)}>Delete</button>
        </div>
    </div>
);
export default EventItem;