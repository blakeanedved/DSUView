import React, { useContext, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Theme } from "../themes";
import styles from "../styles/Scheduler.module.scss";
import "../styles/Scheduler.scss";
import useGlobalStyleSheet from "../hooks/useGlobalStyleSheet";

export interface SchedulerProps {}

const Scheduler = ({}: SchedulerProps) => {
  const { theme } = useContext(Theme);
  const { addRule, updateRule, removeRule, sheetMounted } = useGlobalStyleSheet(
    "fcsheet"
  );

  useEffect(() => {
    if (sheetMounted) {
      // updateRule("body", "body { background: #FF0000 !important; }");
    }
  }, [theme, updateRule, sheetMounted]);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={[
        { title: "Test Event 1", start: "2020-07-29", end: "2020-07-31" },
      ]}
      navLinks
      editable
      selectable
      selectMirror
    />
  );
};

export default Scheduler;
