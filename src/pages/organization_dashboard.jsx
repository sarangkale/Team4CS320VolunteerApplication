import { useState, useRef, useEffect } from "react";
import { logout, getAccountProfile } from "../auth/auth.ts";
import { axios_get } from "../lib/axios.ts";
import { useNavigate } from "react-router";
import CreateOpp from "./CreateOpp.jsx";
import { axios_post } from "../lib/axios.ts";


function StatusBadge({ status }) {
    const isFull = status === "full";
    return (
        <span className={`rounded-full px-3 py-[3px] text-sm font-semibold bg-white whitespace-nowrap border-[3px] ${isFull ? "border-[#BD0303] text-[#BD0303]" : "border-[#2CBD03] text-[#2CBD03]"}`}>
            {isFull ? "Full" : "Active"}
        </span>
    );
}

function EventCard({ event, onOpen }) {
    const isFull = event.volunteers >= event.maxVolunteers;
    return (
        <div
            className="bg-surface rounded-[15px] px-5 py-4 flex flex-col gap-3 cursor-pointer transition-all hover:bg-surface-dark hover:-translate-y-px"
            onClick={() => onOpen(event)}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold">{event.name}</span>
                    <StatusBadge status={isFull ? "full" : "active"} />
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
            <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-[#333] flex-1 leading-[1.55]">{event.description}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span className="text-[17px] font-semibold whitespace-nowrap">
                        {event.volunteers}/{event.maxVolunteers} Volunteers
                    </span>
                </div>
            </div>
        </div>
    );
}

function EventDetailsModal({ event, onClose, onViewApplicants }) {
    if (!event) return null;
    return (
        <div
            className="fixed inset-0 bg-black/[0.42] z-[200] flex items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-card w-[90%] max-w-[620px] px-[34px] py-8 shadow-2xl">
                <h2 className="text-2xl font-bold mb-4">{event.name}</h2>
                <div className="grid grid-cols-2 gap-x-[18px] gap-y-3.5 mb-5">
                    {[
                        { label: "Status", value: event.volunteers >= event.maxVolunteers ? "Full" : "Active" },
                        { label: "Date & Time", value: event.date || "TBD" },
                        { label: "Location", value: event.location || "TBD" },
                        { label: "Category", value: event.category || "General" },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5">
                            <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">{label}</span>
                            <span className="text-[15px] text-gray-900 leading-[1.45]">{value}</span>
                        </div>
                    ))}
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
                    <button
                        className="bg-surface border-none rounded-full px-7 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:bg-surface-dark"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <button
                        className="bg-surface border-none rounded-full px-5 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:bg-surface-dark"
                        onClick={onViewApplicants}
                    >
                        View Applicants
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function OrganizationDashboard() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("events");
    const [expandedEvent, setExpandedEvent] = useState(null);
    const [showCreateEvent, setShowCreateEvent] = useState(false); // ← ADDED

    const [orgProfile, setOrgProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);

    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [eventsError, setEventsError] = useState(null);

    const [form, setForm] = useState({
        orgName: "",
        email: "",
        website: "",
        bio: "",
    });

    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [showSkillInput, setShowSkillInput] = useState(false);
    const skillInputRef = useRef(null);

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            setProfileLoading(true);
            const res = await getAccountProfile();
            if (res.type === "success") {
                const p = res.data.profile;
                setOrgProfile(p);
                setForm({
                    orgName: p.org_name || "",
                    email: p.email || "",
                    phone: p.phone || "",
                    location: p.location || "",
                    website: p.website || "",
                    dateEstablished: p.date_established || "",
                });
            }
            setProfileLoading(false);
        }
        fetchProfile();
    }, []);

    useEffect(() => {
        async function fetchListings() {
            setEventsLoading(true);
            setEventsError(null);
            const res = await axios_get("/organization/listings");
            console.log("listings response:", JSON.stringify(res, null, 2));
            if (res.type === "error") {
                setEventsError("Could not load listings.");
                setEventsLoading(false);
                return;
            }
            const raw = Array.isArray(res.data?.data?.data) ? res.data.data.data
                    : Array.isArray(res.data?.data)        ? res.data.data
                    : Array.isArray(res.data)              ? res.data
                    : [];
            const mapped = raw.map((l) => ({
                id: l.listing_id,
                name: l.listing_name || "Untitled",
                date: l.listing_date || "TBD",
                location: [l.street, l.city, l.state].filter(Boolean).join(", ") || "TBD",
                category: l.categories || "General",
                description: l.description || "",
                volunteers: Array.isArray(l.applicants) ? l.applicants.length : 0,
                maxVolunteers: l.capacity || 0,
            }));
            setEvents(mapped);
            setEventsLoading(false);
        }
        fetchListings();
    }, []);

    const handleFormChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSaveProfile = async () => {
        setSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        const res = await axios_post("/organization/update_profile", {
            org_name: form.orgName,
            email: form.email,
            website: form.website,
            bio: form.bio,
        });

        setSaving(false);

        if (res.type === "error") {
            setSaveError(res.error.msg || "Failed to save.");
            return;
        }
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

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

    const handleCreated = (newListing) => {
        if (!newListing) return;
        setEvents((prev) => [...prev, {
            id: newListing.listing_id,
            name: newListing.listing_name || "Untitled",
            date: newListing.listing_date || "TBD",
            location: [newListing.street, newListing.city, newListing.state].filter(Boolean).join(", ") || "TBD",
            category: newListing.categories || "General",
            description: newListing.description || "",
            volunteers: 0,
            maxVolunteers: newListing.capacity || 0,
        }]);
    };

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
                <h1 className="text-[40px] font-bold mb-[22px]">
                    {profileLoading ? "Hello!" : `Hello, ${orgProfile?.org_name || "Organization"}!`}
                </h1>

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
                            onClick={() => setShowCreateEvent(true)} // ← CHANGED
                        >
                            Create Event
                        </button>
                    ) : (
                        <button
                            className="bg-surface border-none rounded-full px-7 py-3 text-base font-medium cursor-pointer transition-colors hover:bg-surface-dark disabled:opacity-50"
                            onClick={handleSaveProfile}
                            disabled={saving}
                        >
                            {saving ? "Saving…" : saveSuccess ? "Saved!" : "Save Changes"}
                        </button>
                    )}
                </div>

                {/* Account Info Tab */}
                {activeTab === "account" && (
                    <div className="bg-surface rounded-card p-3">
                        <div className="bg-white rounded-inner px-8 pt-7 pb-8">
                            <div className="text-[22px] font-semibold mb-1">Organization Information</div>
                            <div className="text-sm font-light text-[#666] mb-[26px]">
                                {profileLoading ? "Loading…" : "Manage your organization's profile"}
                            </div>
                            <div className="grid grid-cols-2 gap-x-20 gap-y-5">
                                {[
                                    { label: "Organization Name", name: "orgName", placeholder: "The Organization", type: "text" },
                                    { label: "Email", name: "email", placeholder: "user@email.com", type: "email" },
                                    { label: "Website", name: "website", placeholder: "yourorg.com", type: "text" },
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
                                        {saveError && (
                                            <p className="mt-4 text-sm text-[#bd0303]">{saveError}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5 flex flex-col gap-2">
                                <label className="text-[15px] font-normal">Bio</label>
                                <textarea
                                    name="bio"
                                    value={form.bio}
                                    onChange={handleFormChange}
                                    placeholder="Tell volunteers about your organization…"
                                    className="bg-surface border-none rounded-md px-3 py-[9px] text-[15px] text-gray-900 w-full min-h-[90px] resize-y focus:outline-none focus:ring-2 focus:ring-badge focus:bg-surface-focus transition-shadow"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Events & Volunteers Tab */}
                {activeTab === "events" && (
                    <div className="bg-surface rounded-card p-3">
                        <div className="bg-white rounded-inner px-8 pt-7 pb-8">
                            <div className="text-[22px] font-semibold mb-1">Volunteer Events</div>
                            <div className="text-sm font-light text-[#666] mb-[26px]">
                                Manage your Events &amp; Volunteers
                            </div>
                            {eventsLoading ? (
                                <p className="text-[#888] text-[15px]">Loading listings…</p>
                            ) : eventsError ? (
                                <p className="text-[#bd0303] text-[15px]">{eventsError}</p>
                            ) : (
                                <div className="flex flex-col gap-3.5">
                                    {events.map((event) => (
                                        <EventCard key={event.id} event={event} onOpen={setExpandedEvent} />
                                    ))}
                                    {events.length === 0 && (
                                        <div className="flex flex-col items-center gap-3 py-12 px-6">
                                            <span className="text-4xl">📋</span>
                                            <p className="text-[#888] text-[15px]">
                                                No events yet. Click "Create Event" to add one.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Event Details Modal */}
            {expandedEvent && (
                <EventDetailsModal
                    event={expandedEvent}
                    onClose={() => setExpandedEvent(null)}
                    onViewApplicants={() => {
                        setExpandedEvent(null);
                        navigate(`/organization_dashboard/view_applicant/${expandedEvent.id}`);
                    }}
                />
            )}

            {/* Create Opportunity Modal */}   {/* ← ADDED */}
            {showCreateEvent && (
                <CreateOpp
                    onClose={() => setShowCreateEvent(false)}
                    onCreated={handleCreated}
                />
            )}

        </div>
    );
}