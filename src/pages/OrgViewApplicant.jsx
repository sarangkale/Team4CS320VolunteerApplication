import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { axios_get, axios_post } from "../lib/axios";

// ─────────────────────────────────────────────────────────────────────────────
// BACKEND ENDPOINTS REQUIRED
//
// GET  /organization/listings
//   Returns all listings for the authenticated org.
//   Shape: { data: Array<{ listing_id: string, listing_name: string, ... }> }
//
// GET  /organization/listing_applicants?listing_id=<uuid>
//   Joins listing.applicants and listing.accepted_applicants (both UUID[])
//   against the profiles table server-side and returns shaped profile objects.
//   Shape: { data: { pending: VolunteerProfile[], accepted: VolunteerProfile[] } }
//   where VolunteerProfile = { id, name, email, phone, location, bio, skills }
//
// POST /organization/accept_applicant
//   Body: { listing_id: string, user_id: string }
//   Moves user_id from applicants[] → accepted_applicants[] on the listing.
//
// POST /organization/remove_applicant
//   Body: { listing_id: string, user_id: string }
//   Removes user_id from applicants[].
//
// POST /organization/remove_accepted
//   Body: { listing_id: string, user_id: string }
//   Removes user_id from accepted_applicants[].
// ─────────────────────────────────────────────────────────────────────────────


// ── Read-only info pill ───────────────────────────────────────────────────────
function InfoField({ label, value }) {
    return (
        <div>
            <label className="text-[13px] font-medium text-gray-900 block mb-[5px]">
                {label}
            </label>
            <div className="bg-surface rounded-full px-4 py-[7px] text-sm text-[#333] min-h-[34px] flex items-center">
                {value || <span className="text-[#999]">—</span>}
            </div>
        </div>
    );
}


