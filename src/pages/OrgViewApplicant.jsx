import { useState } from "react";

// Mock navigation — replace with: import { useNavigate } from "react-router-dom";
const useNavigate = () => (path) => console.log("Navigate to:", path);

// these are all fillers and should be taken from whatever applicant table that exists 
const INITIAL_PENDING = [
  {
    id: 1,
    name: "John Smith",
    email: "john@email.com",
    phone: "(999)-999-9999",
    location: "Amherst, MA",
    bio: "Passionate about community service and environmental sustainability.",
    skills: ["Teamwork", "Leadership", "Outreach", "Planning"],
  },
  {
    id: 2,
    name: "Maya Patel",
    email: "maya@email.com",
    phone: "(888)-555-1234",
    location: "Northampton, MA",
    bio: "Graduate student with experience in nonprofit coordination.",
    skills: ["Communication", "Research", "Fundraising"],
  },
  {
    id: 3,
    name: "Carlos Rivera",
    email: "carlos@email.com",
    phone: "(777)-333-4567",
    location: "Springfield, MA",
    bio: "Experienced volunteer with a background in event management.",
    skills: ["Events", "Logistics", "Design", "Social Media"],
  },
];

const INITIAL_ACCEPTED = [];

// Read-only info field with pill shape
const InfoField = ({ label, value, required }) => (
  <div>
    <label style={{ fontSize: 13, fontWeight: 500, color: "#111", display: "block", marginBottom: 5 }}>
      {label}{required && <span style={{ color: "#bd0303", marginLeft: 2 }}>*</span>}
    </label>
    <div style={{
      background: "#d9d9d9",
      borderRadius: 100,
      padding: "7px 16px",
      fontSize: 14,
      color: "#333",
      minHeight: 34,
      display: "flex",
      alignItems: "center",
    }}>
      {value || <span style={{ color: "#999" }}>—</span>}
    </div>
  </div>
);

