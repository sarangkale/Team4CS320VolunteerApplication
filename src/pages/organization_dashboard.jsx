import { useState, useRef } from "react";
import { logout } from "../auth/auth.ts";
import { useNavigate } from "react-router";

// ── Sample Data ──────────────────────────────────────────────
const INITIAL_SKILLS = ["Skill #1", "Skill #2", "Skill #3", "Skill #4"];

const INITIAL_EVENTS = [
    {
        id: 1,
        name: "Event #1",
        status: "active",
        date: "January 01, 2026   11:30 AM",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        volunteers: 12,
        maxVolunteers: 15,
    },
    {
        id: 2,
        name: "Event #2",
        status: "active",
        date: "January 01, 2026   11:30 AM",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        volunteers: 12,
        maxVolunteers: 15,
    },
    {
        id: 3,
        name: "Event #3",
        status: "full",
        date: "January 01, 2026   11:30 AM",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        volunteers: 15,
        maxVolunteers: 15,
    },
];

// ── Status Badge ─────────────────────────────────────────────
function StatusBadge({ status }) {
    const isActive = status === "active";
    return (
        <span style={{
            border: `3px solid ${isActive ? "#2CBD03" : "#BD0303"}`,
            color: isActive ? "#2CBD03" : "#BD0303",
            borderRadius: 9999,
            padding: "3px 12px",
            fontSize: 14,
            fontWeight: 600,
            background: "white",
            whiteSpace: "nowrap",
        }}>
            {isActive ? "active" : "Full"}
        </span>
    );
}

