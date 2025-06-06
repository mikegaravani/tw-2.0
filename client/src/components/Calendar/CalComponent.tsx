import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardContent } from "@/components/ui/card";

import { Event, StudyPlan, Task } from "./types/calendarType";
import { useFormattedCalendarItems } from "./hooks/useFormattedCalendarItems";

import FabMenu from "./add-forms/FabMenu";
import TaskCards from "./TaskCards";
import EventDialog from "./view-dialogs/EventDialog";
import TaskDialog from "./view-dialogs/TaskDialog";
import StudyPlanDialog from "./view-dialogs/StudyPlanDialog";

import { useTimeMachineStore } from "@/store/useTimeMachineStore";
import { getTypeColor } from "./hooks/calendarColors";

type CalComponentProps = {
  events: Event[];
  tasks: Task[];
  studyPlans: StudyPlan[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setStudyPlans: React.Dispatch<React.SetStateAction<StudyPlan[]>>;
  onDateRangeChange: (start: Date, end: Date) => void;
};

function CalComponent({
  events,
  tasks,
  studyPlans,
  setEvents,
  setTasks,
  setStudyPlans,
  onDateRangeChange,
}: CalComponentProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedStudyPlan, setSelectedStudyPlan] = useState<StudyPlan | null>(
    null
  );
  const [calendarApi, setCalendarApi] = useState<any>(null);

  const [calendarKey, setCalendarKey] = useState<string>("init");
  const isReady = useTimeMachineStore((state) => state.isReady);

  const calendarItems = useFormattedCalendarItems(events, tasks, studyPlans);

  const rightNow = useTimeMachineStore((state) => state.now);
  const justModified = useTimeMachineStore((state) => state.justModified);
  const setJustModified = useTimeMachineStore((state) => state.setJustModified);

  const handleDatesSet = (arg: any) => {
    const start = new Date(arg.start);
    const end = new Date(arg.end);
    onDateRangeChange(start, end);
  };

  useEffect(() => {
    if (isReady && !calendarKey && rightNow) {
      setCalendarKey(rightNow.toISOString());
    }
    if (calendarApi && rightNow && justModified) {
      calendarApi.gotoDate(rightNow);
      calendarApi.setOption("now", rightNow);
      setCalendarKey(rightNow.toISOString());
      setJustModified(false);
    }
  }, [
    calendarApi,
    rightNow,
    justModified,
    setJustModified,
    calendarKey,
    isReady,
  ]);

  const updateTaskInState = (taskId: string, updatedFields: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updatedFields } : t))
    );
  };

  const updateStudyPlanInState = (id: string, fields: Partial<StudyPlan>) =>
    setStudyPlans((prev) =>
      prev.map((sp) => (sp.id === id ? { ...sp, ...fields } : sp))
    );

  // Handle event click
  const handleEventClick = (clickInfo: any) => {
    const eventId = clickInfo.event.id;
    const ev = events.find((e) => e.id === eventId);
    const ta = tasks.find((t) => t.id === eventId);
    const sp = studyPlans.find((s) => s.id === eventId);

    if (ev?.type === "event") {
      setSelectedEvent(ev);
      return;
    }
    if (ta?.type === "task") {
      setSelectedTask(ta);
      return;
    }
    if (sp?.type === "study-plan") {
      setSelectedStudyPlan(sp);
      return;
    }
  };

  // Switch to list view
  const switchToListView = () => {
    if (calendarApi) {
      calendarApi.changeView("listWeek");
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <FabMenu />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="px-3">
              {isReady && calendarKey && (
                <FullCalendar
                  key={calendarKey}
                  plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    listPlugin,
                    interactionPlugin,
                  ]}
                  initialView="dayGridMonth"
                  initialDate={rightNow}
                  nowIndicator={false}
                  now={rightNow}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,listBtn",
                  }}
                  customButtons={{
                    listBtn: {
                      text: "List",
                      click: switchToListView,
                    },
                  }}
                  buttonText={{
                    today: "Today",
                    month: "Month",
                    week: "Week",
                  }}
                  events={calendarItems}
                  datesSet={handleDatesSet}
                  contentHeight={500}
                  height={"75vh"}
                  eventClick={handleEventClick}
                  dayMaxEvents={3}
                  weekends={true}
                  eventTimeFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    meridiem: "short",
                  }}
                  ref={(el) => {
                    if (el) {
                      setCalendarApi(el.getApi());
                    }
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div className="h-full">
          <TaskCards
            tasks={tasks}
            onTaskClick={(task) => setSelectedTask(task)}
          />
        </div>
      </div>

      <EventDialog
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onDeleteSuccess={(eventId) => {
          setEvents((prev) => prev.filter((e) => e.seriesId !== eventId));
          setSelectedEvent(null);
        }}
        getTypeColor={getTypeColor}
      />

      <TaskDialog
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        getTypeColor={getTypeColor}
        onUpdateTask={updateTaskInState}
        onDeleteSuccess={(taskId) => {
          setTasks((prev) => prev.filter((e) => e.id !== taskId));
          setSelectedTask(null);
        }}
      />

      <StudyPlanDialog
        studyPlan={selectedStudyPlan}
        onClose={() => setSelectedStudyPlan(null)}
        getTypeColor={getTypeColor as any}
        onUpdateStudyPlan={updateStudyPlanInState}
        onDeleteSuccess={(id) => {
          setStudyPlans((prev) => prev.filter((sp) => sp.id !== id));
          setSelectedStudyPlan(null);
        }}
      />
    </div>
  );
}

export default CalComponent;
