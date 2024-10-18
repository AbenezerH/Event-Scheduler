import React, { useState, useEffect } from 'react';

const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
};

const parseDay = (dayString) => {
    return parseInt(dayString?.replace(/\D/g, ''));
};

const RollingDayPicker = ({ recurrence, setRecurrence, handleRecurrenceChange }) => {
    const [currentDay, setCurrentDay] = useState(() => {
        const dayPart = recurrence?.recurrence_amount?.split('-')[1];
        return parseDay(dayPart) || 1; // Ensure a default value if no day is set
    });
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const handleDayChange = (day) => {
        setCurrentDay(day);
        handleRecurrenceChange('day', `${day}${getDaySuffix(day)}`, recurrence, setRecurrence);
    };

    const handleScroll = (e) => {
        if (e.deltaY < 0) {
            setCurrentDay((prevDay) => (prevDay - 1 < 1 ? 31 : prevDay - 1));
        } else {
            setCurrentDay((prevDay) => (prevDay + 1 > 31 ? 1 : prevDay + 1));
        }
    };

    const getDisplayedDays = () => {
        const currentIndex = currentDay - 1;
        return [
            days[(currentIndex - 1 + 31) % 31],
            days[currentIndex],
            days[(currentIndex + 1) % 31]
        ];
    }

    useEffect(() => {
        const dayPart = recurrence?.recurrence_amount?.split('-')[1];
        setCurrentDay(parseDay(dayPart) || 1);
    }, [recurrence]);

    return (
        <div className="roller-day-container">
            <label htmlFor='chosen-date'>Day</label>
            <div className="rolling-day-picker" onWheel={handleScroll}>
                {getDisplayedDays().map((day, index) => (
                    <button
                        key={index}
                        name='chosen-date'
                        className={`day-button ${day === currentDay ? 'current' : ''}`}
                        onClick={() => handleDayChange(day)}
                    >
                        {day}{getDaySuffix(day)}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RollingDayPicker;
