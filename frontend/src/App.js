import './App.css';
import { useState, useEffect } from "react";
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import Calendar from './components/Calendar';

// Mock Database
const mockDatabase = (() => {
  let events = JSON.parse(localStorage.getItem('events')) || [];
  let nextId = Math.max(0, ...events.map(e => e._id || 0)) + 1;

  const saveEvents = () => {
    localStorage.setItem('events', JSON.stringify(events));
  };

  return {
    getEvents: () => [...events],
    addEvent: (event) => {
      const newEvent = { ...event, _id: nextId++ };
      events.push(newEvent);
      saveEvents();
      return newEvent;
    },
    updateEvent: (id, updatedEvent) => {
      const index = events.findIndex(e => e._id === id);
      if (index !== -1) {
        events[index] = { ...updatedEvent, _id: id };
        saveEvents();
        return events[index];
      }
      return null;
    },
    deleteEvent: (id) => {
      const index = events.findIndex(e => e._id === id);
      if (index !== -1) {
        events.splice(index, 1);
        saveEvents();
        return true;
      }
      return false;
    }
  };
})();

// App Component
function App() {
  const [events, setEvents] = useState([]);
  const [recurrenceData, setRecurrenceData] = useState({ recurrence_type: 'standard', time_unit: 'day' });
  const [isRecurring, setIsRecurring] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({ title: '', description: '', dateTime: '' });
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    fetchEvents();
    document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
  }, [isDarkTheme]);

  const fetchEvents = () => {
    setEvents(mockDatabase.getEvents());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentEvent) {
      if (currentEvent._id) {
        updateEvent();
      } else {
        addEvent();
      }
      setCurrentEvent({ title: '', description: '', dateTime: '' });
    }
  };

  const addEvent = () => {
    if (!currentEvent) return;
    const newEvent = mockDatabase.addEvent(currentEvent);
    setEvents([...events, newEvent]);
  };

  const updateEvent = () => {
    if (!currentEvent || !currentEvent._id) return;
    const updatedEvent = mockDatabase.updateEvent(currentEvent._id, currentEvent);
    if (updatedEvent) {
      setEvents(events.map(event => event._id === currentEvent._id ? updatedEvent : event));
    }
  };

  const deleteEvent = (id) => {
    if (!id) return;
    if (mockDatabase.deleteEvent(id)) {
      setEvents(events.filter(event => event._id !== id));
    }
  };

  const editEvent = (event) => {
    if (event) {
      setCurrentEvent(event);
    }
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className="container">
      <div className="theme-toggle">
        <label className="switch">
          <input type="checkbox" checked={isDarkTheme} onChange={toggleTheme} />
          <span className="slider"></span>
        </label>
      </div>
      <h1>Event Calendar</h1>
      <EventForm
        event={currentEvent}
        setEvent={setCurrentEvent}
        recurrenceData={recurrenceData}
        setRecurrenceData={setRecurrenceData}
        handleSubmit={handleSubmit}
        isRecurring={isRecurring}
        setIsRecurring={setIsRecurring}
      />
      <div className="tabs">
        <div
          className={`tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          List View
        </div>
        <div
          className={`tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar View
        </div>
      </div>
      {activeTab === 'list' ? (
        <EventList events={events} editEvent={editEvent} deleteEvent={deleteEvent} />
      ) : (
        <Calendar events={events} />
      )}
    </div>
  );
}

export default App;
