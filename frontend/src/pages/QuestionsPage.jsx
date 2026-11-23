import { useEffect, useState } from "react";
import { data, Navigate, useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";

export default function QuestionsPage() {

    const navigate = useNavigate()
    const [questions, setQuestions] = useState([])
    const [error, setError] = useState('')
    const rawUser = localStorage.getItem('user');
    const currentUser = rawUser && rawUser !== 'undefined' ? JSON.parse(rawUser) : null;    
    const [questionText, setQuestionText] = useState('')
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('')
    if (!currentUser) {
    return <Navigate to="/login" replace />;
}

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };



    const fetchQuestions = async () => {
        try {
            const response = await fetch('/api/questions')
            const data = await response.json()

            if (!response.ok) {
                setError('Не удалось получать данные')
                return;
            }

            setQuestions(data)



        } catch (err) {
            console.error('Реальная ошибка:', err)
            setError("Не удалось подключиться к серверу")
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            const data = await response.json();
            if (response.ok) {
                setCategories(data);
            }
        } catch {
            setError('Не удалось получить категории');
        }
    };


    useEffect(() => {
        fetchCategories()
        fetchQuestions()
    }, [])

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        setError('')

        try {
            const response = await fetch('/api/questions', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    'question_text': questionText,
                    'category_id': Number(categoryId)
                })
            })

            const data = await response.json()
            if (!response.ok) {
                setError('Ошибка добавления вопроса (Пустые поля)')
                return
            }

            fetchQuestions()
            setQuestionText('')

        } catch {
            setError('Не удалось добавить вопрос.')
        }
    }




    const handleToggleQuestion = async (id, isDiscussed) => {
        try {
            const response = await fetch(`/api/questions/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    is_discussed: !isDiscussed
                })
            });

            if (!response.ok) {
                setError('Не удалось обновить статус');
                return;
            }

            // Перезагружаем список с сервера, чтобы статус обновился на экране
            fetchQuestions();
        } catch {
            setError('Ошибка соединения с сервером');
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            const response = await fetch(`/api/questions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                setError('Не удалось удалить вопрос');
                return;
            }

            fetchQuestions();
        } catch {
            setError('Ошибка соединения с сервером');
        }
    };

    const handleEditQuestion = async (id, newText) => {
  try {
    const response = await fetch(`/api/questions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ question_text: newText })
    });

    if (!response.ok) {
      setError('Не удалось отредактировать вопрос');
      return;
    }

    fetchQuestions();
  } catch {
    setError('Ошибка соединения с сервером');
  }
};

    return <>
        <header className="w-screen flex justify-center bg-white">
            <div className="header_menu bg-white w-full max-w-5xl h-17  flex justify-between items-center">
                <p className="text-xl header_title">Вопросы для обсуждения</p>
                <div className="left_menu flex gap-5 items-center">
                    <p className="text-black">Пользователь: {currentUser?.name}</p>
                    <button onClick={handleLogout} className="border-1 px-7 py-1 text-lg rounded-lg">Выйти</button>
                </div>
            </div>
        </header>
        <main className="bg-gray-100 h-screen  w-screen  flex items-center flex-col ">
            <form onSubmit={handleAddQuestion} className=" form mt-5 w-full max-w-3xl  bg-white flex flex-col rounded-xl py-7 justify-center px-10 gap-5">
                <p>Отправить вопрос</p>
                <input type="text"
                    placeholder="Введите ваш вопрос"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="rounded-lg h-10 px-2 border-1 border-gray-300"
                />
                <select name="" id=""
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required

                    className="w-50 "
                >1
                    <option value="">Выберите категорию</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>))}
                </select>
                {error && <p className="text-red-500">{error}</p>}

                <button type="submit"
                    className="rounded-xl bg-blue-600 text-white w-40 py-2"
                >Добавить вопрос</button>
            </form>

            <div className="max-w-3xl w-full">
                <p className="py-5 text-lg">Вопросов: {questions.length}</p>

            </div>

            <section className="w-full max-w-3xl mt-5 flex gap-5 flex-col ">
                {questions.map((q) => (
                    <QuestionCard
                        key={q.id}
                        question={q}
                        currentUser={currentUser}
                        onToggle={handleToggleQuestion}
                        onDelete={handleDeleteQuestion}
                        onClick={handleEditQuestion}
                    />
                ))}
            </section>

        </main>
    </>
}