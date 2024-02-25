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
            if($_SERVER['REQUEST_METHOD'] === 'GET'){
                    
                if($_GET['methode']==='type')
                {

                    if(isset($_GET['search']) && trim($_GET['search']) !== '' && $_GET['search'] !== NULL){
                
                   
                        typevehicle::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                   
                        typevehicle::searchType($_GET['search']);
     
         
                          }
                  else{    typevehicle::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                      typevehicle::gettypes();}
                  }
                  elseif($_GET['methode']==='alltypes')
                  {
                        typevehicle::alltypevehiclesall();
                    }


            } 
            
            elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
  
                if ($_POST['method'] === 'POST') {
                    typevehicle::$vtype = $_POST['typev'];
                    typevehicle::$placemi = $_POST['placemi'];
                    typevehicle::$placemx = $_POST['placemx'];

                    typevehicle::addtype();

                } 
                elseif ($_POST['method'] === 'GET') {
                    // Getting excursion view for button detail
                    typevehicle::$typevehicleId = isset($_POST['typevehicleId']) ? $_POST['typevehicleId'] : $params[0];
                    echo json_encode(typevehicle::gettypevehicle(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                } 
                elseif ($_POST['method'] === 'DELETE') {
                    if ($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin') {
                        typevehicle::$typevehicleId = $_POST['typevehicleId'];
                        typevehicle::deletetypevehicle();
                    } 
                    else {
                        RequestError::error(" Vous n'êtes pas autorisé à supprimer le excursion!");
                    }
                } 
                elseif ($_POST['method'] === 'UPDATE') {
                    typevehicle::$typevehicleId = $params[0];
                    $isEmptyField = false;
                
                    foreach ($_POST as $post) {
                        if (empty($post)) {
                            $isEmptyField = true;
                        }
                    }
          
                    if ($isEmptyField) {
                        RequestError::error(" Certains champs sont vides.");
                    } else {
                        typevehicle::$vtype = $_POST['vtype'];
                        typevehicle::$placemi= $_POST['placemi'];
                        typevehicle::$placemx = $_POST['placemx'];

                        typevehicle::updatetypevehicle();
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
