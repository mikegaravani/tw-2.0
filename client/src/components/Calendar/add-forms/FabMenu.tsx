import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, ListTodo, BookOpenText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEventDialogStore } from "@/components/Calendar/store/useEventDialogStore";
import { useTaskDialogStore } from "@/components/Calendar/store/useTaskDialogStore";
import { useStudyPlanDialogStore } from "@/components/Calendar/store/useStudyPlanDialogStore";

interface FabMenuProps {
  onNewEvent?: () => void;
  onNewTask?: () => void;
  onNewStudyPlan?: () => void;
}

export default function FabMenu({
  onNewEvent,
  onNewTask,
  onNewStudyPlan,
}: FabMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { openDialog: openEventDialog } = useEventDialogStore();
  const { openDialog: openTaskDialog } = useTaskDialogStore();
  const { openDialog: openStudyPlanDialog } = useStudyPlanDialogStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="flex flex-col items-end mb-3 space-y-2">
          <div className="flex items-center gap-2 transition-all duration-200 transform opacity-100 translate-y-0">
            <span className="text-white bg-gray-800 text-sm font-medium py-1 px-2 rounded shadow">
              New Event
            </span>
            <Button
              variant="default"
              size="icon"
              onClick={() => {
                openEventDialog(null);
                onNewEvent?.();
                setIsOpen(false);
              }}
              className="h-12 w-12 rounded-full shadow-lg flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Calendar className="h-5 w-5" />
              <span className="sr-only">New Event</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 transition-all duration-200 transform opacity-100 translate-y-0">
            <span className="text-white bg-gray-800 text-sm font-medium py-1 px-2 rounded shadow">
              New Task
            </span>
            <Button
              variant="default"
              size="icon"
              onClick={() => {
                openTaskDialog(null);
                onNewTask?.();
                setIsOpen(false);
              }}
              className="h-12 w-12 rounded-full shadow-lg flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white"
            >
              <ListTodo className="h-5 w-5" />
              <span className="sr-only">New Task</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 transition-all duration-200 transform opacity-100 translate-y-0">
            <span className="bg-gray-800 text-sm font-medium py-1 px-2 rounded shadow text-white">
              New Study Plan with Pomodoro
            </span>
            <Button
              variant="default"
              size="icon"
              onClick={() => {
                openStudyPlanDialog();
                onNewStudyPlan?.();
                setIsOpen(false);
              }}
              className="h-12 w-12 rounded-full shadow-lg flex items-center justify-center bg-green-600 hover:bg-green-700 text-white"
            >
              <BookOpenText className="h-5 w-5" />
              <span className="sr-only">New Study Plan</span>
            </Button>
          </div>
        </div>
      )}

      <Button
        variant="default"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-transform duration-200 flex items-center justify-center text-white bg-red-600 hover:bg-red-700",
          isOpen ? "rotate-45" : ""
        )}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </Button>
    </div>
  );
}
