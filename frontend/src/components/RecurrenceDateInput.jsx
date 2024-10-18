import MinutePicker from "./MinutePicker";
import DayPicker from "./DayPicker";
import DateNumberPicker from "./DateNumberPicker.jsx";
import YearlyPickerWrapper from "./YearlyEventPicker.jsx";
import { useState } from "react";

const RecurrenceDateInput = ({ recurrenceTimeUnit, recurrence, setRecurrence }) => {
  const [showDayPicker, setShowDayPicker] = useState(false);

  let inputType;
  switch (recurrenceTimeUnit) {
    case 'hour':
      inputType = <MinutePicker recurrence={recurrence} setRecurrence={setRecurrence} />;
      break;
    case 'day':
      inputType = (
        <input
          type="time"
          aria-label='event-date'
          className='recurrence-date-input'
          value={recurrence && recurrence.recurrence_amount ? recurrence.recurrence_amount : ''}
          onChange={(e) => setRecurrence({ ...recurrence, recurrence_amount: e.target.value })}
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
          {showDayPicker && <DayPicker recurrence={recurrence} setRecurrence={setRecurrence} />}
        </div>
      );
      break;
    case 'month':
      inputType = <DateNumberPicker recurrence={recurrence} setRecurrence={setRecurrence} />
      break;
    case 'year':
      inputType = <YearlyPickerWrapper recurrence={recurrence} setRecurrence={setRecurrence} />
      break;
    default:
      inputType = (
        <input
          type="datetime-local"
          aria-label='event-date'
          className='recurrence-date-input'
          value={recurrence && recurrence.event_date ? recurrence.event_date : ''}
          onChange={(e) => setRecurrence({ ...recurrence, event_date: e.target.value })}
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
