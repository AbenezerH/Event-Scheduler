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
            onChange={(e) => setEvent({ ...event, event_title: e.target.value })}
            placeholder="Event Title"
            required
          />
          <input
            type="text"
            aria-label='event-location'
            value={event && event.event_location ? event.event_location : ''}
            onChange={(e) => setEvent({ ...event, event_location: e.target.value })}
            placeholder="Event Location"
          />
          <input
            type="text"
            aria-label='event-organizer'
            value={event && event.event_organizer ? event.event_organizer : ''}
            onChange={(e) => setEvent({ ...event, event_organizer: e.target.value })}
            placeholder="Event Organizer"
          />
          <input
            type="datetime-local"
            aria-label='event-date'
            className='date-input'
            value={event && event.event_date ? event.event_date : ''}
            onChange={(e) => setEvent({ ...event, event_date: e.target.value })}
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
            onChange={(e) => setEvent({ ...event, event_description: e.target.value })}
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
                <option value={""}>Select Time Unit</option>
                <option value={"hour"}>Hour{event?.recurrence?.recurrence_type === 'standard' && "ly"}</option>
                <option value={"day"}>{event?.recurrence?.recurrence_type === 'standard' ? "Daily" : "Day"}</option>
                <option value={"week"}>Week{event?.recurrence?.recurrence_type === 'standard' && "ly"}</option>
                <option value={"month"}>Month{event?.recurrence?.recurrence_type === 'standard' && "ly"}</option>
                <option value={"year"}>Year{event?.recurrence?.recurrence_type === 'standard' && "ly"}</option>
              </select>
            </div>
            <RecurrenceDateInput recurrenceTimeUnit={event?.recurrence?.time_unit} recurrence={event?.recurrence} setRecurrence={(data) => setEvent(prev => ({ ...prev, recurrence: data }))} />
          </div>
          <div className='form-row'>
            <div className='form-col recurrence'>
              <label htmlFor='recurrence-description'>Recurrence Description</label>
              <textarea placeholder='No Recurrence Chosen' readOnly value={JSON.stringify(event?.recurrence)} />
            </div>
          </div>
        </>
      }
      <button type="submit">{event && event.id ? 'Update Event' : 'Add Event'}</button>
    </form>
  )
};

export default EventForm;;