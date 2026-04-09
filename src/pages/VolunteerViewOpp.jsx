import { useState } from "react";

// Mock navigate — swap for: import { useNavigate } from "react-router-dom";
const useNavigate = () => (path) => console.log("Navigate to:", path);

// ── Sample opportunity data (replace with props or API fetch) ──
const OPPORTUNITY = {
  name: "Opportunity name",
  volunteerTotal: 25,
  location: "Amherst, MA",
  date: "January 1, 2026",
  time: "11:30 AM",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  tags: ["Tag #1", "Tag #2", "Tag #3", "Tag #4"],
};

export default function VolunteerViewOpportunity({ opportunity = OPPORTUNITY }) {
  const navigate = useNavigate();
  const [applied, setApplied] = useState(false);
  const [docFile, setDocFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleApply = () => {
    setApplied(true);
    alert("Successfully applied to event!");
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (file) setDocFile(file);
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

        <div style={styles.navCenter}>
          <button
            style={styles.navBtn}
            onClick={() => navigate("/profile")}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e8e8e8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
          >
            My profile
          </button>
          <button
            style={styles.navBtn}
            onClick={() => navigate("/events")}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e8e8e8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
          >
            View all events
          </button>
        </div>

        <button
          style={styles.logoutBtn}
          onClick={() => navigate("/login")}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#2e3a1f")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#485c10")}
        >
          Log out
        </button>
      </nav>

      {/* ── PAGE HEADER ── */}
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Volunteering Opportunity Name</h1>
        <button
          style={styles.backBtn}
          onClick={() => navigate(-1)}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#c8c8c8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#d9d9d9")}
        >
          Back
        </button>
      </div>

      {/* ── CARD ── */}
      <div style={styles.cardWrap}>
        <div style={styles.cardShadow} />
        <div style={styles.card}>

          {/* ── ROW 1: Opportunity Name | Date ── */}
          <div style={styles.row}>
            <div style={styles.col}>
              <span style={styles.label}>Opportunity Name:</span>
              <div style={styles.field}>{opportunity.name}</div>
            </div>
            <div style={styles.col}>
              <span style={styles.label}>Date</span>
              <div style={styles.field}>{opportunity.date}</div>
            </div>
          </div>

          {/* ── ROW 2: Volunteer Total | Time ── */}
          <div style={styles.row}>
            <div style={styles.col}>
              <span style={styles.label}>Volunteer Total:</span>
              <div style={styles.field}>{opportunity.volunteerTotal}</div>
            </div>
            <div style={styles.col}>
              <span style={styles.label}>Time</span>
              <div style={styles.field}>{opportunity.time}</div>
            </div>
          </div>

          {/* ── ROW 3: Location ── */}
          <div style={styles.row}>
            <div style={styles.col}>
              <span style={styles.label}>Location</span>
              <div style={styles.field}>{opportunity.location}</div>
            </div>
            <div style={styles.col} />
          </div>

          {/* ── DESCRIPTION ── */}
          <div style={{ marginTop: 4, marginBottom: 18 }}>
            <span style={styles.label}>Description</span>
            <div style={{ ...styles.field, borderRadius: 20, padding: "14px 20px", lineHeight: 1.6, marginTop: 6 }}>
              {opportunity.description}
            </div>
          </div>

          {/* ── TAGS ── */}
          <div style={{ marginBottom: 18 }}>
            <span style={styles.label}>Tags</span>
            <div style={styles.tagList}>
              {opportunity.tags.map((tag, i) => (
                <span key={i} style={styles.tag}>{tag}</span>
              ))}
              <span style={styles.addTagPlaceholder}>+ Tag</span>
            </div>
          </div>

          {/* ── DOCUMENT UPLOAD ── */}
          <p style={styles.docNote}>
            Please add any additional documents if referenced in the description
          </p>
          <div
            style={{
              ...styles.dropZone,
              background: dragging ? "#ccc" : "#d9d9d9",
              borderColor: dragging ? "#888" : "transparent",
            }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => document.getElementById("doc-upload").click()}
          >
            <input
              id="doc-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileDrop}
            />
            {docFile ? (
              <div style={styles.dropContent}>
                <span style={{ fontSize: 28 }}>📄</span>
                <span style={{ fontSize: 13, color: "#444", marginTop: 4 }}>{docFile.name}</span>
              </div>
            ) : (
              <div style={styles.dropContent}>
                {/* Upload icon SVG */}
                <svg width="60" height="56" viewBox="0 0 60 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="4" width="36" height="46" rx="4" fill="#bbb" />
                  <rect x="12" y="8" width="28" height="3" rx="1.5" fill="#e0e0e0" />
                  <rect x="12" y="14" width="28" height="3" rx="1.5" fill="#e0e0e0" />
                  <rect x="12" y="20" width="20" height="3" rx="1.5" fill="#e0e0e0" />
                  <circle cx="44" cy="42" r="14" fill="#888" />
                  <rect x="43" y="34" width="2" height="10" rx="1" fill="white" />
                  <path d="M38 40 L44 34 L50 40" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
                <span style={{ fontSize: 13, color: "#666", marginTop: 6 }}>
                  {dragging ? "Drop file here" : "Click or drag to upload"}
                </span>
              </div>
            )}
          </div>

          {/* ── APPLY BUTTON (bottom right) ── */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <button
              style={{
                ...styles.applyBtn,
                background: applied ? "#2e3a1f" : "#485c10",
                cursor: applied ? "default" : "pointer",
              }}
              onClick={!applied ? handleApply : undefined}
              onMouseEnter={(e) => {
                if (!applied) e.currentTarget.style.background = "#2e3a1f";
              }}
              onMouseLeave={(e) => {
                if (!applied) e.currentTarget.style.background = "#485c10";
              }}
            >
              {applied ? "✓ Applied!" : "Apply to event"}
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
    fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
    minHeight: "100vh",
    background: "#f0f0f0",
  },

  // Nav
  nav: {
    background: "#d9d9d9",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    height: 82,
    boxSizing: "border-box",
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    flexShrink: 0,
  },
  logoBubble: {
    width: 60,
    height: 56,
    borderRadius: "50%",
    background: "#485c10",
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
  navCenter: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  navBtn: {
    background: "#fff",
    border: "none",
    borderRadius: 100,
    padding: "10px 26px",
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
    color: "#485c10",
    letterSpacing: "-0.2px",
    transition: "background 0.15s",
    fontFamily: "inherit",
  },
  logoutBtn: {
    background: "#485c10",
    color: "#fff",
    border: "none",
    borderRadius: 100,
    padding: "11px 30px",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "-0.3px",
    transition: "background 0.15s",
    fontFamily: "inherit",
    flexShrink: 0,
  },

  // Page header
  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 36px 12px",
    maxWidth: 1100,
    margin: "0 auto",
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 800,
    color: "#111",
    letterSpacing: "-1.2px",
    margin: 0,
  },
  backBtn: {
    background: "#d9d9d9",
    border: "none",
    borderRadius: 100,
    padding: "9px 30px",
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    color: "#111",
    transition: "background 0.15s",
    fontFamily: "inherit",
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
    top: 8,
    left: 30,
    right: 30,
    bottom: -8,
    background: "#c8c8c8",
    borderRadius: 20,
    zIndex: 0,
  },
  card: {
    position: "relative",
    zIndex: 1,
    background: "#fff",
    borderRadius: 20,
    padding: "32px 44px 28px",
    border: "1px solid #e8e8e8",
  },

  // Form layout
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0 80px",
    marginBottom: 20,
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
    display: "block",
  },

  // Read-only display field
  field: {
    background: "#d9d9d9",
    borderRadius: 25,
    padding: "9px 18px",
    fontSize: 15,
    color: "#111",
    letterSpacing: "-0.1px",
    minHeight: 38,
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },

  // Tags
  tagList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    marginTop: 8,
  },
  tag: {
    background: "#8e9b77",
    color: "#fff",
    borderRadius: 100,
    padding: "5px 20px",
    fontSize: 14,
    fontWeight: 500,
    userSelect: "none",
  },
  addTagPlaceholder: {
    background: "#d9d9d9",
    color: "#333",
    borderRadius: 100,
    padding: "5px 20px",
    fontSize: 14,
    fontWeight: 500,
    userSelect: "none",
  },

  // Document upload
  docNote: {
    fontSize: 14,
    color: "#333",
    margin: "0 0 10px 0",
    letterSpacing: "-0.1px",
  },
  dropZone: {
    borderRadius: 20,
    border: "2px dashed transparent",
    height: 120,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.15s, border-color 0.15s",
    maxWidth: 520,
  },
  dropContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    pointerEvents: "none",
  },

  // Apply button
  applyBtn: {
    color: "#fff",
    border: "none",
    borderRadius: 100,
    padding: "13px 36px",
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: "-0.3px",
    transition: "background 0.15s",
    fontFamily: "inherit",
  },
};
