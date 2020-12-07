<script lang="ts">
  import FullCalendar from "svelte-fullcalendar";
  import dayGridPlugin from "@fullcalendar/daygrid";
  import interactionPlugin from "@fullcalendar/interaction";

  let options = {
    initialView: "dayGridMonth",
    events: [
      { title: "event 1", date: "2020-12-12" },
      { title: "event 2", date: "2020-12-25" },
    ],
    plugins: [dayGridPlugin, interactionPlugin],
    editable: true,
    selectable: true,
    selectMirror: true,
  };
</script>

<FullCalendar {options} />
