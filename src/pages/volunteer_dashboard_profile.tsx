import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { UserProfile } from "../../shared/types";
import { getAccountProfile } from "../auth/auth";
import { updateVolunteerProfile } from "../lib/profiles";

export default function VolunteerDashboard() {
    const navigate = useNavigate();
    const [activeTab, _setActiveTab] = useState("profile");

    const [form, setForm] = useState<UserProfile | null>(null);

    const handleFormChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLTextAreaElement | HTMLInputElement, HTMLTextAreaElement | HTMLTextAreaElement | HTMLInputElement>) => {
        setForm((prev) => { if (prev) { return ({ ...prev, [e.target.name]: e.target.name === "graduation_year" ? Number(e.target.value) : e.target.value }) } else { return prev } });
    };

    useEffect(() => {
        getAccountProfile().then(profileRes => {
            if (profileRes.type === "success") {
                setForm(profileRes.data.profile as UserProfile);
            }
        })
    }, [])

    const inputCls = "bg-[#D9D9D9] border-none rounded-[6px] py-[9px] px-[13px] text-[15px] text-[#1a1a1a] outline-none w-full focus:bg-[#e2e2e2] focus:ring-2 focus:ring-[#8E9B77] transition-all duration-200";

    return (
        <div className="bg-[#ebebeb] min-h-screen text-[#1a1a1a] font-['DM_Sans',sans-serif]">
            <nav className="bg-[#D9D9D9] flex items-center px-8 h-[88px] gap-3 sticky top-0 z-50 shadow-md">
                <img 
                    className="bg-primary rounded-full w-[80px] h-[80px] flex items-center justify-center"
                    src='/Logo_zoomed.png'
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
                <h1 className="text-[40px] font-bold mb-1">Hello, {form?.first_name}</h1>
                <p className="text-gray-600 mb-6">Manage your account information below</p>

                <div className="flex items-center justify-between mb-4">
                    <div className="bg-[#D9D9D9] rounded-full p-1 inline-flex gap-1">
                        <button
                            className={`px-7 py-2 rounded-full text-[16px] border-none cursor-pointer font-['DM_Sans',sans-serif] transition-all duration-200 ${activeTab === "profile" ? "bg-white shadow-md font-medium text-[#1a1a1a]" : "bg-transparent text-[#1a1a1a]"
                                }`}
                            onClick={() => navigate("/volunteer_dashboard/profile")}
                        >Profile</button>
                        <button
                            className={`px-7 py-2 rounded-full text-[16px] border-none cursor-pointer font-['DM_Sans',sans-serif] transition-all duration-200 ${activeTab === "activity" ? "bg-white shadow-md font-medium text-[#1a1a1a]" : "bg-transparent text-[#1a1a1a]"
                                }`}
                            onClick={() => navigate("/volunteer_dashboard/activity")}
                        >Activity</button>
                    </div>
                    <button
                        className="bg-[#D9D9D9] border-none rounded-full py-[10px] px-[34px] text-[16px] cursor-pointer hover:bg-[#c2c2c2] transition-colors duration-200 font-['DM_Sans',sans-serif]"
                        onClick={async () => updateVolunteerProfile(
                            form?.bio || "",
                            form?.first_name || "",
                            form?.last_name || "",
                            form?.school || "",
                            form?.major || "",
                            form?.graduation_year || 0,
                            form?.phone || "",
                            form?.user_id!
                        )}
                    >Save Profile</button>
                </div>

                {activeTab === "profile" && (
                    <div className="bg-[#D9D9D9] rounded-[20px] p-3">
                        <div className="bg-white rounded-[14px] px-[34px] pt-[30px] pb-[34px]">


                            <div className="grid grid-cols-2 gap-x-11 gap-y-[22px]">
                                <div className="flex flex-col gap-[7px]">
                                    <label className="text-[15px] font-normal flex items-center gap-[3px]">
                                        First Name<span className="text-red-600">*</span>
                                    </label>
                                    <input type="text" name="first_name" value={form?.first_name || ""} onChange={handleFormChange} placeholder="John Smith" className={inputCls} />
                                </div>
                                <div className="flex flex-col gap-[7px]">
                                    <label className="text-[15px] font-normal flex items-center gap-[3px]">
                                        Last Name<span className="text-red-600">*</span>
                                    </label>
                                    <input type="text" name="last_name" value={form?.last_name || ""} onChange={handleFormChange} placeholder="user@email.com" className={inputCls} />
                                </div>
                                <div className="flex flex-col gap-[7px]">
                                    <label className="text-[15px] font-normal flex items-center gap-[3px]">
                                        School<span className="text-red-600">*</span>
                                    </label>
                                    <input type="text" name="school" value={form?.school || ""} onChange={handleFormChange} placeholder="(999)-999-9999" className={inputCls} />
                                </div>
                                <div className="flex flex-col gap-[7px]">
                                    <label className="text-[15px] font-normal flex items-center gap-[3px]">
                                        Major<span className="text-red-600">*</span>
                                    </label>
                                    <input type="text" name="major" value={form?.major || ""} onChange={handleFormChange} placeholder="City, State" className={inputCls} />
                                </div>
                                <div className="flex flex-col gap-[7px]">
                                    <label className="text-[15px] font-normal flex items-center gap-[3px]">
                                        Graduation Year<span className="text-red-600">*</span>
                                    </label>
                                    <input type="number" name="graduation_year" value={form?.graduation_year || 0} onChange={handleFormChange} placeholder="City, State" className={inputCls} />
                                </div>
                                <div className="flex flex-col gap-[7px]">
                                    <label className="text-[15px] font-normal flex items-center gap-[3px]">
                                        Phone<span className="text-red-600">*</span>
                                    </label>
                                    <input type="tel" name="phone" value={form?.phone || ""} onChange={handleFormChange} placeholder="(000)-000-0000" className={inputCls} />
                                </div>
                                <div className="flex flex-col gap-[7px] col-span-full">
                                    <label className="text-[15px] font-normal">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={form?.bio || ""}
                                        onChange={handleFormChange}
                                        placeholder="Tell us about yourself..."
                                        className={`${inputCls} resize-y min-h-[50px] h-[50px]`}
                                    />
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
