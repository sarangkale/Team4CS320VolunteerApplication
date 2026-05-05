import { useState, useEffect } from "react";
import { getAccountProfile } from "../auth/auth";
import { supabase } from "../lib/supabase";
import "./application.css";

type Tab = "pending" | "accepted";

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
}

interface ListingInfo {
  listing_name: string;
  description: string;
  transport: string;
  duration: string;
  needed_skill: string[];
  capacity: number;
}

// Helper: given a UUID[], fetch and map profiles into Volunteer[]
async function fetchVolunteersByUUIDs(uuids: string[]): Promise<Volunteer[]> {
  if (uuids.length === 0) return [];

  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .in("user_id", uuids);

  if (profilesError || !profilesData) {
    console.error("Error fetching profiles:", profilesError);
    return [];
  }

  return profilesData.map((p) => {
    const firstName = p.first_name || "";
    const lastName = p.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim() || "Unknown Applicant";

    return {
      id: String(p.user_id),
      name: fullName,
      email: String(p.email || ""),
      phone: String(p.phone || "N/A"),
      location: String(p.location || "N/A"),
      bio: String(p.bio || "No bio provided."),
      skills: Array.isArray(p.skills) ? p.skills : [],
    };
  });
}

export default function VolunteerUI() {
  const [activeTab, setActiveTab] = useState<"volunteers" | "edit">("volunteers");
  const [subTab, setSubTab] = useState<Tab>("pending");
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  const [pendingList, setPendingList] = useState<Volunteer[]>([]);
  const [acceptedList, setAcceptedList] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // We store orgId and listingId at component scope so Save Changes and
  // Accept/Remove can use them without re-fetching.
  const [orgId, setOrgId] = useState<string | null>(null);
  const [listingId, setListingId] = useState<string | null>(null);

  // Edit tab state
  const [listingInfo, setListingInfo] = useState<ListingInfo | null>(null);
  const [listingLoading, setListingLoading] = useState(false);
  const [listingSaved, setListingSaved] = useState(false);
  const [listingSaveError, setListingSaveError] = useState<string | null>(null);

  // --- Fetch pending + accepted applicants on mount ---
  useEffect(() => {
    async function fetchAll() {
      setIsLoading(true);

      const accountResult = await getAccountProfile();
      if (accountResult.type === "error" || !accountResult.data?.profile) {
        console.error("Failed to authenticate or retrieve profile.");
        setIsLoading(false);
        return;
      }

      const profileData = accountResult.data.profile as any;
      const resolvedOrgId = profileData.org_id as string | undefined;

      if (!resolvedOrgId) {
        console.error("No org_id found on the current user profile.");
        setIsLoading(false);
        return;
      }

      setOrgId(resolvedOrgId);

      // Fetch the first listing for this org.
      // FIX: select both applicants and accepted_applicants (both UUID[]),
      //      and grab the listing id so we can update it later.
      const { data: listingRow, error: listingsError } = await supabase
        .from("listing")
        .select("id, applicants, accepted_applicants")
        .eq("org_id", resolvedOrgId)
        .limit(1)
        .single();

      if (listingsError || !listingRow) {
        console.error("Error fetching listing:", listingsError);
        setIsLoading(false);
        return;
      }

      setListingId(listingRow.id);

      const pendingUUIDs: string[] = Array.isArray(listingRow.applicants)
        ? listingRow.applicants
        : [];
      const acceptedUUIDs: string[] = Array.isArray(listingRow.accepted_applicants)
        ? listingRow.accepted_applicants
        : [];

      // Exclude anyone already accepted from the pending list so there's
      // no overlap if the DB still has them in both arrays.
      const acceptedSet = new Set(acceptedUUIDs);
      const trulyPendingUUIDs = pendingUUIDs.filter((id) => !acceptedSet.has(id));

      const [pending, accepted] = await Promise.all([
        fetchVolunteersByUUIDs(trulyPendingUUIDs),
        fetchVolunteersByUUIDs(acceptedUUIDs),
      ]);

      setPendingList(pending);
      setAcceptedList(accepted);
      setIsLoading(false);
    }

    fetchAll();
  }, []);

  // --- Fetch listing info for Edit tab (lazy, only when tab is first opened) ---
  useEffect(() => {
    if (activeTab !== "edit") return;
    if (listingInfo) return;

    async function fetchListingInfo() {
      setListingLoading(true);

      // If we already have the listingId from the mount fetch, use it.
      // Otherwise fall back to re-fetching via orgId.
      let targetListingId = listingId;

      if (!targetListingId) {
        const accountResult = await getAccountProfile();
        if (accountResult.type === "error" || !accountResult.data?.profile) {
          setListingLoading(false);
          return;
        }
        const profileData = accountResult.data.profile as any;
        const resolvedOrgId = profileData.org_id;
        if (!resolvedOrgId) { setListingLoading(false); return; }

        const { data: row } = await supabase
          .from("listing")
          .select("id")
          .eq("org_id", resolvedOrgId)
          .limit(1)
          .single();

        if (!row) { setListingLoading(false); return; }
        targetListingId = row.id;
        setListingId(row.id);
      }

      const { data, error } = await supabase
        .from("listing")
        .select("listing_name, description, transport, duration, needed_skill, capacity")
        .eq("id", targetListingId)
        .single();

      if (error || !data) {
        console.error("Error fetching listing info:", error);
        setListingLoading(false);
        return;
      }

      setListingInfo({
        listing_name: data.listing_name || "",
        description: data.description || "",
        transport: data.transport || "",
        duration: data.duration || "",
        needed_skill: Array.isArray(data.needed_skill) ? data.needed_skill : [],
        capacity: data.capacity ?? 0,
      });

      setListingLoading(false);
    }

    fetchListingInfo();
  }, [activeTab]);

  // FIX: Accept — moves volunteer from pendingList to acceptedList and
  //      writes the change to both columns in Supabase.
  const handleAccept = async (volunteer: Volunteer) => {
    if (!listingId) return;

    const newAcceptedUUIDs = [...acceptedList.map((v) => v.id), volunteer.id];
    const newPendingUUIDs = pendingList
      .filter((v) => v.id !== volunteer.id)
      .map((v) => v.id);

    const { error } = await supabase
      .from("listing")
      .update({
        accepted_applicants: newAcceptedUUIDs,
        applicants: newPendingUUIDs,
      })
      .eq("id", listingId);

    if (error) {
      console.error("Failed to accept volunteer:", error);
      return;
    }

    setPendingList((prev) => prev.filter((v) => v.id !== volunteer.id));
    setAcceptedList((prev) => [...prev, volunteer]);
    setSelectedVolunteer(null);
  };

  // FIX: Remove from pending — removes from applicants[] in Supabase.
  const handleRemovePending = async (id: string) => {
    if (!listingId) return;

    const newPendingUUIDs = pendingList.filter((v) => v.id !== id).map((v) => v.id);

    const { error } = await supabase
      .from("listing")
      .update({ applicants: newPendingUUIDs })
      .eq("id", listingId);

    if (error) {
      console.error("Failed to remove pending volunteer:", error);
      return;
    }

    setPendingList((prev) => prev.filter((v) => v.id !== id));
  };

  // FIX: Remove from accepted — removes from accepted_applicants[] in Supabase.
  const handleRemoveAccepted = async (id: string) => {
    if (!listingId) return;

    const newAcceptedUUIDs = acceptedList.filter((v) => v.id !== id).map((v) => v.id);

    const { error } = await supabase
      .from("listing")
      .update({ accepted_applicants: newAcceptedUUIDs })
      .eq("id", listingId);

    if (error) {
      console.error("Failed to remove accepted volunteer:", error);
      return;
    }

    setAcceptedList((prev) => prev.filter((v) => v.id !== id));
  };

  // FIX: Save Changes — actually writes to Supabase now.
  const handleSaveChanges = async () => {
    if (!listingInfo || !listingId) return;
    setListingSaveError(null);

    const { error } = await supabase
      .from("listing")
      .update({
        listing_name: listingInfo.listing_name,
        description: listingInfo.description,
        transport: listingInfo.transport,
        duration: listingInfo.duration,
        needed_skill: listingInfo.needed_skill,
        capacity: listingInfo.capacity,
      })
      .eq("id", listingId);

    if (error) {
      console.error("Failed to save listing:", error);
      setListingSaveError("Save failed. Please try again.");
      return;
    }

    setListingSaved(true);
    setTimeout(() => setListingSaved(false), 3000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const displayedList = subTab === "pending" ? pendingList : acceptedList;

  // FIX: Event title pulled from real listing data once loaded.
  const eventTitle = listingInfo?.listing_name || "Volunteer Opportunity";

  return (
    <div className="page-wrap">
      {/* Nav */}
      <nav className="nav">
        <div className="nav-left">
          <a href="/" className="logo-link" aria-label="Home">
            <div className="logo">logo</div>
          </a>
          <a href="/" className="site-name site-name-link">
            Volunteering @ UMass
          </a>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Log out</button>
      </nav>

      {/* Main card */}
      <div className="main-card">
        {/* Header — FIX: title comes from listingInfo */}
        <div className="card-header">
          <h1 className="event-title">{eventTitle}</h1>
          <button className="back-btn" onClick={() => window.history.back()}>Back</button>
        </div>

        {/* Top tabs */}
        <div className="top-tabs">
          <button
            className={`top-tab ${activeTab === "volunteers" ? "top-tab-active" : ""}`}
            onClick={() => setActiveTab("volunteers")}
          >
            Volunteers
          </button>
          <button
            className={`top-tab ${activeTab === "edit" ? "top-tab-active" : ""}`}
            onClick={() => setActiveTab("edit")}
          >
            Edit Information
          </button>
        </div>

        {/* ── Volunteers tab ── */}
        {activeTab === "volunteers" && (
          <>
            <div className="sub-tab-bar">
              <button
                className={`sub-tab ${subTab === "pending" ? "sub-tab-active" : ""}`}
                onClick={() => setSubTab("pending")}
              >
                Pending
              </button>
              <button
                className={`sub-tab ${subTab === "accepted" ? "sub-tab-active" : ""}`}
                onClick={() => setSubTab("accepted")}
              >
                Accepted
              </button>
            </div>

            {/* Volunteer list */}
            <div className="list-area">
              {isLoading ? (
                <div style={{ padding: "12px 18px" }}>Loading applicants...</div>
              ) : displayedList.length === 0 ? (
                <div style={{ padding: "12px 18px" }}>
                  {subTab === "pending" ? "No pending applicants." : "No accepted volunteers yet."}
                </div>
              ) : (
                displayedList.map((v) => (
                  <div key={v.id} className="volunteer-row">
                    <span
                      className="volunteer-name"
                      onClick={() => setSelectedVolunteer(v)}
                    >
                      {v.name}
                    </span>
                    <div className="row-actions">
                      {subTab === "pending" && (
                        <>
                          {/* FIX: Accept now opens the modal where the real
                               accept action lives, keeping the row clean. */}
                          <button
                            className="accept-btn"
                            onClick={() => setSelectedVolunteer(v)}
                          >
                            Review
                          </button>
                          <button
                            className="remove-btn"
                            onClick={() => handleRemovePending(v.id)}
                          >
                            Remove
                          </button>
                        </>
                      )}
                      {subTab === "accepted" && (
                        // FIX: Remove from accepted is now wired up.
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveAccepted(v.id)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* ── Edit Information tab ── */}
        {activeTab === "edit" && (
          <div className="edit-section">
            {listingLoading ? (
              <div style={{ padding: "12px 0" }}>Loading listing info...</div>
            ) : !listingInfo ? (
              <div style={{ padding: "12px 0" }}>Could not load listing information.</div>
            ) : (
              <>
                <div className="form-grid">
                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label className="label">
                      Listing Name <span className="req">*</span>
                    </label>
                    <input
                      className="input"
                      value={listingInfo.listing_name}
                      onChange={(e) =>
                        setListingInfo({ ...listingInfo, listing_name: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label className="label">Description</label>
                    <textarea
                      className="textarea"
                      style={{ height: 90 }}
                      value={listingInfo.description}
                      onChange={(e) =>
                        setListingInfo({ ...listingInfo, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Transport</label>
                    <input
                      className="input"
                      value={listingInfo.transport}
                      onChange={(e) =>
                        setListingInfo({ ...listingInfo, transport: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Duration</label>
                    <input
                      className="input"
                      value={listingInfo.duration}
                      onChange={(e) =>
                        setListingInfo({ ...listingInfo, duration: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Capacity</label>
                    <input
                      className="input"
                      type="number"
                      value={listingInfo.capacity}
                      onChange={(e) =>
                        setListingInfo({ ...listingInfo, capacity: Number(e.target.value) })
                      }
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label className="label">Needed Skills</label>
                    <div className="skills-row">
                      {listingInfo.needed_skill.map((s, i) => (
                        <span key={i} className="skill-chip">
                          {s}
                          <button
                            className="skill-chip-remove"
                            onClick={() =>
                              setListingInfo({
                                ...listingInfo,
                                needed_skill: listingInfo.needed_skill.filter((_, idx) => idx !== i),
                              })
                            }
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {/* NOTE: prompt() left in place — replace with an inline
                           input field when you want a polished UX here. */}
                      <button
                        className="add-skill-btn"
                        onClick={() => {
                          const skill = prompt("Enter a skill:");
                          if (skill?.trim()) {
                            setListingInfo({
                              ...listingInfo,
                              needed_skill: [...listingInfo.needed_skill, skill.trim()],
                            });
                          }
                        }}
                      >
                        + Skill
                      </button>
                    </div>
                  </div>
                </div>

                <div className="modal-footer" style={{ marginTop: 20 }}>
                  {listingSaved && (
                    <span style={{ color: "#3a8a3a", marginRight: 12, fontSize: 14 }}>
                      ✓ Saved successfully
                    </span>
                  )}
                  {listingSaveError && (
                    <span style={{ color: "#c0392b", marginRight: 12, fontSize: 14 }}>
                      {listingSaveError}
                    </span>
                  )}
                  {}
                  <button className="logout-btn" onClick={handleSaveChanges}>
                    Save Changes
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Applicant modal overlay */}
      {selectedVolunteer && (
        <div className="modal-overlay" onClick={() => setSelectedVolunteer(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{selectedVolunteer.name}</h2>

            <div className="form-grid">
              <div className="form-group">
                <label className="label">Full Name <span className="req">*</span></label>
                <input className="input" defaultValue={selectedVolunteer.name} readOnly />
              </div>
              <div className="form-group">
                <label className="label">Email <span className="req">*</span></label>
                <input className="input" defaultValue={selectedVolunteer.email} readOnly />
              </div>
              <div className="form-group">
                <label className="label">Phone Number <span className="req">*</span></label>
                <input className="input" defaultValue={selectedVolunteer.phone} readOnly />
              </div>
              <div className="form-group">
                <label className="label">Location <span className="req">*</span></label>
                <input className="input" defaultValue={selectedVolunteer.location} readOnly />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 8 }}>
              <label className="label">Bio</label>
              <textarea className="textarea" defaultValue={selectedVolunteer.bio} readOnly />
            </div>

            <div style={{ marginTop: 12 }}>
              <label className="label">Skills</label>
              <div className="skills-row">
                {selectedVolunteer.skills.map((s, i) => (
                  <span key={i} className="skill-chip">{s}</span>
                ))}
              </div>
            </div>

            {}
            <div className="modal-footer">
              {pendingList.some((v) => v.id === selectedVolunteer.id) && (
                <>
                  <button
                    className="accept-btn"
                    style={{ marginRight: 8 }}
                    onClick={() => handleAccept(selectedVolunteer)}
                  >
                    Accept
                  </button>
                  <button
                    className="remove-btn"
                    style={{ marginRight: 8 }}
                    onClick={() => {
                      handleRemovePending(selectedVolunteer.id);
                      setSelectedVolunteer(null);
                    }}
                  >
                    Remove
                  </button>
                </>
              )}
              <button className="back-btn" onClick={() => setSelectedVolunteer(null)}>
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}