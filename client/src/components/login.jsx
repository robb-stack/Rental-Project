import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:8000/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Login failed");
                return;
            }

            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Login successful");
            navigate("/");

        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-white dark:bg-black">
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 p-6 rounded shadow-lg dark:bg-gray-900">
                <h2 className="text-2xl font-bold text-center dark:text-white">Login</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                    required
                />
                <p className="text-sm text-right">
    <Link to="/forgot-password" className="text-blue-500 underline hover:text-blue-600">
        Forgot password?
    </Link>
               </p>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded transition"
                >
                    Login
                </button>

                <p className="text-sm text-center dark:text-gray-300">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-500 underline">
                        Register here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
