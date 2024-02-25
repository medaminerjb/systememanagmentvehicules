<?php
if (
    isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) 
    && isset($_COOKIE['userUuid'])
) {
    CheckUser::$userUuid = $_SESSION['userUuid'];
    CheckUser::checkUserAvailable();

    if (CheckUser::$userAvailable === true) {
        if ($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'|| $_SESSION['userRole']==='chauffeur'||$_SESSION['userRole']==='Agent') {
            header('Content-Type: application/json; charset=utf-8');

            
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                // Getting all excursion for select button
                if ($_GET['method'] === 'allmission') {
                    Excursion::$filter = isset($_GET['filter']) ? $_GET['filter'] : 'all';
                    Excursion::$currentPage = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                    Excursion::allexcursion();
                    new Excursion();
                }
               
            } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                // Getting all excursion historique in view excursion
                Excursion::$currentPage = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                Excursion::getexcursions();
                new Excursion();
            } 
            elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
                if ($_POST['method'] === 'POST') {
                    Excursion::$nom = $_POST['nom'];
                    Excursion::$destination = $_POST['destination'];
                  
                    Excursion::$type = $_POST['type'];
                    Excursion::addexcursion();
                } 
                elseif ($_POST['method'] === 'GET') {
                    // Getting excursion view for button detail
                    Excursion::$excursionId = isset($_POST['excursionId']) ? $_POST['excursionId'] : $params[0];
                    echo json_encode(Excursion::getExcursion(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                } 
                elseif ($_POST['method'] === 'DELETE') {
                    if ($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin') {
                        Excursion::$excursionId = $_POST['excursionId'];
                        Excursion::deleteexcursion();
                    } 
                    else {
                        RequestError::error(" Vous n'êtes pas autorisé à supprimer le excursion!");
                    }
                } 
                elseif ($_POST['method'] === 'UPDATE') {
                    Excursion::$excursionId = $params[0];
                    $isEmptyField = false;

                    foreach ($_POST as $post) {
                        if (empty($post)) {
                            $isEmptyField = true;
                        }
                    }

                    if ($isEmptyField) {
                        RequestError::error(" Certains champs sont vides.");
                    } else {
                        Excursion::$nom = $_POST['nom'];
                        Excursion::$destination = $_POST['destination'];
                        Excursion::updateExcursion();
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
