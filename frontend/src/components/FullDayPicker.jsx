const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


const FullDayPicker = ({ recurrence, setEvent }) => {
    return (
        <select
            name="specific-day"
            aria-label="choose-specific-day"
            className="type-select"
            value={(recurrence && recurrence.recurrence_amount) ? recurrence.recurrence_amount : 1}
            onChange={(e) => setEvent(prev => ({ ...prev, recurrence: { ...recurrence, recurrence_amount: e.target.value } }))}
            required
        >
            {daysOfWeek.map((day, index) => <option value={index} key={index}>{day}</option>)}
        </select>)
}
export default FullDayPicker;