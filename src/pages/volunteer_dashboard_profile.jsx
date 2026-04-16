import { useState, useRef } from "react";
import { useNavigate } from "react-router";

const INITIAL_SKILLS = ["React", "Design", "Python", "Writing"];

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [overlay, setOverlay] = useState(null);
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [skillInput, setSkillInput] = useState("");
  const [showSkillInput, setShowSkillInput] = useState(false);
  const skillInputRef = useRef(null);

  const [form, setForm] = useState({
    fullName: "John Smith",
    email: "User@email.com",
    phone: "(999)-999-999",
    location: "Amherst, MA",
    bio: "",
  });

  const overlayInfo = {
    logout: { title: "Log Out", navigate: () => navigate("/login") },
    profile: { title: "My Profile", navigate: () => navigate("/volunteer_dashboard/profile") },
    events: { title: "View All Events", navigate: () => navigate("/volunteer_dashboard/events") },
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

  const removeSkill = (skill) => setSkills((prev) => prev.filter((s) => s !== skill));

  const openSkillInput = () => {
    setShowSkillInput(true);
    setTimeout(() => skillInputRef.current?.focus(), 50);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --green-dark: #485C11;
          --green-mid: #8E9B77;
          --green-light: #c5d09c;
          --gray-bg: #D9D9D9;
          --white: #ffffff;
          --text: #1a1a1a;
          --text-light: #666;
          --red: #FF0000;
          --pill: 9999px;
        }
        body { font-family: 'DM Sans', sans-serif; background: #ebebeb; min-height: 100vh; color: var(--text); }

        .nav {
          background: var(--gray-bg);
          display: flex;
          align-items: center;
          padding: 0 32px;
          height: 88px;
          gap: 14px;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        }
        .nav-logo {
          background: var(--green-dark);
          color: white;
          border-radius: var(--pill);
          width: 82px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          cursor: pointer;
          flex-shrink: 0;
          transition: opacity 0.2s;
        }
        .nav-logo:hover { opacity: 0.85; }
        .nav-site-name { font-weight: 700; font-size: 21px; margin-right: auto; }
        .nav-btn {
          background: white;
          border: none;
          border-radius: var(--pill);
          padding: 13px 26px;
          font-size: 16px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          color: var(--green-dark);
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .nav-btn:hover { background: var(--green-light); transform: translateY(-1px); }
        .nav-btn-logout {
          background: var(--green-dark);
          color: white;
          border: none;
          border-radius: var(--pill);
          padding: 13px 26px;
          font-size: 16px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .nav-btn-logout:hover { background: #3a4c0d; transform: translateY(-1px); }

        .main { max-width: 1140px; margin: 0 auto; padding: 36px 24px 60px; }
        .greeting { font-size: 40px; font-weight: 700; margin-bottom: 24px; }

        .tab-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 26px; }
        .tabs { background: var(--gray-bg); border-radius: var(--pill); padding: 6px; display: inline-flex; gap: 4px; }
        .tab-btn {
          background: transparent;
          border: none;
          border-radius: var(--pill);
          padding: 10px 28px;
          font-size: 16px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          cursor: pointer;
          transition: background 0.2s;
          color: var(--text);
        }
        .tab-btn.active { background: white; font-weight: 500; box-shadow: 0 1px 4px rgba(0,0,0,0.12); }
        .tab-btn:not(.active):hover { background: rgba(255,255,255,0.55); }

        .edit-btn {
          background: var(--gray-bg);
          border: none;
          border-radius: var(--pill);
          padding: 10px 34px;
          font-size: 16px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s;
        }
        .edit-btn:hover { background: #c2c2c2; }

        .card-wrapper { background: var(--gray-bg); border-radius: 20px; padding: 12px; }
        .card { background: white; border-radius: 14px; padding: 30px 34px 34px; }
        .card-title { font-size: 22px; font-weight: 600; margin-bottom: 4px; }
        .card-subtitle { font-size: 14px; font-weight: 300; color: var(--text-light); margin-bottom: 28px; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px 44px; }
        .field { display: flex; flex-direction: column; gap: 7px; }
        .field.full { grid-column: 1 / -1; }
        label { font-size: 15px; font-weight: 400; display: flex; align-items: center; gap: 3px; }
        label .req { color: var(--red); }
        input[type="text"], input[type="email"], input[type="tel"], textarea {
          background: var(--gray-bg);
          border: none;
          border-radius: 6px;
          padding: 9px 13px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          outline: none;
          width: 100%;
          transition: box-shadow 0.2s, background 0.2s;
        }
        input:focus, textarea:focus { background: #e2e2e2; box-shadow: 0 0 0 2px var(--green-mid); }
        textarea { resize: vertical; min-height: 50px; height: 50px; }

        .skills-section { margin-top: 26px; }
        .skills-label { font-size: 15px; margin-bottom: 10px; }
        .skills-container { display: flex; flex-wrap: wrap; gap: 9px; align-items: center; }
        .skill-tag {
          background: var(--green-mid);
          color: white;
          border-radius: var(--pill);
          padding: 5px 13px;
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .remove-skill {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 15px;
          line-height: 1;
          padding: 0;
          opacity: 0.7;
          transition: opacity 0.15s;
        }
        .remove-skill:hover { opacity: 1; }
        .skill-add-btn {
          background: var(--gray-bg);
          border: none;
          border-radius: var(--pill);
          padding: 5px 16px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          color: var(--text);
          transition: background 0.2s;
        }
        .skill-add-btn:hover { background: #c6c6c6; }
        .skill-mini-input {
          width: 140px;
          padding: 5px 11px !important;
          font-size: 13px !important;
          height: auto !important;
        }

        .activity-placeholder { text-align: center; padding: 60px 24px; color: var(--text-light); }
        .activity-placeholder h3 { font-size: 20px; font-weight: 600; margin-bottom: 8px; }

        .overlay-bg {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.42);
          z-index: 200;
          display: flex; align-items: center; justify-content: center;
        }
        .overlay-card {
          background: white;
          border-radius: 20px;
          padding: 44px 52px;
          text-align: center;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 8px 40px rgba(0,0,0,0.2);
        }
        .overlay-card h2 { font-size: 24px; font-weight: 700; margin-bottom: 10px; }
        .overlay-card p { color: var(--text-light); margin-bottom: 26px; font-size: 15px; }
        .overlay-close {
          background: var(--green-dark);
          color: white;
          border: none;
          border-radius: var(--pill);
          padding: 12px 30px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .overlay-close:hover { background: #3a4c0d; }
      `}</style>

      <nav className="nav">
        <div className="nav-logo">logo</div>
        <span className="nav-site-name">Website name</span>
        <button className="nav-btn" onClick={() => navigate("/volunteer_dashboard/profile")}>My profile</button>
        <button className="nav-btn" onClick={() => navigate("/volunteer_dashboard/events")}>View all events</button>
        <button className="nav-btn-logout" onClick={() => navigate("/login")}>Log out</button>
      </nav>

      <div className="main">
        <h1 className="greeting">HELLO JOHN!</h1>

        <div className="tab-row">
          <div className="tabs">
            <button
              className={`tab-btn${activeTab === "profile" ? " active" : ""}`}
              onClick={() => navigate("/volunteer_dashboard/profile")}
            >Profile</button>
            <button
              className={`tab-btn${activeTab === "activity" ? " active" : ""}`}
              onClick={() => navigate("/volunteer_dashboard/activity")}
            >Activity</button>
          </div>
          <button className="edit-btn">Edit</button>
        </div>

        {activeTab === "profile" && (
          <div className="card-wrapper">
            <div className="card">
              <div className="card-title">Account Information</div>
              <div className="card-subtitle">Manage your Account profile</div>

              <div className="form-grid">
                <div className="field">
                  <label>Full Name <span className="req">*</span></label>
                  <input type="text" name="fullName" value={form.fullName} onChange={handleFormChange} placeholder="John Smith" />
                </div>
                <div className="field">
                  <label>Email <span className="req">*</span></label>
                  <input type="email" name="email" value={form.email} onChange={handleFormChange} placeholder="user@email.com" />
                </div>
                <div className="field">
                  <label>Phone Number <span className="req">*</span></label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleFormChange} placeholder="(999)-999-9999" />
                </div>
                <div className="field">
                  <label>Location <span className="req">*</span></label>
                  <input type="text" name="location" value={form.location} onChange={handleFormChange} placeholder="City, State" />
                </div>
                <div className="field full">
                  <label>Bio</label>
                  <textarea name="bio" value={form.bio} onChange={handleFormChange} placeholder="Tell us about yourself..." />
                </div>
              </div>

              <div className="skills-section">
                <div className="skills-label">Skills</div>
                <div className="skills-container">
                  {skills.map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                      <button className="remove-skill" onClick={() => removeSkill(skill)} title="Remove">×</button>
                    </span>
                  ))}
                  {showSkillInput && (
                    <input
                      ref={skillInputRef}
                      type="text"
                      className="skill-mini-input"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      placeholder="e.g. Cooking"
                    />
                  )}
                  {!showSkillInput && (
                    <button className="skill-add-btn" onClick={openSkillInput}>+ Skill</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="card-wrapper">
            <div className="card">
              <div className="activity-placeholder">
                <h3>No activity yet</h3>
                <p>Your event history and volunteer hours will appear here.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {overlay && (
        <div className="overlay-bg" onClick={(e) => { if (e.target === e.currentTarget) setOverlay(null); }}>
          <div className="overlay-card">
            <h2>{overlayInfo[overlay]?.title}</h2>
            <p>{overlayInfo[overlay]?.msg}</p>
            <button className="overlay-close" onClick={() => setOverlay(null)}>Go back</button>
          </div>
        </div>
      )}
    </>
  );
}
