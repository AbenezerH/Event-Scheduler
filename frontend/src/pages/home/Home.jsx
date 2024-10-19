import "./home.css";
import { useState, useEffect } from "react";
import EventForm from '../../components/EventForm.jsx';
import EventList from '../../components/EventList.jsx';
import Calendar from '../../components/Calendar.jsx';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addWeeks, subDays, differenceInCalendarDays, addMonths, differenceInCalendarMonths, addYears, differenceInCalendarYears, addDays } from "date-fns";


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
	const [currentEvent, setCurrentEvent] = useState({ event_title: '', event_description: '', event_location: '', event_organizer: '', event_date: '', recurrence: { recurrence_type: 'standard', time_unit: 'day', recurrence_amount: '1' } });
	const [isDarkTheme, setIsDarkTheme] = useState(true);
	const [activeTab, setActiveTab] = useState('list');
	const [loading, setLoading] = useState(true);
	const [currentDate, setCurrentDate] = useState(new Date());

	useEffect(() => {
		const checkTokenExpiration = () => {
			const storedToken = JSON.parse(localStorage.getItem('token'));
			if (storedToken && storedToken.value) {
				const currentTime = new Date().getTime();
				console.log(currentTime, storedToken.expiration);
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

		/* const refreshAuthToken = async (refreshToken) => {
			try {
				const res = await axios.post('http://localhost:5000/token', {}, { withCredentials: true });
				console.log('Refresh Response:', res.data);
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
				console.error(error);
				setIsAuthenticated(false);
				setLoading(false);
			}
		}; */

		const refreshAuthToken = async (refreshToken) => {
			try {
				const res = await axios.post('http://localhost:5000/token', {}, { withCredentials: true });
				console.log('Refresh Response:', res.data);
				const data = res.data;
				if (data && data.token) {
					try {
						const decodedToken = jwtDecode(data.token);
						const expirationTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes from now
						const newToken = { value: data.token, refreshToken: refreshToken, expiration: expirationTime };
						localStorage.setItem('token', JSON.stringify(newToken));
						console.log("Token refreshed:", newToken);
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
				console.error(error);
				setIsAuthenticated(false);
				setLoading(false);
			}
		};


		checkTokenExpiration();
		const intervalId = setInterval(checkTokenExpiration, 5 * 60 * 1000); // Check every 5 minutes

		return () => clearInterval(intervalId);
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
			setIsRecurring(false);
			await fetchEvents();
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
			await fetchEvents();
			setIsRecurring(false);
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
				const { event_id, event_description, event_date, event_title, recurrence } = event;
				// const currentDate = new Date(startDate);
				const eventDate = new Date(event_date);

				if (!recurrence?.recurrence_id && eventDate >= startDate && eventDate <= endDate) {
					allEvents.push({
						event_title: event_title,
						event_date: eventDate?.toLocaleString(),
						event_description: event_description,
						event_id: event_id,
					});
				}

				if (recurrence?.recurrence_id) {
					let currentDate = new Date(eventDate);

					while (currentDate <= endDate) {
						// standard repeating it repeats on the time unit specified but for weekly we can create multiple days of the week that repeat
						if (recurrence?.recurrence_type === "standard") {
							const dayOfWeek = daysOfWeek[currentDate.getUTCDay()];
							// standard and daily repeat
							if (recurrence.time_unit === 'day') {
								if (currentDate >= startDate && currentDate <= endDate) {
									allEvents.push({
										event_title: event_title,
										event_date: currentDate.toLocaleString(),
										event_description: event_description,
										event_id: event_id,
									});
								}
								currentDate.setDate(currentDate.getDate() + 1);
							}
							// standard and weekly repeat
							else if (recurrence.time_unit === 'week' && recurrence?.selected_days?.includes(dayOfWeek)) {
								allEvents.push({
									event_date: new Date(
										currentDate?.getFullYear(),
										currentDate?.getMonth(),
										currentDate?.getDate(),
										parseInt(recurrence?.recurrence_amount?.split(":")[0]),
										parseInt(recurrence?.recurrence_amount?.split(":")[1])
									)?.toLocaleString(),
									event_title: event_title,
									event_description: event_description,
									event_id: event_id,
								});
								currentDate.setDate(currentDate.getDate() + 1);
							}
							// standard and monthly repeat
							else if (recurrence?.time_unit === 'month' && currentDate.getDate() === parseInt(recurrence.recurrence_amount)) {
								allEvents.push({
									event_date: currentDate.toLocaleString(),
									event_title: event_title,
									event_description: event_description,
									event_id: event_id,
								});
								currentDate.setDate(currentDate.getDate() + 1);
							}
							// standard and yearly repeat
							else if (recurrence?.time_unit === 'year' &&
								currentDate.getDate() === parseInt(recurrence.recurrence_amount.split('-')[1]) &&
								currentDate.getMonth() === months.indexOf(recurrence.recurrence_amount.split('-')[0])) {
								allEvents.push({
									event_date: new Date(currentDate.getFullYear(), months.indexOf(recurrence.recurrence_amount.split('-')[0]), parseInt(recurrence.recurrence_amount.split('-')[1])).toLocaleString(),
									event_title: event_title,
									event_description: event_description,
									event_id: event_id,
								});
								currentDate.setFullYear(currentDate.getFullYear() + 1);
							} else {
								currentDate.setDate(currentDate.getDate() + 1);
							}
						}
						// repeats every nth time unit which is the repeating frequence and the time unit respectively
						else if (recurrence?.recurrence_type === "every nth") {
							// every nth and day
							if (recurrence?.time_unit === 'day' && differenceInCalendarDays(currentDate, event_date) % parseInt(recurrence?.recurrence_amount) === 0) {
								if (currentDate >= startDate && currentDate <= endDate) {
									allEvents.push({
										event_title: event_title,
										event_date: new Date(currentDate),
										event_description: event_description,
										event_id: event_id,
									});
									currentDate.setDate(currentDate.getDate() + parseInt(recurrence?.recurrence_amount) - 1); // off by one error so we need to subtract 1 because we have an additional code out of the condition to increament the date
								}
							}
							// every nth and week
							else if (recurrence?.time_unit === 'week' &&
								differenceInCalendarDays(currentDate, event_date) % 7 === 0 &&
								(differenceInCalendarDays(currentDate, event_date) / 7) % parseInt(recurrence?.recurrence_amount) === 0) {
								if (currentDate >= startDate && currentDate <= endDate) {
									allEvents.push({
										event_title: event_title,
										event_date: new Date(currentDate).toLocaleString(),
										event_description: event_description,
										event_id: event_id,
									});
									currentDate = subDays(addWeeks(currentDate, parseInt(recurrence?.recurrence_amount)), 1)
								}
							}
							// every nth and week
							else if (recurrence?.time_unit === 'month' &&
								currentDate?.getDate() === new Date(event_date)?.getDate() &&
								differenceInCalendarMonths(currentDate, event_date) % parseInt(recurrence?.recurrence_amount) === 0) {
								if (currentDate >= startDate && currentDate <= endDate) {
									allEvents.push({
										event_title: event_title,
										event_date: new Date(currentDate).toLocaleString(),
										event_description: event_description,
										event_id: event_id,
									});
									currentDate = addMonths(currentDate, parseInt(recurrence?.recurrence_amount));
								}
							}
							// every nth and year
							else if (recurrence?.time_unit === 'year' &&
								currentDate?.getDate() === new Date(event_date).getDate() &&
								currentDate?.getMonth() === new Date(event_date).getMonth() &&
								differenceInCalendarYears(currentDate, event_date) % parseInt(recurrence?.recurrence_amount) === 0) {
								if (currentDate >= startDate && currentDate <= endDate) {
									allEvents.push({
										event_title: event_title,
										event_date: new Date(currentDate).toLocaleString(),
										event_description: event_description,
										event_id: event_id,
									});
									currentDate = addYears(currentDate, parseInt(recurrence?.recurrence_amount));
								}
							}
							currentDate.setDate(currentDate.getDate() + 1);
						}
						// specific day repeating like every monday
						else if (recurrence?.recurrence_type === "specific day") {
							if (currentDate >= startDate && currentDate <= endDate && currentDate.getDay() === parseInt(recurrence?.recurrence_amount)) {
								allEvents.push({
									event_date: currentDate.toLocaleString(),
									event_title: event_title,
									event_description: event_description,
									event_id: event_id,
								})
								currentDate = addWeeks(currentDate, 1);
							}
							else {
								currentDate = addDays(currentDate, 1);
							}
						}
						// repeats on relative days like the 1/3/last monday of the month/year ...
						else if (recurrence?.recurrence_type === "relative date") {

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
