import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (role) => {
        try {
            const response = await axios.post("http://localhost:8000/api/login", {
                email,
                password,
                role
            });

            const { token, user } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            navigate(user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard");
        } catch (err) {
            setError("Email ou mot de passe incorrect.");
        }
    };

    return (
        <div>
            <h2>Connexion</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button onClick={() => handleLogin("admin")}>Login Admin</button>
            <button onClick={() => handleLogin("employee")}>Login Employé</button>
        </div>
    );
}

export default Login;
