import { Link } from "react-router";

function DashboardPage() {
    return (
        <>
            <h1>Dashboard</h1>
            <center>
                <table cellSpacing="50em">
                    <tr>
                        <td><Link to="/">Home</Link></td>
                        <td><Link to="/login">Login</Link></td>
                    </tr>
                </table>
            </center>
        </>
    )
}

export default DashboardPage;
