import { useState } from "react";
import { useNavigate } from "react-router";

// these are all fillers and should be taken from whatever applicant table that exists
const INITIAL_PENDING = [
  {
    id: 1,
    name: "John Smith",
    email: "john@email.com",
    phone: "(999)-999-9999",
    location: "Amherst, MA",
    bio: "Passionate about community service and environmental sustainability.",
    skills: ["Teamwork", "Leadership", "Outreach", "Planning"],
  },
  {
    id: 2,
    name: "Maya Patel",
    email: "maya@email.com",
    phone: "(888)-555-1234",
    location: "Northampton, MA",
    bio: "Graduate student with experience in nonprofit coordination.",
    skills: ["Communication", "Research", "Fundraising"],
  },
  {
    id: 3,
    name: "Carlos Rivera",
    email: "carlos@email.com",
    phone: "(777)-333-4567",
    location: "Springfield, MA",
    bio: "Experienced volunteer with a background in event management.",
    skills: ["Events", "Logistics", "Design", "Social Media"],
  },
];

const INITIAL_ACCEPTED = [];

// Read-only info field with pill shape
const InfoField = ({ label, value, required }) => (
  <div>
    <label className="text-[13px] font-medium text-gray-900 block mb-[5px]">
      {label}{required && <span className="text-[#bd0303] ml-0.5">*</span>}
    </label>
    <div className="bg-surface rounded-full px-4 py-[7px] text-sm text-[#333] min-h-[34px] flex items-center">
      {value || <span className="text-[#999]">—</span>}
    </div>
  </div>
);

// Applicant detail modal
function ApplicantModal({ volunteer, onClose }) {
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
        {/* Title */}
        <h2 className="text-[22px] font-extrabold m-0 mb-6 tracking-[-0.5px] text-gray-900">
          {volunteer.name}
        </h2>

        {/* 2-column grid */}
        <div className="grid grid-cols-2 gap-x-7 gap-y-4 mb-4">
          <InfoField label="Full Name" value={volunteer.name} required />
          <InfoField label="Email" value={volunteer.email} required />
          <InfoField label="Phone Number" value={volunteer.phone} required />
          <InfoField label="Location" value={volunteer.location} required />
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
            {volunteer.skills && volunteer.skills.map((skill, i) => (
              <span
                key={i}
                className="bg-olive-medium text-white rounded-full px-[18px] py-[5px] text-[13px] font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Back button */}
        <div className="flex justify-end">
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

export default function OrganizationEventView() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("volunteers");
  const [activeSubTab, setActiveSubTab] = useState("pending");
  const [pendingList, setPendingList] = useState(INITIAL_PENDING);
  const [acceptedList, setAcceptedList] = useState(INITIAL_ACCEPTED);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const handleAccept = (id) => {
    const volunteer = pendingList.find((v) => v.id === id);
    if (volunteer) {
      setPendingList((prev) => prev.filter((v) => v.id !== id));
      setAcceptedList((prev) => [...prev, volunteer]);
    }
  };

  const handleRemovePending = (id) => {
    setPendingList((prev) => prev.filter((v) => v.id !== id));
  };

  const handleRemoveAccepted = (id) => {
    setAcceptedList((prev) => prev.filter((v) => v.id !== id));
  };

  const currentList = activeSubTab === "pending" ? pendingList : acceptedList;

  return (
    <div className="font-sans min-h-screen bg-page-alt">

      {/* Applicant detail modal */}
      <ApplicantModal
        volunteer={selectedVolunteer}
        onClose={() => setSelectedVolunteer(null)}
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

        {/* Title row */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[34px] font-extrabold m-0 tracking-[-1px]">
            Volunteer Opportunity Name
          </h1>
          <button
            className="bg-surface border-none rounded-full px-7 py-2.5 text-[15px] font-medium cursor-pointer text-gray-900 transition-colors hover:bg-surface-darker"
            onClick={() => navigate("/organization_dashboard")}
          >
            Back
          </button>
        </div>

        {/* Top tab bar: Volunteers / Edit Information */}
        <div className="inline-flex bg-surface rounded-full p-1 mb-5">
          {[
            { key: "volunteers", label: "Volunteers" },
            { key: "editInfo", label: "Edit Information" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                if (key === "editInfo") navigate("/organization_dashboard/edit_event/1");
              }}
              className={`border-none rounded-full px-6 py-2 text-[15px] cursor-pointer text-gray-900 transition-colors
                ${activeTab === key ? "bg-white font-semibold shadow-sm" : "bg-transparent font-normal hover:bg-white/55"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Main card */}
        <div className="bg-surface rounded-card px-3.5 pt-3.5 pb-5">
          <div className="bg-white rounded-inner px-4 pt-5 pb-7 min-h-[460px]">

            {/* Sub tab bar: Accepted / Pending */}
            <div className="inline-flex bg-surface rounded-full p-1 mb-5">
              {[
                { key: "accepted", label: "Accepted" },
                { key: "pending", label: "Pending" },
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

            {/* Volunteer rows */}
            <div className="flex flex-col gap-3">
              {currentList.length === 0 && (
                <p className="text-[#888] text-[15px] px-2 py-3">
                  No {activeSubTab} volunteers.
                </p>
              )}

              {currentList.map((volunteer) => (
                <div
                  key={volunteer.id}
                  className="bg-surface rounded-[16px] h-[58px] flex items-center px-2.5"
                >
                  {/* Clickable name */}
                  <button
                    onClick={() => setSelectedVolunteer(volunteer)}
                    className="bg-none border-none px-1.5 py-1 cursor-pointer font-semibold text-[15px] text-gray-900 min-w-[160px] text-left underline decoration-transparent underline-offset-2 transition-colors hover:text-primary hover:decoration-primary"
                  >
                    {volunteer.name}
                  </button>

                  {/* Action buttons */}
                  <div className="ml-auto flex gap-2.5">
                    {activeSubTab === "pending" && (
                      <button
                        onClick={() => handleAccept(volunteer.id)}
                        className="bg-white border-[2.5px] border-[#2bbd03] rounded-full px-[22px] py-[5px] text-sm font-semibold text-[#2bbd03] cursor-pointer transition-colors hover:bg-[#f0fde8]"
                      >
                        Accept
                      </button>
                    )}
                    <button
                      onClick={() =>
                        activeSubTab === "pending"
                          ? handleRemovePending(volunteer.id)
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

          </div>
        </div>
      </div>
    </div>
  );
}
