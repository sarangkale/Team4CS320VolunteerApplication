import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router";
import { retrieveListings } from "../lib/listings.ts";
import type { ListingData, UserProfile } from "../../shared/types.ts";
import SubmitApp from "./application.tsx";
import { getAccountProfile } from "../auth/auth.ts";

type Coordinates = {
    latitude: number;
    longitude: number;
};

export type DashboardEvent = {
    id: string;
    title: string;
    organization: string;
    date: string;
    time: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
    description: string;
    slotsFilled: number;
    slotsTotal: number;
    category: string;
    skills: string[];
    transport: string[];
    distance?: number | null;
    driveMinutes?: number | null;
    busMinutes?: number | null;
    questions: string[];
};

const AVG_DRIVE_SPEED_MPH = 30;
const BUS_OVERHEAD_MINUTES = 15;
const BUS_SPEED_MPH = 15;
const EVENTS_PER_PAGE = 10;

const CATEGORY_OPTIONS = ["Animals", "Arts", "Community", "Education", "Environment", "Health", "Human Rights", "Youth"];
const SKILL_OPTIONS = ["Fundraising", "Mentoring", "Graphic Design", "Social Media", "Data Entry", "Bilingual", "Event Planning"];
const TRANSPORT_OPTIONS = ["Bus", "Car", "Walk", "Remote"];

function calculateDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const R = 3958.8;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatMinutes(mins: number) {
    const m = Math.round(mins);
    if (m < 60) return `${m} min`;
    const h = Math.floor(m / 60);
    const rem = m % 60;
    return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}

function splitList(value: string | string[] | null | undefined): string[] {
    if (Array.isArray(value)) {
        return value.filter(Boolean);
    }
    return value?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];
}

function formatLocation(listing: ListingData): string {
    return [listing.street, listing.city, listing.state, listing.zip_code].filter(Boolean).join(", ");
}

function mapListingToEvent(listing: ListingData, index: number): DashboardEvent {
    const categories = splitList(listing.categories);
    const transport = splitList(listing.transport);

    return {
        id: listing.listing_id ?? String(index),
        title: listing.listing_name ?? "Untitled event",
        organization: listing.org_name ?? "Unknown organization",
        date: listing.listing_date ?? "Date TBD",
        time: listing.duration ? `${listing.duration} hours` : "Time TBD",
        location: formatLocation(listing) || "Location TBD",
        latitude: listing.latitude ?? null,
        longitude: listing.longitude ?? null,
        description: listing.description ?? "",
        slotsFilled: listing.accepted_applicants?.length ?? 0,
        slotsTotal: listing.capacity ?? 0,
        category: categories[0] ?? "Community",
        skills: listing.needed_skill ?? [],
        transport,
        questions: listing.Questions ?? [],
    };
}

