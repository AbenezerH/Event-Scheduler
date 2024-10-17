import "./home.css";
import { useState, useEffect } from "react";
import EventForm from '../../components/EventForm.jsx';
import EventList from '../../components/EventList.jsx';
import Calendar from '../../components/Calendar.jsx';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const fetcher = async (url) => {
    const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).value : null;
    try {
        const res = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        });
        console.log(res.data)
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};
const postData = async (url, data) => {
    const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).value : null;
    try {
        const res = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        return console.error(error);
    }
};
const putData = async (url, data) => {
    const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).value : null;
    return axios.put(url, data, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        withCredentials: true
    }).then(res => res.data)
        .catch(error => console.error(error));
};
const deleteData = async (url) => {
    const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).value : null;
    return axios.delete(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        withCredentials: true
    }).then(res => res.status === 200)
        .catch(error => console.error(error));
}

const scheduleDatabase = (() => {
    const eventUrl = "http://localhost:5000/event/";
    return {
        getEvents: async () => { return await fetcher(eventUrl) },
        addEvent: async (newEvent) => { return await postData(eventUrl, newEvent) },
        updateEvent: async (id, UpdatedEvent) => { return await putData(eventUrl + id, UpdatedEvent) },
        deleteEvent: async (id) => { return await deleteData(eventUrl + id) },
    }
})()

const formatDate = (date) => {
    const d = new Date(date);
    const pad = (num) => (num < 10 ? '0' : '') + num;
    const ret = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    return ret
};

// Home/main Component
function Home({ setIsAuthenticated, setToken }) {
    const [userId, setUserId] = useState();
    const [events, setEvents] = useState([]);
    const [recurrenceData, setRecurrenceData] = useState({ recurrence_type: 'standard', time_unit: 'day' });
    const [isRecurring, setIsRecurring] = useState(false);
    const [currentEvent, setCurrentEvent] = useState({ event_title: '', event_description: '', event_location: '', event_organizer: '', event_date: '' });
    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const [activeTab, setActiveTab] = useState('list');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkTokenExpiration = () => {
            const storedToken = JSON.parse(localStorage.getItem('token'));
            if (storedToken && storedToken.value) {
                const currentTime = new Date().getTime();
                if (currentTime > storedToken.expiration) {
                    refreshAuthToken(storedToken.refreshToken);
                } else {
                    try {
                        const decodedToken = jwtDecode(storedToken.value);
                        setIsAuthenticated(true);
                        setUserId(decodedToken.user_id);
                        setLoading(false);
                    } catch (error) {
                        console.error('Invalid token:', error);
                        setIsAuthenticated(false);
                        setLoading(false);
                    }
                }
            } else {
                setIsAuthenticated(false);
                setLoading(false);
            }
        };

        const refreshAuthToken = async (refreshToken) => {
            try {
                const res = await axios.post('http://localhost:5000/token', {}, { withCredentials: true });
                const data = res.data;
                if (data && data.token) {
                    try {
                        const decodedToken = jwtDecode(data.token);
                        const expirationTime = new Date().getTime() + 3600 * 1000; // 1 hour from now
                        const newToken = {
                            value: data.token,
                            refreshToken: refreshToken,
                            expiration: expirationTime
                        };
                        localStorage.setItem('token', JSON.stringify(newToken));
                        setIsAuthenticated(true);
                        setUserId(decodedToken.user_id);
                        setLoading(false);
                    } catch (error) {
                        console.error('Invalid token:', error);
                        setIsAuthenticated(false);
                        setLoading(false);
                    }
                } else {
                    setIsAuthenticated(false);
                    setLoading(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
                setLoading(false);
            }
        };

        checkTokenExpiration();
    }, [setIsAuthenticated, setToken]);


    useEffect(() => {
        fetchEvents();
        document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
    }, [isDarkTheme]);


    const fetchEvents = async () => {
        const data = await scheduleDatabase.getEvents();
        if (data) {
            setEvents(data?.map(anEvent => (anEvent && { ...anEvent, event_date: formatDate(anEvent?.event_date) })));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentEvent) {
            if (currentEvent.id) {
                updateEvent();
            } else {
                addEvent();
            }
            setCurrentEvent({ event_title: '', event_description: '', event_location: '', event_organizer: '', event_date: '' });
        }
    };

    const addEvent = async () => {
        if (!currentEvent) return;
        const newEvent = await scheduleDatabase.addEvent(
            {
                event_title: currentEvent.event_title,
                user_id: userId,
                event_description: currentEvent.event_description,
                event_date: new Date(currentEvent.event_date)?.toLocaleString(),
                event_time: new Date(currentEvent.event_date)?.getTime(),
                event_location: currentEvent.event_location,
                event_organizer: currentEvent.event_organizer,
            });

        console.log(newEvent);
        if (newEvent) {
            setEvents([...events, { ...newEvent?.[0], event_date: formatDate(newEvent?.[0]?.event_date) }]);
        }
    };

    const updateEvent = async () => {
        if (!currentEvent || !currentEvent.id) return;
        const updatedEvent = await scheduleDatabase.updateEvent(currentEvent.id, { ...currentEvent, event_time: new Date(currentEvent?.event_date)?.getTime() });
        if (updatedEvent) {
            setEvents(events.map(event => event.id === currentEvent.id ? { ...updatedEvent?.[0], event_date: formatDate(updatedEvent?.[0]?.event_date) } : event));
        }
    };

    const deleteEvent = async (id) => {
        if (!id) return;
        if (scheduleDatabase.deleteEvent(id)) {
            setEvents(events.filter(event => event.id !== id));
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

    if (loading) {
        return <div>Loading...</div>;
    }

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

export default Home;
