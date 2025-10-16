<?php
$allowedOrigin = 'http://localhost:5173';

header('Access-Control-Allow-Origin: ' . $allowedOrigin);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

ob_start();
session_start();

session_unset();
session_destroy();



// Çerezi sil
$cookieSilindi = setcookie("girisCerez", "", [
    "expires" => time() - 3600,
    "path" => "/",
    "secure" => false, // HTTPS kullanıyorsan true yap
    "httponly" => true,
    "samesite" => "Lax" // None kullanıyorsan secure true olmalı
]);

if (!$cookieSilindi) {
    error_log("Çerez silinirken bir hata oluştu!");
}

exit();
ob_end_flush();
?>
