<?php
include('cross.php');

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

include("vt.php");

session_start();

// Check if session or cookie exists
if (isset($_SESSION['userid']) || isset($_COOKIE['girisCerez'])) {
    $start = isset($_GET['start']) ? intval($_GET['start']) : 0;
    $limit = 4;

    $sorgu = $baglanti->prepare("SELECT id, title, price, image FROM products ORDER BY id ASC LIMIT :start, :limit");
    $sorgu->bindParam(':start', $start, PDO::PARAM_INT);
    $sorgu->bindParam(':limit', $limit, PDO::PARAM_INT);
    $sorgu->execute();


    $products = $sorgu->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($products);
} else {
    echo json_encode([]);
?>
