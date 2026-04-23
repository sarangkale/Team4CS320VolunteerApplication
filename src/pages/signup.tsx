import { Link, useNavigate } from "react-router";
import { getCurrentUserRole, organizationSignUp, userSignUp, type AccountRole } from "../auth/auth";
import { useState } from "react";

const inputClass = "w-full py-3.5 px-4 bg-gray-100 border-none rounded-xl text-sm text-gray-800 outline-none box-border";
const labelClass = "block text-sm font-semibold text-gray-900 mb-2";

function UserForm() {
    return (<>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className={labelClass}>First Name</label>
                <input type="text" name="first_name" placeholder="Jane" className={inputClass} />
            </div>
            <div>
                <label className={labelClass}>Last Name</label>
                <input type="text" name="last_name" placeholder="Smith" className={inputClass} />
            </div>
        </div>
        <div>
            <label className={labelClass}>Email</label>
            <input type="email" name="email" placeholder="you@example.com" className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className={labelClass}>School</label>
                <input type="text" name="school" placeholder="UMass Amherst" className={inputClass} />
            </div>
            <div>
                <label className={labelClass}>Grad Year</label>
                <input type="number" name="grad_year" placeholder="2026" className={inputClass} />
            </div>
        </div>
        <div>
            <label className={labelClass}>Password</label>
            <input type="password" name="password" placeholder="••••••••" className={inputClass} />
        </div>
    </>);
}

function OrganizationForm() {
    return (<>
        <div>
            <label className={labelClass}>Organization Name</label>
            <input type="text" name="org_name" placeholder="Charity Organization" className={inputClass} />
        </div>
        <div>
            <label className={labelClass}>Email</label>
            <input type="email" name="email" placeholder="you@example.com" className={inputClass} />
        </div>
        <div>
            <label className={labelClass}>Website</label>
            <input type="url" name="website" placeholder="https://yourorg.com" className={inputClass} />
        </div>
        <div>
            <label className={labelClass}>Password</label>
            <input type="password" name="password" placeholder="••••••••" className={inputClass} />
        </div>
    </>);
}

function SignupPage() {
    const [signupError, setSignupError] = useState("");
    const [currentSignupMode, setCurrentSignupMode] = useState("User" as AccountRole);

    const navigate = useNavigate();

    async function userSubmit(formData: FormData) {
        const email = formData.get("email") as string;
        const firstName = formData.get("first_name") as string;
        const lastName = formData.get("last_name") as string;
        const school = formData.get("school") as string;
        const graduationYear = Number.parseInt(formData.get("grad_year") as string);
        const password = formData.get("password") as string;
        const res = await userSignUp(email, password, firstName, lastName, school, graduationYear);
        if (res.type == "error") {
            setSignupError((_) => res.error.msg);
        } else {
            navigate("/volunteer_dashboard/events");
        }
    }

    async function organizationSubmit(formData: FormData) {
        const email = formData.get("email") as string;
        const orgName = formData.get("org_name") as string;
        const website = formData.get("website") as string;
        const password = formData.get("password") as string;
        console.log(`email: ${email} | org name: ${orgName} | website: ${website} | password: ${password}`);
        const res = await organizationSignUp(email, password, orgName, website);
        if (res.type == "error") {
            setSignupError((_) => res.error.msg);
        } else {
            navigate("/organization_dashboard");
        }
    }

    async function signupSubmit(formData: FormData) {
        const role = formData.get("role") as AccountRole;
        if (role == "User") {
            await userSubmit(formData);
        } else {
            await organizationSubmit(formData);
        }
    }

    const isVolunteer = currentSignupMode === "User";
    const isOrg = currentSignupMode === "Organization";

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto bg-gradient-to-br from-[#e8f5e9] via-[#c8e6c9] to-[#a5d6a7] font-sans">
            <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-10 w-full max-w-[480px]">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mt-0 mb-2">Create Account</h1>
                    <p className="text-gray-400 text-sm m-0">Join us today</p>
                </div>

                {/* Toggle */}
                <div className="flex bg-gray-100 rounded-full p-1 mb-8">
                    <Link
                        to="/login"
                        className="flex-1 py-2.5 rounded-full text-sm font-semibold bg-transparent text-gray-400 no-underline text-center transition-all duration-200"
                    >
                        Login
                    </Link>
                    <button
                        type="button"
                        className="flex-1 py-2.5 rounded-full text-sm font-semibold bg-white text-gray-900 shadow-sm border-none cursor-pointer transition-all duration-200"
                    >
                        Sign Up
                    </button>
                </div>

                {/* Role selection */}
                <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-900 mb-3">I am a:</p>
                    <div className="grid grid-cols-2 gap-4">

                        <button
                            type="button"
                            onClick={() => setCurrentSignupMode("User")}
                            className={`flex flex-col items-center justify-center py-7 px-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                                isVolunteer ? "border-accent bg-accent-light" : "border-gray-200 bg-white"
                            }`}
                        >
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                                stroke={isVolunteer ? "#2d6a4f" : "#9ca3af"}
                                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                className="mb-2">
                                <path d="M16 11c1.657 0 3-1.343 3-3S17.657 5 16 5" />
                                <path d="M19 17c0-1.657-1.343-3-3-3" />
                                <circle cx="10" cy="8" r="3" />
                                <path d="M4 20c0-3.314 2.686-6 6-6s6 2.686 6 6" />
                            </svg>
                            <span className={`text-sm font-semibold ${isVolunteer ? "text-accent-dark" : "text-gray-700"}`}>
                                Volunteer
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setCurrentSignupMode("Organization")}
                            className={`flex flex-col items-center justify-center py-7 px-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                                isOrg ? "border-accent bg-accent-light" : "border-gray-200 bg-white"
                            }`}
                        >
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                                stroke={isOrg ? "#2d6a4f" : "#9ca3af"}
                                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                className="mb-2">
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
                            <span className={`text-sm font-semibold ${isOrg ? "text-accent-dark" : "text-gray-700"}`}>
                                Organization
                            </span>
                        </button>

                    </div>
                </div>

                {/* Form */}
                <form action={signupSubmit} className="flex flex-col gap-5">
                    <input type="hidden" name="role" value={currentSignupMode} />

                    {currentSignupMode === "User" ? <UserForm /> : <OrganizationForm />}

                    {signupError.length !== 0 && (
                        <p className="text-red-500 text-sm m-0">{signupError}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full p-4 bg-accent-bright hover:bg-accent-dark text-white border-none rounded-2xl text-sm font-semibold cursor-pointer transition-colors duration-150"
                    >
                        Create Account
                    </button>
                </form>

            </div>
        </div>
    );
}

export default SignupPage;