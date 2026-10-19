import FullCalendar from '@fullcalendar/react';
import dayGrid from '@fullcalendar/daygrid';
import timeGrid from '@fullcalendar/timegrid';
import interaction from '@fullcalendar/interaction';
import { api } from './api';

export default function Events({ token, refresh, onPick }) {
  return (
    <FullCalendar
      key={`${token}-${refresh}`} // remount to refetch after sign-in or a new booking
      plugins={[dayGrid, timeGrid, interaction]}
      initialView="timeGridWeek"
      height="auto"
      nowIndicator
      slotMinTime="09:00:00"
      slotMaxTime="19:00:00"
      headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' }}
      events={(info, ok, fail) => api('/events', { token }).then(ok, fail)}
      dateClick={(i) => onPick(i.date)}
    />
  );
}
