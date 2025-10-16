<?php
include('cross.php');
header('Access-Control-Allow-Methods: POST, OPTIONS'); 

ob_start();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

include("vt.php"); 
session_start();

if (!isset($_SESSION['userid']) || $_SESSION['status'] != 0) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Bu işlemi yapmaya yetkiniz yok.']);
    exit;
}

$user_id = $_SESSION['userid'];
$data = json_decode(file_get_contents('php://input'), true);

$product_id = $data['id'] ?? null;
$title = $data['title'] ?? null;
$price = $data['price'] ?? null;
$desc = $data['desc'] ?? null;
$image_base64 = $data['image_base64'] ?? null; // Yeni resim Base64 (Data URL) olarak gelir

if (!$product_id || !$title || !$price) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Gerekli alanlar (ID, Başlık, Fiyat) eksik.']);
    exit;
}

try {
    $check_sql = "SELECT userid FROM products WHERE id = :id"; 
    $check_sorgu = $baglanti->prepare($check_sql);
    $check_sorgu->execute([':id' => $product_id]);
    $result = $check_sorgu->fetch(PDO::FETCH_ASSOC);

    if (!$result) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Düzenlenecek ürün bulunamadı.']);
        exit;
    }

    if ($result['userid'] != $user_id) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Bu ilanı düzenlemeye yetkiniz yok.']);
        exit;
    }

    $update_fields = ['title = :title', 'price = :price', 'description = :desc'];
    $params = [
        ':id' => $product_id,
        ':title' => $title,
        ':price' => $price, 
        ':desc' => $desc
    ];

    if ($image_base64) {
        $update_fields[] = 'image = :image';
        $params[':image'] = $image_base64;
    }

    // 3. Veritabanı Güncelleme
    $update_sql = "UPDATE products SET " . implode(', ', $update_fields) . " WHERE id = :id";
    $update_sorgu = $baglanti->prepare($update_sql);
    $update_sorgu->execute($params);

    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'İlan başarıyla güncellendi.']);

} catch (PDOException $e) {
    http_response_code(500);
    error_log("PDO Hata (Update): " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Veritabanı sunucu hatası.']);
}
?>