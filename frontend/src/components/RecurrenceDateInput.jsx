import MinutePicker from "./MinutePicker";
import DayPicker from "./DayPicker";
import { useState } from "react";

const RecurrenceDateInput = ({ recurrenceTimeUnit, event, setEvent }) => {
  const [showDayPicker, setShowDayPicker] = useState(false);

  let inputType;
  switch (recurrenceTimeUnit) {
    case 'hour':
      inputType = <MinutePicker event={event} setEvent={setEvent} />;
      break;
    case 'day':
      inputType = (
        <input
          type="time"
          aria-label='event-date'
          className='date-input'
          value={event && event.dateTime ? event.dateTime : ''}
          onChange={(e) => setEvent({ ...event, dateTime: e.target.value })}
          required
        />
      );
      break;
    case 'week':
      inputType = (
        <div className="dropdown">
          <button type="button" className="btn-day-show" onClick={() => setShowDayPicker(prev => !prev)}>
            {showDayPicker ? 'Hide Day Picker' : 'Show Day Picker'}
          </button>
          {showDayPicker && <DayPicker event={event} setEvent={setEvent} />}
        </div>
      );
      break;
    case 'month':
      inputType = (
        <input
          type="date"
          aria-label='event-date'
          className='date-input'
          value={event && event.dateTime ? event.dateTime : ''}
          onChange={(e) => setEvent({ ...event, dateTime: e.target.value })}
          required
        />
      );
      break;
    case 'year':
      inputType = (
        <input
          type="date"
          aria-label='event-date'
          className='date-input'
          value={event && event.dateTime ? event.dateTime : ""}
          onChange={(e) => setEvent({ ...event, dateTime: e.target.value })}
          required
        />
      );
      break;
    default:
      inputType = (
        <input
          type="datetime-local"
          aria-label='event-date'
          className='date-input'
          value={event && event.dateTime ? event.dateTime : ''}
          onChange={(e) => setEvent({ ...event, dateTime: e.target.value })}
          required
        />
      );
      break;
  }

  return (
    <div className={`${recurrenceTimeUnit === 'hour' && "select-col"} form-col recurrence`}>
      <label htmlFor='recurrence-amount'>Recurrence Amount</label>
      {inputType}
    </ div>
  );
};

export default RecurrenceDateInput;
