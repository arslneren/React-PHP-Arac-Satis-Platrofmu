<?php
include('cross.php');

header('Access-Control-Allow-Methods: GET, OPTIONS');

include("vt.php"); 
session_start();

error_reporting(0);
ini_set('display_errors', 0); 

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


if (!isset($_SESSION['userid'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Oturum bulunamadı. Lütfen giriş yapın.']);
    exit;
}

$user_id = $_SESSION['userid'];

if (!isset($_SESSION['status']) || $_SESSION['status'] != 0) {
    http_response_code(403); 
    echo json_encode(['error' => 'Bu bilgilere erişim yetkiniz yok.']);
    exit;
}
$sorgu = $baglanti->prepare("SELECT id, title, price, image 
        FROM products 
        WHERE userid = :userid 
        ORDER BY id DESC");
$sorgu->bindParam(':userid', $user_id, PDO::PARAM_INT);

$sorgu->execute();

$products = $sorgu->fetchAll(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode($products);

?>