import RecurrenceDateInput from "./RecurrenceDateInput";


// EventForm Component
const EventForm = ({ event, setEvent, handleSubmit, recurrenceData, setRecurrenceData, isRecurring, setIsRecurring }) => {
    return (
        <form onSubmit={handleSubmit}>
            <div className='form-row'>
                <div className='form-col small'>
                    <input
                        type="text"
                        aria-label='event-title'
                        value={event && event.title ? event.title : ''}
                        onChange={(e) => setEvent({ ...event, title: e.target.value })}
                        placeholder="Event Title"
                        required
                    />
                    <input
                        type="text"
                        aria-label='event-location'
                        value={event && event.location ? event.location : ''}
                        onChange={(e) => setEvent({ ...event, location: e.target.value })}
                        placeholder="Event Location"
                    />
                    <input
                        type="text"
                        aria-label='event-organizer'
                        value={event && event.organizer ? event.organizer : ''}
                        onChange={(e) => setEvent({ ...event, organizer: e.target.value })}
                        placeholder="Event Organizer"
                    />
                    <input
                        type="datetime-local"
                        aria-label='event-date'
                        className='date-input'
                        value={event && event.dateTime ? event.dateTime : ''}
                        onChange={(e) => setEvent({ ...event, dateTime: e.target.value })}
                        onDoubleClick={(e) => {
                            setEvent({ ...event, dateTime: e.target.value });
                            e.target.blur();
                        }}
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
                        value={event && event.description ? event.description : ''}
                        onChange={(e) => setEvent({ ...event, description: e.target.value })}
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
                                value={recurrenceData?.recurrence_type || "standard"}
                                onChange={(e) => setRecurrenceData(prev => ({ ...prev, recurrence_type: e.target.value }))}
                            >
                                <option value={"standard"}>Standard Recurrence</option>
                                <option value={"every nth"}>Every Nth Recurrence</option>
                                <option value={"specific day"}>Specific Unit Recurrence</option>
                                <option value={"relative date"}>Relative Date Recurrence</option>
                            </select>
                        </div>
                        <div className='select-col form-col recurrence'>
                            <label htmlFor='time-unit'>Time Unit</label>
                            <select
                                name='time-unit'
                                className='type-select'
                                value={recurrenceData?.time_unit || "day"}
                                onChange={(e) => setRecurrenceData(prev => ({ ...prev, time_unit: e.target.value }))}
                            >
                                <option value={""}>Select Time Unit</option>
                                <option value={"hour"}>Hour{recurrenceData?.recurrence_type === 'standard' && "ly"}</option>
                                <option value={"day"}>{recurrenceData?.recurrence_type === 'standard' ? "Daily" : "Day"}</option>
                                <option value={"week"}>Week{recurrenceData?.recurrence_type === 'standard' && "ly"}</option>
                                <option value={"month"}>Month{recurrenceData?.recurrence_type === 'standard' && "ly"}</option>
                                <option value={"year"}>Year{recurrenceData?.recurrence_type === 'standard' && "ly"}</option>
                            </select>
                        </div>
                        {recurrenceData?.recurrence_type !== 'standard' ?
                            <>
                                <div className='form-col recurrence'>
                                    <label htmlFor='recurrence-amount'>Recurrence Amount</label>
                                    <input
                                        type='number'
                                        name='recurrence-amount'
                                        value={recurrenceData?.recurrence_amount || ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setRecurrenceData(prev => ({
                                                ...prev,
                                                recurrence_amount: (value === '' || value > 0) ? value : 1
                                            }));
                                        }}
                                    />
                                </div>
                            </> :
                            <>
                                <RecurrenceDateInput recurrenceTimeUnit={recurrenceData?.time_unit} event={event} setEvent={setEvent} />
                            </>
                        }
                    </div>
                    <div className='form-row'>
                        <div className='form-col recurrence'>
                            <label htmlFor='recurrence-description'>Recurrence Description</label>
                            <textarea placeholder='No Recurrence Chosen' readOnly />
                        </div>
                    </div>
                </>
            }
            <button type="submit">{event && event._id ? 'Update Event' : 'Add Event'}</button>
        </form>
    )
};

export default EventForm;;