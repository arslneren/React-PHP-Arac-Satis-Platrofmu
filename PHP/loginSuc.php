<?php
include('cross.php');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

ob_start();
session_set_cookie_params(['samesite' => 'Lax']);
session_start();
include("vt.php");
error_reporting(E_ALL);
ini_set('display_errors', '1');

if (isset($_SESSION["oturum"]) && $_SESSION["oturum"]=="6789"){
    echo "5";
}
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawData = file_get_contents('php://input');
    $data = json_decode($rawData, true);

    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        echo "JSON decode hatası: " . json_last_error_msg();
        exit;
    }
    $email = $data["logMail"];
    $parola = $data["LogPass"];
    
    if($email == "" || $parola == ""){
        echo "0";
    }
    else{
        $sorgu=$baglanti->prepare("SELECT password, name, id, email, status FROM users WHERE email = :email");
        $sorgu->execute(['email'=>htmlspecialchars($email)]);
        $sonuc=$sorgu->fetch();
        if($sonuc){
            if($parola == $sonuc["password"]){
                $_SESSION["oturum"] ="6789";
                $_SESSION["email"] = $email;
                $_SESSION["username"] = $sonuc["name"];
                $_SESSION["userid"] = $sonuc["id"];
                $_SESSION["status"] = $sonuc["status"];

                setcookie("girisCerez", hash('sha256', "aa" . $sonuc["email"] . "bb"), [
                    "expires" => time() + (60 * 60 * 24 * 7),
                    "path" => "/", // Tüm site için geçerli
                    "secure" => false, // HTTPS yoksa false, HTTPS varsa true
                    "httponly" => true,
                    "samesite" => "Lax"
                ]);

                // Debugging: Check if session variables are set

                // Debugging: Check if cookie is set

                echo "ok";
            }
            else{
                $parola = "";
                echo "3";
            }
        }
        else{
            $parola = "";
            echo "1";
        }
    }
}
else{
    echo "Sadece POST istekleri kabul edilir.";
}
?>
