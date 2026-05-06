import { useState } from "react";
import { useNavigate } from "react-router";

const UPCOMING_EVENTS = [
    { id: 1, org: "Volunteer Org #1", date: "January 01, 2026   11:30 AM", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", hours: "XX hrs" },
    { id: 2, org: "Volunteer Org #2", date: "January 01, 2026   11:30 AM", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", hours: "XX hrs" },
    { id: 3, org: "Volunteer Org #3", date: "January 01, 2026   11:30 AM", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", hours: "XX hrs" },
];

const HISTORY_EVENTS = [...UPCOMING_EVENTS];
const TOTAL_HOURS = "XX";

function EventCard({ event, onOpen }: { event: any, onOpen: (_: any) => void }) {
    return (
        <div
            className="bg-surface rounded-[15px] px-5 py-4 flex flex-col gap-2.5 cursor-pointer transition-all hover:bg-surface-dark hover:-translate-y-px"
            onClick={() => onOpen(event)}
        >
            <div className="flex items-center justify-between">
                <span className="text-[18px] font-semibold">{event.org}</span>
                <span className="text-[17px] font-medium text-[#222]">{event.date}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
                <span className="text-[15px] text-[#333] flex-1 leading-[1.5]">
                    {event.description}
                </span>
                <span className="text-[18px] font-semibold whitespace-nowrap shrink-0">
                    {event.hours}
                </span>
            </div>
        </div>
    );
}

function EventDetailsModal({ event, onClose }: { event: any, onClose: () => void }) {
    if (!event) return null;

    // OPTIONAL: split date/time if your string includes both
    const [datePart, timePart] = event.date?.split("   ") || [event.date, ""];

    return (
        <div
            className="fixed inset-0 bg-black/[0.42] z-[200] flex items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-card w-[90%] max-w-[620px] px-[34px] py-8 shadow-2xl">
                <h2 className="text-2xl font-bold mb-4">{event.org}</h2>

                <div className="grid grid-cols-2 gap-x-[18px] gap-y-3.5 mb-5">

                    {/* Date */}
                    <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5">
                        <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">
                            Date
                        </span>
                        <span className="text-[15px] text-gray-900 leading-[1.45]">
                            {datePart}
                        </span>
                    </div>

                    {/* Time */}
                    <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5">
                        <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">
                            Time
                        </span>
                        <span className="text-[15px] text-gray-900 leading-[1.45]">
                            {timePart || "TBD"}
                        </span>
                    </div>

                    {/* Location (add this to your data if missing) */}
                    <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5">
                        <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">
                            Location
                        </span>
                        <span className="text-[15px] text-gray-900 leading-[1.45]">
                            {event.location || "TBD"}
                        </span>
                    </div>

                    {/* Category (optional if you add it later) */}
                    <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5">
                        <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">
                            Category
                        </span>
                        <span className="text-[15px] text-gray-900 leading-[1.45]">
                            {event.category || "General"}
                        </span>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5 col-span-2">
                        <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">
                            Description
                        </span>
                        <span className="text-[15px] text-gray-900 leading-[1.45]">
                            {event.description}
                        </span>
                    </div>

                    {/* Hours (volunteer-specific) */}
                    <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5 col-span-2">
                        <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">
                            Hours
                        </span>
                        <span className="text-[15px] text-gray-900 leading-[1.45]">
                            {event.hours}
                        </span>
                    </div>

                </div>

                <div className="flex justify-end">
                    <button
                        className="bg-surface border-none rounded-full px-7 py-3 text-[15px] font-medium cursor-pointer hover:bg-surface-dark"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ActivityDashboard() {
    const navigate = useNavigate();
    const [activeTab, _setActiveTab] = useState("activity");
    const [expandedEvent, setExpandedEvent] = useState(null);

    return (
        <div className="bg-page min-h-screen text-[#1a1a1a] font-sans">
            {/* NAV */}
            <nav className="bg-surface flex items-center px-8 h-nav gap-3 sticky top-0 z-50 shadow-md">
                <div className="bg-primary text-white rounded-full w-[82px] h-[70px] flex items-center justify-center font-bold text-[18px]">
                    logo
                </div>

                <span className="font-bold text-[21px] mr-auto">
                    Website name
                </span>

                <button
                    className="bg-white text-[#485C11] rounded-full px-6 py-3 font-medium border-none cursor-pointer hover:bg-gray-50 transition-colors duration-200 font-['DM_Sans',sans-serif]"
                    onClick={() => navigate("/volunteer_dashboard/profile")}
                >My profile</button>
                <button
                    className="bg-white text-[#485C11] rounded-full px-6 py-3 font-medium border-none cursor-pointer hover:bg-gray-50 transition-colors duration-200 font-['DM_Sans',sans-serif]"
                    onClick={() => navigate("/volunteer_dashboard/events")}
                >View all events</button>
                <button
                    className="bg-[#485C11] text-white rounded-full px-6 py-3 font-medium border-none cursor-pointer hover:bg-[#3a4c0d] transition-colors duration-200 font-['DM_Sans',sans-serif]"
                    onClick={() => navigate("/login")}
                >Log out</button>
            </nav>

            {/* MAIN */}
            <div className="max-w-content mx-auto px-6 pt-8 pb-[60px]">
                <h1 className="text-[40px] font-bold mb-1">Hello John</h1>
                <p className="text-gray-600 mb-6">Manage your events below</p>

                {/* TABS */}
                <div className="flex items-center justify-between mb-4">
                    {/* LEFT: TOGGLE */}
                    <div className="bg-[#D9D9D9] rounded-full p-1 inline-flex gap-1">
                        <button
                            className={`px-7 py-2 rounded-full text-[16px] border-none cursor-pointer font-['DM_Sans',sans-serif] transition-all duration-200 ${activeTab === "profile"
                                    ? "bg-white shadow-md font-medium text-[#1a1a1a]"
                                    : "bg-transparent text-[#1a1a1a]"
                                }`}
                            onClick={() => navigate("/volunteer_dashboard/profile")}
                        >
                            Profile
                        </button>

                        <button
                            className={`px-7 py-2 rounded-full text-[16px] border-none cursor-pointer font-['DM_Sans',sans-serif] transition-all duration-200 ${activeTab === "activity"
                                    ? "bg-white shadow-md font-medium text-[#1a1a1a]"
                                    : "bg-transparent text-[#1a1a1a]"
                                }`}
                            onClick={() => navigate("/volunteer_dashboard/activity")}
                        >
                            Activity
                        </button>
                    </div>

                    {/* RIGHT: EDIT BUTTON */}
                    <button className="bg-[#D9D9D9] border-none rounded-full py-[10px] px-[34px] text-[16px] cursor-pointer hover:bg-[#c2c2c2] transition-colors duration-200 font-['DM_Sans',sans-serif]">
                        Edit
                    </button>
                </div>
                {/* UPCOMING */}
                <div className="mb-7">
                    <div className="bg-surface rounded-card p-3">
                        <div className="bg-white rounded-inner px-7 pt-6 pb-7">
                            <div className="flex items-center justify-between mb-[18px]">
                                <span className="text-[28px] font-normal">Upcoming</span>
                            </div>
                            <div className="flex flex-col gap-[14px]">
                                {UPCOMING_EVENTS.map((e) => (
                                    <EventCard key={e.id} event={e} onOpen={setExpandedEvent} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* VOLUNTEER HISTORY */}
                <div className="mb-7">
                    <div className="bg-surface rounded-card p-3">
                        <div className="bg-white rounded-inner px-7 pt-6 pb-7">
                            <div className="flex items-center justify-between mb-[18px]">
                                <span className="text-[28px] font-normal">Volunteer History</span>
                                <span className="text-[18px] font-normal text-[#333]">Total number of hours: {TOTAL_HOURS}</span>
                            </div>
                            <div className="flex flex-col gap-[14px]">
                                {HISTORY_EVENTS.map((e) => (
                                    <EventCard key={e.id} event={e} onOpen={setExpandedEvent} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {expandedEvent && (
                <EventDetailsModal
                    event={expandedEvent}
                    onClose={() => setExpandedEvent(null)}
                />
            )}
        </div>
    );
}
