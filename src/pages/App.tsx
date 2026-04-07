import './App.css'
import { Link } from 'react-router'

function App() {
    return (
        <>
            <center>
                <table cellSpacing="50em">
                    <tbody>
                        <tr>
                            <td><Link to="/login">Login</Link></td>
                            <td><Link to="/signup">Sign up</Link></td>
                        </tr>
                    </tbody>
                </table>
            </center>
            <h1>Landing Page</h1>
        </>
    )
}

export default App
