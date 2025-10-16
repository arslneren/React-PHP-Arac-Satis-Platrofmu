<?php
include('cross.php');
include("vt.php");
session_start();

if (!isset($_GET['id'])) {
    echo json_encode(['error' => 'Ürün ID belirtilmedi']);
    exit;
}

$id = intval($_GET['id']);

// Güvenlik için ID sanitize edildi

$sorgu = $baglanti->prepare("SELECT title, price, image, description FROM products WHERE id = :id LIMIT 1");
$sorgu->execute(['id' => $id]);
$urun = $sorgu->fetch(PDO::FETCH_ASSOC);

if ($urun) {
    // Eğer image alanı varsa, dizi olarak dönebiliriz (örnek: tek resim)

    echo json_encode([
        'title' => $urun['title'],
        'price' => $urun['price'],
        'imgs' => $urun['image'],
        'desc' => $urun['description'] ?? '',
    ]);
} else {
    echo json_encode(['error' => 'Ürün bulunamadı']);
}
?>
