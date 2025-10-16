<?php
include('cross.php');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

include ("vt.php");

if(isset($_POST)){
    $rawData = file_get_contents('php://input');
    $data = json_decode($rawData, true);


    $username = $data["regUsername"];
    $email = $data["regMail"];
    $password = $data["regPass"];
    $password2 = $data["regPassAgain"];
    $status = $data["isSeller"];

    if ($username <> "" && $email <> "" && $password <> "" && $password == $password2) {

        $mailval = '/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/';

        if (preg_match($mailval, $email) === 1) {
            $sorgu=$baglanti->prepare("SELECT id FROM users where email =:mail");
            $sorgu->execute(['mail'=>htmlspecialchars($email)]);
            if ($sorgu->rowCount()  == 0) {
                $sorgu2=$baglanti->prepare("INSERT INTO users (name, email, password, status) VALUES (:username, :mail, :sifre, :status)");
                $sorgu2->bindParam(':username', $username);
                $sorgu2->bindParam(':mail', $email);
                $sorgu2->bindParam(':sifre', $password);
                $sorgu2->bindParam(':status', $status);
                $sonuc2 = $sorgu2->execute();
                if ($sonuc2) {
                    $_SESSION["oturum"] ="6789";
                    $_SESSION["email"] = $email;
                    $_SESSION["username"] = $username;
                    $sesId = $baglanti->lastInsertId();
                    $_SESSION["userid"] = $sesId;
                    $_SESSION["status"] = $status;
                    setcookie("girisCerez", md5("aa" . $email . "bb"), [
                        "expires" => time() + (60 * 60 * 24 * 7),
                        "path" => "/",
                        "secure" => false,
                        "httponly" => true,
                        "samesite" => "Lax"
                    ]);


                    $response = [
                        "success" => true,
                        "message" => "Kayıt başarılı!",
                    ];

                    echo json_encode($response);
                } else {
                    echo "Hata oluştu";
                }
            } else {
                $response = [
                        "success" => false,
                        "message" => "Böyle bir mail adresi zaten kayıtlı.",
                    ];

                    echo json_encode($response);
            }
        }
        else{
            $response = [
                        "success" => false,
                        "message" => "Mail hatası.",
                    ];

                    echo json_encode($response);
        }
    }

}
else{
    echo "Hata oluştu.";
}


/*
 * Hata kodu anlamları
 * 1- kayıtlı mail zaten var
 * 2- böyle bir mail adresi olamaz.
 */
