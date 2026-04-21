import { useState, useEffect } from "react";
import { getAccountProfile } from "../auth/auth"; // Adjust path as needed
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

// --- Dummy accepted volunteers (replace with Supabase data once column exists) ---
const DUMMY_ACCEPTED: Volunteer[] = [
  {
    id: "dummy-1",
    name: "Alice Johnson",
    email: "alice.johnson@umass.edu",
    phone: "413-555-0101",
    location: "Amherst, MA",
    bio: "Passionate about community service and sustainability initiatives.",
    skills: ["Communication", "Event Planning"],
  },
  {
    id: "dummy-2",
    name: "Marcus Lee",
    email: "marcus.lee@umass.edu",
    phone: "413-555-0182",
    location: "Northampton, MA",
    bio: "Pre-med student with experience in health outreach programs.",
    skills: ["First Aid", "Public Health"],
  },
];

export default function VolunteerUI() {
  const [activeTab, setActiveTab] = useState<"volunteers" | "edit">("volunteers");
  const [subTab, setSubTab] = useState<Tab>("pending");
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [pendingList, setPendingList] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Information state
  const [listingInfo, setListingInfo] = useState<ListingInfo | null>(null);
  const [listingLoading, setListingLoading] = useState(false);
  const [listingSaved, setListingSaved] = useState(false);

  // --- Fetch pending applicants ---
  useEffect(() => {
    async function fetchOrgListingsAndApplicants() {
      setIsLoading(true);

      const accountResult = await getAccountProfile();
      if (accountResult.type === "error" || !accountResult.data?.profile) {
        console.error("Failed to authenticate or retrieve profile.");
        setIsLoading(false);
        return;
      }

      const profileData = accountResult.data.profile as any;
      const orgId = profileData.org_id;

      if (!orgId) {
        console.error("No org_id found on the current user profile.");
        setIsLoading(false);
        return;
      }

      const { data: listingsData, error: listingsError } = await supabase
        .from("listing")
        .select("applicants")
        .eq("org_id", orgId);

      if (listingsError || !listingsData) {
        console.error("Error fetching org listings:", listingsError);
        setIsLoading(false);
        return;
      }

      const allEmails = new Set<string>();
      listingsData.forEach((listing) => {
        if (listing.applicants) {
          listing.applicants.split(",").forEach((email: string) => {
            const trimmed = email.trim();
            if (trimmed) allEmails.add(trimmed);
          });
        }
      });

      const emailArray = Array.from(allEmails);

      if (emailArray.length === 0) {
        setPendingList([]);
        setIsLoading(false);
        return;
      }

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("email", emailArray);

      if (profilesError || !profilesData) {
        console.error("Error fetching profiles:", profilesError);
        setIsLoading(false);
        return;
      }

      const loadedVolunteers: Volunteer[] = profilesData.map((p) => {
        const firstName = p.first_name || "";
        const lastName = p.last_name || "";
        const fullName = `${firstName} ${lastName}`.trim() || "Unknown Applicant";
        const skillsArray = Array.isArray(p.skills) ? p.skills : [];

        return {
          id: String(p.user_id || p.email || Math.random()),
          name: fullName,
          email: String(p.email || ""),
          phone: String(p.phone || "N/A"),
          location: String(p.location || "N/A"),
          bio: String(p.bio || "No bio provided."),
          skills: skillsArray,
        };
      });

      setPendingList(loadedVolunteers);
      setIsLoading(false);
    }

    fetchOrgListingsAndApplicants();
  }, []);

  // --- Fetch listing info for Edit tab ---
  useEffect(() => {
    if (activeTab !== "edit") return;
    if (listingInfo) return; // already loaded

    async function fetchListingInfo() {
      setListingLoading(true);

      const accountResult = await getAccountProfile();
      if (accountResult.type === "error" || !accountResult.data?.profile) {
        setListingLoading(false);
        return;
      }

      const profileData = accountResult.data.profile as any;
      const orgId = profileData.org_id;

      if (!orgId) {
        setListingLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("listing")
        .select("listing_name, description, transport, duration, needed_skill, capacity")
        .eq("org_id", orgId)
        .limit(1)
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

  const handleRemove = (id: string) => {
    setPendingList((prev) => prev.filter((v) => v.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const displayedList = subTab === "pending" ? pendingList : DUMMY_ACCEPTED;

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
        {/* Header */}
        <div className="card-header">
          <h1 className="event-title">Volunteer Opportunity Placeholder</h1>
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
            {/* Sub-tab bar — Pending first, Accepted second */}
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
              {isLoading && subTab === "pending" ? (
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
                          <button className="accept-btn" onClick={() => setSelectedVolunteer(v)}>
                            Accept
                          </button>
                          <button className="remove-btn" onClick={() => handleRemove(v.id)}>
                            Remove
                          </button>
                        </>
                      )}
                      {subTab === "accepted" && (
                        <button className="remove-btn" onClick={() => {/* wire up later */}}>
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
                  <button
                    className="logout-btn"
                    onClick={async () => {
                      // TODO: wire up to Supabase update once ready
                      // await supabase.from("listing").update({ ...listingInfo }).eq("org_id", orgId);
                      setListingSaved(true);
                      setTimeout(() => setListingSaved(false), 3000);
                    }}
                  >
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

            <div className="modal-footer">
              <button className="back-btn" onClick={() => setSelectedVolunteer(null)}>Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}