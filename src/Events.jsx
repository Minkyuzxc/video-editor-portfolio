import FullCalendar from '@fullcalendar/react';
import dayGrid from '@fullcalendar/daygrid';

// Edit this list, one line per event. Use 'YYYY-MM-DD' for a date, or add an end date for a range.
const EVENTS = [
  { title: 'Festival screening (example)', start: '2026-11-14' },
  { title: 'Open for new projects (example)', start: '2026-12-01', end: '2026-12-08' },
  { title: 'Studio closed (example)', start: '2026-12-24', end: '2027-01-02' },
];

export default function Events() {
  return (
    <FullCalendar
      plugins={[dayGrid]}
      initialView="dayGridMonth"
      height="auto"
      events={EVENTS}
      eventColor="#f2a541"
      eventTextColor="#0e1726"
      headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
    />
  );
}
