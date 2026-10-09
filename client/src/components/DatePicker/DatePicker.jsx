import React, { useState, useRef, useEffect } from 'react';

const DatePicker = ({
  value,
  onChange,
  placeholder = 'Select a date',
  minDate,
  maxDate,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const wrapperRef = useRef(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const y = d.getFullYear();
    return `${y}-${m}-${day}`; // YYYY-MM-DD
  };

  const isSameDay = (a, b) => {
    if (!a || !b) return false;
    const d1 = new Date(a);
    const d2 = new Date(b);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isDisabledDay = (day) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    if (minDate && date < new Date(minDate).setHours(0, 0, 0, 0)) return true;
    if (maxDate && date > new Date(maxDate).setHours(0, 0, 0, 0)) return true;
    return false;
  };

  const handleSelect = (day) => {
    const selected = new Date(year, month, day);
    onChange(formatDate(selected));
    setIsOpen(false);
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  // Build grid cells (leading blanks + days)
  const cells = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div ref={wrapperRef} style={styles.wrapper}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((o) => !o)}
        style={{
          ...styles.input,
          ...(disabled ? styles.inputDisabled : {}),
        }}
        disabled={disabled}
      >
        <span style={{ color: value ? '#111' : '#9ca3af' }}>
          {value ? formatDate(value) : placeholder}
        </span>
        <span style={styles.icon}>📅</span>
      </button>

      {isOpen && (
        <div style={styles.popover}>
          {/* Header */}
          <div style={styles.header}>
            <button type="button" onClick={prevMonth} style={styles.navBtn}>
              ‹
            </button>
            <div style={styles.headerLabel}>
              {monthNames[month]} {year}
            </div>
            <button type="button" onClick={nextMonth} style={styles.navBtn}>
              ›
            </button>
          </div>

          {/* Day labels */}
          <div style={styles.grid}>
            {dayLabels.map((d) => (
              <div key={d} style={styles.dayLabel}>
                {d}
              </div>
            ))}

            {/* Day cells */}
            {cells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} />;
              }
              const disabledDay = isDisabledDay(day);
              const selected = isSameDay(new Date(year, month, day), value);
              const isToday = isSameDay(new Date(year, month, day), today);

              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabledDay}
                  onClick={() => handleSelect(day)}
                  style={{
                    ...styles.dayCell,
                    ...(selected ? styles.daySelected : {}),
                    ...(isToday && !selected ? styles.dayToday : {}),
                    ...(disabledDay ? styles.dayDisabled : {}),
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    display: 'inline-block',
    width: '100%',
    maxWidth: 280,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    background: '#fff',
    fontSize: 14,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'left',
  },
  inputDisabled: {
    background: '#f3f4f6',
    cursor: 'not-allowed',
    opacity: 0.7,
  },
  icon: {
    fontSize: 16,
    opacity: 0.6,
  },
  popover: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    zIndex: 1000,
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    padding: 12,
    width: 280,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLabel: {
    fontWeight: 600,
    fontSize: 14,
  },
  navBtn: {
    border: 'none',
    background: '#f3f4f6',
    borderRadius: 6,
    width: 28,
    height: 28,
    cursor: 'pointer',
    fontSize: 16,
    lineHeight: 1,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 4,
  },
  dayLabel: {
    fontSize: 11,
    textAlign: 'center',
    color: '#9ca3af',
    padding: '4px 0',
    fontWeight: 600,
  },
  dayCell: {
    border: 'none',
    background: 'transparent',
    borderRadius: 6,
    height: 32,
    fontSize: 13,
    cursor: 'pointer',
    color: '#111',
  },
  daySelected: {
    background: '#2563eb',
    color: '#fff',
    fontWeight: 600,
  },
  dayToday: {
    border: '1px solid #2563eb',
    color: '#2563eb',
  },
  dayDisabled: {
    color: '#d1d5db',
    cursor: 'not-allowed',
  },
};

export default DatePicker;