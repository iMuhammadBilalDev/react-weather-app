import React, { useState } from 'react';
import moment from 'moment';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const Calendar = (props) => {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(null);

  const daysInMonth = () => currentMonth.daysInMonth();
  const startOfMonth = () => moment(currentMonth).startOf('month').format('d');
  const startDate = () => moment(currentMonth).startOf('month');

  const renderDays = () => {
    const blanks = [];
    for (let i = 0; i < startOfMonth(); i++) {
      blanks.push(<td key={i * 80} className="emptySlot" />);
    }

    const days = [];
    for (let day = 1; day <= daysInMonth(); day++) {
      const date = moment(startDate()).add(day - 1, 'days');
      const isSelected = selectedDate && date.isSame(selectedDate, 'day');
      const isCurrentDate = moment().isSame(date, 'day'); // Check if it's the current date

      days.push(
        <td
          key={day}
          className={`day ${isSelected ? 'selected' : ''} ${isCurrentDate ? 'current-date' : ''}`}
          onClick={() => handleDateClick(date)}
        >
          {day}
        </td>
      );
    }

    const totalSlots = [...blanks, ...days];
    const rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }

      if (i === totalSlots.length - 1) {
        rows.push(cells);
      }
    });

    return rows.map((row, i) => (
      <tr key={i * 100}>{row}</tr>
    ));
  };

  const nextMonth = () => {
    setCurrentMonth(moment(currentMonth).add(1, 'M'));
  };

  const prevMonth = () => {
    setCurrentMonth(moment(currentMonth).subtract(1, 'M'));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    props.onDateSelect(date.format('YYYY-MM-DD'));
  };

  return (
    <div className="calendar-container">
      <div className="header">
        <MdChevronLeft onClick={prevMonth} className="arrow" />
        <h2>{currentMonth.format('MMMM YYYY')}</h2>
        <MdChevronRight onClick={nextMonth} className="arrow" />
      </div>
      <table className="calendar">
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>{renderDays()}</tbody>
      </table>
    </div>
  );
};

export default Calendar;
