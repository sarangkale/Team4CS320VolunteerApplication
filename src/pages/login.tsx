import { Link, useNavigate } from "react-router";
import { getCurrentUserRole, login } from "../auth/auth";
import { type RequestError } from "../lib/axios.ts";
import { useState } from "react";

function LoginPage() {
    const [loginError, setLoginError] = useState({} as RequestError);
    const [showError, setShowError] = useState(false);
    const [selectedRole, setSelectedRole] = useState<"volunteer" | "organization" | null>(null);

    let navigate = useNavigate();
    async function loginSubmit(formData: FormData) {
        try {
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            console.log("Submitting login with:", email);

            const res = await login(email, password);
            console.log("Login response:", res);

            switch (res.type) {
                case "success": {
                    const role = getCurrentUserRole();
                    console.log("Current role:", role);

                    if (role === "User") {
                        navigate("/volunteer_dashboard/events");
                    } else {
                        navigate("/organization_dashboard");
                    }
                    break;
                }
                case "error": {
                    setLoginError(res.error);
                    setShowError(true);
                    break;
                }
                default: {
                    console.log("Unexpected response shape:", res);
                }
            }
        } catch (err) {
            console.error("Login crashed:", err);
            setShowError(true);
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto bg-gradient-to-br from-[#e8f5e9] via-[#c8e6c9] to-[#a5d6a7] font-sans">
            <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-10 w-full max-w-[480px]">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mt-0 mb-2">Welcome</h1>
                    <p className="text-gray-400 text-sm m-0">Sign in to your account</p>
                </div>

                {/* Login / Sign Up toggle */}
                <div className="flex bg-gray-100 rounded-full p-1 mb-8">
                    <button
                        type="button"
                        className="flex-1 py-2.5 rounded-full text-sm font-semibold bg-white text-gray-900 shadow-sm border-none cursor-pointer transition-all duration-200"
                    >
                        Login
                    </button>
                    <Link
                        to="/signup"
                        className="flex-1 py-2.5 rounded-full text-sm font-semibold bg-transparent text-gray-400 border-none cursor-pointer transition-all duration-200 no-underline text-center"
                    >
                        Sign Up
                    </Link>
                </div>

                {/* Role selection */}
                <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-900 mb-3">I am a:</p>
                    <div className="grid grid-cols-2 gap-4">

                        <button
                            type="button"
                            onClick={() => setSelectedRole("volunteer")}
                            className={`flex flex-col items-center justify-center py-7 px-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                                selectedRole === "volunteer"
                                    ? "border-accent bg-accent-light"
                                    : "border-gray-200 bg-white"
                            }`}
                        >
                            <svg
                                width="40" height="40" viewBox="0 0 24 24" fill="none"
                                stroke={selectedRole === "volunteer" ? "#2d6a4f" : "#9ca3af"}
                                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                className="mb-2"
                            >
                                <path d="M16 11c1.657 0 3-1.343 3-3S17.657 5 16 5" />
                                <path d="M19 17c0-1.657-1.343-3-3-3" />
                                <circle cx="10" cy="8" r="3" />
                                <path d="M4 20c0-3.314 2.686-6 6-6s6 2.686 6 6" />
                            </svg>
                            <span className={`text-sm font-semibold ${selectedRole === "volunteer" ? "text-accent-dark" : "text-gray-700"}`}>
                                Volunteer
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedRole("organization")}
                            className={`flex flex-col items-center justify-center py-7 px-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                                selectedRole === "organization"
                                    ? "border-accent bg-accent-light"
                                    : "border-gray-200 bg-white"
                            }`}
                        >
                            <svg
                                width="40" height="40" viewBox="0 0 24 24" fill="none"
                                stroke={selectedRole === "organization" ? "#2d6a4f" : "#9ca3af"}
                                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                className="mb-2"
                            >
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
                            <span className={`text-sm font-semibold ${selectedRole === "organization" ? "text-accent-dark" : "text-gray-700"}`}>
                                Organization
                            </span>
                        </button>

                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={(e) => { e.preventDefault(); loginSubmit(new FormData(e.currentTarget)); }}
                    className="flex flex-col gap-5"
                >
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            {selectedRole === "organization" ? "Organization Email" : selectedRole === "volunteer" ? "Volunteer Email" : "Email"}
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder={selectedRole === "organization" ? "organization@email.com" : "you@example.com"}
                            className="w-full py-3.5 px-4 bg-gray-100 border-none rounded-xl text-sm text-gray-800 outline-none box-border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className="w-full py-3.5 px-4 bg-gray-100 border-none rounded-xl text-sm text-gray-800 outline-none box-border"
                        />
                    </div>

                    {showError && loginError && (
                        <p className="text-red-500 text-sm m-0">{loginError?.msg || loginError?.name}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full p-4 bg-accent-bright hover:bg-accent-dark text-white border-none rounded-2xl text-sm font-semibold cursor-pointer transition-colors duration-150"
                    >
                        Sign In
                    </button>
                </form>

            </div>
        </div>
    );
}

export default LoginPage;