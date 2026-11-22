import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function RegisterPage() {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Ошибка регистрации')
                return;
            }

            const token = data.token || data.api_token
            if (token) {
                localStorage.setItem('token', token)
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user))
                }
                navigate('/')
            } else {
                navigate('/login')
            }

        } catch (err) {
            console.error(err)
            setError("Не удалось подключиться к серверу")
        }
    }

    return <>
        <main className="w-screen flex justify-center items-center h-screen bg-gray-100">
            <div className="form flex-col justify-center bg-white p-20 rounded-3xl">
                <h1 className=" mb-[50px] text-3xl font-bold">Регистрация</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <input type="text"
                        placeholder="Имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required

                        className="text-lg rounded-lg w-100 text-center h-13 border-1 border-gray-500"
                    />

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

                    <button type="submit" className="rounded-lg bg-blue-600 h-13 text-white font-bold">Зарегистрироваться</button>
                </form>

                <p className=" mt-3 text-gray-500">уже есть аккаунт?{' '}  <Link to='/login' className="text-blue-600 underline ">Войти</Link></p>
            </div>
        </main>

    </>
}