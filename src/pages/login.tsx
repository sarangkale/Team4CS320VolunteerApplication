import { Link, useNavigate } from "react-router";
import { getCurrentUserRole, login } from "../auth/auth";
import { type RequestError } from "../lib/axios.ts";
import { useState } from "react";

function LoginPage() {
    const [loginError, setLoginError] = useState({} as RequestError);
    const [showError, setShowError] = useState(false);

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

                {/* Form */}
                <form
                    onSubmit={(e) => { e.preventDefault(); loginSubmit(new FormData(e.currentTarget)); }}
                    className="flex flex-col gap-5"
                >
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder={"yourEmail@example.com"}
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
