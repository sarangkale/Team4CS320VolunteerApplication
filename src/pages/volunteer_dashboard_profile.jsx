import { useState, useRef } from "react";

const INITIAL_SKILLS = ["React", "Design", "Python", "Writing"];

export default function VolunteerDashboard() {
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
    logout: { title: "Log Out", msg: "You would be logged out and redirected to the login page." },
    profile: { title: "My Profile", msg: "This would navigate to your public profile page." },
    events: { title: "View All Events", msg: "This would navigate to the events listing page." },
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

  const inputCls = "bg-[#D9D9D9] border-none rounded-[6px] py-[9px] px-[13px] text-[15px] text-[#1a1a1a] outline-none w-full focus:bg-[#e2e2e2] focus:ring-2 focus:ring-[#8E9B77] transition-all duration-200";

  return (
    <div className="bg-[#ebebeb] min-h-screen text-[#1a1a1a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* NAV */}
      <nav className="bg-[#D9D9D9] flex items-center px-8 h-[88px] gap-[14px] sticky top-0 z-[100] shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
        <div className="bg-[#485C11] text-white rounded-full w-[82px] h-[70px] flex items-center justify-center font-bold text-[18px] cursor-pointer shrink-0 hover:opacity-85 transition-opacity duration-200">
          logo
        </div>
        <span className="font-bold text-[21px] mr-auto">Website name</span>
        <button
          className="bg-white border-none rounded-full py-[13px] px-[26px] text-[16px] font-medium text-[#485C11] cursor-pointer hover:bg-[#c5d09c] hover:-translate-y-px transition-all duration-200"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          onClick={() => setOverlay("profile")}
        >My profile</button>
        <button
          className="bg-white border-none rounded-full py-[13px] px-[26px] text-[16px] font-medium text-[#485C11] cursor-pointer hover:bg-[#c5d09c] hover:-translate-y-px transition-all duration-200"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          onClick={() => setOverlay("events")}
        >View all events</button>
        <button
          className="bg-[#485C11] text-white border-none rounded-full py-[13px] px-[26px] text-[16px] font-medium cursor-pointer hover:bg-[#3a4c0d] hover:-translate-y-px transition-all duration-200"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          onClick={() => setOverlay("logout")}
        >Log out</button>
      </nav>

      {/* MAIN */}
      <div className="max-w-[1140px] mr-auto px-6 pt-9 pb-[60px]">
        <h1 className="text-[40px] font-bold mb-6">HELLO JOHN!</h1>

        {/* TAB ROW */}
        <div className="flex items-center justify-between mb-[26px]">
          <div className="bg-[#D9D9D9] rounded-full p-[6px] inline-flex gap-1">
            {["profile", "activity"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-none rounded-full py-[10px] px-7 text-[16px] cursor-pointer capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white font-medium shadow-[0_1px_4px_rgba(0,0,0,0.12)] text-[#1a1a1a]"
                    : "bg-transparent font-normal text-[#1a1a1a] hover:bg-white/55"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <button
            className="bg-[#D9D9D9] border-none rounded-full py-[10px] px-[34px] text-[16px] cursor-pointer hover:bg-[#c2c2c2] transition-colors duration-200"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >Edit</button>
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="bg-[#D9D9D9] rounded-[20px] p-3">
            <div className="bg-white rounded-[14px] px-[34px] pt-[30px] pb-[34px]">
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
                      className="bg-[#8E9B77] text-white rounded-full py-[5px] px-[13px] text-[13px] font-medium flex items-center gap-[7px]"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        title="Remove"
                        className="bg-none border-none text-white cursor-pointer text-[15px] leading-none p-0 opacity-70 hover:opacity-100 transition-opacity duration-150"
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
                      className="w-[140px] bg-[#D9D9D9] border-none rounded-[6px] py-[5px] px-[11px] text-[13px] text-[#1a1a1a] outline-none focus:bg-[#e2e2e2] focus:ring-2 focus:ring-[#8E9B77]"
                    />
                  )}
                  {!showSkillInput && (
                    <button
                      onClick={openSkillInput}
                      className="bg-[#D9D9D9] border-none rounded-full py-[5px] px-4 text-[14px] cursor-pointer text-[#1a1a1a] hover:bg-[#c6c6c6] transition-colors duration-200"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >+ Skill</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === "activity" && (
          <div className="bg-[#D9D9D9] rounded-[20px] p-3">
            <div className="bg-white rounded-[14px] px-[34px] pt-[30px] pb-[34px]">
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
          <div className="bg-white rounded-[20px] py-11 px-[52px] text-center max-w-[400px] w-[90%] shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
            <h2 className="text-[24px] font-bold mb-2.5">{overlayInfo[overlay]?.title}</h2>
            <p className="text-[#666] mb-[26px] text-[15px]">{overlayInfo[overlay]?.msg}</p>
            <button
              className="bg-[#485C11] text-white border-none rounded-full py-3 px-[30px] text-[15px] font-medium cursor-pointer hover:bg-[#3a4c0d] transition-colors duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              onClick={() => setOverlay(null)}
            >Go back</button>
          </div>
        </div>
      )}
    </div>
  );
}