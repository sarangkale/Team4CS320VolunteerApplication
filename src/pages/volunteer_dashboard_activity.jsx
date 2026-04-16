import { useState } from "react";

const UPCOMING_EVENTS = [
  { id: 1, org: "Volunteer Org #1", date: "January 01, 2026   11:30 AM", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", hours: "XX hrs" },
  { id: 2, org: "Volunteer Org #2", date: "January 01, 2026   11:30 AM", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", hours: "XX hrs" },
  { id: 3, org: "Volunteer Org #3", date: "January 01, 2026   11:30 AM", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", hours: "XX hrs" },
];

const HISTORY_EVENTS = [...UPCOMING_EVENTS];
const TOTAL_HOURS = "XX";

function EventCard({ org, date, description, hours }) {
  return (
    <div className="bg-[#D9D9D9] rounded-[15px] px-5 py-4 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[18px] font-semibold">{org}</span>
        <span className="text-[17px] font-medium text-[#222]">{date}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-[15px] text-[#333] flex-1 leading-[1.5]">{description}</span>
        <span className="text-[18px] font-semibold whitespace-nowrap shrink-0">{hours}</span>
      </div>
    </div>
  );
}

export default function ActivityDashboard() {
  const [activeTab, setActiveTab] = useState("activity");
  const [overlay, setOverlay] = useState(null);

  const overlayInfo = {
    logout: { title: "Log Out", msg: "You would be logged out and redirected to the login page." },
    profile: { title: "My Profile", msg: "This would navigate to your profile page." },
    events: { title: "View All Events", msg: "This would navigate to the events listing page." },
  };

  return (
    <div className="bg-[#ebebeb] min-h-screen text-[#1a1a1a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* NAV */}
      <nav className="bg-[#D9D9D9] flex items-center px-8 h-[88px] gap-[14px] sticky top-0 z-[100] shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
        <div className="bg-[#485C11] text-white rounded-full w-[82px] h-[70px] flex items-center justify-center font-bold text-[18px] cursor-pointer shrink-0">
          logo
        </div>
        <span className="font-bold text-[21px] mr-auto">Website name</span>
        <button
          className="bg-white border-none rounded-full py-[13px] px-[26px] text-[16px] font-medium text-[#485C11] cursor-pointer"
          onClick={() => setOverlay("profile")}
        >My profile</button>
        <button
          className="bg-white border-none rounded-full py-[13px] px-[26px] text-[16px] font-medium text-[#485C11] cursor-pointer"
          onClick={() => setOverlay("events")}
        >View all events</button>
        <button
          className="bg-[#485C11] text-white border-none rounded-full py-[13px] px-[26px] text-[16px] font-medium cursor-pointer"
          onClick={() => setOverlay("logout")}
        >Log out</button>
      </nav>

      {/* MAIN */}
      <div className="max-w-[1140px] mx-auto px-6 pt-8 pb-[60px]">
        <h1 className="text-[40px] font-bold mb-[22px]">HELLO JOHN!</h1>

        {/* TABS */}
        <div className="bg-[#D9D9D9] rounded-full p-[6px] inline-flex gap-1 mb-7">
          {["profile", "activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-none rounded-full py-[10px] px-7 text-[16px] cursor-pointer capitalize transition-all duration-200 ${
                activeTab === tab
                  ? "bg-white font-medium shadow-[0_1px_4px_rgba(0,0,0,0.12)] text-[#1a1a1a]"
                  : "bg-transparent font-normal text-[#1a1a1a]"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* UPCOMING */}
        <div className="mb-7">
          <div className="bg-[#D9D9D9] rounded-[20px] p-3">
            <div className="bg-white rounded-[14px] px-7 pt-6 pb-7">
              <div className="flex items-center justify-between mb-[18px]">
                <span className="text-[28px] font-normal">Upcoming</span>
              </div>
              <div className="flex flex-col gap-[14px]">
                {UPCOMING_EVENTS.map((e) => <EventCard key={e.id} {...e} />)}
              </div>
            </div>
          </div>
        </div>

        {/* VOLUNTEER HISTORY */}
        <div className="mb-7">
          <div className="bg-[#D9D9D9] rounded-[20px] p-3">
            <div className="bg-white rounded-[14px] px-7 pt-6 pb-7">
              <div className="flex items-center justify-between mb-[18px]">
                <span className="text-[28px] font-normal">Volunteer History</span>
                <span className="text-[18px] font-normal text-[#333]">Total number of hours: {TOTAL_HOURS}</span>
              </div>
              <div className="flex flex-col gap-[14px]">
                {HISTORY_EVENTS.map((e) => <EventCard key={e.id} {...e} />)}
              </div>
            </div>
          </div>
        </div>
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
              className="bg-[#485C11] text-white border-none rounded-full py-3 px-[30px] text-[15px] font-medium cursor-pointer"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              onClick={() => setOverlay(null)}
            >Go back</button>
          </div>
        </div>
      )}
    </div>
  );
}