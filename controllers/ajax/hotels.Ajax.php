<?php
if (
    isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) 
    && isset($_COOKIE['userUuid'])
){
    CheckUser::$userUuid = $_SESSION['userUuid'];
    CheckUser::checkUserAvailable();

    if (CheckUser::$userAvailable === true) {
        if ($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'|| $_SESSION['userRole']==='chauffeur'||$_SESSION['userRole']==='Agent') {
            header('Content-Type: application/json; charset=utf-8');
             if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            if($_GET['method']==='allhotels'){
                Hotel::allhotels();
            }
else{if(isset($_GET['search']) && trim($_GET['search']) !== '' && $_GET['search'] !== NULL){
    Hotel::$currentPage = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    Hotel::searchHotel($_GET['search']);
      }
  else 
      {Hotel::$currentPage = isset($_GET['page']) ? (int)$_GET['page'] : 1;
      Hotel::gethotels();
      new Hotel();}
}
          
            } 
            
            elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
                if ($_POST['method'] === 'POST') {
                    Hotel::$nom = $_POST['nom'];
                    Hotel::$localisation = $_POST['localisation'];
                    Hotel::$numero = $_POST['numero'];
                    Hotel::$zone = $_POST['zone'];
                    Hotel::addhotel();
                } 
                elseif ($_POST['method'] === 'GET') {
                    // Getting excursion view for button detail
                    Hotel::$hotelId = isset($_POST['hotelId']) ? $_POST['hotelId'] : $params[0];
                    echo json_encode(Hotel::getHotel(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                } 
                elseif ($_POST['method'] === 'DELETE') {
                    if ($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin') {
                        Hotel::$hotelId = $_POST['hotelId'];
                        Hotel::deletehotel();
                    } 
                    else {
                        RequestError::error(" Vous n'êtes pas autorisé à supprimer le excursion!");
                    }
                } 
                elseif ($_POST['method'] === 'UPDATE') {
                    Hotel::$hotelId = $params[0];
                    $isEmptyField = false;

                    foreach ($_POST as $post) {
                        if (empty($post)) {
                            $isEmptyField = true;
                        }
                    }

                    if ($isEmptyField) {
                        RequestError::error(" Certains champs sont vides.");
                    } else {
                        Hotel::$nom = $_POST['nom'];
                        Hotel::$localisation = $_POST['localisation'];
                        Hotel::$numero = $_POST['numero'];
                        Hotel::$zone = $_POST['zone'];
                        Hotel::updateHotel();
                    }
                }
            }
        } else {
            RequestError::error("Vous n'êtes pas autorisé(e) à effectuer cette action.");
        }
    } else {
        RequestError::error("Réorienter
");
    }
}
