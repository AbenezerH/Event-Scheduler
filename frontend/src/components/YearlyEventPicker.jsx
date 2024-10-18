import RollingDayPicker from "./RollingDayPicker.jsx";
import MonthPicker from "./MonthPicker.jsx";
import { useState, useRef } from "react";

const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
};

const YearlyPickerWrapper = ({ recurrence, setRecurrence }) => {
    const [selectedMonth, setSelectedMonth] = useState();
    const [showPicker, setShowPicker] = useState(false);
    const inputRef = useRef(null);

    const handleFocus = () => setShowPicker(true);
    const handleBlur = (e) => {
        if (!inputRef.current.contains(e.relatedTarget)) {
            setShowPicker(false);
        }
    };

    const parseDay = (dayString) => {
        return dayString ? parseInt(dayString.replace(/\D/g, '')) : 1;
    };

    const handleRecurrenceChange = (type, value, recurrence, setRecurrence) => {
        let newRecurrenceAmount = recurrence?.recurrence_amount || "Jan-1st";

        if (type === 'month') {
            const dayPart = parseDay(newRecurrenceAmount.split('-')[1]);
            newRecurrenceAmount = `${value}-${dayPart + getDaySuffix(dayPart)}`;
        } else if (type === 'day') {
            const monthPart = newRecurrenceAmount.split('-')[0] || "Jan";
            newRecurrenceAmount = `${monthPart}-${value}`;
        }

        setRecurrence({ ...recurrence, recurrence_amount: newRecurrenceAmount });
    };

    return (
        <div ref={inputRef} className="yearly-picker-wrapper" onBlur={handleBlur}>
            <input
                type="text"
                aria-label="yearly-event"
                className="recurrence-date-input"
                value={recurrence?.recurrence_amount ? recurrence.recurrence_amount : ""}
                onClick={(e) => showPicker ? () => {
                    handleBlur(e);

                } : handleFocus()}
                readOnly
                placeholder="Select Month and Day"
            />
            {showPicker && (
                <YearlyEventPicker recurrence={recurrence} setRecurrence={setRecurrence} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} handleRecurrenceChange={handleRecurrenceChange} />
            )}
        </div>
    );
};

const YearlyEventPicker = ({ recurrence, setRecurrence, selectedMonth, setSelectedMonth, handleRecurrenceChange }) => {

    return (
        <div className="yearly-event-picker">
            <MonthPicker handleRecurrenceChange={handleRecurrenceChange} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} recurrence={recurrence} setRecurrence={setRecurrence} />
            <RollingDayPicker handleRecurrenceChange={handleRecurrenceChange} recurrence={recurrence} setRecurrence={setRecurrence} currentMonth={selectedMonth && selectedMonth} />
        </div>
    );
};

export default YearlyPickerWrapper;
