import { useState, useRef } from "react";
import { useNavigate } from "react-router";

const INITIAL_SKILLS = ["React", "Design", "Python", "Writing"];

export default function VolunteerDashboard() {
    const navigate = useNavigate();
    const [activeTab, _setActiveTab] = useState("profile");
    const [skills, setSkills] = useState(INITIAL_SKILLS);
    const [skillInput, setSkillInput] = useState("");
    const [showSkillInput, setShowSkillInput] = useState(false);
    const skillInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        fullName: "John Smith",
        email: "User@email.com",
        phone: "(999)-999-999",
        location: "Amherst, MA",
        bio: "",
    });

    const handleFormChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLTextAreaElement | HTMLInputElement, HTMLTextAreaElement | HTMLTextAreaElement | HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

    const removeSkill = (skill: string) => setSkills((prev) => prev.filter((s) => s !== skill));

    const openSkillInput = () => {
        setShowSkillInput(true);
        setTimeout(() => skillInputRef.current?.focus(), 50);
    };

    const inputCls = "bg-[#D9D9D9] border-none rounded-[6px] py-[9px] px-[13px] text-[15px] text-[#1a1a1a] outline-none w-full focus:bg-[#e2e2e2] focus:ring-2 focus:ring-[#8E9B77] transition-all duration-200";

    return (
        <div className="bg-[#ebebeb] min-h-screen text-[#1a1a1a] font-['DM_Sans',sans-serif]">
          <nav className="bg-[#D9D9D9] flex items-center px-8 h-[88px] gap-3 sticky top-0 z-50 shadow-md">
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
          <div className="max-w-[1140px] mx-auto px-6 pt-9 pb-[60px]">
            <h1 className="text-[40px] font-bold mb-1">Hello John</h1>
              <p className="text-gray-600 mb-6">Manage your account information below</p>

            <div className="flex items-center justify-between mb-4">
              <div className="bg-[#D9D9D9] rounded-full p-1 inline-flex gap-1">
                <button
                  className={`px-7 py-2 rounded-full text-[16px] border-none cursor-pointer font-['DM_Sans',sans-serif] transition-all duration-200 ${
                    activeTab === "profile" ? "bg-white shadow-md font-medium text-[#1a1a1a]" : "bg-transparent text-[#1a1a1a]"
                  }`}
                  onClick={() => navigate("/volunteer_dashboard/profile")}
                >Profile</button>
                <button
                  className={`px-7 py-2 rounded-full text-[16px] border-none cursor-pointer font-['DM_Sans',sans-serif] transition-all duration-200 ${
                    activeTab === "activity" ? "bg-white shadow-md font-medium text-[#1a1a1a]" : "bg-transparent text-[#1a1a1a]"
                  }`}
                  onClick={() => navigate("/volunteer_dashboard/activity")}
                >Activity</button>
              </div>
              <button
                className="bg-[#D9D9D9] border-none rounded-full py-[10px] px-[34px] text-[16px] cursor-pointer hover:bg-[#c2c2c2] transition-colors duration-200 font-['DM_Sans',sans-serif]"
              >Edit</button>
            </div>

            {activeTab === "profile" && (
              <div className="bg-[#D9D9D9] rounded-[20px] p-3">
                <div className="bg-white rounded-[14px] px-[34px] pt-[30px] pb-[34px]">
                  

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
                          className="w-[140px] bg-[#D9D9D9] border-none rounded-[6px] py-[5px] px-[11px] text-[13px] text-[#1a1a1a] outline-none focus:bg-[#e2e2e2] focus:ring-2 focus:ring-[#8E9B77]"
                        />
                      )}
                      {!showSkillInput && (
                        <button
                          onClick={openSkillInput}
                          className="bg-[#D9D9D9] border-none rounded-full py-[5px] px-4 text-[14px] cursor-pointer text-[#1a1a1a] hover:bg-[#c6c6c6] transition-colors duration-200 font-['DM_Sans',sans-serif]"
                        >+ Skill</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

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
        </div>
    );
}
