import React, { useContext, useMemo, useState } from 'react';
import FullCalendar, { DatesSetArg, DateSelectArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { EventDropArg } from '@fullcalendar/interaction';
import { useCss } from 'react-use';
import Content from './Content';
import Modal from './Modal';
import useDate from '../hooks/useDate';
import useFilter from '../hooks/useFilter';
import { Theme } from '../themes';
import { db } from '../firebase';
import styles from '../styles/EventSchedule.module.scss';
import '../styles/Scheduler.scss';
import useCollection from '../hooks/useCollection';

const Scheduler = () => {
  // const { theme } = useContext(Theme);
  const date = useDate();
  const [fcDate, setFcDate] = useState(date);
  const dbRef = useMemo(
    () =>
      db
        .collection('newevents')
        .where(
          'start',
          '<',
          new Date(
            fcDate.getFullYear(),
            fcDate.getMonth() + 6,
            fcDate.getDate()
          )
        )
        .where(
          'start',
          '>',
          new Date(
            fcDate.getFullYear(),
            fcDate.getMonth() - 6,
            fcDate.getDate()
          )
        ),
    [fcDate]
  );
  const [eventSnapshot] = useCollection(dbRef);
  const [filter, updateFilter] = useFilter();
  const [modalActive, setModalActive] = useState(false);

  const datesSet = ({ start }: DatesSetArg) => {
    setFcDate(new Date(start.getFullYear(), start.getMonth(), date.getDay()));
  };

  const eventDrop = ({ event }: EventDropArg) => {
    db.collection('newevents').doc(event.id).update({
      start: event.start,
      end: event.end,
    });
  };

  const select = ({ start, end }: DateSelectArg) => {
    setModalActive(true);
    console.log(
      `selected ${start.toLocaleString()} to ${end.toLocaleString()}`
    );
  };

  // useEffect(() => {
  //   console.log(eventSnapshot);
  // }, [eventSnapshot]);

  // updateFilter('3');

  // const className = useCss({
  //   '.fc': {
  //     '.fc-button-primary': {
  //       // background: 'red',
  //     },
  //   },
  // });

  return (
    // <div className={className}>
    <>
      <Modal active={modalActive}>
        <h1>Gamertime</h1>
        <button onClick={() => setModalActive(false)}>Close Modal</button>
      </Modal>
      <Content>
        {false && (
          <input
            onChange={(event) => {
              updateFilter(event.target.value);
            }}
          />
        )}
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          datesSet={datesSet}
          eventDrop={eventDrop}
          select={select}
          initialView="dayGridMonth"
          events={eventSnapshot?.docs
            .map((e) => fcEvent(e))
            .filter((e) => isFiltered(filter, e))}
          navLinks
          editable
          selectable
          selectMirror
        />
      </Content>
    </>
    // </div>
  );
};

const isFiltered = (filter: RegExp, event: any) => {
  return Object.values(event).some((e: any) => filter.test(e.toString()));
};

const fcEvent = (doc: firebase.firestore.DocumentData) => {
  const data = doc.data();

  return {
    id: doc.id,
    title: data.title,
    start: data.start.toDate(),
    end: data.end.toDate(),
    description: data.description,
    category: data.category,
  };
};

export default Scheduler;
