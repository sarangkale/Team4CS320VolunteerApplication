import { useState } from "react";
import { useNavigate } from "react-router";

const INITIAL_TAGS = ["Tag #1", "Tag #2", "Tag #3", "Tag #4"];

export default function CreateOpportunity() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    volunteerTotal: "",
    location: "",
    date: "",
    time: "",
    description: "",
  });

  const [tags, setTags] = useState(INITIAL_TAGS);
  const [addingTag, setAddingTag] = useState(false);
  const [newTagValue, setNewTagValue] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (addingTag) {
      if (newTagValue.trim()) {
        setTags((prev) => [...prev, newTagValue.trim()]);
      }
      setNewTagValue("");
      setAddingTag(false);
    } else {
      setAddingTag(true);
    }
  };

  const handleRemoveTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePost = () => {
    console.log("Posted:", form, tags);
    alert("Opportunity posted!");
  };

  return (
    <div className="font-sans min-h-screen bg-page-alt">

      {/* Nav */}
      <nav className="bg-surface flex items-center justify-between px-7 h-nav-sm box-border">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-[52px] rounded-full bg-olive flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-[13px] tracking-tight">logo</span>
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">Website name</span>
        </div>
        <button
          className="bg-olive text-white border-none rounded-full px-7 py-2.5 text-base font-semibold cursor-pointer tracking-tight transition-colors hover:bg-olive-dark"
          onClick={() => navigate("/login")}
        >
          Log out
        </button>
      </nav>

      {/* Page header */}
      <div className="flex items-center justify-between px-9 pt-[22px] pb-3.5 max-w-header mx-auto">
        <h1 className="text-[30px] font-extrabold text-gray-900 tracking-[-1px] m-0">
          Create a Volunteering Opportunity!
        </h1>
        <button
          className="bg-surface border-none rounded-full px-7 py-2 text-base font-medium cursor-pointer text-gray-900 transition-colors hover:bg-surface-dark"
          onClick={() => navigate("/organization_dashboard")}
        >
          Back
        </button>
      </div>

      {/* Card wrap */}
      <div className="relative max-w-card mx-auto mb-12 px-9">
        {/* Shadow layer */}
        <div className="absolute rounded-card bg-surface-shadow z-0" style={{ inset: "6px -6px -6px 6px" }} />

        {/* Card */}
        <div className="relative z-10 bg-white rounded-card px-10 pt-8 pb-7 border border-[#e0e0e0]">

          {/* Row 1: Name | Date */}
          <div className="grid grid-cols-2 gap-x-[60px] mb-[18px]">
            <div className="flex flex-col gap-1.5">
              <label className="text-[15px] font-medium text-gray-900 tracking-tight mb-1" htmlFor="name">
                Opportunity Name:
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Opportunity name"
                className="w-full bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none font-sans tracking-tight"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[15px] font-medium text-gray-900 tracking-tight mb-1" htmlFor="date">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none font-sans tracking-tight"
              />
            </div>
          </div>

          {/* Row 2: Volunteer Total | Time */}
          <div className="grid grid-cols-2 gap-x-[60px] mb-[18px]">
            <div className="flex flex-col gap-1.5">
              <label className="text-[15px] font-medium text-gray-900 tracking-tight mb-1" htmlFor="volunteerTotal">
                Volunteer Total:
              </label>
              <input
                id="volunteerTotal"
                name="volunteerTotal"
                value={form.volunteerTotal}
                onChange={handleChange}
                placeholder="25"
                className="w-full bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none font-sans tracking-tight"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[15px] font-medium text-gray-900 tracking-tight mb-1" htmlFor="time">
                Time
              </label>
              <input
                id="time"
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                className="w-full bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none font-sans tracking-tight"
              />
            </div>
          </div>

          {/* Row 3: Location (left only) */}
          <div className="grid grid-cols-2 gap-x-[60px] mb-[18px]">
            <div className="flex flex-col gap-1.5">
              <label className="text-[15px] font-medium text-gray-900 tracking-tight mb-1" htmlFor="location">
                Location
              </label>
              <input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Amherst, MA"
                className="w-full bg-surface border-none rounded-full px-[18px] py-[9px] text-[15px] text-gray-900 outline-none font-sans tracking-tight"
              />
            </div>
            <div /> {/* spacer */}
          </div>

          {/* Description */}
          <div className="mt-2">
            <label className="text-[15px] font-medium text-gray-900 tracking-tight mb-1 block" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              className="w-full bg-surface border-none rounded-[20px] px-[18px] py-3 text-[15px] text-gray-900 outline-none font-sans tracking-tight leading-[1.55] resize-y"
            />
          </div>

          {/* Tags + Post button */}
          <div className="mt-6 flex items-end justify-between flex-wrap gap-4">
            {/* Tags */}
            <div>
              <label className="text-[15px] font-medium text-gray-900 tracking-tight mb-1 block">Tags</label>
              <div className="flex flex-wrap gap-2 items-center mt-1.5">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    onClick={() => handleRemoveTag(i)}
                    title="Click to remove"
                    className="bg-olive-medium text-white rounded-full px-[18px] py-[5px] text-sm font-medium cursor-pointer select-none transition-colors hover:bg-olive-light"
                  >
                    {tag}
                  </span>
                ))}

                {addingTag && (
                  <input
                    autoFocus
                    value={newTagValue}
                    onChange={(e) => setNewTagValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddTag();
                      if (e.key === "Escape") {
                        setAddingTag(false);
                        setNewTagValue("");
                      }
                    }}
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

            {/* Post Event */}
            <button
              onClick={() => {
                handlePost();
                navigate("/organization_dashboard");
              }}
              className="bg-olive text-white border-none rounded-full px-8 py-3 text-base font-bold cursor-pointer tracking-tight transition-colors hover:bg-olive-dark whitespace-nowrap shrink-0"
            >
              Post Event
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
