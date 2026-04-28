import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

// GENERATED USING GITHUB COPILOT - NOT FINAL DESIGN OR IMPLEMENTATION, JUST A STARTING POINT FOR FRONTEND DEVELOPMENT.
const MOCK_EVENTS = [
	{
		id: 1,
		title: "Community Food Pantry Support",
		organization: "Amherst Care Collective",
		date: "Tue, Apr 28",
		time: "4:00 PM - 7:00 PM",
		location: "North Amherst Community Center",
		description: "Help sort and distribute weekly food boxes for local families.",
		slotsFilled: 9,
		slotsTotal: 14,
		category: "Community",
	},
	{
		id: 2,
		title: "Riverfront Cleanup Day",
		organization: "Pioneer Green Team",
		date: "Sat, May 2",
		time: "9:30 AM - 12:30 PM",
		location: "Hadley Riverwalk Entrance",
		description: "Join a morning cleanup focused on trail and shoreline restoration.",
		slotsFilled: 18,
		slotsTotal: 20,
		category: "Environment",
	},
	{
		id: 3,
		title: "Youth Coding Mentor Session",
		organization: "Valley Tech Access",
		date: "Thu, May 7",
		time: "5:30 PM - 7:30 PM",
		location: "Downtown Library Lab",
		description: "Mentor middle school students during beginner coding activities.",
		slotsFilled: 6,
		slotsTotal: 8,
		category: "Education",
	},
	{
		id: 4,
		title: "Senior Center Wellness Check-In",
		organization: "NeighborLink",
		date: "Mon, May 11",
		time: "10:00 AM - 1:00 PM",
		location: "Amherst Senior Center",
		description: "Support staff with guest check-ins, light setup, and activity transitions.",
		slotsFilled: 10,
		slotsTotal: 10,
		category: "Health",
	},
];

const CATEGORY_FILTERS = ["All", "Community", "Environment", "Education", "Health"];

