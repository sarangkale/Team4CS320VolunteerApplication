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
    <div style={styles.page}>
      {/* ── NAV ── */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <div style={styles.logoBubble}>
            <span style={styles.logoText}>logo</span>
          </div>
          <span style={styles.siteName}>Website name</span>
        </div>
        <button
          style={styles.logoutBtn}
          onClick={() => navigate("/login")}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#2e3a1f")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#3b4a2e")}
        >
          Log out
        </button>
      </nav>

      {/* ── PAGE HEADER ── */}
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Create a Volunteering Opportunity!</h1>
        <button
          style={styles.backBtn}
          onClick={() => navigate("/organization_dashboard")}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#c8c8c8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#d9d9d9")}
        >
          Back
        </button>
      </div>

      {/* ── CARD ── */}
      <div style={styles.cardWrap}>
        {/* shadow layer */}
        <div style={styles.cardShadow} />
        <div style={styles.card}>

          {/* ── ROW 1: Opportunity Name | Date ── */}
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label} htmlFor="name">Opportunity Name:</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Opportunity name"
                style={styles.input}
              />
            </div>
            <div style={styles.col}>
              <label style={styles.label} htmlFor="date">Date</label>
              <input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          {/* ── ROW 2: Volunteer Total | Time ── */}
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label} htmlFor="volunteerTotal">Volunteer Total:</label>
              <input
                id="volunteerTotal"
                name="volunteerTotal"
                value={form.volunteerTotal}
                onChange={handleChange}
                placeholder="25"
                style={styles.input}
              />
            </div>
            <div style={styles.col}>
              <label style={styles.label} htmlFor="time">Time</label>
              <input
                id="time"
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          {/* ── ROW 3: Location (left only) ── */}
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label} htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Amherst, MA"
                style={styles.input}
              />
            </div>
            <div style={styles.col} /> {/* spacer */}
          </div>

          {/* ── DESCRIPTION ── */}
          <div style={{ marginTop: 8 }}>
            <label style={styles.label} htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              style={{ ...styles.input, height: "auto", resize: "vertical", padding: "12px 18px", lineHeight: 1.55 }}
            />
          </div>

          {/* ── TAGS + POST BUTTON ── */}
          <div style={styles.tagsRow}>
            {/* Tags section */}
            <div>
              <label style={styles.label}>Tags</label>
              <div style={styles.tagList}>
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    onClick={() => handleRemoveTag(i)}
                    title="Click to remove"
                    style={styles.tag}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#4f5c3a")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#6b7a52")}
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
                    style={styles.tagInput}
                  />
                )}

                <button
                  onClick={handleAddTag}
                  style={styles.addTagBtn}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#c8c8c8")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#d9d9d9")}
                >
                  {addingTag ? "✓ Add" : "+ Tag"}
                </button>
              </div>
            </div>

            {/* Post Event button */}
            <button
              onClick={() => {
                handlePost();
                navigate("/organization_dashboard");
              }}
              style={styles.postBtn}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#2e3a1f")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#3b4a2e")}
            >
              Post Event
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = {
  page: {
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    minHeight: "100vh",
    background: "#f0f0f0",
  },

  // Nav
  nav: {
    background: "#d9d9d9",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 28px",
    height: 76,
    boxSizing: "border-box",
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  logoBubble: {
    width: 56,
    height: 52,
    borderRadius: "50%",
    background: "#3b4a2e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: {
    color: "#fff",
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: "-0.5px",
  },
  siteName: {
    fontWeight: 700,
    fontSize: 18,
    color: "#111",
    letterSpacing: "-0.3px",
  },
  logoutBtn: {
    background: "#3b4a2e",
    color: "#fff",
    border: "none",
    borderRadius: 100,
    padding: "10px 30px",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "-0.3px",
    transition: "background 0.15s",
  },

  // Page header
  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "22px 36px 14px",
    maxWidth: 1100,
    margin: "0 auto",
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: 800,
    color: "#111",
    letterSpacing: "-1px",
    margin: 0,
  },
  backBtn: {
    background: "#d9d9d9",
    border: "none",
    borderRadius: 100,
    padding: "8px 28px",
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    color: "#111",
    transition: "background 0.15s",
  },

  // Card
  cardWrap: {
    position: "relative",
    maxWidth: 1060,
    margin: "0 auto 48px",
    padding: "0 36px",
  },
  cardShadow: {
    position: "absolute",
    inset: "6px -6px -6px 6px",
    background: "#d0d0d0",
    borderRadius: 20,
    zIndex: 0,
  },
  card: {
    position: "relative",
    zIndex: 1,
    background: "#fff",
    borderRadius: 20,
    padding: "32px 40px 28px",
    border: "1px solid #e0e0e0",
  },

  // Form layout
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0 60px",
    marginBottom: 18,
  },
  col: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  label: {
    fontSize: 15,
    fontWeight: 500,
    color: "#111",
    marginBottom: 4,
    letterSpacing: "-0.2px",
  },
  input: {
    display: "block",
    width: "100%",
    background: "#d9d9d9",
    border: "none",
    borderRadius: 25,
    padding: "9px 18px",
    fontSize: 15,
    color: "#111",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    letterSpacing: "-0.2px",
  },

  // Tags
  tagsRow: {
    marginTop: 24,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
  },
  tagList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    marginTop: 6,
  },
  tag: {
    background: "#6b7a52",
    color: "#fff",
    borderRadius: 100,
    padding: "5px 18px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    userSelect: "none",
    transition: "background 0.15s",
  },
  tagInput: {
    borderRadius: 100,
    border: "1.5px solid #bbb",
    padding: "4px 14px",
    fontSize: 14,
    width: 110,
    outline: "none",
    fontFamily: "inherit",
  },
  addTagBtn: {
    background: "#d9d9d9",
    border: "none",
    borderRadius: 100,
    padding: "5px 18px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    color: "#111",
    transition: "background 0.15s",
    fontFamily: "inherit",
  },

  postBtn: {
    background: "#3b4a2e",
    color: "#fff",
    border: "none",
    borderRadius: 100,
    padding: "12px 34px",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "-0.3px",
    transition: "background 0.15s",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
};