// Applicant detail modal
function ApplicantModal({ volunteer, onClose }) {
  if (!volunteer) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "32px 36px 28px",
          width: "100%",
          maxWidth: 580,
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        }}
      >
        {/* Title */}
        <h2 style={{
          fontSize: 22,
          fontWeight: 800,
          margin: "0 0 24px",
          letterSpacing: "-0.5px",
          color: "#111",
        }}>
          {volunteer.name}
        </h2>

        {/* 2-column grid of fields */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px 28px",
          marginBottom: 16,
        }}>
          <InfoField label="Full Name" value={volunteer.name} required />
          <InfoField label="Email" value={volunteer.email} required />
          <InfoField label="Phone Number" value={volunteer.phone} required />
          <InfoField label="Location" value={volunteer.location} required />
        </div>

        {/* Bio — full width, rounded rectangle */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#111", display: "block", marginBottom: 5 }}>
            Bio
          </label>
          <div style={{
            background: "#d9d9d9",
            borderRadius: 14,
            padding: "10px 16px",
            fontSize: 14,
            color: "#333",
            minHeight: 46,
            lineHeight: 1.6,
          }}>
            {volunteer.bio || <span style={{ color: "#999" }}>No bio provided.</span>}
          </div>
        </div>

        {/* Skills */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#111", display: "block", marginBottom: 8 }}>
            Skills
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {volunteer.skills && volunteer.skills.map((skill, i) => (
              <span
                key={i}
                style={{
                  background: "#6b7a52",
                  color: "#fff",
                  borderRadius: 100,
                  padding: "5px 18px",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Back button bottom-right */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              background: "#d9d9d9",
              border: "none",
              borderRadius: 100,
              padding: "10px 30px",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              color: "#111",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#c8c8c8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#d9d9d9"; }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrganizationEventView() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("volunteers");
  const [activeSubTab, setActiveSubTab] = useState("pending");
  const [pendingList, setPendingList] = useState(INITIAL_PENDING);
  const [acceptedList, setAcceptedList] = useState(INITIAL_ACCEPTED);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const handleAccept = (id) => {
    const volunteer = pendingList.find((v) => v.id === id);
    if (volunteer) {
      setPendingList((prev) => prev.filter((v) => v.id !== id));
      setAcceptedList((prev) => [...prev, volunteer]);
    }
  };

  const handleRemovePending = (id) => {
    setPendingList((prev) => prev.filter((v) => v.id !== id));
  };

  const handleRemoveAccepted = (id) => {
    setAcceptedList((prev) => prev.filter((v) => v.id !== id));
  };

  const currentList = activeSubTab === "pending" ? pendingList : acceptedList;

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", minHeight: "100vh", background: "#f0f0f0" }}>

      {/* Applicant detail modal */}
      <ApplicantModal
        volunteer={selectedVolunteer}
        onClose={() => setSelectedVolunteer(null)}
      />

      {/* ── Nav ── */}
      <nav style={{
        background: "#d9d9d9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 32px",
        borderBottom: "1px solid #bbb",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "#485c10",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
          }}>
            logo
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#111" }}>Website name</span>
        </div>
        <button
          onClick={() => navigate("/login")}
          style={{
            background: "#485c10",
            color: "#fff",
            border: "none",
            borderRadius: 100,
            padding: "11px 32px",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "-0.5px",
          }}
        >
          Log out
        </button>
      </nav>

      {/* ── Page body ── */}
      <div style={{ maxWidth: 960, margin: "28px auto", padding: "0 28px" }}>

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, margin: 0, letterSpacing: "-1px" }}>
            Volunteer Opportunity Name
          </h1>
          <button
            onClick={() => navigate("/opportunities")}
            style={{
              background: "#d9d9d9",
              border: "none",
              borderRadius: 100,
              padding: "10px 28px",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              color: "#111",
            }}
          >
            Back
          </button>
        </div>

        {/* Top tab bar: Volunteers / Edit Information */}
        <div style={{
          display: "inline-flex",
          background: "#d9d9d9",
          borderRadius: 100,
          padding: 4,
          marginBottom: 20,
        }}>
          {[
            { key: "volunteers", label: "Volunteers" },
            { key: "editInfo", label: "Edit Information" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                if (key === "editInfo") navigate("/edit-opportunity");
              }}
              style={{
                background: activeTab === key ? "#fff" : "transparent",
                border: "none",
                borderRadius: 100,
                padding: "8px 24px",
                fontSize: 15,
                fontWeight: activeTab === key ? 600 : 400,
                cursor: "pointer",
                color: "#111",
                transition: "background 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Main card */}
        <div style={{
          background: "#d9d9d9",
          borderRadius: 20,
          padding: "14px 14px 20px",
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 14,
            padding: "20px 16px 28px",
            minHeight: 460,
          }}>

            {/* Sub tab bar: Accepted / Pending */}
            <div style={{
              display: "inline-flex",
              background: "#d9d9d9",
              borderRadius: 100,
              padding: 4,
              marginBottom: 20,
            }}>
              {[
                { key: "accepted", label: "Accepted" },
                { key: "pending", label: "Pending" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveSubTab(key)}
                  style={{
                    background: activeSubTab === key ? "#fff" : "transparent",
                    border: "none",
                    borderRadius: 100,
                    padding: "7px 28px",
                    fontSize: 15,
                    fontWeight: activeSubTab === key ? 600 : 400,
                    cursor: "pointer",
                    color: "#111",
                    transition: "background 0.15s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Volunteer rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {currentList.length === 0 && (
                <p style={{ color: "#888", fontSize: 15, padding: "12px 8px" }}>
                  No {activeSubTab} volunteers.
                </p>
              )}

              {currentList.map((volunteer) => (
                <div
                  key={volunteer.id}
                  style={{
                    background: "#d9d9d9",
                    borderRadius: 16,
                    height: 58,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 10px",
                  }}
                >
                  {/* Clickable name opens modal */}
                  <button
                    onClick={() => setSelectedVolunteer(volunteer)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: "4px 6px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#111",
                      minWidth: 160,
                      textAlign: "left",
                      textDecoration: "underline",
                      textDecorationColor: "transparent",
                      textUnderlineOffset: 2,
                      transition: "color 0.15s, text-decoration-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#485c10";
                      e.currentTarget.style.textDecorationColor = "#485c10";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#111";
                      e.currentTarget.style.textDecorationColor = "transparent";
                    }}
                  >
                    {volunteer.name}
                  </button>

                  {/* Action buttons */}
                  <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                    {activeSubTab === "pending" && (
                      <button
                        onClick={() => handleAccept(volunteer.id)}
                        style={{
                          background: "#fff",
                          border: "2.5px solid #2bbd03",
                          borderRadius: 100,
                          padding: "5px 22px",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#2bbd03",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#f0fde8"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
                      >
                        Accept
                      </button>
                    )}
                    <button
                      onClick={() =>
                        activeSubTab === "pending"
                          ? handleRemovePending(volunteer.id)
                          : handleRemoveAccepted(volunteer.id)
                      }
                      style={{
                        background: "#fff",
                        border: "2.5px solid #bd0303",
                        borderRadius: 100,
                        padding: "5px 20px",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#bd0303",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#fdf0f0"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
