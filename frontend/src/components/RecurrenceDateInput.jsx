import MinutePicker from "./MinutePicker";
import DayPicker from "./DayPicker";
import DateNumberPicker from "./DateNumberPicker.jsx";
import YearlyPickerWrapper from "./YearlyEventPicker.jsx";
import { useState } from "react";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const RecurrenceDateInput = ({ recurrenceTimeUnit, recurrence, setRecurrence }) => {
  const [showDayPicker, setShowDayPicker] = useState(false);

  let inputType;
  if (recurrence?.recurrence_type === "standard") {
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
  }
  else if (recurrence?.recurrence_type === "every nth") {
    inputType = (
      <div className='form-col recurrence'>
        <input
          type='number'
          name='recurrence-amount'
          value={recurrence?.recurrence_amount || ""}
          onChange={(e) => {
            const value = e.target.value;
            setRecurrence({ ...recurrence, recurrence_amount: (value === '' || value > 0) ? value : 1 });
          }}
        />
      </div>)
  }
  else if (recurrence?.recurrence_type === "specific day") {
    inputType = (
      <select
        name="specific-day"
        aria-label="choose-specific-day"
        className="type-select"
        value={recurrence && recurrence.recurrence_amount || 1}
        onChange={(e) => setRecurrence({ ...recurrence, recurrence_amount: e.target.value })}
        required
      >
        {daysOfWeek.map((day, index) => <option value={index} key={index}>{day}</option>)}
      </select>)
  }
  else if (recurrence?.recurrence_type === "relative date") {
    inputType = (
      <div className='form-col recurrence'>
        <input
          type='number'
          name='recurrence-amount'
          value={recurrence?.recurrence_amount || ""}
          onChange={(e) => {
            const value = e.target.value;
            setRecurrence({ ...recurrence, recurrence_amount: (value === '' || value > 0) ? value : 1 });
          }}
        />
      </div>)
  }

  return (
    <div className={`${recurrenceTimeUnit === 'hour' && "select-col"} form-col recurrence`}>
      <label htmlFor='recurrence-amount'>Recurrence Amount</label>
      {inputType}
    </ div>
  );
};

export default RecurrenceDateInput;
