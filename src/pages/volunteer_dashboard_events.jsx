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

  const handleFormChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      const val = skillInput.trim();
      if (val && !skills.includes(val)) setSkills((prev) => [...prev, val]);
      setSkillInput(""); setShowSkillInput(false);
    } else if (e.key === "Escape") {
      setSkillInput(""); setShowSkillInput(false);
    }
  };

  const removeSkill = (skill) => setSkills((prev) => prev.filter((s) => s !== skill));
  const openSkillInput = () => { setShowSkillInput(true); setTimeout(() => skillInputRef.current?.focus(), 50); };

  const inputCls = "bg-surface border-none rounded-[6px] py-[9px] px-[13px] text-[15px] text-[#1a1a1a] outline-none w-full focus:bg-surface-focus focus:ring-2 focus:ring-badge transition-all duration-200";

  return (
    <div className="bg-page min-h-screen text-[#1a1a1a] font-sans">
      <nav className="bg-surface flex items-center px-8 h-nav gap-3 sticky top-0 z-50 shadow-md">
        <div className="bg-primary text-white rounded-full w-[82px] h-[70px] flex items-center justify-center font-bold text-[18px]">
          logo
        </div>
        <span className="font-bold text-[21px] mr-auto">Website name</span>
        <button
          className="bg-white text-primary rounded-full px-6 py-3 font-medium border-none cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          onClick={() => navigate("/volunteer_dashboard/profile")}
        >My profile</button>
        <button
          className="bg-white text-primary rounded-full px-6 py-3 font-medium border-none cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          onClick={() => navigate("/volunteer_dashboard/events")}
        >View all events</button>
        <button
          className="bg-primary text-white rounded-full px-6 py-3 font-medium border-none cursor-pointer hover:bg-primary-dark transition-colors duration-200"
          onClick={() => navigate("/login")}
        >Log out</button>
      </nav>

      {/* MAIN */}
      <div className="max-w-content mr-auto px-6 pt-9 pb-[60px]">
        <h1 className="text-[40px] font-bold mb-6">HELLO JOHN!</h1>

        <div className="flex items-center justify-between mb-4">
          <div className="bg-surface rounded-full p-1 inline-flex gap-1">
            <button
              className={`px-7 py-2 rounded-full text-[16px] border-none cursor-pointer transition-all duration-200 ${
                activeTab === "profile" ? "bg-white shadow-md font-medium text-[#1a1a1a]" : "bg-transparent text-[#1a1a1a]"
              }`}
              onClick={() => navigate("/volunteer_dashboard/profile")}
            >Profile</button>
            <button
              className={`px-7 py-2 rounded-full text-[16px] border-none cursor-pointer transition-all duration-200 ${
                activeTab === "activity" ? "bg-white shadow-md font-medium text-[#1a1a1a]" : "bg-transparent text-[#1a1a1a]"
              }`}
              onClick={() => navigate("/volunteer_dashboard/activity")}
            >Activity</button>
          </div>
          <button
            className="bg-surface border-none rounded-full py-[10px] px-[34px] text-[16px] cursor-pointer hover:bg-surface-dark transition-colors duration-200"
          >Edit</button>
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="bg-surface rounded-card p-3">
            <div className="bg-white rounded-inner px-[34px] pt-[30px] pb-[34px]">
              <div className="text-[22px] font-semibold mb-1">Account Information</div>
              <div className="text-[14px] font-light text-[#666] mb-7">Manage your Account profile</div>

              <div className="grid grid-cols-2 gap-x-11 gap-y-[22px]">
                <div className="flex flex-col gap-[7px]">
                  <label className="text-[15px] font-normal flex items-center gap-[3px]">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input type="text" name="fullName" value={form.fullName} onChange={handleFormChange} placeholder="John Smith" className={inputCls} />
                </div>
                <div className="flex flex-col gap-[7px]">
                  <label className="text-[15px] font-normal flex items-center gap-[3px]">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input type="email" name="email" value={form.email} onChange={handleFormChange} placeholder="user@email.com" className={inputCls} />
                </div>
                <div className="flex flex-col gap-[7px]">
                  <label className="text-[15px] font-normal flex items-center gap-[3px]">
                    Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleFormChange} placeholder="(999)-999-9999" className={inputCls} />
                </div>
                <div className="flex flex-col gap-[7px]">
                  <label className="text-[15px] font-normal flex items-center gap-[3px]">
                    Location <span className="text-red-600">*</span>
                  </label>
                  <input type="text" name="location" value={form.location} onChange={handleFormChange} placeholder="City, State" className={inputCls} />
                </div>
                <div className="flex flex-col gap-[7px] col-span-full">
                  <label className="text-[15px] font-normal">Bio</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleFormChange}
                    placeholder="Tell us about yourself..."
                    className={`${inputCls} resize-y min-h-[50px] h-[50px]`}
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="mt-[26px]">
                <div className="text-[15px] mb-2.5">Skills</div>
                <div className="flex flex-wrap gap-[9px] items-center">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-badge text-white rounded-full py-[5px] px-[13px] text-[13px] font-medium flex items-center gap-[7px]"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        title="Remove"
                        className="bg-transparent border-none text-white cursor-pointer text-[15px] leading-none p-0 opacity-70 hover:opacity-100 transition-opacity duration-150"
                      >×</button>
                    </span>
                  ))}
                  {showSkillInput && (
                    <input
                      ref={skillInputRef}
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      placeholder="e.g. Cooking"
                      className="w-[140px] bg-surface border-none rounded-[6px] py-[5px] px-[11px] text-[13px] text-[#1a1a1a] outline-none focus:bg-surface-focus focus:ring-2 focus:ring-badge"
                    />
                  )}
                  {!showSkillInput && (
                    <button
                      onClick={openSkillInput}
                      className="bg-surface border-none rounded-full py-[5px] px-4 text-[14px] cursor-pointer text-[#1a1a1a] hover:bg-surface-darker transition-colors duration-200"
                    >+ Skill</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === "activity" && (
          <div className="bg-surface rounded-card p-3">
            <div className="bg-white rounded-inner px-[34px] pt-[30px] pb-[34px]">
              <div className="text-center py-[60px] px-6 text-[#666]">
                <h3 className="text-[20px] font-semibold mb-2">No activity yet</h3>
                <p>Your event history and volunteer hours will appear here.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* OVERLAY */}
      {overlay && (
        <div
          className="fixed inset-0 bg-black/[0.42] z-[200] flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) setOverlay(null); }}
        >
          <div className="bg-white rounded-card py-11 px-[52px] text-center max-w-[400px] w-[90%] shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
            <h2 className="text-[24px] font-bold mb-2.5">{overlayInfo[overlay]?.title}</h2>
            <p className="text-[#666] mb-[26px] text-[15px]">{overlayInfo[overlay]?.msg}</p>
            <button
              className="bg-primary text-white border-none rounded-full py-3 px-[30px] text-[15px] font-medium cursor-pointer hover:bg-primary-dark transition-colors duration-200"
              onClick={() => setOverlay(null)}
            >Go back</button>
          </div>
        </div>
      )}
    </div>
  );
}