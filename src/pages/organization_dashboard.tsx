import { useState, useEffect } from "react";
import { getAccountProfile, logout } from "../auth/auth.ts";
import { useNavigate } from "react-router";
import { acceptApplicant, deleteListing, editListing, finishListing, getApplicationAnswers, getListingApplicants, getOwnedListings, removeApplicant } from "../lib/listings.ts";
import type { ApplicationData, ListingData, OrganizationProfile, UserProfile } from "../../shared/types.ts";
import { updateOrganizationProfile } from "../lib/profiles.ts";
import CreateOpp from "./CreateOpp.jsx";

// ── Status Badge ─────────────────────────────────────────────
function StatusBadge({ status }: { status: boolean }) {
    return (
        <span className={`rounded-full px-3 py-[3px] text-sm font-semibold bg-white whitespace-nowrap border-[3px] ${status ? "border-[#2CBD03] text-[#2CBD03]" : "border-[#BD0303] text-[#BD0303]"}`}>
            {status ? "active" : "Full"}
        </span>
    );
}

// ── Event Card ───────────────────────────────────────────────
function EventCard({ event, onOpen }: { event: ListingData, onOpen: () => void }) {
    return (
        <div className="bg-surface rounded-[15px] px-5 py-4 flex flex-col gap-3 cursor-pointer transition-all hover:bg-surface-dark hover:-translate-y-px" onClick={onOpen}>
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold">{event.listing_name}</span>
                    <StatusBadge status={event.accepted_applicants ? event.accepted_applicants.length !== event.capacity : true} />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                    </svg>
                    <span className="text-base font-medium text-[#222]">{
                        (new Date(event.listing_date!.split("-")[0].length > 4 ? event.listing_date!.slice(event.listing_date!.split("-")[0].length - 4) : event.listing_date!)).toLocaleString()
                    }</span>
                </div>
            </div>
            <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-[#333] flex-1 leading-[1.55]">{event.description}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span className="text-[17px] font-semibold whitespace-nowrap">
                        {event.accepted_applicants ? event.accepted_applicants.length : 0}/{event.capacity ? event.capacity : 0} Volunteers
                    </span>
                </div>
            </div>
        </div>
    );
}

function EventInfo({ edit, listing, setListing }: { edit: boolean, listing: ListingData, setListing: React.Dispatch<React.SetStateAction<ListingData>> }) {
    const [addingQuestion, setAddingQuestion] = useState(false);
    const [newQuestionValue, setNewQuestionValue] = useState("");
    const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
    const [editingQuestionValue, setEditingQuestionValue] = useState("");

    const questions = listing.Questions ?? [];

    const handleAddQuestion = () => {
        if (addingQuestion) {
            if (newQuestionValue.trim()) {
                setListing(prev => ({ ...prev, Questions: [...(prev.Questions ?? []), newQuestionValue.trim()] }));
            }
            setNewQuestionValue("");
            setAddingQuestion(false);
        } else {
            setAddingQuestion(true);
        }
    };

    const handleRemoveQuestion = (index: number) => {
        setListing(prev => ({ ...prev, Questions: (prev.Questions ?? []).filter((_, i) => i !== index) }));
        if (editingQuestionIndex === index) {
            setEditingQuestionIndex(null);
            setEditingQuestionValue("");
        }
    };

    const handleSaveEditQuestion = (index: number) => {
        if (editingQuestionValue.trim()) {
            setListing(prev => ({
                ...prev,
                Questions: (prev.Questions ?? []).map((q, i) => i === index ? editingQuestionValue.trim() : q),
            }));
        }
        setEditingQuestionIndex(null);
        setEditingQuestionValue("");
    };

    return (<>
        {edit ?
            <input type="text" className="text-2xl font-bold mb-4" value={listing.listing_name || ""} onChange={e => setListing(prev => ({ ...prev, listing_name: e.target.value }))} />
            : <h2 className="text-2xl font-bold mb-4">{listing.listing_name}</h2>
        }
        <div className="grid grid-cols-2 gap-x-[18px] gap-y-[14px] mb-5">
            <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5">
                <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">Capacity</span>
                {edit ?
                    <input type="number" value={listing.capacity || 0} onChange={e => setListing(prev => ({ ...prev, capacity: Math.max(Number(e.target.value), prev.accepted_applicants ? prev.accepted_applicants.length : 0) }))} />
                    : <span className="text-[15px] text-gray-900 leading-[1.45]">{listing.capacity}</span>
                }
            </div>
            <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5">
                <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">Date &amp; Time</span>
                {edit ?
                    <input type="date" value={listing.listing_date || ""} onChange={e => setListing(prev => ({ ...prev, listing_date: e.target.value }))} />
                    : <span className="text-[15px] text-gray-900 leading-[1.45]">{`${new Date(listing.listing_date!).toDateString()}, ${new Date(listing.volunteer_time!).toLocaleTimeString("en-us")}`}</span>
                }
            </div>
            <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5">
                <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">Location</span>
                {edit ?
                    <table>
                        <tbody>
                            <tr>
                                {["street", "city", "state", "zip_code"].map(key => (
                                    <td key={key}><input style={{ width: "4em" }} type="text" value={(listing as any)[key] || ""} onChange={e => setListing(prev => ({ ...prev, [key]: e.target.value }))} /></td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                    : <span className="text-[15px] text-gray-900 leading-[1.45]">{`${listing.street}, ${listing.city}, ${listing.state}, ${listing.zip_code}`}</span>
                }
            </div>
            <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5">
                <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">Category</span>
                {edit ?
                    <input type="text" value={listing.categories || ""} onChange={e => setListing(prev => ({ ...prev, categories: e.target.value }))} />
                    : <table>
                        <tbody>
                            <tr>
                                {listing.categories ? listing.categories.split(", ").map(category => (
                                    <td key={category}>{category}</td>
                                )) : <></>}
                            </tr>
                        </tbody>
                    </table>
                }
            </div>
            <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5">
                <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">Volunteers</span>
                <span className="text-[15px] text-gray-900 leading-[1.45]">{listing.accepted_applicants ? listing.accepted_applicants.length : 0}/{listing.capacity ? listing.capacity : 0}</span>
            </div>
            <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5">
                <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">Transport</span>
                {edit ?
                    <textarea value={listing.transport || ""} onChange={e => setListing(prev => ({ ...prev, transport: e.target.value }))} />
                    : <span className="text-[15px] text-gray-900 leading-[1.45]">{listing.transport}</span>
                }
            </div>
            <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5 col-span-full">
                <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">Description</span>
                {edit ?
                    <textarea value={listing.description || ""} onChange={e => setListing(prev => ({ ...prev, description: e.target.value }))} />
                    : <span className="text-[15px] text-gray-900 leading-[1.45]">{listing.description}</span>
                }
            </div>

            {/* ── Questionnaire ── */}
            {(questions.length > 0 || edit) && (
                <div className="flex flex-col gap-2 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5" style={{ gridColumn: "1 / -1" }}>
                    <span className="text-xs font-semibold text-[#666] uppercase tracking-[0.4px]">Applicant Questionnaire</span>

                    {questions.length === 0 && edit && (
                        <span className="text-[13px] text-gray-400 italic">No questions yet. Add one below.</span>
                    )}

                    {questions.length > 0 && (
                        <div className="flex flex-col gap-2 mt-0.5">
                            {questions.map((q, i) => (
                                <div key={i} className="bg-white rounded-[8px] px-3 py-2 flex flex-col gap-1.5">
                                    {edit && editingQuestionIndex === i ? (
                                        <div className="flex flex-col gap-2">
                                            <textarea
                                                autoFocus
                                                rows={2}
                                                value={editingQuestionValue}
                                                onChange={e => setEditingQuestionValue(e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSaveEditQuestion(i); }
                                                    if (e.key === "Escape") { setEditingQuestionIndex(null); setEditingQuestionValue(""); }
                                                }}
                                                className="bg-[#f3f3f3] border-none rounded-[6px] px-2 py-1.5 text-[13px] text-gray-900 outline-none w-full resize-none leading-[1.5]"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSaveEditQuestion(i)}
                                                    className="bg-primary text-white border-none rounded-full px-3.5 py-1 text-xs font-medium cursor-pointer transition-colors hover:bg-primary-dark">
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => { setEditingQuestionIndex(null); setEditingQuestionValue(""); }}
                                                    className="bg-[#f3f3f3] border-none rounded-full px-3.5 py-1 text-xs cursor-pointer text-gray-600 transition-colors hover:bg-surface-dark">
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="text-[13px] text-gray-800 leading-snug flex-1">
                                                <span className="text-gray-400 font-medium mr-1.5 select-none">{i + 1}.</span>
                                                {q}
                                            </span>
                                            {edit && (
                                                <div className="flex gap-0.5 shrink-0">
                                                    <button
                                                        onClick={() => { setEditingQuestionIndex(i); setEditingQuestionValue(q); }}
                                                        title="Edit question"
                                                        className="bg-transparent border-none rounded-full w-6 h-6 flex items-center justify-center text-gray-400 cursor-pointer transition-colors hover:bg-[#f3f3f3] hover:text-gray-700 text-[12px]">
                                                        ✎
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveQuestion(i)}
                                                        title="Remove question"
                                                        className="bg-transparent border-none rounded-full w-6 h-6 flex items-center justify-center text-gray-400 cursor-pointer transition-colors hover:bg-[#f3f3f3] hover:text-red-500 text-[14px]">
                                                        ×
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {edit && (
                        <>
                            {addingQuestion && (
                                <textarea
                                    autoFocus
                                    rows={2}
                                    value={newQuestionValue}
                                    onChange={e => setNewQuestionValue(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddQuestion(); }
                                        if (e.key === "Escape") { setAddingQuestion(false); setNewQuestionValue(""); }
                                    }}
                                    placeholder="e.g. Do you have experience working with children?"
                                    className="bg-white border-none rounded-[8px] px-3 py-2 text-[13px] text-gray-900 outline-none w-full resize-none leading-[1.5] mt-1"
                                />
                            )}
                            <div className="flex gap-2 mt-1">
                                <button
                                    onClick={handleAddQuestion}
                                    className="bg-white border-none rounded-full px-3.5 py-1 text-xs cursor-pointer text-gray-900 transition-colors hover:bg-surface-dark">
                                    {addingQuestion ? "✓ Add Question" : "+ Question"}
                                </button>
                                {addingQuestion && (
                                    <button
                                        onClick={() => { setAddingQuestion(false); setNewQuestionValue(""); }}
                                        className="bg-transparent border-none rounded-full px-3.5 py-1 text-xs cursor-pointer text-gray-500 transition-colors hover:bg-white">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    </>);
}

function Modal({
    children,
    onClose,
}: {
    children: React.ReactNode,
    onClose: () => void,
}) {
    return (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-[300] p-4 overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-white rounded-card w-[90%] max-w-[50em] px-[34px] py-8 shadow-2xl my-auto">
                {children}
            </div>
        </div>
    )
}

// ── Event Detail Modal ──────────────────────────────────────
function EventDetails({ event, onClose, onSave, onDelete, onFinish }: {
    event: ListingData,
    onClose: () => void,
    onSave: (listing: ListingData) => void,
    onDelete: () => void,
    onFinish: () => void,
}) {
    if (!event) return null;

    const [edit, setEdit] = useState(false);
    const [listing, setListing] = useState(event);
    const [showApplicants, setShowApplicants] = useState(false);
    const [applicants, setApplicants] = useState<UserProfile[]>([]);
    const [applications, setApplications] = useState<Record<string, ApplicationData>>({});

    useEffect(() => {
        getListingApplicants(event.listing_id!).then(listingApplicantsRes => {
            if (listingApplicantsRes.type === "success") {
                setApplicants(listingApplicantsRes.data);
            }
        });

        getApplicationAnswers(event.listing_id!).then(listingApplicationsRes => {
            if (listingApplicationsRes.type === "success") {
                const applicationsMap: Record<string, ApplicationData> = {};
                for (const application of listingApplicationsRes.data) {
                    applicationsMap[application.user_id] = application;
                }
                setApplications(applicationsMap);
            }
        })
    }, []);

    return (
        <>
            {showApplicants ? <>
                <h2 className="text-2xl font-bold mb-4">{event.listing_name}</h2>
                {applicants.map(applicant => (
                    <div className="flex flex-col gap-1 bg-[#f3f3f3] rounded-[10px] px-3 py-2.5" key={applicant.user_id}>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <p key={applicant.user_id}>{applicant.first_name} {applicant.last_name} | {applicant.email}</p>
                                    </td>
                                    <td>
                                        <button
                                            className="bg-surface text-gray-900 border-none rounded-full px-5 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:bg-surface-dark"
                                            onClick={async () => await removeApplicant(listing.listing_id!, applicant.user_id)}>
                                            Reject
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="bg-primary text-white border-none rounded-full px-5 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:brightness-110"
                                            onClick={async () => {
                                                await acceptApplicant(listing.listing_id!, applicant.user_id);
                                                setApplicants(prev => prev.filter(user => user.user_id != applicant.user_id));
                                            }}>
                                            Accept
                                        </button>
                                    </td>
                                </tr>
                                {listing.Questions?.map((question, i) => {
                                    return (
                                        <tr key={`${applicant.user_id}-${question}`}>
                                            <td key={`${applicant.user_id}-${question} question`}>
                                                {question}
                                            </td>
                                            <td key={`${applicant.user_id}-${question} answer`}>
                                                {applications[applicant.user_id].Answer![i]}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ))}
            </> : <EventInfo edit={edit} listing={listing} setListing={setListing} />
            }

            <div className="flex justify-end flex-wrap gap-2.5">
                <button className="bg-surface text-gray-900 border-none rounded-full px-5 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:bg-surface-dark" onClick={onClose}>Close</button>
                {!showApplicants && (edit ?
                    <button className="bg-surface text-gray-900 border-none rounded-full px-5 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:bg-surface-dark" onClick={() => { setEdit(false); onSave(listing); }}>Save Event</button>
                    : <button className="bg-surface text-gray-900 border-none rounded-full px-5 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:bg-surface-dark" onClick={() => setEdit(true)}>Edit Event</button>)
                }
                <button className="bg-primary text-white border-none rounded-full px-5 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:brightness-110" onClick={() => onFinish()}>Finish Listing</button>
                {
                    showApplicants ?
                        <button className="bg-primary text-white border-none rounded-full px-5 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:brightness-110" onClick={() => setShowApplicants(false)}>View Listing</button>
                        : <button className="bg-primary text-white border-none rounded-full px-5 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:brightness-110" onClick={() => setShowApplicants(true)}>View Applicants</button>

                }
                <button className="bg-[#BD0303] text-white border-none rounded-full px-5 py-3 text-[15px] font-medium cursor-pointer transition-colors hover:brightness-110" onClick={() => onDelete()}>Delete Listing</button>
            </div>
        </>
    );
}

// ── Main Component ───────────────────────────────────────────
export default function OrganizationDashboard() {
    const [activeTab, setActiveTab] = useState("events");
    const [showCreateEvent, setShowCreateEvent] = useState(false);
    const [expandedEventIndex, setExpandedEventIndex] = useState<number | null>(null);
    const [events, setEvents] = useState<ListingData[]>([]);
    const [orgProfile, setOrgProfile] = useState<OrganizationProfile | null>();

    useEffect(() => {
        getOwnedListings().then(res => {
            if (res.type == "success") {
                setEvents(res.data);
            }
        });

        getAccountProfile().then(res => {
            if (res.type == "success") {
                setOrgProfile(res.data.profile as OrganizationProfile);
            }
        });
    }, []);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setOrgProfile((prev) => ({ ...prev!, [e.target.name]: e.target.value }));

    const navigate = useNavigate();

    return (
        <div className="font-sans bg-page min-h-screen text-gray-900">
            {/* ── NAV ── */}
            <nav className="bg-surface flex items-center px-8 h-[88px] gap-3.5 sticky top-0 z-[100] shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
                <div className="bg-primary text-white rounded-full w-[82px] h-[70px] flex items-center justify-center font-bold text-lg shrink-0">logo</div>
                <span className="font-bold text-[21px] mr-auto">Website name</span>
                <button className="bg-primary text-white border-none rounded-full px-[26px] py-[13px] text-base font-medium cursor-pointer transition-colors hover:brightness-110" onClick={async () => {
                    try { await logout(); } finally { navigate("/login"); }
                }}>
                    Log out
                </button>
            </nav>

            {/* ── MAIN ── */}
            <div className="max-w-[1140px] mx-auto px-6 pt-8 pb-[60px]">
                <h1 className="text-[40px] font-bold mb-[22px]">
                    {orgProfile === null ? "Hello!" : `Hello, ${orgProfile?.org_name || "Organization"}!`}
                </h1>

                {/* ── TABS ROW ── */}
                <div className="flex items-center justify-between mb-[26px]">
                    <div className="bg-surface rounded-full p-1.5 inline-flex gap-1">
                        <button
                            className={`border-none rounded-full px-6 py-2.5 text-base cursor-pointer transition-colors whitespace-nowrap
                                ${activeTab === "account" ? "bg-white font-medium shadow-sm text-gray-900" : "bg-transparent font-normal text-gray-900 hover:bg-white/55"}`}
                            onClick={() => setActiveTab("account")}>
                            Account info
                        </button>
                        <button
                            className={`border-none rounded-full px-6 py-2.5 text-base cursor-pointer transition-colors whitespace-nowrap
                                ${activeTab === "events" ? "bg-white font-medium shadow-sm text-gray-900" : "bg-transparent font-normal text-gray-900 hover:bg-white/55"}`}
                            onClick={() => setActiveTab("events")}>
                            Events &amp; Volunteers
                        </button>
                    </div>

                    {activeTab === "events" ? (
                        <button className="bg-surface border-none rounded-full px-7 py-3 text-base font-medium cursor-pointer transition-colors hover:bg-surface-dark" onClick={() => setShowCreateEvent(true)}>
                            Create Event
                        </button>
                    ) : (
                        <button
                            className="bg-surface border-none rounded-full px-7 py-3 text-base font-medium cursor-pointer transition-colors hover:bg-surface-dark"
                            onClick={async () => updateOrganizationProfile(orgProfile?.bio || "", orgProfile?.org_name || "", orgProfile?.website || "", orgProfile?.org_id!)}>
                            Update Profile
                        </button>
                    )}
                </div>

                {/* ══════════ ACCOUNT INFO TAB ══════════ */}
                {activeTab === "account" && (
                    <div className="bg-surface rounded-card p-3">
                        <div className="bg-white rounded-inner px-8 pt-7 pb-8">
                            <div className="text-[22px] font-semibold mb-1">Organization Information</div>
                            <div className="text-sm font-light text-[#666] mb-[26px]">Manage your organization's profile</div>
                            <div className="grid grid-cols-2 gap-x-20 gap-y-5">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[15px] font-normal">Organization Name:</label>
                                    <input className="bg-surface border-none rounded-md px-3 py-[9px] text-[15px] text-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-badge transition-shadow" type="text" name="org_name" value={orgProfile!.org_name!} onChange={handleFormChange} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[15px] font-normal">Website</label>
                                    <input className="bg-surface border-none rounded-md px-3 py-[9px] text-[15px] text-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-badge transition-shadow" type="text" name="website" value={orgProfile!.website!} onChange={handleFormChange} />
                                </div>
                                <div className="flex flex-col gap-2" style={{ gridColumn: "1 / -1" }}>
                                    <label className="text-[15px] font-normal">Bio</label>
                                    <textarea className="bg-surface border-none rounded-md px-3 py-[9px] text-[15px] text-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-badge transition-shadow" name="bio" value={orgProfile!.bio!} onChange={handleFormChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══════════ EVENTS & VOLUNTEERS TAB ══════════ */}
                {activeTab === "events" && (
                    <div className="bg-surface rounded-card p-3">
                        <div className="bg-white rounded-inner px-8 pt-7 pb-8">
                            <div className="text-[22px] font-semibold mb-1">Volunteer Events: {events.length}</div>
                            <div className="text-sm font-light text-[#666] mb-[26px]">Manage your Events &amp; Volunteers</div>
                            <div className="flex flex-col gap-3.5">
                                {events.map((event, i) => (
                                    <EventCard key={event.listing_id} event={event} onOpen={() => setExpandedEventIndex(i)} />
                                ))}
                                {events.length === 0 && (
                                    <div className="flex flex-col items-center gap-3 py-12 px-6">
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
                <CreateOpp
                    onClose={() => setShowCreateEvent(false)}
                    onCreated={(listing) => {
                        setEvents(prev => [...prev, listing]);
                        setShowCreateEvent(false);
                    }}
                />
            )}

            {/* ── EVENT DETAILS MODAL ── */}
            {expandedEventIndex !== null && (
                <Modal onClose={() => setExpandedEventIndex(null)}>
                    <EventDetails
                        event={events[expandedEventIndex]}
                        onClose={() => setExpandedEventIndex(null)}
                        onSave={async (updated) => {
                            setEvents(prev => prev.map((e, i) => i === expandedEventIndex ? updated : e));
                            await editListing(updated);
                        }}
                        onDelete={async () => {
                            setEvents(prev => prev.filter((_, i) => i != expandedEventIndex));
                            setExpandedEventIndex(null);
                            await deleteListing(events[expandedEventIndex].listing_id!);
                        }}
                        onFinish={async () => {
                            setEvents(prev => prev.filter((_, i) => i != expandedEventIndex));
                            setExpandedEventIndex(null);
                            await finishListing(events[expandedEventIndex].listing_id!);
                        }}
                    />
                </Modal>
            )}
        </div>
    );
}
