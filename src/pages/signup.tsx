import { Link, useNavigate } from "react-router";
import { signUp, type AccountRole } from "../auth/auth";
import { useState } from "react";

export default function SignupPage() {
    const [signupError, setSignupError] = useState("");
    const navigate = useNavigate();

    async function signupSubmit(formData: FormData) {
        console.log(formData);
        const email = formData.get("email") as string;
        const name = formData.get("name") as string;
        const university = formData.get("university") as string;
        const role = formData.get("role") as AccountRole;
        const password = formData.get("password") as string;
        let res = await signUp(email, password, name, university, role);
        if (res.type == "error") {
            setSignupError((_) => res.error.message);
        } else {
            navigate("/dashboard");
        }
    }

    return (
        <>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <h1>Signup Page</h1>
            <form action={signupSubmit}>
                <input type="email" name="email" placeholder="Email" /> <br />
                <input type="text" name="name" placeholder="Name" /> <br/>
                <input type="text" name="university" placeholder="University" /> <br />
                <select name="role">
                    <option selected value="User">User</option>
                    <option value="Organization">Organization</option>
                </select><br />
                <input type="password" name="password" placeholder="Password" /> <br />
                <button type="submit">Sign up</button>
            </form>
            {(signupError.length != 0) && <p>{signupError}</p>}
        </>
    );
}
