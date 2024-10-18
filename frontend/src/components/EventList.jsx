import EventItem from "./EventItem";


// EventList Component
const EventList = ({ events, editEvent, deleteEvent }) => {
    return (
        <div className="event-list">
            {events
                ?.sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
                .map(event => (
                    <EventItem
                        key={event?.id}
                        event={event}
                        editEvent={editEvent}
                        deleteEvent={deleteEvent}
                    />
                ))
            }
        </div>
    );
}

export default EventList;