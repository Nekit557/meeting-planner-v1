import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || data.message || "Неверный email или пароль");
                return;
            }

            localStorage.setItem("token", data.api_token);
            localStorage.setItem("user", JSON.stringify(data));
            navigate("/");
        } catch (err) {
            console.error("Ошибка входа:", err);
            setError("Не удалось подключиться к серверу");
        }
    };

    return <>
    <main className="w-screen flex justify-center items-center h-screen bg-gray-100">
            <div className="form flex-col justify-center bg-white p-20 rounded-3xl">
                <h1 className=" mb-[50px] text-3xl font-bold">Вход</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <input type="email"
                        placeholder="Почта"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="text-lg rounded-lg w-100 text-center h-13 border-1 border-gray-500"
                    />

                    <input type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        required
                        className="text-lg rounded-lg w-100 text-center h-13 border-1 border-gray-500"
                    />
                    {error && <p className="text-red-500">{error}</p>}

                    <button type="submit" className="rounded-lg bg-blue-600 h-13 text-white font-bold">Войти</button>
                </form>

                <p className=" mt-3 text-gray-500">еще нет аккаунта?{' '}  <Link to='/register' className="text-blue-600 underline ">Регистрация</Link></p>
            </div>
        </main>
    </>
}