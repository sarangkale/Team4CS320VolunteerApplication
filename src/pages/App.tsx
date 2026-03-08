import './App.css'
import { Link } from 'react-router'

function App() {
    return (
        <>
            <center>
                <table cellSpacing="50em">
                    <tr>
                        <td><Link to="/dashboard">Dashboard</Link></td>
                        <td><Link to="/login">Login</Link></td>
                        <td><Link to="/signup">Signup</Link></td>
                    </tr>
                </table>
            </center>
            <h1>Landing Page</h1>
        </>
    )
}

export default App
