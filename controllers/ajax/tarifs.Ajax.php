<?php
if (
    isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole'])
    && isset($_COOKIE['userUuid'])
) {
    CheckUser::$userUuid = $_SESSION['userUuid'];
    CheckUser::checkUserAvailable();

    if (CheckUser::$userAvailable === true) {
        if ($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin' || $_SESSION['userRole'] === 'chauffeur' || $_SESSION['userRole'] === 'Agent') {
            header('Content-Type: application/json; charset=utf-8');
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                 if ($_GET['method'] === 'alltarifs') {
                    echo json_encode( tarifs::alltarifs(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
               } else {
                if(isset($_GET['search']) && trim($_GET['search']) !== '' && $_GET['search'] !== NULL){
                    tarifs::$currentPage = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                    tarifs::searchtarifs($_GET['search']);
                      }
                  else {tarifs::$currentPage = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                  tarifs::gettarifss();
                 new tarifs();}
               }
            } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {

                if ($_POST['method'] === 'POST') {
                    tarifs::$excursion = $_POST['excursion'];
                    tarifs::$typev = $_POST['typev'];
                    tarifs::$tarifsadu = $_POST['tarifsadu'];
                    tarifs::$tarifsenf = $_POST['tarifsenf'];
                    tarifs::addtarifs();
                } elseif ($_POST['method'] === 'GET') {
                    // Getting excursion view for button detail
                    tarifs::$tarifsId = isset($_POST['tarifsId']) ? $_POST['tarifsId'] : $params[0];
                    echo json_encode(tarifs::gettarifs(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                } elseif ($_POST['method'] === 'DELETE') {
                    if ($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin') {
                        tarifs::$tarifsId = $_POST['tarifsId'];
                        tarifs::deletetarifs();
                    } else {
                        RequestError::error(" Vous n'êtes pas autorisé à supprimer le excursion!");
                    }
                } elseif ($_POST['method'] === 'UPDATE') {
                    tarifs::$tarifsId = $params[0];
                    $isEmptyField = false;

                    foreach ($_POST as $post) {
                        if (empty($post)) {
                            $isEmptyField = true;
                        }
                    }

                    if ($isEmptyField) {
                        RequestError::error(" Certains champs sont vides.");
                    } else {
                        tarifs::$tarifsadu = $_POST['tarifsadu'];
                        tarifs::$tarifsenf = $_POST['tarifsenf'];
                        tarifs::updatetarifs();
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
