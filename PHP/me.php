<?php
ob_start();
session_start();

include('cross.php');


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_clean(); 
    exit(); 
}

if (isset($_SESSION['userid']) && isset($_SESSION['email'])) {
    $response_data = [
        'loggedIn' => true, 
        'userid' => $_SESSION['userid'], 
        'email' => $_SESSION['email'],
        'status' => $_SESSION['status'] 
    ];
    
    echo json_encode($response_data);

} else {
    echo json_encode(['loggedIn' => false]);
}

ob_end_flush();
?>