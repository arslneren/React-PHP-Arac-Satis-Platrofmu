<?php
include('cross.php');
header('Access-Control-Allow-Methods: GET, OPTIONS');

ob_start();
include("vt.php"); 
session_start(); 

if (!isset($_SESSION['userid'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Bu işlemi yapmak için oturum açmalısınız.']);
    exit;
}

$search_term = $_GET['q'] ?? '';

$results = [];

if (empty($search_term)) {
    http_response_code(200);
    echo json_encode($results);
    exit;
}

$search_param_with_wildcard = "%" . $search_term . "%";

$sorgu = $baglanti->prepare("SELECT id, title, price, image, description AS `desc` 
        FROM products 
        WHERE title LIKE :search_term OR description LIKE :search_term2");
        
$sorgu->bindParam(':search_term', $search_param_with_wildcard);
$sorgu->bindParam(':search_term2', $search_param_with_wildcard);

$sorgu->execute();

$results = $sorgu->fetchAll(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode($results);
?>