// ── Applicant detail modal ────────────────────────────────────────────────────
// Read-only — organizations can view but not edit volunteer profiles.
function ApplicantModal({ volunteer, isPending, onClose, onAccept, onRemove }) {
    if (!volunteer) return null;

    return (
        <div
            className="fixed inset-0 bg-black/45 z-[100] flex items-center justify-center p-6"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-card px-9 pt-8 pb-7 w-full max-w-[580px] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-[22px] font-extrabold m-0 mb-6 tracking-[-0.5px] text-gray-900">
                    {volunteer.name}
                </h2>

                {/* 2-column info grid */}
                <div className="grid grid-cols-2 gap-x-7 gap-y-4 mb-4">
                    <InfoField label="Full Name" value={volunteer.name} />
                    <InfoField label="Email" value={volunteer.email} />
                    <InfoField label="Phone Number" value={volunteer.phone} />
                    <InfoField label="Location" value={volunteer.location} />
                </div>

                {/* Bio */}
                <div className="mb-[18px]">
                    <label className="text-[13px] font-medium text-gray-900 block mb-[5px]">Bio</label>
                    <div className="bg-surface rounded-inner px-4 py-2.5 text-sm text-[#333] min-h-[46px] leading-[1.6]">
                        {volunteer.bio || <span className="text-[#999]">No bio provided.</span>}
                    </div>
                </div>

                {/* Skills */}
                <div className="mb-7">
                    <label className="text-[13px] font-medium text-gray-900 block mb-2">Skills</label>
                    <div className="flex flex-wrap gap-2 items-center">
                        {volunteer.skills && volunteer.skills.length > 0
                            ? volunteer.skills.map((skill, i) => (
                                <span
                                    key={i}
                                    className="bg-olive-medium text-white rounded-full px-[18px] py-[5px] text-[13px] font-medium"
                                >
                                    {skill}
                                </span>
                            ))
                            : <span className="text-[#999] text-sm">No skills listed.</span>
                        }
                    </div>
                </div>

                {/* Footer — accept/remove only for pending applicants */}
                <div className="flex justify-end gap-2.5">
                    {isPending && (
                        <>
                            <button
                                onClick={onAccept}
                                className="bg-white border-[2.5px] border-[#2bbd03] rounded-full px-[22px] py-[5px] text-sm font-semibold text-[#2bbd03] cursor-pointer transition-colors hover:bg-[#f0fde8]"
                            >
                                Accept
                            </button>
                            <button
                                onClick={onRemove}
                                className="bg-white border-[2.5px] border-[#bd0303] rounded-full px-5 py-[5px] text-sm font-semibold text-[#bd0303] cursor-pointer transition-colors hover:bg-[#fdf0f0]"
                            >
                                Remove
                            </button>
                        </>
                    )}
                    <button
                        onClick={onClose}
                        className="bg-surface border-none rounded-full px-7 py-2.5 text-[15px] font-medium cursor-pointer text-gray-900 transition-colors hover:bg-surface-darker"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}


// ── Main Component ────────────────────────────────────────────────────────────
export default function OrganizationEventView() {
    const navigate = useNavigate();

    // Listing ID seeded from route: /organization_dashboard/view_applicant/:listingId
    const { listingId: routeListingId } = useParams();

    const [activeSubTab, setActiveSubTab] = useState("pending");
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);

    // All listings for this org — populates the dropdown
    const [listings, setListings] = useState([]);
    const [listingsLoading, setListingsLoading] = useState(true);
    const [listingsError, setListingsError] = useState(null);

    // Currently active listing
    const [selectedListingId, setSelectedListingId] = useState(routeListingId ?? null);

    // Applicants for the selected listing
    const [pendingList, setPendingList] = useState([]);
    const [acceptedList, setAcceptedList] = useState([]);
    const [applicantsLoading, setApplicantsLoading] = useState(false);
    const [applicantsError, setApplicantsError] = useState(null);

    // Inline error for accept/remove actions
    const [actionError, setActionError] = useState(null);

    // --- Fetch all org listings on mount ---
    useEffect(() => {
        async function fetchListings() {
            setListingsLoading(true);
            setListingsError(null);

            const res = await axios_get("/organization/listings");

            if (res.type === "error") {
                setListingsError("Could not load listings. Please try again.");
                setListingsLoading(false);
                return;
            }

            const data = Array.isArray(res.data?.data?.data) ? res.data.data.data
                      : Array.isArray(res.data?.data)        ? res.data.data
                      : [];
            setListings(data);

            // If the route didn't specify a listing, auto-select the first
            if (!routeListingId && data.length > 0) {
                setSelectedListingId(data[0].listing_id);
            }

            setListingsLoading(false);
        }

        fetchListings();
    }, []);

    // --- Fetch applicants whenever the selected listing changes ---
    useEffect(() => {
        if (!selectedListingId) return;

        async function fetchApplicants() {
            setApplicantsLoading(true);
            setApplicantsError(null);
            setPendingList([]);
            setAcceptedList([]);

            const res = await axios_get("/organization/listing_applicants", {
                params: { listing_id: selectedListingId },
            });

            if (res.type === "error") {
                setApplicantsError("Could not load applicants. Please try again.");
                setApplicantsLoading(false);
                return;
            }

            const { pending, accepted } = res.data.data;
            setPendingList(pending ?? []);
            setAcceptedList(accepted ?? []);
            setApplicantsLoading(false);
        }

        fetchApplicants();
    }, [selectedListingId]);

    // Accept — POST to backend, update local state on success
    const handleAccept = async (volunteer) => {
        setActionError(null);

        const res = await axios_post("/organization/accept_applicant", {
            listing_id: selectedListingId,
            user_id: volunteer.id,
        });

        if (res.type === "error") {
            setActionError("Failed to accept applicant. Please try again.");
            return;
        }

        setPendingList((prev) => prev.filter((v) => v.id !== volunteer.id));
        setAcceptedList((prev) => [...prev, volunteer]);
        setSelectedVolunteer(null);
    };

    // Remove from pending
    const handleRemovePending = async (volunteer) => {
        setActionError(null);

        const res = await axios_post("/organization/remove_applicant", {
            listing_id: selectedListingId,
            user_id: volunteer.id,
        });

        if (res.type === "error") {
            setActionError("Failed to remove applicant. Please try again.");
            return;
        }

        setPendingList((prev) => prev.filter((v) => v.id !== volunteer.id));
        setSelectedVolunteer(null);
    };

    // Remove from accepted
    const handleRemoveAccepted = async (id) => {
        setActionError(null);

        const res = await axios_post("/organization/remove_accepted", {
            listing_id: selectedListingId,
            user_id: id,
        });

        if (res.type === "error") {
            setActionError("Failed to remove volunteer. Please try again.");
            return;
        }

        setAcceptedList((prev) => prev.filter((v) => v.id !== id));
    };

    const handleListingChange = (e) => {
        setSelectedListingId(e.target.value);
        setActiveSubTab("pending");
        setSelectedVolunteer(null);
        setActionError(null);
    };

    const currentList = activeSubTab === "pending" ? pendingList : acceptedList;
    const selectedListing = listings.find((l) => l.listing_id === selectedListingId);
    const selectedVolunteerIsPending = selectedVolunteer
        ? pendingList.some((v) => v.id === selectedVolunteer.id)
        : false;

    return (
        <div className="font-sans min-h-screen bg-page-alt">

            {/* Applicant detail modal */}
            <ApplicantModal
                volunteer={selectedVolunteer}
                isPending={selectedVolunteerIsPending}
                onClose={() => setSelectedVolunteer(null)}
                onAccept={() => handleAccept(selectedVolunteer)}
                onRemove={() => handleRemovePending(selectedVolunteer)}
            />

            {/* Nav */}
            <nav className="bg-surface flex items-center justify-between px-8 py-3 border-b border-[#bbb]">
                <div className="flex items-center gap-3">
                    <div className="w-[52px] h-[52px] rounded-full bg-primary flex items-center justify-center text-white font-bold text-[13px] shrink-0">
                        logo
                    </div>
                    <span className="font-bold text-lg text-gray-900">Website name</span>
                </div>
                <button
                    className="bg-primary text-white border-none rounded-full px-8 py-[11px] text-base font-semibold cursor-pointer tracking-[-0.5px] transition-colors hover:bg-primary-dark"
                    onClick={() => navigate("/login")}
                >
                    Log out
                </button>
            </nav>

            {/* Page body */}
            <div className="max-w-[960px] mx-auto mt-7 px-7 pb-12">

                {/* Title row with optional listing dropdown */}
                <div className="flex items-center justify-between mb-4 gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <h1 className="text-[34px] font-extrabold m-0 tracking-[-1px] shrink-0">
                            {listingsLoading
                                ? "Loading…"
                                : selectedListing?.listing_name ?? "Applicants"}
                        </h1>

                        {/* Dropdown only shown when org has more than one listing */}
                        {!listingsLoading && listings.length > 1 && (
                            <select
                                value={selectedListingId ?? ""}
                                onChange={handleListingChange}
                                className="bg-surface border-none rounded-full px-4 py-2 text-[15px] text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-badge max-w-[240px]"
                            >
                                {listings.map((l) => (
                                    <option key={l.listing_id} value={l.listing_id}>
                                        {l.listing_name}
                                    </option>
                                ))}
                            </select>
                        )}

                        {listingsError && (
                            <span className="text-[#bd0303] text-sm">{listingsError}</span>
                        )}
                    </div>

                    <button
                        className="bg-surface border-none rounded-full px-7 py-2.5 text-[15px] font-medium cursor-pointer text-gray-900 transition-colors hover:bg-surface-darker shrink-0"
                        onClick={() => navigate("/organization_dashboard")}
                    >
                        Back
                    </button>
                </div>

                {/* Action error banner */}
                {actionError && (
                    <div className="mb-4 bg-[#fdf0f0] border border-[#bd0303] rounded-[10px] px-4 py-2.5 text-sm text-[#bd0303]">
                        {actionError}
                    </div>
                )}

                {/* Main card */}
                <div className="bg-surface rounded-card px-3.5 pt-3.5 pb-5">
                    <div className="bg-white rounded-inner px-4 pt-5 pb-7 min-h-[460px]">

                        {/* Sub tab bar: Pending / Accepted */}
                        <div className="inline-flex bg-surface rounded-full p-1 mb-5">
                            {[
                                { key: "pending", label: "Pending" },
                                { key: "accepted", label: "Accepted" },
                            ].map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveSubTab(key)}
                                    className={`border-none rounded-full px-7 py-[7px] text-[15px] cursor-pointer text-gray-900 transition-colors
                                        ${activeSubTab === key ? "bg-white font-semibold shadow-sm" : "bg-transparent font-normal hover:bg-white/55"}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* List content */}
                        {listingsLoading || applicantsLoading ? (
                            <p className="text-[#888] text-[15px] px-2 py-3">
                                {listingsLoading ? "Loading listings…" : "Loading applicants…"}
                            </p>
                        ) : !selectedListingId ? (
                            <p className="text-[#888] text-[15px] px-2 py-3">
                                No listings found for this organization.
                            </p>
                        ) : applicantsError ? (
                            <p className="text-[#bd0303] text-[15px] px-2 py-3">{applicantsError}</p>
                        ) : currentList.length === 0 ? (
                            <p className="text-[#888] text-[15px] px-2 py-3">
                                No {activeSubTab} applicants.
                            </p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {currentList.map((volunteer) => (
                                    <div
                                        key={volunteer.id}
                                        className="bg-surface rounded-[16px] h-[58px] flex items-center px-2.5"
                                    >
                                        {/* Name opens the detail modal */}
                                        <button
                                            onClick={() => setSelectedVolunteer(volunteer)}
                                            className="bg-none border-none px-1.5 py-1 cursor-pointer font-semibold text-[15px] text-gray-900 min-w-[160px] text-left underline decoration-transparent underline-offset-2 transition-colors hover:text-primary hover:decoration-primary"
                                        >
                                            {volunteer.name}
                                        </button>

                                        {/* Row action buttons */}
                                        <div className="ml-auto flex gap-2.5">
                                            {activeSubTab === "pending" && (
                                                <button
                                                    onClick={() => handleAccept(volunteer)}
                                                    className="bg-white border-[2.5px] border-[#2bbd03] rounded-full px-[22px] py-[5px] text-sm font-semibold text-[#2bbd03] cursor-pointer transition-colors hover:bg-[#f0fde8]"
                                                >
                                                    Accept
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    activeSubTab === "pending"
                                                        ? handleRemovePending(volunteer)
                                                        : handleRemoveAccepted(volunteer.id)
                                                }
                                                className="bg-white border-[2.5px] border-[#bd0303] rounded-full px-5 py-[5px] text-sm font-semibold text-[#bd0303] cursor-pointer transition-colors hover:bg-[#fdf0f0]"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}