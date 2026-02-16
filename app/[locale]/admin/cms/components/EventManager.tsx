"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent, deleteEvent } from "@/lib/cms-actions";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  imageUrl: string | null;
  status: string;
}

interface EventManagerProps {
  initialEvents: Event[];
}

export default function EventManager({ initialEvents }: EventManagerProps) {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      imageUrl: formData.get("imageUrl") as string,
    };

    try {
      if (editingEvent) {
        const result = await updateEvent(editingEvent.id, data);
        if (result.success) {
          setShowForm(false);
          setEditingEvent(null);
          router.refresh();
        }
      } else {
        const result = await createEvent(data);
        if (result.success) {
          setShowForm(false);
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    setIsLoading(true);
    try {
      const result = await deleteEvent(id);
      if (result.success) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Event Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditingEvent(null);
            setShowForm(true);
          }}
          className="px-6 py-3 bg-[#c9a962] text-black font-medium rounded-lg hover:bg-[#d4b86a] transition-all"
        >
          + Add Event
        </button>
      </div>

      {/* Event Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {editingEvent ? "Edit Event" : "Create Event"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Title</label>
                <input
                  name="title"
                  defaultValue={editingEvent?.title}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a962]/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingEvent?.description}
                  required
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a962]/50 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Location</label>
                <input
                  name="location"
                  defaultValue={editingEvent?.location}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a962]/50 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Start Date</label>
                  <input
                    name="startDate"
                    type="datetime-local"
                    defaultValue={editingEvent?.startDate ? new Date(editingEvent.startDate).toISOString().slice(0, 16) : ""}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a962]/50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">End Date (Optional)</label>
                  <input
                    name="endDate"
                    type="datetime-local"
                    defaultValue={editingEvent?.endDate ? new Date(editingEvent.endDate).toISOString().slice(0, 16) : ""}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a962]/50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Image URL (Optional)</label>
                <input
                  name="imageUrl"
                  defaultValue={editingEvent?.imageUrl || ""}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a962]/50 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEvent(null);
                  }}
                  className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-[#c9a962] text-black rounded-lg hover:bg-[#d4b86a] transition-all disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : editingEvent ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="grid gap-4">
        {events.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
            <p className="text-white/60">No events yet. Create your first event!</p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${event.status === "upcoming"
                          ? "bg-blue-500/20 text-blue-400"
                          : event.status === "ongoing"
                            ? "bg-green-500/20 text-green-400"
                            : event.status === "past"
                              ? "bg-gray-500/20 text-gray-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mb-1">{event.location}</p>
                  <p className="text-white/40 text-sm">
                    {formatDate(event.startDate)}
                    {event.endDate && ` - ${formatDate(event.endDate)}`}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingEvent(event);
                      setShowForm(true);
                    }}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