function toggleArrayFilter(setter: Dispatch<SetStateAction<string[]>>, value: string) {
    setter((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
}

function EventCard({ event, onOpen }: { event: DashboardEvent, onOpen: (_: DashboardEvent) => void }) {
    const fillPercent = event.slotsTotal > 0
        ? Math.min(100, Math.round((event.slotsFilled / event.slotsTotal) * 100))
        : 0;

    return (
        <div
            className="bg-surface rounded-[15px] px-5 py-4 flex flex-col gap-2.5 cursor-pointer transition-all hover:bg-surface-dark hover:-translate-y-px"
            onClick={() => onOpen(event)}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <span className="block text-[18px] font-semibold leading-snug">{event.title}</span>
                    <span className="block text-sm text-[#666]">{event.organization}</span>
                </div>
                <span className="bg-white text-primary rounded-full px-3 py-[3px] text-sm font-semibold whitespace-nowrap">
                    {event.category}
                </span>
            </div>

            <div className="flex items-center justify-between gap-4">
                <span className="text-[15px] text-[#333] flex-1 leading-[1.5]">
                    {event.description}
                </span>
                <span className="text-[17px] font-semibold whitespace-nowrap shrink-0">
                    {event.slotsFilled}/{event.slotsTotal}
                </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#333]">
                <span>{event.date}</span>
                <span>|</span>
                <span>{event.time}</span>
                <span>|</span>
                <span>{event.location}</span>
            </div>

            {(event.driveMinutes != null || event.busMinutes != null) && (
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    {event.driveMinutes != null && (
                        <span className="rounded-full bg-white px-3 py-1 text-[#2a4db5]">
                            {formatMinutes(event.driveMinutes)} drive
                        </span>
                    )}
                    {event.busMinutes != null && (
                        <span className="rounded-full bg-white px-3 py-1 text-[#8a5200]">
                            {formatMinutes(event.busMinutes)} bus
                        </span>
                    )}
                </div>
            )}

            <div className="h-2 rounded-full bg-white overflow-hidden">
                <div className="h-full bg-badge rounded-full" style={{ width: `${fillPercent}%` }} />
            </div>
        </div>
    );
}

function FilterGroup({
    label,
    options,
    selected,
    onToggle,
}: {
    label: string,
    options: string[],
    selected: string[],
    onToggle: (_: string) => void,
}) {
    return (
        <div>
            <span className="block text-xs font-semibold text-[#666] uppercase tracking-[0.4px] mb-2">
                {label}
            </span>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        className={`rounded-full px-4 py-2 text-sm border-none cursor-pointer transition-colors font-['DM_Sans',sans-serif] ${selected.includes(option)
                            ? "bg-badge text-white"
                            : "bg-surface text-[#1a1a1a] hover:bg-surface-dark"
                            }`}
                        onClick={() => onToggle(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}

function EventDetailsModal({ event, onClose }: { event: DashboardEvent, onClose: () => void }) {
    const [showQuestions, setShowQuestions] = useState(false);
    return (
        <>
        {showQuestions ?
            <SubmitApp listing={event} onClose={onClose} />
            : <div
                className="fixed inset-0 bg-black/[0.42] z-[200] flex items-center justify-center p-4"
                onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            >
                <div className="bg-white rounded-card w-[90%] max-w-[620px] px-[34px] py-8 shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4">{event.title}</h2>

                    <div className="grid grid-cols-2 gap-x-[18px] gap-y-3.5 mb-5 max-[620px]:grid-cols-1">
                        <ModalField label="Organization" value={event.organization} />
                        <ModalField label="Category" value={event.category} />
                        <ModalField label="Date" value={event.date} />
                        <ModalField label="Time" value={event.time} />
                        <ModalField label="Location" value={event.location} />
                        <ModalField label="Transport" value={event.transport.join(", ") || "TBD"} />
                        <ModalField label="Skills Needed" value={event.skills.join(", ") || "None listed"} full />
                        <ModalField label="Description" value={event.description} full />
                        <ModalField label="Volunteer Slots" value={`${event.slotsFilled}/${event.slotsTotal} filled`} full />
                        {event.distance != null && (
                            <ModalField label="Distance" value={`${event.distance.toFixed(1)} miles away`} full />
                        )}
                    </div>

                    <div className="flex justify-end gap-2.5">
                        <button
                            className="bg-surface border-none rounded-full px-7 py-3 text-[15px] font-medium cursor-pointer hover:bg-surface-dark"
                            onClick={onClose}
                        >
                            Close
                        </button>
                        <button
                            className="bg-primary text-white border-none rounded-full px-7 py-3 text-[15px] font-medium cursor-pointer hover:bg-primary-dark"
                            onClick={() => setShowQuestions(true)}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>}
        </>
    );
}

function ModalField({ label, value, full = false }: { label: string, value: string, full?: boolean }) {
    return (
        <div className={`flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5 ${full ? "col-span-2 max-[620px]:col-span-1" : ""}`}>
            <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">
                {label}
            </span>
            <span className="text-[15px] text-gray-900 leading-[1.45]">
                {value}
            </span>
        </div>
    );
}

export default function VolunteerDashboardEvents() {
    const navigate = useNavigate();
    const [events, setEvents] = useState<DashboardEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [expandedEvent, setExpandedEvent] = useState<DashboardEvent | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedTransport, setSelectedTransport] = useState<string[]>([]);
    const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
    const [locationError, setLocationError] = useState("");
    const [locationLoading, setLocationLoading] = useState(false);
    const [showLocationConsent, setShowLocationConsent] = useState(false);
    const [maxDistance, setMaxDistance] = useState<number | null>(null);
    const [slotsAvailable, setSlotsAvailable] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchEvents() {
            setLoading(true);
            setLoadError("");
            const result = await retrieveListings(0, 100);

            if (cancelled) return;

            if (result.type === "success") {
                setEvents(result.data.map(mapListingToEvent));
            } else {
                console.error("Error fetching events:", result.error);
                setLoadError("Unable to load events right now.");
                setEvents([]);
            }

            setLoading(false);
        }

        fetchEvents();

        getAccountProfile().then(profileRes => {
            if (profileRes.type === "success") {
                setProfile(profileRes.data.profile as UserProfile);
            }
        })

        return () => {
            cancelled = true;
        };
    }, []);

    const enrichedEvents = useMemo(() => {
        return events.map((event) => {
            if (!userLocation || event.latitude == null || event.longitude == null) {
                return { ...event, distance: null, driveMinutes: null, busMinutes: null };
            }

            const dist = calculateDistanceMiles(
                userLocation.latitude,
                userLocation.longitude,
                event.latitude,
                event.longitude
            );

            return {
                ...event,
                distance: dist,
                driveMinutes: event.transport.includes("Car") ? (dist / AVG_DRIVE_SPEED_MPH) * 60 : null,
                busMinutes: event.transport.includes("Bus") ? (dist / BUS_SPEED_MPH) * 60 + BUS_OVERHEAD_MINUTES : null,
            };
        });
    }, [events, userLocation]);

    const visibleEvents = useMemo(() => {
        return enrichedEvents.filter((event) => {
            const term = searchTerm.toLowerCase();
            if (term && !event.title.toLowerCase().includes(term) && !event.organization.toLowerCase().includes(term)) {
                return false;
            }
            if (selectedCategories.length && !selectedCategories.includes(event.category)) {
                return false;
            }
            if (selectedSkills.length && !selectedSkills.some((skill) => event.skills.includes(skill))) {
                return false;
            }
            if (selectedTransport.length && !selectedTransport.some((transport) => event.transport.includes(transport))) {
                return false;
            }
            if (maxDistance != null && (event.distance == null || event.distance > maxDistance)) {
                return false;
            }
            if (slotsAvailable && event.slotsFilled >= event.slotsTotal) {
                return false;
            }
            return true;
        });
    }, [enrichedEvents, maxDistance, searchTerm, selectedCategories, selectedSkills, selectedTransport, slotsAvailable]);

    const totalPages = Math.max(1, Math.ceil(visibleEvents.length / EVENTS_PER_PAGE));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const pageStart = (safeCurrentPage - 1) * EVENTS_PER_PAGE;
    const pageEnd = pageStart + EVENTS_PER_PAGE;
    const paginatedEvents = visibleEvents.slice(pageStart, pageEnd);

    const activeFilterCount =
        Number(selectedCategories.length > 0) +
        Number(selectedSkills.length > 0) +
        Number(selectedTransport.length > 0) +
        Number(maxDistance != null) +
        Number(slotsAvailable);

    function clearAllFilters() {
        setSearchTerm("");
        setSelectedCategories([]);
        setSelectedSkills([]);
        setSelectedTransport([]);
        setMaxDistance(null);
        setSlotsAvailable(false);
        setCurrentPage(1);
    }

    function handleLocationButtonClick() {
        if (userLocation) {
            setUserLocation(null);
            setLocationError("");
            return;
        }
        setShowLocationConsent(true);
    }

    function confirmLocationAccess() {
        setShowLocationConsent(false);
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by this browser.");
            return;
        }
        setLocationLoading(true);
        setLocationError("");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                setLocationLoading(false);
            },
            (err) => {
                console.error(err);
                setLocationError("Unable to access your location. Please allow location access in your browser settings.");
                setLocationLoading(false);
            }
        );
    }

    return (
        <div className="bg-page min-h-screen text-[#1a1a1a] font-sans">
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
                >
                    My profile
                </button>
                <button
                    className="bg-white text-[#485C11] rounded-full px-6 py-3 font-medium border-none cursor-pointer hover:bg-gray-50 transition-colors duration-200 font-['DM_Sans',sans-serif]"
                    onClick={() => navigate("/volunteer_dashboard/events")}
                >
                    View all events
                </button>
                <button
                    className="bg-[#485C11] text-white rounded-full px-6 py-3 font-medium border-none cursor-pointer hover:bg-[#3a4c0d] transition-colors duration-200 font-['DM_Sans',sans-serif]"
                    onClick={() => navigate("/login")}
                >
                    Log out
                </button>
            </nav>

            <div className="max-w-content mx-auto px-6 pt-8 pb-[60px]">
                <h1 className="text-[40px] font-bold mb-1">Hello, {profile?.first_name || ""}</h1>
                <p className="text-gray-600 mb-6">Explore volunteer opportunities below</p>

                <div className="flex items-center justify-between mb-4">
                    <button
                        className="ml-auto mr-0 bg-[#D9D9D9] border-none rounded-full py-[10px] px-[34px] text-[16px] cursor-pointer hover:bg-[#c2c2c2] transition-colors duration-200 font-['DM_Sans',sans-serif]"
                        onClick={() => setShowFilters((value) => !value)}
                    >
                        {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : "Filters"}
                    </button>
                </div>

                <div className="mb-7">
                    <div className="bg-surface rounded-card p-3">
                        <div className="bg-white rounded-inner px-7 pt-6 pb-7">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-[18px]">
                                <span className="text-[28px] font-normal">Available Events</span>
                                <div className="flex flex-wrap items-center gap-2">
                                    <input
                                        type="text"
                                        className="bg-surface border-none rounded-full px-5 py-[10px] text-[15px] outline-none min-w-[260px] focus:bg-surface-focus focus:ring-2 focus:ring-badge"
                                        placeholder="Search events or organizations"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className={`border-none rounded-full px-5 py-[10px] text-[15px] font-medium cursor-pointer transition-colors font-['DM_Sans',sans-serif] ${userLocation
                                            ? "bg-white text-primary"
                                            : "bg-surface text-[#1a1a1a] hover:bg-surface-dark"
                                            }`}
                                        disabled={locationLoading}
                                        onClick={handleLocationButtonClick}
                                    >
                                        {locationLoading ? "Detecting..." : userLocation ? "Location on" : "Use location"}
                                    </button>
                                </div>
                            </div>

                            {locationError && <p className="text-sm text-red-700 mb-4">{locationError}</p>}
                            {loadError && <p className="text-sm text-red-700 mb-4">{loadError}</p>}

                            <div className="flex items-start gap-5 max-[900px]:flex-col">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col gap-[14px]">
                                        {loading ? (
                                            <div className="bg-surface rounded-[15px] px-5 py-5 text-[#666]">
                                                Loading events...
                                            </div>
                                        ) : paginatedEvents.length > 0 ? (
                                            paginatedEvents.map((event) => (
                                                <EventCard key={event.id} event={event} onOpen={setExpandedEvent} />
                                            ))
                                        ) : (
                                            <div className="bg-surface rounded-[15px] px-5 py-5 text-[#666]">
                                                No events match your current filters.
                                            </div>
                                        )}
                                    </div>

                                    {!loading && visibleEvents.length > 0 && (
                                        <div className="flex flex-wrap items-center justify-between gap-3 mt-[18px]">
                                            <span className="text-sm text-[#666]">
                                                Showing {pageStart + 1}-{Math.min(pageEnd, visibleEvents.length)} of {visibleEvents.length} events
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    className="bg-surface border-none rounded-full px-5 py-2 text-[15px] font-medium cursor-pointer hover:bg-surface-dark disabled:opacity-40 disabled:cursor-not-allowed"
                                                    disabled={safeCurrentPage === 1}
                                                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                                                >
                                                    Previous
                                                </button>
                                                <span className="text-sm text-[#333] px-2">
                                                    Page {safeCurrentPage} of {totalPages}
                                                </span>
                                                <button
                                                    type="button"
                                                    className="bg-surface border-none rounded-full px-5 py-2 text-[15px] font-medium cursor-pointer hover:bg-surface-dark disabled:opacity-40 disabled:cursor-not-allowed"
                                                    disabled={safeCurrentPage === totalPages}
                                                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {showFilters && (
                                    <aside className="w-[290px] shrink-0 bg-[#f3f3f3] rounded-[10px] p-4 flex flex-col gap-4 sticky top-[112px] max-[900px]:w-full max-[900px]:sticky max-[900px]:top-auto">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-[20px] font-semibold">Filters</span>
                                            <button
                                                type="button"
                                                className="bg-surface border-none rounded-full px-4 py-2 text-sm font-medium cursor-pointer hover:bg-surface-dark"
                                                onClick={() => setShowFilters(false)}
                                            >
                                                Close
                                            </button>
                                        </div>

                                        <FilterGroup
                                            label="Category"
                                            options={CATEGORY_OPTIONS}
                                            selected={selectedCategories}
                                            onToggle={(value) => {
                                                toggleArrayFilter(setSelectedCategories, value);
                                                setCurrentPage(1);
                                            }}
                                        />
                                        <FilterGroup
                                            label="Skill"
                                            options={SKILL_OPTIONS}
                                            selected={selectedSkills}
                                            onToggle={(value) => {
                                                toggleArrayFilter(setSelectedSkills, value);
                                                setCurrentPage(1);
                                            }}
                                        />
                                        <FilterGroup
                                            label="Transport"
                                            options={TRANSPORT_OPTIONS}
                                            selected={selectedTransport}
                                            onToggle={(value) => {
                                                toggleArrayFilter(setSelectedTransport, value);
                                                setCurrentPage(1);
                                            }}
                                        />

                                        <div>
                                            <span className="block text-xs font-semibold text-[#666] uppercase tracking-[0.4px] mb-2">
                                                Distance
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {[5, 10, 25, 50].map((mi) => (
                                                    <button
                                                        key={mi}
                                                        type="button"
                                                        className={`rounded-full px-4 py-2 text-sm border-none transition-colors font-['DM_Sans',sans-serif] ${maxDistance === mi
                                                            ? "bg-badge text-white"
                                                            : "bg-surface text-[#1a1a1a] hover:bg-surface-dark"
                                                        } ${!userLocation ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                                                        disabled={!userLocation}
                                                        onClick={() => {
                                                            setMaxDistance(maxDistance === mi ? null : mi);
                                                            setCurrentPage(1);
                                                        }}
                                                    >
                                                        Within {mi} mi
                                                    </button>
                                                ))}
                                                <button
                                                    type="button"
                                                    className={`rounded-full px-4 py-2 text-sm border-none cursor-pointer transition-colors font-['DM_Sans',sans-serif] ${slotsAvailable
                                                        ? "bg-badge text-white"
                                                        : "bg-surface text-[#1a1a1a] hover:bg-surface-dark"
                                                        }`}
                                                    onClick={() => {
                                                        setSlotsAvailable((value) => !value);
                                                        setCurrentPage(1);
                                                    }}
                                                >
                                                    Slots available
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="bg-surface border-none rounded-full px-7 py-3 text-[15px] font-medium cursor-pointer hover:bg-surface-dark mt-1"
                                            onClick={clearAllFilters}
                                        >
                                            Clear all
                                        </button>
                                    </aside>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showLocationConsent && (
                <div
                    className="fixed inset-0 bg-black/[0.42] z-[200] flex items-center justify-center p-4"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowLocationConsent(false); }}
                >
                    <div className="bg-white rounded-card w-[90%] max-w-[420px] px-[34px] py-8 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-3">Allow location access?</h2>
                        <p className="text-[15px] text-[#333] leading-[1.5] mb-5">
                            This uses your browser location to calculate distances and estimated travel time for volunteer events.
                        </p>
                        <div className="flex justify-end gap-2.5">
                            <button
                                type="button"
                                className="bg-surface border-none rounded-full px-7 py-3 text-[15px] font-medium cursor-pointer hover:bg-surface-dark"
                                onClick={() => setShowLocationConsent(false)}
                            >
                                Not now
                            </button>
                            <button
                                type="button"
                                className="bg-primary text-white border-none rounded-full px-7 py-3 text-[15px] font-medium cursor-pointer hover:bg-primary-dark"
                                onClick={confirmLocationAccess}
                            >
                                Allow
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {expandedEvent && (
                <EventDetailsModal event={expandedEvent} onClose={() => setExpandedEvent(null)} />
            )}
        </div>
    );
}
