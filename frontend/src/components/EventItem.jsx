// EventItem Component
const EventItem = ({ event, editEvent, deleteEvent }) => (
    <div className="event">
        <div>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <small>{new Date(event.dateTime).toLocaleString()}</small>
        </div>
        <div className="event-actions">
            <button onClick={() => editEvent(event)}>Edit</button>
            <button onClick={() => deleteEvent(event._id)}>Delete</button>
        </div>
    </div>
);
export default EventItem;