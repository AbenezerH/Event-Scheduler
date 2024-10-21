import React, { useState, useEffect, useRef, useCallback } from 'react';

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

const getDaysInMonth = (monthName, year) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = months.indexOf(monthName);
    return new Date(year, monthIndex + 1, 0).getDate();
};

const RollingDayPicker = ({ recurrence, setEvent, handleRecurrenceChange, currentMonth }) => {
    const year = new Date().getFullYear();
    const daysInMonth = getDaysInMonth(currentMonth, year) || 31;
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const [currentDay, setCurrentDay] = useState(() => {
        const dayPart = recurrence?.recurrence_amount?.split('-')[1];
        return parseDay(dayPart) || 1; // Ensure a default value if no day is set
    });

    const handleDayChange = (day) => {
        setCurrentDay(day);
        handleRecurrenceChange('day', `${day}${getDaySuffix(day)}`, recurrence);
    };

    const handleScroll = useCallback((e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            setCurrentDay((prevDay) => (prevDay - 1 < 1 ? daysInMonth : prevDay - 1));
        } else {
            setCurrentDay((prevDay) => (prevDay + 1 > daysInMonth ? 1 : prevDay + 1));
        }
    }, [daysInMonth]);

    const containerRef = useRef();

    useEffect(() => {
        const currentRef = containerRef.current;
        currentRef.addEventListener('wheel', handleScroll, { passive: false });

        return () => {
            currentRef.removeEventListener('wheel', handleScroll);
        };
    }, [handleScroll]);

    const getDisplayedDays = () => {
        const currentIndex = currentDay - 1;
        return [
            days[(currentIndex - 1 + daysInMonth) % daysInMonth],
            days[currentIndex],
            days[(currentIndex + 1) % daysInMonth]
        ];
    };

    useEffect(() => {
        const dayPart = recurrence?.recurrence_amount?.split('-')[1];
        setCurrentDay(parseDay(dayPart) || 1);
    }, [recurrence, currentMonth]);

    return (
        <div className="roller-day-container" ref={containerRef}>
            <label htmlFor='chosen-date'>Day</label>
            <div className="rolling-day-picker">
                {getDisplayedDays().map((day, index) => (
                    <button
                        type='button'
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
