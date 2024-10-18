import "./home.css";
import { useState, useEffect } from "react";
import EventForm from '../../components/EventForm.jsx';
import EventList from '../../components/EventList.jsx';
import Calendar from '../../components/Calendar.jsx';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";


const fetcher = async (url) => {
	const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).value : null;
	try {
		const res = await axios.get(url, {
			headers: {
				'Authorization': `Bearer ${token}`
			},
			withCredentials: true
		});
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
	try {
		const res = await axios.put(url, data, {
			headers: { 'Authorization': `Bearer ${token}` },
			withCredentials: true
		});
		return res.data;
	} catch (error) {
		console.error(error);
		return null;
	}
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

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
	const [eventsRecurringDate, setEventsRecurringDate] = useState([]);
	const [isRecurring, setIsRecurring] = useState(false);
	const [currentEvent, setCurrentEvent] = useState({ event_title: '', event_description: '', event_location: '', event_organizer: '', event_date: '', recurrence: { recurrence_type: 'standard', time_unit: 'day' } });
	const [isDarkTheme, setIsDarkTheme] = useState(true);
	const [activeTab, setActiveTab] = useState('list');
	const [loading, setLoading] = useState(true);
	const [currentDate, setCurrentDate] = useState(new Date());

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
			setEvents(data?.map(anEvent => (anEvent && {
				...anEvent, event_date: formatDate(anEvent?.event_date),
				recurrence: {
					recurrence_amount: anEvent?.recurrence_amount,
					recurrence_description: anEvent?.recurrence_description,
					relative_recurrence_by: anEvent?.relative_recurrence_by,
					recurrence_type: anEvent?.recurrence_type,
					selected_days: anEvent?.selected_days,
					time_unit: anEvent?.time_unit,
					recurrence_id: anEvent?.recurrence_id,
				}
			})));
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
			setCurrentEvent({ event_title: '', event_description: '', event_location: '', event_organizer: '', event_date: '', recurrence: { recurrence_type: 'standard', time_unit: 'day' } });
		}
	};

	const addEvent = async () => {
		if (!currentEvent) return;

		const { recurrence, ...eventData } = currentEvent; // Destructure to separate recurrence data

		// Format event_date to ISO string as expected by the backend
		eventData.event_date = new Date(eventData.event_date).toLocaleString();

		// Prepare the data to be sent, including recurrence if available
		const newEvent = await scheduleDatabase.addEvent({
			...eventData,
			user_id: userId,
			...(isRecurring && { recurrence })
		});

		if (newEvent?.length > 0) {
			// Update the local events state
			setEvents([...events,
			{
				...newEvent[0],
				event_date: new Date(newEvent[0]?.event_date).toLocaleString(),
				recurrence: isRecurring && {
					recurrence_amount: newEvent[0]?.recurrence_amount,
					recurrence_description: newEvent[0]?.recurrence_description,
					relative_recurrence_by: newEvent[0]?.relative_recurrence_by,
					recurrence_type: newEvent[0]?.recurrence_type,
					selected_days: newEvent[0]?.selected_days,
					time_unit: newEvent[0]?.time_unit,
				}
			}]);
		}
	};

	const updateEvent = async () => {
		if (!currentEvent || !currentEvent.id) return;

		const { recurrence, ...eventData } = currentEvent; // Destructure to separate recurrence data
		const updatedEvent = await scheduleDatabase.updateEvent(eventData.id, {
			...eventData,
			user_id: userId,
			event_time: new Date(currentEvent?.event_date)?.getTime(),
			...(isRecurring && { recurrence })
		});

		if (updatedEvent) {
			setEvents(events.map(event => event.id === currentEvent.id ?
				{
					...updatedEvent?.[0],
					event_date: formatDate(updatedEvent?.[0]?.event_date),
					recurrence: isRecurring && {
						recurrence_amount: updatedEvent[0]?.recurrence_amount,
						recurrence_description: updatedEvent[0]?.recurrence_description,
						relative_recurrence_by: updatedEvent[0]?.relative_recurrence_by,
						recurrence_type: updatedEvent[0]?.recurrence_type,
						selected_days: updatedEvent[0]?.selected_days,
						time_unit: updatedEvent[0]?.time_unit,
					}
				} :
				event));
			setIsRecurring(true);
		}
	};

	const deleteEvent = async (id) => {
		if (!id) return;
		const deletionStatus = await scheduleDatabase.deleteEvent(id);
		if (deletionStatus) {
			setEvents(events.filter(event => event.id !== id));
		}
	};

	const editEvent = (event) => {
		if (event) {
			setCurrentEvent(event);
			setIsRecurring(true);
		}
	};

	const toggleTheme = () => {
		setIsDarkTheme(!isDarkTheme);
	};

	useEffect(() => {
		const startOfMonthVar = startOfMonth(currentDate);
		const endOfMonthVar = endOfMonth(currentDate);
		const startDateVar = startOfWeek(startOfMonthVar);
		const endDateVar = endOfWeek(endOfMonthVar);
		const daysOfWeek = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];

		const generateEvents = (events, startDate = new Date(), endDate = new Date(new Date().setDate(new Date().getDate() + 30))) => {
			const allEvents = [];

			events.forEach(event => {
				const { event_id, event_description, event_title, recurrence } = event;
				const currentDate = new Date(startDate);

				if (recurrence) {
					while (currentDate <= endDate) {
						const dayOfWeek = daysOfWeek[currentDate.getUTCDay()];

						if (recurrence.time_unit === 'day') {
							allEvents.push({
								event_date: new Date(
									currentDate?.getFullYear(),
									currentDate?.getMonth(),
									currentDate?.getDate(),
									parseInt(recurrence?.recurrence_amount?.split(":")[0]),
									parseInt(recurrence?.recurrence_amount?.split(":")[1])
								)?.toISOString(),
								event_title: event_title,
								event_description: event_description,
								event_id: event_id,
							});
							currentDate.setDate(currentDate.getDate() + 1);
						} else if (recurrence.time_unit === 'week' && recurrence.selected_days.includes(dayOfWeek)) {
							allEvents.push({
								event_date: new Date(
									currentDate?.getFullYear(),
									currentDate?.getMonth(),
									currentDate?.getDate(),
									parseInt(recurrence?.recurrence_amount?.split(":")[0]),
									parseInt(recurrence?.recurrence_amount?.split(":")[1])
								)?.toISOString(),
								event_title: event_title,
								event_description: event_description,
								event_id: event_id,
							});
							currentDate.setDate(currentDate.getDate() + 1);
						} else if (recurrence?.time_unit === 'month' && currentDate.getDate() === parseInt(recurrence.recurrence_amount)) {
							allEvents.push({
								event_date: new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(recurrence.recurrence_amount)).toISOString(),
								event_title: event_title,
								event_description: event_description,
								event_id: event_id,
							});
							currentDate.setMonth(currentDate.getMonth() + 1);
						} else if (recurrence?.time_unit === 'year' &&
							currentDate.getDate() === parseInt(recurrence.recurrence_amount.split('-')[1]) &&
							currentDate.getMonth() === months.indexOf(recurrence.recurrence_amount.split('-')[0])) {
							console.log(new Date(currentDate.getFullYear(), months.indexOf(recurrence.recurrence_amount.split('-')[0]), parseInt(recurrence.recurrence_amount.split('-')[1])).toISOString(),)
							allEvents.push({
								event_date: new Date(currentDate.getFullYear(), months.indexOf(recurrence.recurrence_amount.split('-')[0]), parseInt(recurrence.recurrence_amount.split('-')[1])).toISOString(),
								event_title: event_title,
								event_description: event_description,
								event_id: event_id,
							});
							currentDate.setFullYear(currentDate.getFullYear() + 1);
						} else {
							currentDate.setDate(currentDate.getDate() + 1);
						}
					}
				}
			});

			return allEvents;
		};

		setEventsRecurringDate(generateEvents(events, startDateVar, endDateVar));
	}, [events, currentDate]);

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
				<EventList events={events} editEvent={editEvent} deleteEvent={deleteEvent} eventDates={eventsRecurringDate} setEventDates={setEventsRecurringDate} />
			) : (
				<Calendar eventDates={eventsRecurringDate} setEventDates={setEventsRecurringDate} currentDate={currentDate} setCurrentDate={setCurrentDate} />
			)}
		</div>
	);
}

export default Home;