export default function VolunteerDashboardEvents() {
	const navigate = useNavigate();
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [expandedEvent, setExpandedEvent] = useState(null);

	const visibleEvents = useMemo(() => {
		if (selectedCategory === "All") return MOCK_EVENTS;
		return MOCK_EVENTS.filter((event) => event.category === selectedCategory);
	}, [selectedCategory]);

	return (
		<div className="font-sans bg-page min-h-screen text-gray-900">

			{/* Nav */}
			<nav className="bg-surface sticky top-0 z-20 shadow-sm flex items-center gap-3.5 px-8 h-nav flex-wrap">
				<div className="bg-primary text-white rounded-full w-[82px] h-[70px] flex items-center justify-center font-bold text-lg shrink-0">
					logo
				</div>
				<span className="font-bold text-[21px] mr-auto">Website name</span>
				<button
					className="bg-white text-primary border-none rounded-full px-6 py-3 text-base font-medium cursor-pointer transition-all hover:bg-[#c5d09c] hover:-translate-y-px"
					onClick={() => navigate("/volunteer_dashboard/profile")}
				>
					My profile
				</button>
				<button
					className="bg-white text-primary border-none rounded-full px-6 py-3 text-base font-medium cursor-pointer transition-all hover:bg-[#c5d09c] hover:-translate-y-px"
					onClick={() => navigate("/volunteer_dashboard/events")}
				>
					View all events
				</button>
				<button
					className="bg-primary text-white border-none rounded-full px-6 py-3 text-base font-medium cursor-pointer transition-all hover:bg-primary-dark hover:-translate-y-px"
					onClick={() => navigate("/login")}
				>
					Log out
				</button>
			</nav>

			{/* Main */}
			<main className="max-w-content mx-auto px-6 pt-9 pb-16">
				<h1 className="text-[40px] font-bold mb-6">HELLO JOHN!</h1>

				{/* Tabs row */}
				<div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
					<div className="bg-surface rounded-full p-1.5 inline-flex gap-1">
						<button
							className="bg-transparent border-none rounded-full px-7 py-2.5 text-base font-normal cursor-pointer transition-colors hover:bg-white/55 text-gray-900"
							onClick={() => navigate("/volunteer_dashboard/profile")}
						>
							Profile
						</button>
						<button
							className="bg-white border-none rounded-full px-7 py-2.5 text-base font-medium cursor-pointer shadow-sm text-gray-900"
							onClick={() => navigate("/volunteer_dashboard/events")}
						>
							Events
						</button>
					</div>
				</div>

				{/* Category filters */}
				<div className="flex flex-wrap gap-2 mb-5">
					{CATEGORY_FILTERS.map((category) => (
						<button
							key={category}
							type="button"
							onClick={() => setSelectedCategory(category)}
							className={`border-none rounded-full px-4 py-2 text-sm cursor-pointer transition-colors
								${selectedCategory === category
									? "bg-badge text-white"
									: "bg-[#d4d4d4] text-gray-900 hover:bg-surface-darker"
								}`}
						>
							{category}
						</button>
					))}
				</div>

				{/* Events grid */}
				{visibleEvents.length > 0 ? (
					<div className="grid grid-cols-2 gap-4 max-[920px]:grid-cols-1">
						{visibleEvents.map((event) => {
							const fillPercent = Math.min(100, Math.round((event.slotsFilled / event.slotsTotal) * 100));

							return (
								<article
									key={event.id}
									className="bg-white rounded-inner p-[18px] shadow-sm flex flex-col gap-2.5 cursor-pointer transition-all hover:bg-[#f3f3f3] hover:-translate-y-px hover:shadow-md"
									onClick={() => setExpandedEvent(event)}
								>
									{/* Card header */}
									<div className="flex justify-between gap-2.5 items-start">
										<div>
											<h2 className="text-[19px] font-semibold">{event.title}</h2>
											<p className="text-sm text-[#686868]">{event.organization}</p>
										</div>
										<span className="bg-[#f1f4ea] border border-[#d8e0c2] text-primary text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
											{event.category}
										</span>
									</div>

									{/* Meta */}
									<div className="flex flex-wrap gap-1.5 text-sm text-[#404040]">
										<span>{event.date}</span>
										<span>•</span>
										<span>{event.time}</span>
										<span>•</span>
										<span>{event.location}</span>
									</div>

									{/* Description */}
									<p className="text-sm leading-[1.45] text-[#4e4e4e]">{event.description}</p>

									{/* Progress */}
									<div className="flex justify-between items-center text-[13px] text-[#474747]">
										<span>Volunteer slots</span>
										<span>{event.slotsFilled}/{event.slotsTotal}</span>
									</div>
									<div className="h-2 rounded-full bg-[#e1e1e1] overflow-hidden">
										<div
											className="h-full bg-badge rounded-full"
											style={{ width: `${fillPercent}%` }}
										/>
									</div>
								</article>
							);
						})}
					</div>
				) : (
					<div className="bg-white rounded-inner p-7 text-center text-[#686868]">
						No events found for this category right now.
					</div>
				)}
			</main>

			{/* Event modal */}
			{expandedEvent && (
				<div
					className="fixed inset-0 bg-black/45 z-[200] flex items-center justify-center p-6"
					onClick={(e) => { if (e.target === e.currentTarget) setExpandedEvent(null); }}
				>
					<div className="w-full max-w-[680px] bg-white rounded-card shadow-2xl px-8 py-7">
						<div className="text-[26px] font-bold mb-[18px]">{expandedEvent.title}</div>

						<div className="grid grid-cols-2 gap-3.5 mb-[18px] max-[620px]:grid-cols-1">
							<div className="bg-[#f3f3f3] rounded-xl px-3.5 py-3">
								<span className="block text-xs font-bold tracking-wide uppercase text-[#666] mb-1">Organization</span>
								<div className="text-[15px] text-gray-900 leading-[1.45]">{expandedEvent.organization}</div>
							</div>
							<div className="bg-[#f3f3f3] rounded-xl px-3.5 py-3">
								<span className="block text-xs font-bold tracking-wide uppercase text-[#666] mb-1">Category</span>
								<div className="text-[15px] text-gray-900 leading-[1.45]">{expandedEvent.category}</div>
							</div>
							<div className="bg-[#f3f3f3] rounded-xl px-3.5 py-3">
								<span className="block text-xs font-bold tracking-wide uppercase text-[#666] mb-1">Date &amp; Time</span>
								<div className="text-[15px] text-gray-900 leading-[1.45]">{expandedEvent.date} {expandedEvent.time}</div>
							</div>
							<div className="bg-[#f3f3f3] rounded-xl px-3.5 py-3">
								<span className="block text-xs font-bold tracking-wide uppercase text-[#666] mb-1">Location</span>
								<div className="text-[15px] text-gray-900 leading-[1.45]">{expandedEvent.location}</div>
							</div>
							<div className="bg-[#f3f3f3] rounded-xl px-3.5 py-3 col-span-2 max-[620px]:col-span-1">
								<span className="block text-xs font-bold tracking-wide uppercase text-[#666] mb-1">Description</span>
								<div className="text-[15px] text-gray-900 leading-[1.45]">{expandedEvent.description}</div>
							</div>
							<div className="bg-[#f3f3f3] rounded-xl px-3.5 py-3 col-span-2 max-[620px]:col-span-1">
								<span className="block text-xs font-bold tracking-wide uppercase text-[#666] mb-1">Volunteer Slots</span>
								<div className="text-[15px] text-gray-900 leading-[1.45]">{expandedEvent.slotsFilled}/{expandedEvent.slotsTotal} filled</div>
							</div>
						</div>

						<div className="flex justify-end gap-2.5 flex-wrap mt-2">
							<button
								type="button"
								className="bg-surface text-gray-900 border-none rounded-full px-5 py-2.5 text-[15px] font-semibold cursor-pointer transition-all hover:bg-surface-darker hover:-translate-y-px"
								onClick={() => setExpandedEvent(null)}
							>
								Back
							</button>
							<button
								type="button"
								className="bg-primary text-white border-none rounded-full px-5 py-2.5 text-[15px] font-semibold cursor-pointer transition-all hover:bg-primary-dark hover:-translate-y-px"
								onClick={() => {}}
							>
								Apply
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
