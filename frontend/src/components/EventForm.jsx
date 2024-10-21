import RecurrenceDateInput from "./RecurrenceDateInput";


// EventForm Component
const EventForm = ({ event, setEvent, handleSubmit, isRecurring, setIsRecurring }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className='form-row'>
        <div className='form-col small'>
          <input
            type="text"
            aria-label='event-title'
            value={event && event.event_title ? event.event_title : ''}
            onChange={(e) => setEvent(prev => ({ ...prev, event_title: e.target.value }))}
            placeholder="Event Title"
            required
          />
          <input
            type="text"
            aria-label='event-location'
            value={event && event.event_location ? event.event_location : ''}
            onChange={(e) => setEvent(prev => ({ ...prev, event_location: e.target.value }))}
            placeholder="Event Location"
          />
          <input
            type="text"
            aria-label='event-organizer'
            value={event && event.event_organizer ? event.event_organizer : ''}
            onChange={(e) => setEvent(prev => ({ ...prev, event_organizer: e.target.value }))}
            placeholder="Event Organizer"
          />
          <input
            type="datetime-local"
            aria-label='event-date'
            className='date-input'
            value={event && event.event_date ? event.event_date : ''}
            onChange={(e) => setEvent(prev => ({ ...prev, event_date: e.target.value }))}
            required
          />
          <div className="recurrence-toggle-wrapper">
            <span className="recurrence-toggle-description">{isRecurring ? "Recurring Event" : "Single Occurence"}</span>
            <div className="recurrence-toggle" onClick={() => setIsRecurring(prev => !prev)}>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={() => setIsRecurring(prev => !prev)}
                id="recurrence-toggle-checkbox"
                className="recurrence-toggle-checkbox"
              />
              <label htmlFor="recurrence-toggle-checkbox" className="recurrence-toggle-label">
                <span className="recurrence-toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        <div className='form-col large'>
          <textarea
            aria-label='event-description'
            value={event && event.event_description ? event.event_description : ''}
            onChange={(e) => setEvent(prev => ({ ...prev, event_description: e.target.value }))}
            placeholder="Event Description"
            required
          />
        </div>
      </div>
      {isRecurring &&
        <>
          <div className='form-row recurrence'>
            <div className='select-col form-col recurrence'>
              <label htmlFor='type-of-recurrence'>Recurrence Type</label>
              <select
                name='type-of-recurrence'
                className='type-select'
                value={event?.recurrence?.recurrence_type || "standard"}
                onChange={(e) => setEvent(prev => ({ ...prev, recurrence: { ...prev.recurrence, recurrence_type: e.target.value } }))}
              >
                <option value={"standard"}>Standard Recurrence</option>
                <option value={"every nth"}>Every Nth Recurrence</option>
                <option value={"specific day"}>Specific Day Recurrence</option>
                <option value={"relative date"}>Relative Date Recurrence</option>
              </select>
            </div>
            <div className='select-col form-col recurrence'>
              <label htmlFor='time-unit'>Time Unit</label>
              <select
                name='time-unit'
                className='type-select'
                value={event?.recurrence?.time_unit || "day"}
                onChange={(e) => setEvent(prev => ({ ...prev, recurrence: { ...prev.recurrence, time_unit: e.target.value } }))}
              >
                {event?.recurrence?.recurrence_type !== 'specific day' ? (
                  <>
                    {event?.recurrence?.recurrence_type !== 'relative date' && <>
                      <option value={""}>Select Time Unit</option>
                      <option value={"day"}>{event?.recurrence?.recurrence_type === 'standard' ? "Daily" : "Day"}</option>
                      <option value={"week"}>Week{event?.recurrence?.recurrence_type === 'standard' && "ly"}</option>
                    </>}
                    <option value={"month"}>Month{(event?.recurrence?.recurrence_type === 'standard' || event?.recurrence?.recurrence_type === 'relative date') && "ly"}</option>
                    <option value={"year"}>Year{(event?.recurrence?.recurrence_type === 'standard' || event?.recurrence?.recurrence_type === 'relative date') && "ly"}</option>
                  </>
                ) : (
                  <option value={"day"}>Day</option>
                )}
              </select>
            </div>
            <RecurrenceDateInput recurrenceTimeUnit={event?.recurrence?.time_unit} recurrence={event?.recurrence} setEvent={setEvent} />
          </div>
          <div className='form-row'>
            <div className='form-col recurrence'>
              <label htmlFor='recurrence-description'>Recurrence Description</label>
              <textarea
                placeholder='No Recurrence Chosen'
                readOnly
                value={(() => {
                  const { recurrence_type, time_unit, recurrence_amount, selected_days, relative_recurrence_by } = event.recurrence;

                  const convertTimeTo12Hour = (time24) => {
                    let [hours, minutes] = time24.split(':');
                    hours = parseInt(hours, 10);
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12 || 12; // Convert 0 to 12 for midnight
                    return `${hours}:${minutes || '00'} ${ampm}`;
                  };

                  const getDaySuffix = (day) => {
                    if (day > 3 && day < 21) return 'th';
                    switch (day % 10) {
                      case 1: return 'st';
                      case 2: return 'nd';
                      case 3: return 'rd';
                      default: return 'th';
                    }
                  };

                  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                  console.log(recurrence_type)
                  if (recurrence_type === 'standard') {
                    if (time_unit === 'day') {
                      return `This event recurs daily at ${convertTimeTo12Hour(recurrence_amount)}.`;
                    } else if (time_unit === 'week') {
                      return `This event recurs weekly on the specified days which are ${selected_days ? selected_days?.join(", ") : "unspecified days"} at the time of ${convertTimeTo12Hour(recurrence_amount)}.`;
                    } else if (time_unit === 'month') {
                      return `This event recurs monthly on the same date which is on the ${recurrence_amount}${getDaySuffix(recurrence_amount)} of the month.`;
                    } else if (time_unit === 'year') {
                      return `This event recurs yearly on the same date which is on ${recurrence_amount}.`;
                    }
                  } else if (recurrence_type === 'every nth') {
                    if (time_unit === 'day') {
                      return `This event recurs every ${recurrence_amount} day(s).`;
                    } else if (time_unit === 'week') {
                      return `This event recurs every ${recurrence_amount} week(s).`;
                    } else if (time_unit === 'month') {
                      return `This event recurs every ${recurrence_amount} month(s).`;
                    } else if (time_unit === 'year') {
                      return `This event recurs every ${recurrence_amount} year(s).`;
                    }
                  } else if (recurrence_type === 'specific day') {
                    return `This event recurs on every ${daysOfWeek?.[parseInt(recurrence_amount)]} at ${convertTimeTo12Hour(new Date(event.event_date).getHours() + ":" + new Date(event.event_date).getMinutes())}.`;
                  } else if (recurrence_type === 'relative date') {
                    if (time_unit === "month") {
                      return `This event recurs on the ${relative_recurrence_by || ''}${(isNaN(relative_recurrence_by) && relative_recurrence_by) || ''} ${daysOfWeek?.[parseInt(recurrence_amount)] || ''} of every month.`;
                    } else if (time_unit === 'year') {
                      return `This event recurs on the ${relative_recurrence_by || ''}${(isNaN(relative_recurrence_by) && relative_recurrence_by) || ''} ${daysOfWeek?.[parseInt(recurrence_amount)] || ''} of ${event.event_date && new Date(event.event_date)?.toLocaleString('default', { month: 'long' })} every year.`;
                    }
                    else {
                      return 'This event recurs on relative weekdays compared to the month or year'
                    }
                  }

                  return `No Recurrence Chosen`;
                })()}
              />
            </div>
          </div>
        </>
      }
      <button type="submit">{event && event.id ? 'Update Event' : 'Add Event'}</button>
    </form>
  )
};

export default EventForm;;