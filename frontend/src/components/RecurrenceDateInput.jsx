import MinutePicker from "./MinutePicker";
import DayPicker from "./DayPicker";
import DateNumberPicker from "./DateNumberPicker.jsx";
import YearlyPickerWrapper from "./YearlyEventPicker.jsx";
import FullDayPicker from "./FullDayPicker.jsx";
import { useState } from "react";

const RecurrenceDateInput = ({ recurrenceTimeUnit, recurrence, setEvent }) => {

  const [showDayPicker, setShowDayPicker] = useState(false);

  let inputType;
  if (recurrence?.recurrence_type === "standard") {
    switch (recurrenceTimeUnit) {
      case 'hour':
        inputType = <MinutePicker recurrence={recurrence} setEvent={setEvent} />;
        break;
      case 'day':
        inputType = (
          <input
            type="time"
            aria-label='event-date'
            className='recurrence-date-input'
            value={recurrence && recurrence.recurrence_amount ? recurrence.recurrence_amount : ''}
            onChange={(e) => setEvent(prev => ({ ...prev, recurrence: { ...prev.recurrence, recurrence_amount: e.target.value } }))}
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
            {showDayPicker && <DayPicker recurrence={recurrence} setEvent={setEvent} />}
          </div>
        );
        break;
      case 'month':
        inputType = <DateNumberPicker recurrence={recurrence} setEvent={setEvent} />
        break;
      case 'year':
        inputType = <YearlyPickerWrapper recurrence={recurrence} setEvent={setEvent} />
        break;
      default:
        inputType = (
          <input
            type="datetime-local"
            aria-label='event-date'
            className='recurrence-date-input'
            value={recurrence && recurrence.event_date ? recurrence.event_date : ''}
            onChange={(e) => setEvent(prev => ({ ...prev, recurrence: { ...prev.recurrence, event_date: e.target.value } }))}
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
            setEvent(prev => ({ ...prev, recurrence: { ...prev.recurrence, recurrence_amount: (value === '' || value > 0) ? value : 1 } }));
          }}
        />
      </div>)
  }
  else if (recurrence?.recurrence_type === "specific day") {
    inputType = <FullDayPicker recurrence={recurrence} setEvent={setEvent} />
  }
  else if (recurrence?.recurrence_type === "relative date") {
    inputType = (
      <div className='relative-date inputs'>
        <div className="form-col gap-5">
          <label htmlFor="recurrence-amount">Day</label>
          <FullDayPicker recurrence={recurrence} setEvent={setEvent} />
        </div>
        <div className="form-col gap-5">
          <label htmlFor="recurrence-amount">Relative Number</label>
          <input
            type='number'
            name='recurrence-amount'
            value={recurrence?.recurrence_amount || ""}
            onChange={(e) => {
              const value = e.target.value;
              setEvent(prev => ({ ...prev, recurrence: { ...prev.recurrence, recurrence_amount: (value === '' || value > 0) ? value : 1 } }));
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={`${recurrenceTimeUnit === 'hour' && "select-col"} form-col recurrence`}>
      {recurrence?.recurrence_type !== "relative date" && (<label htmlFor='recurrence-amount'>Recurrence Amount</label>)}
      {inputType}
    </ div>
  );
};

export default RecurrenceDateInput;
