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
        location: "Amherst Town Hall",
        category: "Community",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        volunteers: 12,
        maxVolunteers: 15,
    },
    {
        id: 2,
        name: "Event #2",
        status: "active",
        date: "January 01, 2026   11:30 AM",
        location: "Downtown Public Library",
        category: "Education",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        volunteers: 12,
        maxVolunteers: 15,
    },
    {
        id: 3,
        name: "Event #3",
        status: "full",
        date: "January 01, 2026   11:30 AM",
        location: "North Commons Park",
        category: "Environment",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        volunteers: 15,
        maxVolunteers: 15,
    },
];

// ── Status Badge ─────────────────────────────────────────────
function StatusBadge({ status }) {
    const isActive = status === "active";
    return (
        <span className={`rounded-full px-3 py-[3px] text-sm font-semibold bg-white whitespace-nowrap border-[3px] ${isActive ? "border-[#2CBD03] text-[#2CBD03]" : "border-[#BD0303] text-[#BD0303]"}`}>
            {isActive ? "active" : "Full"}
        </span>
    );
}

// ── Event Card ───────────────────────────────────────────────
function EventCard({ event, onOpen }) {
    return (
        <div
            className="bg-surface rounded-[15px] px-5 py-4 flex flex-col gap-3 cursor-pointer transition-all hover:bg-surface-dark hover:-translate-y-px"
            onClick={() => onOpen(event)}
        >
            {/* Top row */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold">{event.name}</span>
                    <StatusBadge status={event.status} />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                    </svg>
                    <span className="text-base font-medium text-[#222]">{event.date}</span>
                </div>
            </div>

            {/* Bottom row */}
            <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-[#333] flex-1 leading-[1.55]">{event.description}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span className="text-[17px] font-semibold whitespace-nowrap">{event.volunteers}/{event.maxVolunteers} Volunteers</span>
                </div>
            </div>
        </div>
    );
}

// ── Event Detail Modal ───────────────────────────────────────
function EventDetailsModal({ event, onClose, onEditEvent, onViewApplicants }) {
    if (!event) return null;

    return (
        <div className="fixed inset-0 bg-black/[0.42] z-[200] flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-white rounded-card w-[90%] max-w-[620px] px-[34px] py-8 shadow-2xl">
                <h2 className="text-2xl font-bold mb-4">{event.name}</h2>

                <div className="grid grid-cols-2 gap-x-[18px] gap-y-3.5 mb-5">
                    <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5">
                        <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">Status</span>
                        <span className="text-[15px] text-gray-900 leading-[1.45]">{event.status === "active" ? "Active" : "Full"}</span>
                    </div>
                    <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5">
                        <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">Date &amp; Time</span>
                        <span className="text-[15px] text-gray-900 leading-[1.45]">{event.date}</span>
                    </div>
                    <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5">
                        <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">Location</span>
                        <span className="text-[15px] text-gray-900 leading-[1.45]">{event.location || "TBD"}</span>
                    </div>
                    <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5">
                        <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">Category</span>
                        <span className="text-[15px] text-gray-900 leading-[1.45]">{event.category || "General"}</span>
                    </div>
                    <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5 col-span-2">
                        <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">Description</span>
                        <span className="text-[15px] text-gray-900 leading-[1.45]">{event.description}</span>
                    </div>
                    <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5 col-span-2">
                        <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">Volunteers</span>
                        <span className="text-[15px] text-gray-900 leading-[1.45]">{event.volunteers}/{event.maxVolunteers}</span>
                    </div>
                </div>

                <div className="flex justify-end flex-wrap gap-2.5">
                    <button className="bg-surface border-none rounded-full px-7 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:bg-surface-dark" onClick={onClose}>Close</button>
                    <button className="bg-surface border-none rounded-full px-5 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:bg-surface-dark" onClick={onViewApplicants}>View Applicants</button>
                    <button className="bg-primary text-white border-none rounded-full px-7 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:bg-primary-dark" onClick={onEditEvent}>Edit Event</button>
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
            location: "TBD",
            category: "General",
            description: form.description || "No description provided.",
            volunteers: 0,
            maxVolunteers: parseInt(form.maxVolunteers, 10) || 15,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/[0.42] z-[200] flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-white rounded-card w-[90%] max-w-[520px] px-[52px] py-11 shadow-2xl">
                <h2 className="text-2xl font-bold mb-5">Create Event</h2>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[15px] font-normal">Event Name</label>
                        <input className="bg-surface border-none rounded-md px-3 py-[9px] text-[15px] text-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-badge focus:bg-surface-focus" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Community Cleanup" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[15px] font-normal">Date &amp; Time</label>
                        <input className="bg-surface border-none rounded-md px-3 py-[9px] text-[15px] text-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-badge focus:bg-surface-focus" name="date" value={form.date} onChange={handleChange} placeholder="e.g. January 01, 2026  11:30 AM" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[15px] font-normal">Description</label>
                        <textarea className="bg-surface border-none rounded-md px-3 py-[9px] text-[15px] text-gray-900 w-full min-h-[80px] resize-y focus:outline-none focus:ring-2 focus:ring-badge focus:bg-surface-focus" name="description" value={form.description} onChange={handleChange} placeholder="Describe the event..." />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[15px] font-normal">Max Volunteers</label>
                        <input className="bg-surface border-none rounded-md px-3 py-[9px] text-[15px] text-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-badge focus:bg-surface-focus" type="number" name="maxVolunteers" value={form.maxVolunteers} onChange={handleChange} placeholder="e.g. 15" min="1" />
                    </div>
                </div>
                <div className="flex gap-3 mt-6 justify-end">
                    <button className="bg-surface border-none rounded-full px-7 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:bg-surface-dark" onClick={onClose}>Cancel</button>
                    <button className="bg-primary text-white border-none rounded-full px-7 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:bg-primary-dark" onClick={handleSubmit}>Create</button>
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
    const [expandedEvent, setExpandedEvent] = useState(null);
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
        <div className="font-sans bg-page min-h-screen text-gray-900">

            {/* Nav */}
            <nav className="bg-surface flex items-center px-8 h-nav gap-3.5 sticky top-0 z-[100] shadow-sm">
                <div className="bg-primary text-white rounded-full w-[82px] h-[70px] flex items-center justify-center font-bold text-lg shrink-0">
                    logo
                </div>
                <span className="font-bold text-[21px] mr-auto">Website name</span>
                <button
                    className="bg-primary text-white border-none rounded-full px-6 py-3 text-base font-medium cursor-pointer transition-colors hover:bg-primary-dark"
                    onClick={async () => {
                        try { await logout(); } finally { navigate("/login"); }
                    }}
                >
                    Log out
                </button>
            </nav>

            {/* Main */}
            <div className="max-w-content mx-auto px-6 pt-8 pb-16">
                <h1 className="text-[40px] font-bold mb-[22px]">Hello Organization!</h1>

                {/* Tabs row */}
                <div className="flex items-center justify-between mb-[26px]">
                    <div className="bg-surface rounded-full p-1.5 inline-flex gap-1">
                        <button
                            className={`border-none rounded-full px-6 py-2.5 text-base cursor-pointer transition-colors whitespace-nowrap
                                ${activeTab === "account" ? "bg-white font-medium shadow-sm text-gray-900" : "bg-transparent font-normal text-gray-900 hover:bg-white/55"}`}
                            onClick={() => setActiveTab("account")}
                        >
                            Account info
                        </button>
                        <button
                            className={`border-none rounded-full px-6 py-2.5 text-base cursor-pointer transition-colors whitespace-nowrap
                                ${activeTab === "events" ? "bg-white font-medium shadow-sm text-gray-900" : "bg-transparent font-normal text-gray-900 hover:bg-white/55"}`}
                            onClick={() => setActiveTab("events")}
                        >
                            Events &amp; Volunteers
                        </button>
                    </div>

                    {activeTab === "events" ? (
                        <button
                            className="bg-surface border-none rounded-full px-7 py-3 text-base font-medium cursor-pointer transition-colors hover:bg-surface-dark"
                            onClick={() => navigate("/organization_dashboard/create_opportunity")}
                        >
                            Create Event
                        </button>
                    ) : (
                        <button className="bg-surface border-none rounded-full px-7 py-3 text-base font-medium cursor-pointer transition-colors hover:bg-surface-dark">
                            Edit
                        </button>
                    )}
                </div>

                {/* ── Account Info Tab ── */}
                {activeTab === "account" && (
                    <div className="bg-surface rounded-card p-3">
                        <div className="bg-white rounded-inner px-8 pt-7 pb-8">
                            <div className="text-[22px] font-semibold mb-1">Organization Information</div>
                            <div className="text-sm font-light text-[#666] mb-[26px]">Manage your organization's profile</div>

                            <div className="grid grid-cols-2 gap-x-20 gap-y-5">
                                {[
                                    { label: "Organization Name:", name: "orgName", placeholder: "The Organization", type: "text" },
                                    { label: "Email", name: "email", placeholder: "user@email.com", type: "email" },
                                    { label: "Phone Number", name: "phone", placeholder: "(999)-999-9999", type: "tel" },
                                    { label: "Location", name: "location", placeholder: "City, State", type: "text" },
                                    { label: "Website", name: "website", placeholder: "yourorg.com", type: "text" },
                                    { label: "Date of established", name: "dateEstablished", placeholder: "January 1, 2026", type: "text" },
                                ].map(({ label, name, placeholder, type }) => (
                                    <div key={name} className="flex flex-col gap-2">
                                        <label className="text-[15px] font-normal">{label}</label>
                                        <input
                                            type={type}
                                            name={name}
                                            value={form[name]}
                                            onChange={handleFormChange}
                                            placeholder={placeholder}
                                            className="bg-surface border-none rounded-md px-3 py-[9px] text-[15px] text-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-badge focus:bg-surface-focus transition-shadow"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Desired Skills */}
                            <div className="mt-7">
                                <div className="text-[15px] mb-3">Desired Skills</div>
                                <div className="flex flex-wrap gap-2.5 items-center">
                                    {skills.map((skill) => (
                                        <span key={skill} className="bg-badge text-white rounded-full px-3.5 py-1.5 text-sm font-medium flex items-center gap-1.5">
                                            {skill}
                                            <button
                                                className="bg-none border-none text-white cursor-pointer text-base leading-none p-0 opacity-70 hover:opacity-100 transition-opacity"
                                                onClick={() => removeSkill(skill)}
                                                title="Remove"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                    {showSkillInput && (
                                        <input
                                            ref={skillInputRef}
                                            type="text"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={handleSkillKeyDown}
                                            placeholder="e.g. Cooking"
                                            className="bg-surface border-none rounded-md px-3 py-[5px] text-sm w-[140px] focus:outline-none focus:ring-2 focus:ring-badge focus:bg-surface-focus"
                                        />
                                    )}
                                    {!showSkillInput && (
                                        <button
                                            className="bg-surface border-none rounded-full px-4 py-1.5 text-sm cursor-pointer text-gray-900 transition-colors hover:bg-surface-darker"
                                            onClick={openSkillInput}
                                        >
                                            + Skill
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Events & Volunteers Tab ── */}
                {activeTab === "events" && (
                    <div className="bg-surface rounded-card p-3">
                        <div className="bg-white rounded-inner px-8 pt-7 pb-8">
                            <div className="text-[22px] font-semibold mb-1">Volunteer Events</div>
                            <div className="text-sm font-light text-[#666] mb-[26px]">Manage your Events &amp; Volunteers</div>

                            <div className="flex flex-col gap-3.5">
                                {events.map((event) => (
                                    <EventCard key={event.id} event={event} onOpen={setExpandedEvent} />
                                ))}
                                {events.length === 0 && (
                                    <div className="flex flex-col items-center gap-3 py-12 px-6">
                                        <span className="text-4xl">📋</span>
                                        <p className="text-[#888] text-[15px]">No events yet. Click "Create Event" to add one.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Event Modal */}
            {showCreateEvent && (
                <CreateEventModal
                    onClose={() => setShowCreateEvent(false)}
                    onCreate={handleCreateEvent}
                />
            )}

            {/* Event Details Modal */}
            {expandedEvent && (
                <EventDetailsModal
                    event={expandedEvent}
                    onClose={() => setExpandedEvent(null)}
                    onEditEvent={() => navigate(`/organization_dashboard/edit_event/${expandedEvent.id}`)}
                    onViewApplicants={() => navigate(`/organization_dashboard/view_applicant/${expandedEvent.id}`)}
                />
            )}

            {/* Logout Overlay */}
            {overlay && (
                <div className="fixed inset-0 bg-black/[0.42] z-[200] flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setOverlay(null); }}>
                    <div className="bg-white rounded-card px-[52px] py-11 text-center max-w-[400px] w-[90%] shadow-2xl">
                        <h2 className="text-2xl font-bold mb-2.5">{overlayInfo[overlay]?.title}</h2>
                        <p className="text-[#666] mb-[26px] text-[15px]">{overlayInfo[overlay]?.msg}</p>
                        <button
                            className="bg-primary text-white border-none rounded-full px-7 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:bg-primary-dark"
                            onClick={() => setOverlay(null)}
                        >
                            Go back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
