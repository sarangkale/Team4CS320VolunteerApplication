import { useState } from "react";
import { useNavigate, useParams } from "react-router";

const EVENT_BY_ID = {
  1: {
    name: "Event #1",
    volunteerTotal: "15",
    location: "Amherst Town Hall",
    date: "2026-01-01",
    time: "11:30",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  2: {
    name: "Event #2",
    volunteerTotal: "15",
    location: "Downtown Public Library",
    date: "2026-01-01",
    time: "11:30",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  3: {
    name: "Event #3",
    volunteerTotal: "15",
    location: "North Commons Park",
    date: "2026-01-01",
    time: "11:30",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
};

export default function EditOpportunity() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const eventData = EVENT_BY_ID[Number(eventId)] ?? EVENT_BY_ID[1];

  const [form, setForm] = useState({
    name: eventData.name,
    volunteerTotal: eventData.volunteerTotal,
    location: eventData.location,
    date: eventData.date,
    time: eventData.time,
    description: eventData.description,
  });

  const [tags, setTags] = useState(["Tag #1", "Tag #2", "Tag #3", "Tag #4"]);
  const [newTagInput, setNewTagInput] = useState("");
  const [addingTag, setAddingTag] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (addingTag) {
      if (newTagInput.trim()) {
        setTags((prev) => [...prev, newTagInput.trim()]);
      }
      setNewTagInput("");
      setAddingTag(false);
    } else {
      setAddingTag(true);
    }
  };

  const handleRemoveTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ];
    return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
  };

  // Format time for display
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [h, min] = timeStr.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${min} ${ampm}`;
  };

  const handleSave = () => {
    console.log("Saved:", form, tags);
    alert("Changes saved!");
    navigate("/organization_dashboard");
  };

  return (
    <div className="font-sans min-h-screen bg-page-alt">

      {/* Nav */}
      <nav className="bg-surface flex items-center justify-between px-6 py-2.5 border-b border-[#bbb]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-olive flex items-center justify-center text-white font-bold text-[13px] shrink-0">
            logo
          </div>
          <span className="font-semibold text-lg text-gray-900">Website name</span>
        </div>
        <button
          className="bg-olive text-white border-none rounded-full px-7 py-2.5 text-base font-semibold cursor-pointer transition-colors hover:bg-olive-dark"
          onClick={() => navigate("/login")}
        >
          Log out
        </button>
      </nav>

      {/* Page body */}
      <div className="max-w-[900px] mx-auto mt-8 px-6 pb-12">

        {/* Title */}
        <h1 className="text-[32px] font-extrabold m-0 mb-[18px]">
          Edit Event {eventId ? `#${eventId}` : ""}
        </h1>

        {/* Tab bar */}
        <div className="flex mb-6">
          <button
            onClick={() => navigate("/organization_dashboard/view_applicant/1")}
            className="px-6 py-2 text-[15px] font-normal bg-transparent border border-[#bbb] rounded-l-full cursor-pointer text-gray-900 transition-colors hover:bg-white"
          >
            Volunteers
          </button>
          <button
            className="px-6 py-2 text-[15px] font-bold bg-white border border-[#bbb] -ml-px rounded-r-full cursor-pointer text-gray-900"
          >
            Edit Information
          </button>
        </div>

        {/* Card */}
        <div className="bg-[#e8e8e8] rounded-[16px] border border-[#c0c0c0] px-9 pt-8 pb-7">

          {/* Two-column grid */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-5">

            {/* Opportunity Name */}
            <div>
              <label className="block text-[15px] font-medium text-gray-900 mb-1.5">
                Opportunity Name:
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-surface border-none rounded-full px-4 py-2 text-[15px] text-gray-900 outline-none font-sans"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-[15px] font-medium text-gray-900 mb-1.5">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full bg-surface border-none rounded-full px-4 py-2 text-[15px] text-gray-900 outline-none font-sans"
              />
            </div>

            {/* Volunteer Total */}
            <div>
              <label className="block text-[15px] font-medium text-gray-900 mb-1.5">
                Volunteer Total:
              </label>
              <input
                name="volunteerTotal"
                value={form.volunteerTotal}
                onChange={handleChange}
                className="w-full bg-surface border-none rounded-full px-4 py-2 text-[15px] text-gray-900 outline-none font-sans"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-[15px] font-medium text-gray-900 mb-1.5">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full bg-surface border-none rounded-full px-4 py-2 text-[15px] text-gray-900 outline-none font-sans"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-[15px] font-medium text-gray-900 mb-1.5">
                Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full bg-surface border-none rounded-full px-4 py-2 text-[15px] text-gray-900 outline-none font-sans"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-5">
            <label className="block text-[15px] font-medium text-gray-900 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full bg-surface border-none rounded-[20px] px-4 py-2.5 text-[15px] text-gray-900 outline-none font-sans leading-[1.5] resize-y"
            />
          </div>

          {/* Tags + Save */}
          <div className="mt-6 flex items-center justify-between flex-wrap gap-3">

            {/* Tags */}
            <div>
              <label className="block text-[15px] font-medium text-gray-900 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 items-center">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    title="Click to remove"
                    onClick={() => handleRemoveTag(i)}
                    className="bg-olive-medium text-white rounded-full px-[18px] py-[5px] text-sm font-medium cursor-pointer select-none transition-colors hover:bg-olive-light"
                  >
                    {tag}
                  </span>
                ))}

                {addingTag && (
                  <input
                    autoFocus
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                    placeholder="Tag name"
                    className="rounded-full border border-[#bbb] px-3.5 py-1 text-sm w-[110px] outline-none font-sans"
                  />
                )}

                <button
                  onClick={handleAddTag}
                  className="bg-surface border-none rounded-full px-[18px] py-[5px] text-sm font-medium cursor-pointer text-gray-900 transition-colors hover:bg-surface-dark font-sans"
                >
                  {addingTag ? "✓ Add" : "+ Tag"}
                </button>
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              className="bg-olive text-white border-none rounded-full px-8 py-3 text-base font-bold cursor-pointer transition-colors hover:bg-olive-dark whitespace-nowrap self-end"
            >
              Save changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
