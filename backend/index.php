<?php

header('Content-Type: application/json; charset=UTF-8');// я узнал что это нужно для того что бы php передавал данные в виде json 

require_once __DIR__ . '/config/db.php';
require_once __DIR__ .'/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($method == 'GET' && $path === '/api/categories') {
    $stmt = $pdo->query('SELECT id, name FROM categories ORDER BY id');
    $categories = $stmt->fetchAll();
    echo json_encode($categories, JSON_UNESCAPED_UNICODE);

}else if($method == 'GET' && $path === '/api/questions') {
    $stmt = $pdo->query('SELECT 
    q.id,
    q.question_text,
    q.is_discussed,
    q.created_at,
    q.category_id,
    c.name AS category_name,
    q.user_id,
    u.name AS author_name
    FROM questions q 
    LEFT JOIN categories c ON q.category_id = c.id
    JOIN users u ON q.user_id = u.id
    ORDER BY q.id DESC');
    $questions = $stmt->fetchAll();
    echo json_encode($questions, JSON_UNESCAPED_UNICODE);

}else if($method === 'POST' && $path === '/api/questions'){
    $currentUser = getAuthUser($pdo);
    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $currentUser['id'];
    $categoryId = $data['category_id'] ?? null;
    $questionText = trim($data['question_text'] ?? '');
    if (empty($questionText)) {
        http_response_code(400);
        echo json_encode(['error' => 'текст вопросы обязательный'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = $pdo->prepare('INSERT INTO questions (user_id, category_id, question_text) VALUES (:user_id, :category_id, :question_text) RETURNING *');
    $stmt->execute([
        ':user_id' => $userId,
        ':category_id' => $categoryId,
        ':question_text' => $questionText
        ]);
    $newQuestion = $stmt->fetch();
    http_response_code(201);
    echo json_encode($newQuestion, JSON_UNESCAPED_UNICODE);

} else if ($method === 'DELETE' && preg_match('#^/api/questions/(\d+)$#', $path, $matches)) {
    $currentUser = getAuthUser($pdo);
    $questionId = (int)$matches[1];
    $stmt = $pdo->prepare('SELECT user_id FROM questions WHERE id = :id');
    $stmt->execute([':id' => $questionId]);
    $question = $stmt->fetch();

    if (!$question) {
        http_response_code(404);
        echo json_encode(['error' => 'Question not found'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($question['user_id'] !== $currentUser['id'] && $currentUser['role'] !== 'admin'){
        http_response_code(403);
        echo json_encode(['error'=> 'Можно удалять только свои вопросы'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $stmt = $pdo->prepare('DELETE FROM questions WHERE id = :id');
    $stmt->execute([':id' => $questionId]);
    http_response_code(204);
    exit;
    

} else if($method === 'PATCH' && preg_match('#^/api/questions/(\d+)$#', $path, $matches)) {
    $currentUser = getAuthUser($pdo);
    $questionId = (int)$matches[1];
    $stmt = $pdo->prepare('SELECT user_id FROM questions WHERE id = :id');
    $stmt->execute([':id' => $questionId]);
    $question = $stmt->fetch();
    if (!$question) {
        http_response_code(404);
        echo json_encode(['error' => 'Question not found'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($question['user_id'] !== $currentUser['id'] && $currentUser['role'] !== 'admin'){
        http_response_code(403);
        echo json_encode(['error' => 'Можно редактировать только свои вопросы'], JSON_UNESCAPED_UNICODE);
        exit;

    }

    $isAdmin = ($currentUser['role'] === 'admin');
    $isAuthor = ((int)$question['user_id'] === (int)$currentUser['id']);
    $isDiscussed = (bool)$question['is_discussed'];

    $data = json_decode(file_get_contents('php://input'), true);


    if (isset($data['question_text'])){
        if($isDiscussed){
            http_response_code(403);
            echo json_encode(['error' => 'Нельзя редактировать обсужденный вопрос'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        
        if(!$isAdmin && !$isAuthor){
            http_response_code(403);
            echo json_encode(['error'=> 'Можно редактировать только свои вопросы'], JSON_UNESCAPED_UNICODE);
        }

        $newText = trim($data['question_text']);
        if ($newText === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Текст вопроса не может быть пустым'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $stmt = $pdo->prepare('UPDATE questions SET question_text = :question_text WHERE id = :id RETURNING *');
        $stmt->execute([
            ':question_text' => $newText,
            ':id' => $questionId
        ]);
        echo json_encode($stmt->fetch(), JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    if(!isset($data['is_discussed']) || !is_bool($data['is_discussed'])){
        http_response_code(400);
        echo json_encode(['error' => 'поле обязательно должно быть true или false'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    
    $stmt = $pdo->prepare('UPDATE questions SET is_discussed = :is_discussed WHERE id = :id RETURNING *');
    $stmt->execute([
        ':is_discussed' => $data['is_discussed'] ? true : false,
        ':id' => $questionId
        
    ]);
    $updatedQuestion = $stmt->fetch();

    if ($updatedQuestion) {
        echo json_encode($updatedQuestion, JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Question not found'], JSON_UNESCAPED_UNICODE);
        exit;
    }

} else if ($method === 'POST' && $path === '/api/register') {
    require_once __DIR__ . '/api/register.php';

} else if ($method === 'POST'&& $path === '/api/login') {
    require_once __DIR__ .'/api/login.php';
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Not Found'], JSON_UNESCAPED_UNICODE);
    exit;
}

