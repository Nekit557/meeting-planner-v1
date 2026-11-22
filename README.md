


# Meeting Planner

Веб-приложение для планирования встреч сотрудников компании. Сотрудники оставляют вопросы в нужные отделы, после чего эти вопросы обсуждаются на ближайших встречах.

## Стек и технологии

- **Frontend:** React, Tailwind CSS, Vite, React Router
- **Backend:** PHP (REST API, PDO)
- **Database:** PostgreSQL
- **Инфраструктура:** Docker, Docker Compose, Adminer

## Требования

- Docker и Docker Compose
- Node.js 18+ и npm *(для запуска фронтенда)*
- PHP 8.0+ (с расширением `pdo_pgsql`) и PostgreSQL 14+ *(если запускать без Docker)*

---

## Установка и запуск

### 1. Клонирование репозитория
```bash
git clone [https://github.com/Nekit557/meeting-planner-v1.git](https://github.com/Nekit557/meeting-planner-v1.git)
cd meeting-planner-v1

```

### 2. Запуск контейнеров (Backend + PostgreSQL + Adminer)

```bash
docker compose up -d --build

```

### 3. Запуск Frontend

```bash
cd frontend
npm install
npm run dev

```

После запуска приложение будет доступно по адресу: `http://localhost:5173`

### Остановка проекта

```bash
docker compose down

```

---

## Доступ к аккаунту администратора

Для проверки прав администратора (удаление вопросов и смена статуса «Обсуждено»):

* **Email:** `admin@admin.com`
* **Пароль:** `11111111`

---

## Как создать нового администратора

1. Зарегистрируйте обычного пользователя через форму регистрации на сайте.
2. Откройте **Adminer** по адресу `http://localhost:8080` и введите данные для входа:

| Поле | Значение |
| --- | --- |
| **Движок** | `PostgreSQL` |
| **Сервер** | `db` |
| **Имя пользователя** | `postgres` |
| **Пароль** | `secret` |
| **База данных** | `meeting_planner` |

3. Откройте таблицу `users`, перейдите в редактирование нужной записи и замените поле `role` у зарегистрированного пользователя на `admin`.
4. Выйдите из аккаунта на сайте и войдите заново, чтобы обновились права доступа.

```

---

