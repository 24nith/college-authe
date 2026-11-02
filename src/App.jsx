
import { useState } from "react";

function App() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");

    // Read both JSON and text responses from Express
    async function readResponse(response) {
        const text = await response.text();

        try {
            return JSON.parse(text);
        } catch {
            return { message: text };
        }
    }

    // Signup
    async function signup(e) {
        e.preventDefault();

        if (!username || !email || !password) {
            alert("All fields are required");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await readResponse(response);
            alert(data.message || "Signup successful");
        } catch (error) {
            alert("Cannot connect to backend");
        }
    }

    // Login
    async function login(e) {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await readResponse(response);

            if (response.ok) {
                setToken(data.token);
                alert("Login successful");
            } else {
                alert(data.message || "Login failed");
            }
        } catch (error) {
            alert("Cannot connect to backend");
        }
    }

    // Access protected profile
    async function getProfile() {
        try {
            const response = await fetch("http://localhost:5000/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await readResponse(response);

            alert(JSON.stringify(data));
        } catch (error) {
            alert("Cannot connect to backend");
        }
    }

    return (
        <div>
            <h2>College Authentication</h2>

            <h3>Signup</h3>

            <form onSubmit={signup}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <br /><br />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <br /><br />

                <button type="submit">Signup</button>
            </form>

            <hr />

            <h3>Login</h3>

            <form onSubmit={login}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <br /><br />

                <button type="submit">Login</button>
            </form>

            <hr />

            <h3>Protected Profile</h3>

            <button onClick={getProfile} disabled={!token}>
                View Profile
            </button>
        </div>
    );
}

export default App;
