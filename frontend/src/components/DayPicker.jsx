const DayPicker = ({ recurrence, setEvent }) => {
    const daysOfWeek = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];

    const handleDayChange = (day) => {
        const currentDays = recurrence.selected_days || [];
        const newDays = currentDays.includes(day) ?
            currentDays.filter(d => d !== day) :
            [...currentDays, day];

        setEvent(prev => ({ ...prev, recurrence: { ...prev.recurrence, selected_days: newDays } }));
    };

    return (
        <div className="day-picker">
            {daysOfWeek.map(day => (
                <label key={day}>
                    <input
                        type="checkbox"
                        checked={recurrence.selected_days?.includes(day) || false}
                        onChange={() => handleDayChange(day)}
                    />
                    {day}
                </label>
            ))}
            <input
                type="time"
                aria-label='recurrence-amount'
                className='recurrence-date-input'
                value={recurrence && recurrence.recurrence_amount ? recurrence.recurrence_amount : ''}
                onChange={(e) => setEvent(prev => ({ ...prev, recurrence: { ...prev.recurrence, recurrence_amount: e.target.value } }))}
                required
            />
        </div>
    );
};

export default DayPicker;