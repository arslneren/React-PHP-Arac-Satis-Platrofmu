<?php
// Simple example for receiving a multipart/form-data POST from the React client.
// WARNING: This is a minimal example. For production, add proper validation, authentication and error handling.

// Configure your upload directory
$uploadDir = __DIR__ . '/uploads';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

// Get form fields
$title = isset($_POST['title']) ? $_POST['title'] : '';
$price = isset($_POST['price']) ? $_POST['price'] : '';
$desc = isset($_POST['desc']) ? $_POST['desc'] : '';
$createdAt = isset($_POST['createdAt']) ? $_POST['createdAt'] : time();

// Simple response structure
$response = [
    'success' => false,
    'message' => '',
    'id' => null,
];

// Validate
if (empty($title) || empty($price)) {
    http_response_code(400);
    $response['message'] = 'Missing title or price';
    echo json_encode($response);
    exit;
}

// Handle image upload (optional)
$imagePath = null;
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $tmpName = $_FILES['image']['tmp_name'];
    $origName = basename($_FILES['image']['name']);
    $ext = pathinfo($origName, PATHINFO_EXTENSION);
    $newName = uniqid('img_') . '.' . $ext;
    $dest = $uploadDir . '/' . $newName;
    if (move_uploaded_file($tmpName, $dest)) {
        $imagePath = '/uploads/' . $newName; // adjust if needed
    }
}

// Example DB insertion (pseudo). Replace with your DB code.
// Here we'll just simulate an ID and return success.
$newId = uniqid();

$response['success'] = true;
$response['message'] = 'İlan başarıyla alındı.';
$response['id'] = $newId;
$response['image'] = $imagePath;

header('Content-Type: application/json');
echo json_encode($response);

?>