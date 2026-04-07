import { Link, useNavigate } from "react-router";
import { getCurrentUserRole, login } from "../auth/auth";
import { useState } from "react";

function LoginPage() {
    const [loginError, setLoginError] = useState("");
    const [showError, setShowError] = useState(false);
    let navigate = useNavigate();
    async function loginSubmit(formData: FormData) {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const res = await login(email, password);
        switch (res.type) {
            case "success": {
                const roleResult = await getCurrentUserRole();

                if (roleResult.type === "error") {
                    setLoginError((_) => roleResult.error.message);
                    setShowError((_) => true);
                    break;
                }

                if (roleResult.data === "User") {
                    navigate("/VolunteerDashboard");
                } else {
                    navigate("/dashboard");
                }
                break;
            }
            case "error": {
                setLoginError((_) => res.error.message);
                setShowError((_) => true);
                break;
            }
        }
    }

    return (
        <>
            <center>
                <table cellSpacing="50em">
                    <tbody>
                        <tr>
                            <td><Link to="/">Home</Link></td>
                            <td><Link to="/signup">Sign up</Link></td>
                        </tr>
                    </tbody>
                </table>
            </center>
            <h1>Login Page</h1>
            <form action={loginSubmit}>
                <input type="email" name="email" placeholder="Email" /> <br />
                <input type="password" name="password" placeholder="Password" /> <br />
                <button type="submit">Log in</button>
            </form>
            {showError && <p>{loginError}</p>}
        </>
    )
}

export default LoginPage;
