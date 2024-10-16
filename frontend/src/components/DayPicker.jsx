const DayPicker = ({ event, setEvent }) => {
    const daysOfWeek = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];

    const handleDayChange = (day) => {
        setEvent(prevEvent => {
            const currentDays = prevEvent.recurrenceDays || [];
            const newDays = currentDays.includes(day)
                ? currentDays.filter(d => d !== day)
                : [...currentDays, day];
            return { ...prevEvent, recurrenceDays: newDays };
        });
    };

    return (
        <div className="day-picker">
            {daysOfWeek.map(day => (
                <label key={day}>
                    <input
                        type="checkbox"
                        checked={event.recurrenceDays?.includes(day) || false}
                        onChange={() => handleDayChange(day)}
                    />
                    {day}
                </label>
            ))}
        </div>
    );
};

export default DayPicker;