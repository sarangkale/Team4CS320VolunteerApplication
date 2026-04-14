import { useNavigate } from "react-router";

export default function VolunteerDashboard() {
	const navigate = useNavigate();

	return (
		<div style={styles.page}>
			<button type="button" style={styles.button} onClick={() => navigate("/volunteer_dashboard/profile")}>
				Profile
			</button>
			<button type="button" style={styles.button} onClick={() => navigate("/volunteer_dashboard/events")}>
				View All Events
			</button>
			<button type="button" style={styles.button} onClick={() => navigate("/login")}>
				Logout
			</button>
		</div>
	);
}

const styles = {
	page: {
		minHeight: "100vh",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		gap: "1rem",
	},
	button: {
		minWidth: "200px",
		padding: "0.9rem 1.25rem",
		border: "1px solid #ccc",
		borderRadius: "8px",
		background: "black",
		cursor: "pointer",
		fontSize: "1rem",
	},
};

