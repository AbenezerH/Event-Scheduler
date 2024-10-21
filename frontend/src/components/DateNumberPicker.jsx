const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
};

const DateNumberPicker = ({ recurrence, setEvent }) => {
    const dayOptions = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

    return (
        <select
            value={recurrence?.recurrence_amount ?? '1st'}
            onChange={(e) => setEvent(prev => ({ ...prev, recurrence: { ...prev.recurrence, recurrence_amount: e.target.value } }))}
            aria-label="day-picker"
            className="custom-select select-col minute-select"
        >
            {dayOptions.map(day => (
                <option key={day} value={day}>{day}{getDaySuffix(parseInt(day))}</option>
            ))}
        </select>
    );
};

export default DateNumberPicker;
