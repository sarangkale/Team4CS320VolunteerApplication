import { useState, useEffect } from "react";
import { getAccountProfile } from "../auth/auth"; // Adjust path as needed
import { supabase } from "../lib/supabase";
import "./application.css";

type Tab = "accepted" | "pending";

// Updated to hold all the profile data directly
interface Volunteer {
  id: string; // Changed to string to use email or profile UUID as a stable key
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
}

export default function VolunteerUI() {
  const [activeTab, setActiveTab] = useState<"volunteers" | "edit">("volunteers");
  const [subTab, setSubTab] = useState<Tab>("accepted");
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [list, setList] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrgListingsAndApplicants() {
      setIsLoading(true);

      // 1. Get the current organization's ID
      const accountResult = await getAccountProfile();
      if (accountResult.type === "error" || !accountResult.data?.profile) {
        console.error("Failed to authenticate or retrieve profile.");
        setIsLoading(false);
        return;
      }
      
      const profileData = accountResult.data.profile as any; // Cast as needed based on your auth types
      const orgId = profileData.org_id;

      if (!orgId) {
        console.error("No org_id found on the current user profile.");
        setIsLoading(false);
        return;
      }

      // 2. Fetch listings specifically for this organization
      const { data: listingsData, error: listingsError } = await supabase
        .from("listing")
        .select("applicants")
        .eq("org_id", orgId);

      console.log("1. The Org ID being searched:", orgId);
      console.log("2. The raw listings data returned:", listingsData);
      console.log("3. Any Supabase errors?", listingsError);

      if (listingsError || !listingsData) {
        console.error("Error fetching org listings:", listingsError);
        setIsLoading(false);
        return;
      }

      // 3. Extract and deduplicate all emails from the comma-separated strings
      const allEmails = new Set<string>();
      listingsData.forEach((listing) => {
        if (listing.applicants) {
          listing.applicants.split(",").forEach((email) => {
            const trimmed = email.trim();
            if (trimmed) allEmails.add(trimmed);
          });
        }
      });

      const emailArray = Array.from(allEmails);

      if (emailArray.length === 0) {
        setList([]);
        setIsLoading(false);
        return;
      }

      // 4. Query the profiles table for matching emails
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles") // Ensure this matches your exact table name
        .select("*")
        .in("email", emailArray);

      if (profilesError || !profilesData) {
        console.error("Error fetching profiles:", profilesError);
        setIsLoading(false);
        return;
      }

      // 5. Map the database profiles to the local Volunteer state
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

      setList(loadedVolunteers);
      setIsLoading(false);
    }

    fetchOrgListingsAndApplicants();
  }, []);

  const handleAccept = (v: Volunteer) => {
    setSelectedVolunteer(v);
  };

  const handleRemove = (id: string) => {
    setList((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="page-wrap">
      {/* Nav */}
      <nav className="nav">
        <div className="nav-left">
          <div className="logo">logo</div>
          <span className="site-name">Volunteering @ UMass</span>
        </div>
        <button className="logout-btn">Log out</button>
      </nav>

      {/* Main card */}
      <div className="main-card">
        {/* Header */}
        <div className="card-header">
          <h1 className="event-title">Volunteer Opportunity Placeholder</h1>
          <button className="back-btn">Back</button>
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

        {/* Sub-tab bar */}
        <div className="sub-tab-bar">
          <button
            className={`sub-tab ${subTab === "accepted" ? "sub-tab-active" : ""}`}
            onClick={() => setSubTab("accepted")}
          >
            Accepted
          </button>
          <button
            className={`sub-tab ${subTab === "pending" ? "sub-tab-active" : ""}`}
            onClick={() => setSubTab("pending")}
          >
            Pending
          </button>
        </div>

        {/* Volunteer list */}
        <div className="list-area">
          {isLoading ? (
            <div style={{ padding: "12px 18px" }}>Loading applicants...</div>
          ) : list.length === 0 ? (
             <div style={{ padding: "12px 18px" }}>No applicants yet.</div>
          ) : (
            list.map((v) => (
              <div key={v.id} className="volunteer-row">
                <span 
                  className="volunteer-name" 
                  onClick={() => handleAccept(v)}
                >
                  {v.name}
                </span>
                <div className="row-actions">
                  <button className="accept-btn" onClick={() => handleAccept(v)}>Accept</button>
                  <button className="remove-btn" onClick={() => handleRemove(v.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Applicant modal overlay */}
      {selectedVolunteer && (
        <div className="modal-overlay" onClick={() => setSelectedVolunteer(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{selectedVolunteer.name}</h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullNameInput" className="label">
                  Full Name <span className="req">*</span>
                </label>
                <input id="fullNameInput" className="input" defaultValue={selectedVolunteer.name} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="emailInput" className="label">
                  Email <span className="req">*</span>
                </label>
                <input id="emailInput" className="input" defaultValue={selectedVolunteer.email} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="phoneInput" className="label">
                  Phone Number <span className="req">*</span>
                </label>
                <input id="phoneInput" className="input" defaultValue={selectedVolunteer.phone} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="locationInput" className="label">
                  Location <span className="req">*</span>
                </label>
                <input id="locationInput" className="input" defaultValue={selectedVolunteer.location} readOnly />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 8 }}>
              <label htmlFor="bioInput" className="label">Bio</label>
              <textarea id="bioInput" className="textarea" defaultValue={selectedVolunteer.bio} readOnly />
            </div>

            <div style={{ marginTop: 12 }}>
              <label className="label">Skills</label>
              <div className="skills-row">
                {selectedVolunteer.skills.map((s, i) => (
                  <span key={i} className="skill-chip">{s}</span>
                ))}
                <button className="add-skill-btn">+ Skill</button>
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