import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { ListingData, UserProfile } from "../../shared/types";
import { getHistoryAndUpcomingListings } from "../lib/listings";
import { getAccountProfile } from "../auth/auth";

function EventCard({ event, onOpen }: { event: ListingData, onOpen: (_: any) => void }) {
    return (
        <div
            className="bg-surface rounded-[15px] px-5 py-4 flex flex-col gap-2.5 cursor-pointer transition-all hover:bg-surface-dark hover:-translate-y-px"
            onClick={() => onOpen(event)}
        >
            <div className="flex items-center justify-between">
                <span className="text-[18px] font-semibold">{event.listing_name || "UNKNOWN"}</span>
                <span className="text-[17px] font-medium text-[#222]">{(new Date(event.listing_date!)).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
                <span className="text-[15px] text-[#333] flex-1 leading-[1.5]">
                    {event.description}
                </span>
                <span className="text-[18px] font-semibold whitespace-nowrap shrink-0">
                    {event.duration}
                </span>
            </div>
        </div>
    );
}

function EventDetailsModal({ event, onClose }: { event: ListingData, onClose: () => void }) {
    if (!event) return null;

    // OPTIONAL: split date/time if your string includes both
    // const [datePart, timePart] = event.date?.split("   ") || [event.date, ""];

    return (
        <div
            className="fixed inset-0 bg-black/[0.42] z-[200] flex items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-card w-[90%] max-w-[620px] px-[34px] py-8 shadow-2xl">
                <h2 className="text-2xl font-bold mb-4">{event.listing_name || "UNKNOWN"}</h2>

                <div className="grid grid-cols-2 gap-x-[18px] gap-y-3.5 mb-5">

                    {/* Date */}
                    <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5">
                        <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">
                            Date
                        </span>
                        <span className="text-[15px] text-gray-900 leading-[1.45]">
                            {(new Date(event.listing_date!)).toLocaleString()}
                        </span>
                    </div>

                    {/* Time */}
                    <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5">
                        <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">
                            Time
                        </span>
                        <span className="text-[15px] text-gray-900 leading-[1.45]">
                            {(new Date(event.volunteer_time!)).toTimeString()  || "TBD"}
                        </span>
                    </div>

                    {/* Location (add this to your data if missing) */}
                    <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5">
                        <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">
                            Location
                        </span>
                        <span className="text-[15px] text-gray-900 leading-[1.45]">
                            {`${event.street!}, ${event.city!}, ${event.state}, ${event.zip_code}`}
                        </span>
                    </div>

                    {/* Category (optional if you add it later) */}
                    <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5">
                        <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">
                            Category
                        </span>
                        <span className="text-[15px] text-gray-900 leading-[1.45]">
                            {event.categories || "General"}
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
                            {event.duration}
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

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [upcomingEvents, setUpcomingEvents] = useState<ListingData[]>([]);
    const [historyEvents, setHistoryEvents] = useState<ListingData[]>([]);

    useEffect(() => {
        getHistoryAndUpcomingListings().then(res => {
            if (res.type === "success") {
                setHistoryEvents(res.data.history);
                setUpcomingEvents(res.data.upcoming);
            }
        });

        getAccountProfile().then(res => {
            if (res.type === "success") {
                setProfile(res.data.profile as UserProfile);
            }
        })
    }, []);

    return (
        <div className="bg-page min-h-screen text-[#1a1a1a] font-sans">
            {/* NAV */}
            <nav className="bg-surface flex items-center px-8 h-nav gap-3 sticky top-0 z-50 shadow-md">
                <img 
                    className="bg-primary rounded-full w-[80px] h-[80px] flex items-center justify-center"
                    src='src\assets\Logo_zoomed.png'
                    alt='logo image'
                />
                <span className="font-bold text-[21px] mr-auto">Helping Hands</span>

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
                <h1 className="text-[40px] font-bold mb-1">Hello, {profile?.first_name}</h1>
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

                    
                </div>
                {/* UPCOMING */}
                <div className="mb-7">
                    <div className="bg-surface rounded-card p-3">
                        <div className="bg-white rounded-inner px-7 pt-6 pb-7">
                            <div className="flex items-center justify-between mb-[18px]">
                                <span className="text-[28px] font-normal">Upcoming</span>
                            </div>
                            <div className="flex flex-col gap-[14px]">
                                {upcomingEvents.map((e) => (
                                    <EventCard key={e.listing_id!} event={e} onOpen={setExpandedEvent} />
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
                                <span className="text-[18px] font-normal text-[#333]">Total number of hours: {profile?.total_hours_completed}</span>
                            </div>
                            <div className="flex flex-col gap-[14px]">
                                {historyEvents.map((e) => (
                                    <EventCard key={e.listing_id!} event={e} onOpen={setExpandedEvent} />
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
