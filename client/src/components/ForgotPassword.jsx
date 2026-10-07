import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/user/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Something went wrong");
                return;
            }

            setSuccess(data.message || "Password reset link has been sent to your email.");
            setEmail("");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-white dark:bg-black">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm space-y-4 p-6 rounded shadow-lg dark:bg-gray-900"
            >
                <h2 className="text-2xl font-bold text-center dark:text-white">
                    Forgot Password
                </h2>

                <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                    Enter your email and we’ll send you a link to reset your password.
                </p>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                    required
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white p-2 rounded transition"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <p className="text-sm text-center dark:text-gray-300">
                    Remember your password?{" "}
                    <Link to="/login" className="text-blue-500 underline">
                        Back to Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;