import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
    getAccountProfile,
    getCurrentUser,
    logout,
    type UserProfile,
} from "../auth/auth";

type Opportunity = {
    id: string;
    title: string;
    organization: string;
    category: "Education" | "Community" | "Environment" | "Healthcare";
    locationType: "Remote" | "In Person" | "Hybrid";
    date: string;
    description: string;
    urgent: boolean;
};

const SAMPLE_OPPORTUNITIES: Opportunity[] = [
    {
        id: "opp-1",
        title: "After-School Reading Support",
        organization: "Bright Futures Center",
        category: "Education",
        locationType: "In Person",
        date: "2026-04-20",
        description: "Help elementary students with reading practice and homework review.",
        urgent: false,
    },
    {
        id: "opp-2",
        title: "Neighborhood Food Pantry Pack-Out",
        organization: "City Care Network",
        category: "Community",
        locationType: "In Person",
        date: "2026-04-14",
        description: "Sort and package grocery boxes for weekly distribution.",
        urgent: true,
    },
    {
        id: "opp-3",
        title: "Virtual Resume Mentorship",
        organization: "LaunchPath",
        category: "Community",
        locationType: "Remote",
        date: "2026-04-18",
        description: "Coach high school seniors on resume writing and interview prep.",
        urgent: false,
    },
    {
        id: "opp-4",
        title: "Park Cleanup Day",
        organization: "Green Blocks Initiative",
        category: "Environment",
        locationType: "Hybrid",
        date: "2026-04-27",
        description: "Join cleanup teams and support recycling sorting stations.",
        urgent: true,
    },
    {
        id: "opp-5",
        title: "Hospital Welcome Desk",
        organization: "Riverside Health",
        category: "Healthcare",
        locationType: "In Person",
        date: "2026-04-16",
        description: "Guide visitors and support patient check-in logistics.",
        urgent: false,
    },
];

function isVolunteerProfile(profile: unknown): profile is UserProfile {
    return !!profile && typeof profile === "object" && "user_id" in profile;
}

export default function VolunteerDashboard() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [profile, setProfile] = useState<UserProfile | null>(null);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedLocationType, setSelectedLocationType] = useState("All");
    const [showUrgentOnly, setShowUrgentOnly] = useState(false);

    useEffect(() => {
        async function loadVolunteerProfile() {
            const userResult = await getCurrentUser();

            if (userResult.error || !userResult.data.user) {
                navigate("/login", { replace: true });
                return;
            }

            const profileResult = await getAccountProfile();

            if (profileResult.type === "error") {
                setLoadError(profileResult.error.message || "Unable to load account profile.");
                setIsLoading(false);
                return;
            }

            if (!isVolunteerProfile(profileResult.data)) {
                navigate("/dashboard", { replace: true });
                return;
            }

            setProfile(profileResult.data);
            setIsLoading(false);
        }

        loadVolunteerProfile();
    }, [navigate]);

    const filteredOpportunities = useMemo(() => {
        return SAMPLE_OPPORTUNITIES.filter((opportunity) => {
            const categoryMatches =
                selectedCategory === "All" || opportunity.category === selectedCategory;
            const locationMatches =
                selectedLocationType === "All" || opportunity.locationType === selectedLocationType;
            const urgentMatches = !showUrgentOnly || opportunity.urgent;

            return categoryMatches && locationMatches && urgentMatches;
        });
    }, [selectedCategory, selectedLocationType, showUrgentOnly]);

    async function handleLogout() {
        await logout();
        navigate("/login", { replace: true });
    }

    if (isLoading) {
        return (
            <main className="dashboard-page volunteer-dashboard" aria-busy="true">
                <p>Loading volunteer dashboard...</p>
            </main>
        );
    }

    return (
        <main className="dashboard-page volunteer-dashboard">
            <header className="dashboard-header">
                <nav className="dashboard-nav" aria-label="Primary">
                    <Link to="/">Home</Link>
                    <Link to="/dashboard">Account Dashboard</Link>
                </nav>
                <button type="button" className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </header>

            <section className="dashboard-intro" aria-label="Volunteer profile summary">
                <h1>Volunteer Dashboard</h1>
                <p>
                    Welcome back
                    {profile?.first_name ? `, ${profile.first_name}` : ""}.
                </p>
            </section>

            {loadError && (
                <section className="dashboard-error" role="alert">
                    <p>{loadError}</p>
                </section>
            )}

            <section className="opportunity-filters" aria-labelledby="filters-title">
                <h2 id="filters-title">Filters</h2>
                <form className="filters-form" onSubmit={(e) => e.preventDefault()}>
                    <label>
                        Category
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Community">Community</option>
                            <option value="Education">Education</option>
                            <option value="Environment">Environment</option>
                            <option value="Healthcare">Healthcare</option>
                        </select>
                    </label>

                    <label>
                        Location
                        <select
                            value={selectedLocationType}
                            onChange={(e) => setSelectedLocationType(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Remote">Remote</option>
                            <option value="In Person">In Person</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </label>

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={showUrgentOnly}
                            onChange={(e) => setShowUrgentOnly(e.target.checked)}
                        />
                        Show urgent opportunities only
                    </label>
                </form>
            </section>

            <section className="opportunity-listings" aria-labelledby="opportunities-title">
                <h2 id="opportunities-title">Volunteer Opportunities</h2>

                <div className="opportunities-grid">
                    {filteredOpportunities.length === 0 ? (
                        <p>No opportunities match your current filters.</p>
                    ) : (
                        filteredOpportunities.map((opportunity) => (
                            <article key={opportunity.id} className="opportunity-card">
                                <header className="opportunity-card-header">
                                    <h3>{opportunity.title}</h3>
                                    {opportunity.urgent && <span className="status-badge">Urgent</span>}
                                </header>
                                <p className="opportunity-meta">
                                    {opportunity.organization} | {opportunity.category} | {opportunity.locationType}
                                </p>
                                <p>{opportunity.description}</p>
                                <p className="opportunity-date">Date: {opportunity.date}</p>
                                <button type="button" className="apply-button">
                                    View Details
                                </button>
                            </article>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}