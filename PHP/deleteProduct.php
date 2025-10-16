<?php
include('cross.php');
header('Access-Control-Allow-Methods: POST, OPTIONS');

ob_start();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

error_reporting(1);
ini_set('display_errors', 1);

include("vt.php"); // PDO bağlantı objesini içerir
session_start();

// --- 1. GÜVENLİK VE YETKİ KONTROLÜ ---

// Satıcı (status=0) olup olmadığını ve oturumun varlığını kontrol et
if (!isset($_SESSION['userid']) || $_SESSION['status'] != 0) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Bu işlemi yapmaya yetkiniz yok.']);
    exit;
}

// Gelen POST (JSON) verisini al
$data = json_decode(file_get_contents('php://input'), true);
$product_id = $data['id'] ?? null;
$user_id = $_SESSION['userid'];

// Ürün ID'sinin varlığını ve geçerliliğini kontrol et
if (!$product_id || !is_numeric($product_id)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Geçersiz ürün ID.']);
    exit;
}

// --- 2. SAHİPLİK KONTROLÜ VE SİLME İŞLEMİ ---

try {
    // 2.1. Ürünün oturumdaki kullanıcıya ait olup olmadığını kontrol et
    $check_sql = "SELECT userid FROM products WHERE id = :id";
    $check_sorgu = $baglanti->prepare($check_sql);
    $check_sorgu->execute([':id' => $product_id]);
    $result = $check_sorgu->fetch(PDO::FETCH_ASSOC);

    // Ürün veritabanında yoksa
    if (!$result) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Silinmek istenen ürün bulunamadı.']);
        exit;
    }

    // Ürün, oturumdaki kullanıcıya ait değilse (Sahiplik kontrolü)
    if ($result['userid'] != $user_id) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Bu ilanı silmeye yetkiniz yok.']);
        exit;
    }

    // 2.2. Kontrol başarılı: Ürünü sil
    $delete_sql = "DELETE FROM products WHERE id = :id";
    $delete_sorgu = $baglanti->prepare($delete_sql);
    $delete_sorgu->execute([':id' => $product_id]);

    // Silme başarılı yanıtı
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'İlan başarıyla silindi.']);

} catch (PDOException $e) {
    // Veritabanı hatası yönetimi
    http_response_code(500);
    error_log("PDO Hata (Delete Product): " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Veritabanı sunucu hatası.']);
}
?>