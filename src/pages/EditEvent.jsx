import { useState } from "react";
import { useNavigate, useParams } from "react-router";

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

  const handleSave = () => {
    console.log("Saved:", form, tags);
    alert("Changes saved!");
    navigate("/organization_dashboard");
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

  return (
    <div
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", minHeight: "100vh", background: "#f0f0f0" }}
    >
      {/* ── Nav ── */}
      <nav
        style={{
          background: "#d9d9d9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 24px",
          borderBottom: "1px solid #bbb",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#3b4a2e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            logo
          </div>
          <span style={{ fontWeight: 600, fontSize: 18, color: "#111" }}>Website name</span>
        </div>

        <button
          onClick={() => navigate("/login")}
          style={{
            background: "#3b4a2e",
            color: "#fff",
            border: "none",
            borderRadius: 24,
            padding: "10px 28px",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Log out
        </button>
      </nav>

      {/* ── Page body ── */}
      <div style={{ maxWidth: 900, margin: "32px auto", padding: "0 24px" }}>
        {/* Title */}
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 18px" }}>
          Edit Event {eventId ? `#${eventId}` : ""}
        </h1>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 0, marginBottom: 24 }}>
          {["Volunteers", "Edit Information"].map((tab) => (
            <button
              key={tab}
              onClick={() => tab === "Volunteers" && navigate("/organization_dashboard/view_applicant/1")}
              style={{
                padding: "8px 26px",
                fontSize: 15,
                fontWeight: tab === "Edit Information" ? 700 : 400,
                background: tab === "Edit Information" ? "#fff" : "transparent",
                border: "1.5px solid #bbb",
                borderRadius: tab === "Volunteers" ? "20px 0 0 20px" : "0 20px 20px 0",
                cursor: "pointer",
                color: "#111",
                marginLeft: tab === "Edit Information" ? -1 : 0,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Card */}
        <div
          style={{
            background: "#e8e8e8",
            borderRadius: 16,
            border: "1.5px solid #c0c0c0",
            padding: "32px 36px 28px",
          }}
        >
          {/* Two-column grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: 48,
              rowGap: 20,
            }}
          >
            {/* Left: Opportunity Name */}
            <div>
              <label style={labelStyle}>Opportunity Name:</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Right: Date */}
            <div>
              <label style={labelStyle}>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Left: Volunteer Total */}
            <div>
              <label style={labelStyle}>Volunteer Total:</label>
              <input
                name="volunteerTotal"
                value={form.volunteerTotal}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Right: Time */}
            <div>
              <label style={labelStyle}>Time</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Left: Location (spans just one col) */}
            <div>
              <label style={labelStyle}>Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Description – full width */}
          <div style={{ marginTop: 20 }}>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              style={{
                ...inputStyle,
                height: "auto",
                resize: "vertical",
                padding: "10px 16px",
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* Tags row + Save */}
          <div
            style={{
              marginTop: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {/* Tags */}
            <div>
              <label style={{ ...labelStyle, marginBottom: 8 }}>Tags</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    title="Click to remove"
                    onClick={() => handleRemoveTag(i)}
                    style={{
                      background: "#6b7a52",
                      color: "#fff",
                      borderRadius: 100,
                      padding: "5px 18px",
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: "pointer",
                      userSelect: "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.target.style.background = "#4f5c3a")}
                    onMouseLeave={(e) => (e.target.style.background = "#6b7a52")}
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
                    style={{
                      borderRadius: 100,
                      border: "1.5px solid #bbb",
                      padding: "4px 14px",
                      fontSize: 14,
                      width: 110,
                      outline: "none",
                    }}
                  />
                )}

                <button
                  onClick={handleAddTag}
                  style={{
                    background: "#d9d9d9",
                    border: "none",
                    borderRadius: 100,
                    padding: "5px 18px",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    color: "#111",
                  }}
                >
                  {addingTag ? "✓ Add" : "+ Tag"}
                </button>
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              style={{
                background: "#3b4a2e",
                color: "#fff",
                border: "none",
                borderRadius: 24,
                padding: "12px 32px",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                alignSelf: "flex-end",
              }}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Shared styles
const labelStyle = {
  display: "block",
  fontSize: 15,
  fontWeight: 500,
  marginBottom: 6,
  color: "#111",
};

const inputStyle = {
  display: "block",
  width: "100%",
  background: "#d9d9d9",
  border: "none",
  borderRadius: 25,
  padding: "8px 16px",
  fontSize: 15,
  color: "#111",
  outline: "none",
  boxSizing: "border-box",
};
