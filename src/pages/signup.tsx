import { Link, useNavigate } from "react-router";
import { userSignUp, type AccountRole } from "../auth/auth";
import { useState } from "react";

export default function SignupPage() {
    const [signupError, setSignupError] = useState("");
    const navigate = useNavigate();

    async function signupSubmit(formData: FormData) {
        console.log(formData);
        const email = formData.get("email") as string;
        const firstName = formData.get("first_name") as string;
        const lastName = formData.get("last_name") as string;
        const school = formData.get("university") as string;
        const role = formData.get("role") as AccountRole;
        const graduationYear = Number.parseInt(formData.get("grad_year") as string);
        const password = formData.get("password") as string;
        if (role == "User") {
            let res = await userSignUp(email, password, firstName, lastName, school, graduationYear);
            if (res.type == "error") {
                setSignupError((_) => res.error.message);
            } else {
                navigate("/dashboard");
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
                            <td><Link to="/login">Login</Link></td>
                        </tr>
                    </tbody>
                </table>
            </center>
            <h1>Signup Page</h1>
            <form action={signupSubmit}>
                <select name="role" defaultValue="User">
                    <option value="User">User</option>
                    <option value="Organization">Organization</option>
                </select><br />
                <input type="email" name="email" placeholder="Email" /> <br />
                <input type="text" name="first_name" placeholder="First name" /> <input type="text" name="last_name" placeholder="Last name" /> <br />
                <input type="text" name="school" placeholder="School" /> <br />
                <input type="number" name="grad_year" placeholder="2026" /> <br />
                <input type="password" name="password" placeholder="Password" /> <br />
                <button type="submit">Sign up</button>
            </form>
            {(signupError.length != 0) && <p>{signupError}</p>}
        </>
    );
}
