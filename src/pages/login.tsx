import { Link, useNavigate } from "react-router";
import { getCurrentUserRole, login, type RequestError } from "../auth/auth";
import { useState } from "react";

export default function LoginPage() {
    const [loginError, setLoginError] = useState({} as RequestError);
    const [showError, setShowError] = useState(false);
    const [selectedRole, setSelectedRole] = useState<"volunteer" | "organization" | null>(null);

    let navigate = useNavigate();
    async function loginSubmit(formData: FormData) {
        console.warn("Submitting");
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const res = await login(email, password);
        console.log(res);

        switch (res.type) {
            case "success": {
                if (getCurrentUserRole() === "User") {
                    navigate("/volunteer_dashboard");
                } else {
                    navigate("/organization_dashboard");
                }
                break;
            }
            case "error": {
                setLoginError((_) => res.error);
                setShowError((_) => true);
                break;
            }
        }
    }

    return (
        <div style={styles.page}>
            <div style={styles.card}>

                <div style={styles.header}>
                    <h1 style={styles.title}>Welcome</h1>
                    <p style={styles.subtitle}>Sign in to your account</p>
                </div>

                <div style={styles.toggleContainer}>
                    <button type="button" style={styles.toggleBtn(true)}>Login</button>
                    <Link to="/signup" style={{ ...styles.toggleBtn(false), textDecoration: "none", textAlign: "center" }}>
                        Sign Up
                    </Link>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", marginBottom: "0.75rem" }}>I am a:</p>
                    <div style={styles.roleGrid}>

                        <button type="button" onClick={() => setSelectedRole("volunteer")} style={styles.roleBtn(selectedRole === "volunteer")}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                                stroke={selectedRole === "volunteer" ? "#2d6a4f" : "#9ca3af"}
                                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                style={{ marginBottom: "0.5rem" }}>
                                <path d="M16 11c1.657 0 3-1.343 3-3S17.657 5 16 5" />
                                <path d="M19 17c0-1.657-1.343-3-3-3" />
                                <circle cx="10" cy="8" r="3" />
                                <path d="M4 20c0-3.314 2.686-6 6-6s6 2.686 6 6" />
                            </svg>
                            <span style={styles.roleLabel(selectedRole === "volunteer")}>Volunteer</span>
                        </button>

                        <button type="button" onClick={() => setSelectedRole("organization")} style={styles.roleBtn(selectedRole === "organization")}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                                stroke={selectedRole === "organization" ? "#2d6a4f" : "#9ca3af"}
                                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                style={{ marginBottom: "0.5rem" }}>
                                <rect x="3" y="3" width="7" height="18" rx="1" />
                                <rect x="10" y="8" width="11" height="13" rx="1" />
                                <line x1="6" y1="7" x2="6" y2="7.01" strokeWidth="2" />
                                <line x1="6" y1="11" x2="6" y2="11.01" strokeWidth="2" />
                                <line x1="6" y1="15" x2="6" y2="15.01" strokeWidth="2" />
                                <line x1="14" y1="12" x2="14" y2="12.01" strokeWidth="2" />
                                <line x1="18" y1="12" x2="18" y2="12.01" strokeWidth="2" />
                                <line x1="14" y1="16" x2="14" y2="16.01" strokeWidth="2" />
                                <line x1="18" y1="16" x2="18" y2="16.01" strokeWidth="2" />
                            </svg>
                            <span style={styles.roleLabel(selectedRole === "organization")}>Organization</span>
                        </button>

                    </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); loginSubmit(new FormData(e.currentTarget)); }} style={styles.form}>
                    <div>
                        <label style={styles.label}>
                            {selectedRole === "organization" ? "Organization Email" : selectedRole === "volunteer" ? "Volunteer Email" : "Email"}
                        </label>
                        <input type="email" name="email" placeholder={selectedRole === "organization" ? "organization@email.com" : "you@example.com"} style={styles.input} />
                    </div>
                    <div>
                        <label style={styles.label}>
                            Password
                        </label>
                        <input type="password" name="password" placeholder="••••••••" style={styles.input} />
                    </div>

                    <button type="submit" style={styles.submitBtn}
                        onMouseEnter={e => (e.currentTarget.style.background = "#1b4332")}
                        onMouseLeave={e => (e.currentTarget.style.background = "#1c832f")}>
                        Sign In
                    </button>

                </form>

                {showError && loginError && <p style={styles.errorText}>{[loginError.name, loginError.msg]}</p>}

            </div>
        </div>
    )
}

const styles = {
    page: {
        position: "fixed" as const,
        inset: 0,
        background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        overflowY: "auto" as const,
        fontFamily: "'DM Sans', sans-serif",
    },
    card: {
        background: "#ffffff",
        borderRadius: "1.5rem",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: "2.5rem",
        width: "100%",
        maxWidth: "480px",
    },
    header: {
        textAlign: "center" as const,
        marginBottom: "2rem",
    },
    title: {
        fontSize: "1.875rem",
        fontWeight: 700,
        color: "#111827",
        margin: "0 0 0.5rem",
    },
    subtitle: {
        color: "#9ca3af",
        fontSize: "0.875rem",
        margin: 0,
    },
    toggleContainer: {
        display: "flex",
        background: "#f3f4f6",
        borderRadius: "9999px",
        padding: "4px",
        marginBottom: "2rem",
    },
    toggleBtn: (active: boolean) => ({
        flex: 1,
        padding: "0.625rem",
        borderRadius: "9999px",
        border: "none",
        cursor: "pointer",
        fontSize: "0.875rem",
        fontWeight: 600,
        transition: "all 0.2s",
        background: active ? "#ffffff" : "transparent",
        color: active ? "#111827" : "#9ca3af",
        boxShadow: active ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
    }),
    roleGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
    },
    roleBtn: (active: boolean) => ({
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        padding: "1.75rem 1rem",
        borderRadius: "1rem",
        border: `2px solid ${active ? "#2d6a4f" : "#e5e7eb"}`,
        background: active ? "#d8f3dc" : "#ffffff",
        cursor: "pointer",
        transition: "all 0.2s",
    }),
    roleLabel: (active: boolean) => ({
        fontSize: "0.875rem",
        fontWeight: 600,
        color: active ? "#1b4332" : "#374151",
    }),
    form: {
        display: "flex",
        flexDirection: "column" as const,
        gap: "1.25rem",
    },
    label: {
        display: "block",
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "#111827",
        marginBottom: "0.5rem",
    },
    input: {
        width: "100%",
        padding: "0.875rem 1rem",
        background: "#f3f4f6",
        border: "none",
        borderRadius: "0.75rem",
        fontSize: "0.875rem",
        color: "#1f2937",
        outline: "none",
        boxSizing: "border-box" as const,
    },
    submitBtn: {
        width: "100%",
        padding: "1rem",
        background: "#1c832f",
        color: "#ffffff",
        border: "none",
        borderRadius: "1rem",
        fontSize: "0.875rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "background 0.15s",
    },
    errorText: {
        color: "#ef4444",
        fontSize: "0.875rem",
        margin: 0,
    },
};
