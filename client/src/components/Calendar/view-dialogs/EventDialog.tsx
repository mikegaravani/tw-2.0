import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Edit, Trash2, MapPin } from "lucide-react";
import { Event } from "../types/calendarType";
import { useEffect } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";
import AddEventDialog from ".././add-forms/AddEventDialog";
import { useEventDialogStore } from "@/components/Calendar/store/useEventDialogStore";
import { deleteEvent } from "@/api/calendar";

type EventDialogProps = {
  event: Event | null;
  onClose: () => void;
  getTypeColor: (type: "event") => { bg: string; color: string };
  onDeleteSuccess?: (id: string) => void;
};

const EventDialog: React.FC<EventDialogProps> = ({
  event,
  onClose,
  getTypeColor,
  onDeleteSuccess,
}) => {
  if (!event) return null;

  const [isEventOneDay, setIsEventOneDay] = useState(true);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { isOpen, openDialog, closeDialog } = useEventDialogStore();

  const typeColor = getTypeColor(event.type);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isEventOneDayCheck = () => {
    if (!event.endTime) return true;

    const start = new Date(event.startTime);
    const end = new Date(event.endTime);

    return (
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate()
    );
  };

  useEffect(() => {
    if (event) {
      setIsEventOneDay(isEventOneDayCheck());
    }
  }, [event]);

  const openEditEvent = () => {
    onClose();
    openDialog(event);
  };

  const handleDeleteEvent = async () => {
    if (!event) return;

    try {
      await deleteEvent(event.seriesId);
      onClose();
      onDeleteSuccess?.(event.seriesId);
      setIsDeleteConfirmOpen(false);
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  return (
    <>
      <Dialog open={!!event} onOpenChange={onClose}>
        <DialogContent className="z-[9999] sm:max-w-[550px] p-0 overflow-hidden rounded-lg">
          <div className="h-2" style={{ backgroundColor: typeColor.bg }} />

          <div className="p-6">
            <DialogHeader className="mb-4">
              <div className="flex flex-col gap-4">
                <div className="space-y-1">
                  <Badge className={`${typeColor.bg} text-white mb-2`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </Badge>
                  <DialogTitle className="text-2xl font-bold">
                    {event.title}
                  </DialogTitle>
                  {event.location && (
                    <DialogDescription className="text-sm text-gray-600">
                      <MapPin className="h-4 w-4 inline-block mr-1" />
                      {event.location}
                    </DialogDescription>
                  )}
                </div>
              </div>
            </DialogHeader>

            {/* Event is just one day: no need to display the same date twice */}
            <div className="space-y-6">
              <Separator />
              {isEventOneDay && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">
                        {formatDate(event.startTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-medium">
                        {event.isAllDay ? (
                          "All day"
                        ) : (
                          <>
                            {formatTime(event.startTime)}
                            {event.endTime && ` - ${formatTime(event.endTime)}`}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Event is not just one day: display starting and ending dates */}
              {!isEventOneDay && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <div>
                      <p className="text-sm text-gray-600">Starting Date</p>
                      <p className="font-medium">
                        {formatDate(event.startTime)}
                        {!event.isAllDay && (
                          <> at {formatTime(event.startTime)}</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <div>
                      <p className="text-sm text-gray-600">Ending Date</p>
                      <p className="font-medium">
                        {formatDate(event.endTime)}
                        {!event.isAllDay && (
                          <> at {formatTime(event.endTime)}</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {event.description && <Separator />}
              {event.description && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Description</p>
                  <div className="p-3 bg-gray-100/50 rounded-lg">
                    <p>{event.description}</p>
                  </div>
                </div>
              )}
              <Separator />
              <div className="flex justify-end gap-2">
                <Button
                  onClick={openEditEvent}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
                <Button
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  variant="destructive"
                  size="sm"
                  className="gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {isOpen && event && (
        <AddEventDialog
          onCreateSuccess={() => {
            closeDialog();
            onClose();
          }}
        />
      )}

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="z-[99999]">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to permanently delete this event?</p>
          {event.recurrence ? (
            <p className="text-sm text-gray-600">
              This will delete all occurrences of this event.
            </p>
          ) : null}
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteConfirmOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Yes, delete it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventDialog;
