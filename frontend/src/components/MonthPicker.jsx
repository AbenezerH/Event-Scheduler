const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const MonthPicker = ({ selectedMonth, setEvent, setSelectedMonth, recurrence, handleRecurrenceChange }) => {
    return (
        <div className="month-picker">
            {months.map((month, index) => (
                <button
                    type="button"
                    key={index}
                    className={`month-button ${selectedMonth === month ? 'selected' : ''}`}
                    onClick={() => {
                        setSelectedMonth(month);
                        handleRecurrenceChange('month', month, recurrence);
                    }}
                >
                    {month}
                </button>
            ))}
        </div>
    );
};

export default MonthPicker;
