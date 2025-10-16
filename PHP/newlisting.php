<?php
include('cross.php');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

// --- PREFLIGHT (OPTIONS) İSTEĞİNİ ELE ALMA ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); 
    exit; 
}
// ---------------------------------------------

header('Content-Type: application/json; charset=utf-8');

include("vt.php");
session_start();

if (!isset($_SESSION['userid'])) {
    http_response_code(401); // Yetkisiz
    $response = [
        "success" => false,
        "message" => "Oturum bulunamadı. Lütfen giriş yapın."
    ];
    echo json_encode($response);
    exit;
}

if (!isset($_SESSION['status']) || $_SESSION['status'] != 0) {
    http_response_code(403);
    $response = [
        "success" => false,
        "message" => "Bu işlemi gerçekleştirmeye yetkiniz yok. (Sadece Satıcılar ilan ekleyebilir)",
    ];
    echo json_encode($response);
    exit;
}

$user_id = $_SESSION['userid'];

$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true);

if ($data) {
    // React'ten gelen alanlar
    $title = $data["title"] ?? null;
    $price = $data["price"] ?? null;
    $desc = $data["desc"] ?? '';
    $image_base64 = $data["image_base64"] ?? null;

    if (!empty($title) && !empty($price) && !empty($image_base64)) {
        
        try {
            
            $sql = "INSERT INTO products (title, price, image, description, userid) 
                    VALUES (:title, :price, :image, :description, :userid)";

            $sorgu = $baglanti->prepare($sql);

            $sorgu->bindParam(':title', $title, PDO::PARAM_STR);
            $sorgu->bindParam(':price', $price, PDO::PARAM_STR); // Tabloda INT olsa da, PDO string kabul edebilir.
            $sorgu->bindParam(':image', $image_base64, PDO::PARAM_STR); // Base64 verisi için
            $sorgu->bindParam(':description', $desc, PDO::PARAM_STR);
            $sorgu->bindParam(':userid', $user_id, PDO::PARAM_INT);

            $sonuc = $sorgu->execute();

            if ($sonuc) {
                http_response_code(201);
                $lastId = $baglanti->lastInsertId();
                
                $response = [
                    "success" => true,
                    "message" => "İlan başarıyla oluşturuldu.",
                    "id" => $lastId
                ];
                echo json_encode($response);
            } else {
                http_response_code(500);
                $response = ["success" => false, "message" => "İlan eklenirken bilinmeyen bir hata oluştu."];
                echo json_encode($response);
            }

        } catch (PDOException $e) {
            http_response_code(500); 
            error_log("PDO Hata (New Listing): " . $e->getMessage()); 
            $response = [
                "success" => false,
                "message" => "Veritabanı hatası: İlan eklenemedi.",
                "error_detail" => $e->getMessage() 
            ];
            echo json_encode($response);
        }

    } else {
        // Eksik veri
        http_response_code(400);
        $response = ["success" => false, "message" => "Başlık, Fiyat veya Resim eksik."];
        echo json_encode($response);
    }

} else {
    // JSON çözümlenemedi
    http_response_code(400);
    $response = ["success" => false, "message" => "Geçersiz JSON verisi."];
    echo json_encode($response);
}
?>