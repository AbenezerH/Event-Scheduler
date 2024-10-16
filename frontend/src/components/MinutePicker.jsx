const MinutePicker = ({ event, setEvent }) => {
    const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const dateTime = event?.dateTime ?? 'T00:00';

    return (
        <select
            value={dateTime.split('T')[1]?.split(':')[1] ?? ''}
            onChange={(e) => setEvent({ ...event, dateTime: `T00:${e.target.value}` })}
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
