CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(90) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'employee',
    api_token VARCHAR(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    question_text TEXT NOT NULL,
    is_discussed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name) VALUES
    ('IT'),
    ('Технический'),
    ('HR'),
    ('Финансы'),
    ('Маркетинг'),
    ('Другое')
ON CONFLICT (name) DO NOTHING;

INSERT INTO users (name, email, password, role) VALUES
    ('Admin', 'admin@admin.com', '$2y$10$3c.NgyrqzrY4xJKCR.1muuDrHhE2iLD/Gr79Ekd1LBny8ybbblekC', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO questions (user_id, category_id, question_text, is_discussed) VALUES
    (
        (SELECT id FROM users WHERE email = 'admin@admin.com'),
        (SELECT id FROM categories WHERE name = 'IT'),
        'Обсудить план задач на следующую неделю',
        false
    ),
    (
        (SELECT id FROM users WHERE email = 'admin@admin.com'),
        (SELECT id FROM categories WHERE name = 'Технический'),
        'Проверить готовность проекта к релизу',
        false
    ),
    (
        (SELECT id FROM users WHERE email = 'admin@admin.com'),
        (SELECT id FROM categories WHERE name = 'HR'),
        'Утвердить время еженедельных планерок',
        true
    );