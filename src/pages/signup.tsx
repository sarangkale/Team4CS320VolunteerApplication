import { Link, useNavigate } from "react-router";
import { organizationSignUp, userSignUp, type AccountRole } from "../auth/auth";
import { useState } from "react";

function UserForm() {
    return (<>
        <input type="email" name="email" placeholder="Email" /> <br />
        <input type="text" name="first_name" placeholder="First name" /> <input type="text" name="last_name" placeholder="Last name" /> <br />
        <input type="text" name="school" placeholder="School" /> <br />
        <input type="number" name="grad_year" placeholder="2026" /> <br />
        <input type="password" name="password" placeholder="Password" /> <br />
    </>);
}

function OrganizationForm() {
    return (<>
        <input type="email" name="email" placeholder="Email" /> <br />
        <input type="text" name="org_name" placeholder="Organization name" /><br />
        <input type="url" name="website" placeholder="Website" /> <br />
        <input type="password" name="password" placeholder="Password" /> <br />
    </>);
}

export default function SignupPage() {
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
            setSignupError((_) => res.error.message);
        } else {
            navigate("/VolunteerDashboard");
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
            setSignupError((_) => res.error.message);
        } else {
            navigate("/dashboard");
        }
    }

    async function signupSubmit(formData: FormData) {
        const role = formData.get("role") as AccountRole;
        if (role == "User") {
            await userSubmit(formData);
        } else {
            await organizationSubmit(formData)
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
                <select name="role" defaultValue={currentSignupMode} onChange={(e) => setCurrentSignupMode(e.target.value as AccountRole)}>
                    <option value="User">User</option>
                    <option value="Organization">Organization</option>
                </select><br />
                {currentSignupMode == "User" ? <UserForm /> : <OrganizationForm /> }
                <button type="submit">Sign up</button>
            </form>
            {(signupError.length != 0) && <p>{signupError}</p>}
        </>
    );
}