// ── Event Card ───────────────────────────────────────────────
function EventCard({ event }) {
    return (
        <div style={s.eventCard}>
            <div style={s.eventTop}>
                <div style={s.eventLeft}>
                    <span style={s.eventName}>{event.name}</span>
                    <StatusBadge status={event.status} />
                </div>
                <div style={s.eventRight}>
                    {/* Calendar icon */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                    </svg>
                    <span style={s.eventDate}>{event.date}</span>
                </div>
            </div>
            <div style={s.eventBottom}>
                <span style={s.eventDesc}>{event.description}</span>
                <div style={s.volunteerCount}>
                    {/* Person icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span style={s.volunteerText}>
                        {event.volunteers}/{event.maxVolunteers} Volunteers
                    </span>
                </div>
            </div>
        </div>
    );
}

// ── Create Event Modal ───────────────────────────────────────
function CreateEventModal({ onClose, onCreate }) {
    const [form, setForm] = useState({
        name: "",
        date: "",
        description: "",
        maxVolunteers: "",
    });

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = () => {
        if (!form.name.trim()) return;
        onCreate({
            id: Date.now(),
            name: form.name,
            status: "active",
            date: form.date || "TBD",
            description: form.description || "No description provided.",
            volunteers: 0,
            maxVolunteers: parseInt(form.maxVolunteers) || 15,
        });
        onClose();
    };

    return (
        <div style={s.overlayBg} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{ ...s.overlayCard, maxWidth: 520, textAlign: "left" }}>
                <h2 style={{ ...s.overlayTitle, textAlign: "left", marginBottom: 20 }}>Create Event</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={s.field}>
                        <label style={s.label}>Event Name</label>
                        <input style={s.input} name="name" value={form.name} onChange={handleChange} placeholder="e.g. Community Cleanup" />
                    </div>
                    <div style={s.field}>
                        <label style={s.label}>Date &amp; Time</label>
                        <input style={s.input} name="date" value={form.date} onChange={handleChange} placeholder="e.g. January 01, 2026  11:30 AM" />
                    </div>
                    <div style={s.field}>
                        <label style={s.label}>Description</label>
                        <textarea style={{ ...s.input, minHeight: 80, resize: "vertical" }} name="description" value={form.description} onChange={handleChange} placeholder="Describe the event..." />
                    </div>
                    <div style={s.field}>
                        <label style={s.label}>Max Volunteers</label>
                        <input style={s.input} type="number" name="maxVolunteers" value={form.maxVolunteers} onChange={handleChange} placeholder="e.g. 15" min="1" />
                    </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
                    <button style={s.cancelBtn} onClick={onClose}>Cancel</button>
                    <button style={s.overlayClose} onClick={handleSubmit}>Create</button>
                </div>
            </div>
        </div>
    );
}

// ── Main Component ───────────────────────────────────────────
export default function OrganizationDashboard() {
    const [activeTab, setActiveTab] = useState("events");
    const [overlay, setOverlay] = useState(null);
    const [showCreateEvent, setShowCreateEvent] = useState(false);
    const [events, setEvents] = useState(INITIAL_EVENTS);

    const [form, setForm] = useState({
        orgName: "The Organization",
        email: "User@email.com",
        phone: "(999)-999-999",
        location: "Amherst, MA",
        website: "TheOrganization.com",
        dateEstablished: "January 1, 2026",
    });

    const [skills, setSkills] = useState(INITIAL_SKILLS);
    const [skillInput, setSkillInput] = useState("");
    const [showSkillInput, setShowSkillInput] = useState(false);
    const skillInputRef = useRef(null);

    const handleFormChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const openSkillInput = () => {
        setShowSkillInput(true);
        setTimeout(() => skillInputRef.current?.focus(), 50);
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === "Enter") {
            const val = skillInput.trim();
            if (val && !skills.includes(val)) setSkills((prev) => [...prev, val]);
            setSkillInput("");
            setShowSkillInput(false);
        } else if (e.key === "Escape") {
            setSkillInput("");
            setShowSkillInput(false);
        }
    };

    const removeSkill = (skill) =>
        setSkills((prev) => prev.filter((sk) => sk !== skill));

    const handleCreateEvent = (newEvent) => {
        setEvents((prev) => [...prev, newEvent]);
    };

    const overlayInfo = {
        logout: { title: "Log Out", msg: "You would be logged out and redirected to the login page." },
    };

    const navigate = useNavigate();

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #ebebeb; min-height: 100vh; color: #1a1a1a; }
        input, textarea, button { font-family: 'DM Sans', sans-serif; }
        input:focus, textarea:focus { outline: none; box-shadow: 0 0 0 2px #8E9B77; background: #e2e2e2 !important; }
        .navBtnLogout:hover { background: #3a4c0d !important; }
        .tabInactive:hover { background: rgba(255,255,255,0.55) !important; }
        .skillAddBtn:hover { background: #c6c6c6 !important; }
        .removeSkillBtn:hover { opacity: 1 !important; }
        .overlayCloseBtn:hover { background: #3a4c0d !important; }
        .createEventBtn:hover { background: #c2c2c2 !important; }
      `}</style>

            {/* ── NAV ── */}
            <nav style={s.nav}>
                <div style={s.navLogo}>logo</div>
                <span style={s.navSiteName}>Website name</span>
                <button className="navBtnLogout" style={s.navBtnLogout} onClick={async () => {
                    try {
                        await logout();
                    } finally {
                        navigate("/login");
                    }
                }}>
                    Log out
                </button>
            </nav>

            {/* ── MAIN ── */}
            <div style={s.main}>
                <h1 style={s.greeting}>Hello Organization!</h1>

                {/* ── TABS ROW ── */}
                <div style={s.tabRow}>
                    <div style={s.tabs}>
                        <button
                            className={activeTab !== "account" ? "tabInactive" : ""}
                            style={activeTab === "account" ? s.tabActive : s.tabInactive}
                            onClick={() => setActiveTab("account")}
                        >
                            Account info
                        </button>
                        <button
                            className={activeTab !== "events" ? "tabInactive" : ""}
                            style={activeTab === "events" ? s.tabActive : s.tabInactive}
                            onClick={() => setActiveTab("events")}
                        >
                            Events &amp; Volunteers
                        </button>
                    </div>

                    {activeTab === "events" ? (
                        <button className="createEventBtn" style={s.createEventBtn} onClick={() => navigate("/organization_dashboard/create_opportunity")}>
                            Create Event
                        </button>
                    ) : (
                        <button className="createEventBtn" style={s.createEventBtn}>Edit</button>
                    )}
                </div>

                {/* ══════════ ACCOUNT INFO TAB ══════════ */}
                {activeTab === "account" && (
                    <div style={s.cardWrapper}>
                        <div style={s.card}>
                            <div style={s.cardTitle}>Organization Information</div>
                            <div style={s.cardSubtitle}>Manage your organization's profile</div>

                            <div style={s.formGrid}>
                                <div style={s.field}>
                                    <label style={s.label}>Organization Name:</label>
                                    <input style={s.input} type="text" name="orgName" value={form.orgName} onChange={handleFormChange} placeholder="The Organization" />
                                </div>
                                <div style={s.field}>
                                    <label style={s.label}>Email</label>
                                    <input style={s.input} type="email" name="email" value={form.email} onChange={handleFormChange} placeholder="user@email.com" />
                                </div>
                                <div style={s.field}>
                                    <label style={s.label}>Phone Number</label>
                                    <input style={s.input} type="tel" name="phone" value={form.phone} onChange={handleFormChange} placeholder="(999)-999-9999" />
                                </div>
                                <div style={s.field}>
                                    <label style={s.label}>Location</label>
                                    <input style={s.input} type="text" name="location" value={form.location} onChange={handleFormChange} placeholder="City, State" />
                                </div>
                                <div style={s.field}>
                                    <label style={s.label}>Website</label>
                                    <input style={s.input} type="text" name="website" value={form.website} onChange={handleFormChange} placeholder="yourorg.com" />
                                </div>
                                <div style={s.field}>
                                    <label style={s.label}>Date of established</label>
                                    <input style={s.input} type="text" name="dateEstablished" value={form.dateEstablished} onChange={handleFormChange} placeholder="January 1, 2026" />
                                </div>
                            </div>

                            {/* Desired Skills */}
                            <div style={s.skillsSection}>
                                <div style={s.skillsLabel}>Desired Skills</div>
                                <div style={s.skillsContainer}>
                                    {skills.map((skill) => (
                                        <span key={skill} style={s.skillTag}>
                                            {skill}
                                            <button className="removeSkillBtn" style={s.removeSkill} onClick={() => removeSkill(skill)} title="Remove">×</button>
                                        </span>
                                    ))}
                                    {showSkillInput && (
                                        <input
                                            ref={skillInputRef}
                                            style={{ ...s.input, width: 140, padding: "5px 11px" }}
                                            type="text"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={handleSkillKeyDown}
                                            placeholder="e.g. Cooking"
                                        />
                                    )}
                                    {!showSkillInput && (
                                        <button className="skillAddBtn" style={s.skillAddBtn} onClick={openSkillInput}>+ Skill</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══════════ EVENTS & VOLUNTEERS TAB ══════════ */}
                {activeTab === "events" && (
                    <div style={s.cardWrapper}>
                        <div style={s.card}>
                            <div style={s.cardTitle}>Volunteer Events</div>
                            <div style={s.cardSubtitle}>Manage your Events &amp; Volunteers</div>
                            <div style={s.eventList}>
                                {events.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                                {events.length === 0 && (
                                    <div style={s.emptyState}>
                                        <span style={{ fontSize: 36 }}>📋</span>
                                        <p style={{ color: "#888", fontSize: 15 }}>No events yet. Click "Create Event" to add one.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── CREATE EVENT MODAL ── */}
            {showCreateEvent && (
                <CreateEventModal
                    onClose={() => setShowCreateEvent(false)}
                    onCreate={handleCreateEvent}
                />
            )}

            {/* ── LOGOUT OVERLAY ── */}
            {overlay && (
                <div style={s.overlayBg} onClick={(e) => { if (e.target === e.currentTarget) setOverlay(null); }}>
                    <div style={s.overlayCard}>
                        <h2 style={s.overlayTitle}>{overlayInfo[overlay]?.title}</h2>
                        <p style={s.overlayMsg}>{overlayInfo[overlay]?.msg}</p>
                        <button className="overlayCloseBtn" style={s.overlayClose} onClick={() => setOverlay(null)}>
                            Go back
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

// ── Styles ───────────────────────────────────────────────────
const s = {
    nav: { background: "#D9D9D9", display: "flex", alignItems: "center", padding: "0 32px", height: 88, gap: 14, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
    navLogo: { background: "#485C11", color: "white", borderRadius: 9999, width: 82, height: 70, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, flexShrink: 0 },
    navSiteName: { fontWeight: 700, fontSize: 21, marginRight: "auto" },
    navBtnLogout: { background: "#485C11", color: "white", border: "none", borderRadius: 9999, padding: "13px 26px", fontSize: 16, fontWeight: 500, cursor: "pointer", transition: "background 0.2s" },

    main: { maxWidth: 1140, margin: "0 auto", padding: "32px 24px 60px" },
    greeting: { fontSize: 40, fontWeight: 700, marginBottom: 22 },

    tabRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 },
    tabs: { background: "#D9D9D9", borderRadius: 9999, padding: 6, display: "inline-flex", gap: 4 },
    tabActive: { background: "white", border: "none", borderRadius: 9999, padding: "10px 24px", fontSize: 16, fontWeight: 500, cursor: "pointer", color: "#1a1a1a", boxShadow: "0 1px 4px rgba(0,0,0,0.12)", transition: "background 0.2s", whiteSpace: "nowrap" },
    tabInactive: { background: "transparent", border: "none", borderRadius: 9999, padding: "10px 24px", fontSize: 16, fontWeight: 400, cursor: "pointer", color: "#1a1a1a", transition: "background 0.2s", whiteSpace: "nowrap" },
    createEventBtn: { background: "#D9D9D9", border: "none", borderRadius: 9999, padding: "12px 28px", fontSize: 16, fontWeight: 500, cursor: "pointer", transition: "background 0.2s" },

    cardWrapper: { background: "#D9D9D9", borderRadius: 20, padding: 12 },
    card: { background: "white", borderRadius: 14, padding: "28px 32px 32px" },
    cardTitle: { fontSize: 22, fontWeight: 600, marginBottom: 4 },
    cardSubtitle: { fontSize: 14, fontWeight: 300, color: "#666", marginBottom: 26 },

    formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 80px" },
    field: { display: "flex", flexDirection: "column", gap: 8 },
    label: { fontSize: 15, fontWeight: 400 },
    input: { background: "#D9D9D9", border: "none", borderRadius: 6, padding: "9px 13px", fontSize: 15, color: "#1a1a1a", width: "100%", transition: "box-shadow 0.2s, background 0.2s" },

    skillsSection: { marginTop: 28 },
    skillsLabel: { fontSize: 15, marginBottom: 12 },
    skillsContainer: { display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" },
    skillTag: { background: "#8E9B77", color: "white", borderRadius: 9999, padding: "6px 14px", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 7 },
    removeSkill: { background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 0, opacity: 0.7, transition: "opacity 0.15s" },
    skillAddBtn: { background: "#D9D9D9", border: "none", borderRadius: 9999, padding: "6px 16px", fontSize: 14, cursor: "pointer", color: "#1a1a1a", transition: "background 0.2s" },

    eventList: { display: "flex", flexDirection: "column", gap: 14 },
    eventCard: { background: "#D9D9D9", borderRadius: 15, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 },
    eventTop: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
    eventLeft: { display: "flex", alignItems: "center", gap: 12 },
    eventRight: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
    eventName: { fontSize: 18, fontWeight: 600 },
    eventDate: { fontSize: 16, fontWeight: 500, color: "#222" },
    eventBottom: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 },
    eventDesc: { fontSize: 14, fontWeight: 400, color: "#333", flex: 1, lineHeight: 1.55 },
    volunteerCount: { display: "flex", alignItems: "center", gap: 6, flexShrink: 0 },
    volunteerText: { fontSize: 17, fontWeight: 600, whiteSpace: "nowrap" },
    emptyState: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "48px 24px" },

    cancelBtn: { background: "#D9D9D9", border: "none", borderRadius: 9999, padding: "12px 28px", fontSize: 15, fontWeight: 500, cursor: "pointer" },
    overlayBg: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.42)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" },
    overlayCard: { background: "white", borderRadius: 20, padding: "44px 52px", textAlign: "center", maxWidth: 400, width: "90%", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" },
    overlayTitle: { fontSize: 24, fontWeight: 700, marginBottom: 10 },
    overlayMsg: { color: "#666", marginBottom: 26, fontSize: 15 },
    overlayClose: { background: "#485C11", color: "white", border: "none", borderRadius: 9999, padding: "12px 30px", fontSize: 15, fontWeight: 500, cursor: "pointer", transition: "background 0.2s" },
};
