import { useState } from "react";

type Tab = "accepted" | "pending";

interface Volunteer {
  id: number;
  name: string;
}

interface ApplicantInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
}

const volunteers: Volunteer[] = [
  { id: 1, name: "Volunteer Name" },
  { id: 2, name: "Volunteer Name" },
  { id: 3, name: "Volunteer Name" },
];

const applicantInfo: ApplicantInfo = {
  fullName: "John Smith",
  email: "User@email.com",
  phone: "(999)-999-9999",
  location: "Amherst, MA",
  bio: "",
  skills: ["Skill", "Skill", "Skill", "Skill"],
};

export default function VolunteerUI() {
  const [activeTab, setActiveTab] = useState<"volunteers" | "edit">("volunteers");
  const [subTab, setSubTab] = useState<Tab>("accepted");
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [list, setList] = useState<Volunteer[]>(volunteers);

  const handleAccept = (v: Volunteer) => {
    setSelectedVolunteer(v);
  };

  const handleRemove = (id: number) => {
    setList((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div style={styles.pageWrap}>
      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <div style={styles.logo}>logo</div>
          <span style={styles.siteName}>Website name</span>
        </div>
        <button style={styles.logoutBtn}>Log out</button>
      </nav>

      {/* Main card */}
      <div style={styles.mainCard}>
        {/* Header */}
        <div style={styles.cardHeader}>
          <h1 style={styles.eventTitle}>Volunteer Opportunity Name</h1>
          <button style={styles.backBtn}>Back</button>
        </div>

        {/* Top tabs */}
        <div style={styles.topTabs}>
          <button
            style={{ ...styles.topTab, ...(activeTab === "volunteers" ? styles.topTabActive : {}) }}
            onClick={() => setActiveTab("volunteers")}
          >
            Volunteers
          </button>
          <button
            style={{ ...styles.topTab, ...(activeTab === "edit" ? styles.topTabActive : {}) }}
            onClick={() => setActiveTab("edit")}
          >
            Edit Information
          </button>
        </div>

        {/* Sub-tab bar */}
        <div style={styles.subTabBar}>
          <button
            style={{ ...styles.subTab, ...(subTab === "accepted" ? styles.subTabActive : {}) }}
            onClick={() => setSubTab("accepted")}
          >
            Accepted
          </button>
          <button
            style={{ ...styles.subTab, ...(subTab === "pending" ? styles.subTabActive : {}) }}
            onClick={() => setSubTab("pending")}
          >
            Pending
          </button>
        </div>

        {/* Volunteer list */}
        <div style={styles.listArea}>
          {list.map((v) => (
            <div key={v.id} style={styles.volunteerRow}>
              <span style={styles.volunteerName}>{v.name}</span>
              <div style={styles.rowActions}>
                <button style={styles.acceptBtn} onClick={() => handleAccept(v)}>Accept</button>
                <button style={styles.removeBtn} onClick={() => handleRemove(v.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Applicant modal overlay */}
      {selectedVolunteer && (
        <div style={styles.modalOverlay} onClick={() => setSelectedVolunteer(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Applicant Name</h2>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Full Name <span style={styles.req}>*</span>
                </label>
                <input style={styles.input} defaultValue={applicantInfo.fullName} readOnly />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Email <span style={styles.req}>*</span>
                </label>
                <input style={styles.input} defaultValue={applicantInfo.email} readOnly />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Phone Number <span style={styles.req}>*</span>
                </label>
                <input style={styles.input} defaultValue={applicantInfo.phone} readOnly />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Location <span style={styles.req}>*</span>
                </label>
                <input style={styles.input} defaultValue={applicantInfo.location} readOnly />
              </div>
            </div>

            <div style={{ ...styles.formGroup, marginTop: 8 }}>
              <label style={styles.label}>Bio</label>
              <textarea style={styles.textarea} readOnly />
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={styles.label}>Skills</label>
              <div style={styles.skillsRow}>
                {applicantInfo.skills.map((s, i) => (
                  <span key={i} style={styles.skillChip}>{s}</span>
                ))}
                <button style={styles.addSkillBtn}>+ Skill</button>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.backBtn} onClick={() => setSelectedVolunteer(null)}>Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────── */
const OLIVE = "#4a5e2f";
const OLIVE_LIGHT = "#5a7339";
const BORDER = "#d0d0d0";
const BG = "#f0f0f0";
const CARD_BG = "#ffffff";

const styles: Record<string, React.CSSProperties> = {
  pageWrap: {
    minHeight: "100vh",
    width: "100vw",
    marginLeft: "calc(-50vw + 50%)",
    background: BG,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: 14,
    color: "#222",
    textAlign: "left",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: CARD_BG,
    padding: "8px 20px",
    borderBottom: `1px solid ${BORDER}`,
  },
  navLeft: { display: "flex", alignItems: "center", gap: 10 },
  logo: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: OLIVE,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 11,
    fontWeight: 600,
  },
  siteName: { fontWeight: 500, fontSize: 14 },
  logoutBtn: {
    background: OLIVE,
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "6px 16px",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 13,
  },

  mainCard: {
    background: CARD_BG,
    margin: "24px auto",
    maxWidth: 780,
    borderRadius: 10,
    border: `1px solid ${BORDER}`,
    padding: "24px 32px 32px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  eventTitle: { fontSize: 26, fontWeight: 700, margin: 0 },
  backBtn: {
    background: "#e8e8e8",
    border: `1px solid ${BORDER}`,
    borderRadius: 6,
    padding: "4px 14px",
    cursor: "pointer",
    fontSize: 13,
  },

  topTabs: { display: "flex", gap: 4, marginBottom: 14 },
  topTab: {
    background: "#e8e8e8",
    border: `1px solid ${BORDER}`,
    borderRadius: 6,
    padding: "6px 18px",
    cursor: "pointer",
    fontSize: 15,
    color: "#444",
  },
  topTabActive: {
    background: "#d2d2d2",
    fontWeight: 600,
    color: "#111",
  },

  subTabBar: {
    display: "flex",
    gap: 4,
    marginBottom: 10,
  },
  subTab: {
    background: "transparent",
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    padding: "4px 18px",
    cursor: "pointer",
    fontSize: 15,
    color: "#555",
  },
  subTabActive: {
    background: "#e0e0e0",
    color: "#111",
    fontWeight: 600,
  },

  listArea: {
    background: "#f7f7f7",
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: "6px 0",
    minHeight: 160,
  },
  volunteerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 18px",
    borderBottom: `1px solid #e8e8e8`,
  },
  volunteerName: {
    fontSize: 16,
    color: "#222",
  },
  rowActions: { display: "flex", gap: 6 },
  acceptBtn: {
    background: "transparent",
    border: "2px solid #3a8a3a",
    color: "#3a8a3a",
    borderRadius: 12,
    padding: "3px 16px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
  removeBtn: {
    background: "transparent",
    border: "2px solid #c0392b",
    color: "#c0392b",
    borderRadius: 12,
    padding: "3px 16px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },

  /* Modal */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    background: CARD_BG,
    borderRadius: 10,
    padding: "28px 32px",
    width: 580,
    maxWidth: "92vw",
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    position: "relative",
  },
  modalTitle: { fontSize: 22, fontWeight: 700, margin: "0 0 18px" },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px 16px",
  },
  formGroup: { display: "flex", flexDirection: "column", gap: 3 },
  label: { fontSize: 14, fontWeight: 600, color: "#333" },
  req: { color: "#c0392b" },
  input: {
    border: `1px solid ${BORDER}`,
    borderRadius: 5,
    padding: "6px 10px",
    fontSize: 15,
    background: "#fafafa",
    color: "#333",
    outline: "none",
  },
  textarea: {
    border: `1px solid ${BORDER}`,
    borderRadius: 5,
    padding: "6px 10px",
    fontSize: 15,
    background: "#fafafa",
    resize: "none",
    height: 60,
    width: "100%",
    boxSizing: "border-box",
  },
  skillsRow: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 },
  skillChip: {
    background: OLIVE_LIGHT,
    color: "#fff",
    borderRadius: 12,
    padding: "4px 16px",
    fontSize: 14,
    fontWeight: 500,
  },
  addSkillBtn: {
    background: "#e8e8e8",
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    padding: "4px 14px",
    fontSize: 14,
    cursor: "pointer",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 18,
  },
};