import { Link } from "react-router";
import { getCurrentUser, logout } from "../auth/auth";
import { useState } from "react";
import { AuthError, type UserResponse } from "@supabase/supabase-js";

function LoggedInDashbaord() {
    return <>
        <h1>Dashboard</h1>
        <center>
            <table cellSpacing="50em">
                <tbody>
                    <tr>
                        <td><Link to="/">Home</Link></td>
                        <td><Link to="/login">Login</Link></td>
                        <td><button onClick={async (_) => {
                            await logout();
                            console.log(await getCurrentUser());
                        }}>Sign out</button></td>
                    </tr>
                </tbody>
            </table>
        </center>
    </>;
}

function DashboardPage() {
    const [user, setUser] = useState({data: {user: null}, error: new AuthError("")} as UserResponse);
    getCurrentUser().then(u =>setUser(u));
    console.log("User: " + user);
    return (
        <>{user.data.user != null ? <LoggedInDashbaord /> : <>
            <p>No session</p>
            <Link to="/login">Login</Link>
        </>
        }</>
    );
}

export default DashboardPage;
