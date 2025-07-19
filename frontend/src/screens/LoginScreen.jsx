import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginScreen.css";
import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const { userInfo, login, logout } = useAuth();


    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/api/users/login", { email, password });
            login(data);
            navigate("/");
        } catch (err) {
            setError("Invalid email or password");
        }
    };


    return (
        <div className="login-container">
            {userInfo ? (
                <div className="login-box">
                    <h2 className="login-heading">Already Logged In</h2>
                    <p>You are already logged in as: <strong>{userInfo.email}</strong></p>
                    <button onClick={() => logout()}>Logout</button>
                </div>
            ) : (
                <form className="login-box" onSubmit={submitHandler}>
                    <h2 className="login-heading">Sign In</h2>
                    {error && <div className="error-text">{error}</div>}

                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">Sign In</button>
                </form>
            )}
        </div>
    );
};

export default LoginScreen;
