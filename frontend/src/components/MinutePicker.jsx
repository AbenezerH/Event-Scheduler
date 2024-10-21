const MinutePicker = ({ recurrence, setEvent }) => {
    const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const dateTime = recurrence?.recurrence_amount ?? 'T00:00';

    return (
        <select
            value={dateTime.split('T')[1]?.split(':')[1] ?? ''}
            onChange={(e) => setEvent(prev => ({ ...prev, recurrence: { ...prev.recurrence, recurrence_amount: `T00:${e.target.value}` } }))}
            aria-label="minute-picker"
            className="custom-select select-col minute-select"
        >
            {minuteOptions.map(min => (
                <option key={min} value={min}>{min}</option>
            ))}
        </select>
    );
};

export default MinutePicker;
