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
                    
                if($_GET['methode']==='allmodels')
                {
                    Modelsvehicle::getmodelsall();
                }else
                {
                    if(isset($_GET['search']) && trim($_GET['search']) !== '' && $_GET['search'] !== NULL){
                
                   
                        Modelsvehicle::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                     
                        Modelsvehicle::searchModel($_GET['search']);
     
         
                          }
                  else {  Modelsvehicle::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                      Modelsvehicle::getmodels();}
                  }


            } 
            
            elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
  
                if ($_POST['method'] === 'POST') {

Modelsvehicle::$model = $_POST['model'];
Modelsvehicle::$puissanceM = $_POST['puissanceM'];
Modelsvehicle::$puissanceA = $_POST['puissanceA'];
Modelsvehicle::$bvitesse = $_POST['bvitesse'];
Modelsvehicle::$reservoir = $_POST['reservoir'];
Modelsvehicle::$typec = $_POST['typec'];

Modelsvehicle::$vtypeUuid = $_POST['vtypeUuid'];
              Modelsvehicle::$place = $_POST['place'];
             Modelsvehicle::modelsvehicle();
                } 
                elseif ($_POST['method'] === 'GET') {
                    // Getting excursion view for button detail
                    Modelsvehicle::$modelId = isset($_POST['modelId']) ? $_POST['modelId'] : $params[0];
                    echo json_encode(Modelsvehicle::getmodelsvehicle(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                } 
                elseif ($_POST['method'] === 'DELETE') {
                    if ($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin') {
                        Modelsvehicle::$modelId = $_POST['modelId'];
                        Modelsvehicle::deletemodelsvehicle();
                    } 
                    else {
                        RequestError::error(" Vous n'êtes pas autorisé à supprimer le model!");
                    }
                } 
                elseif ($_POST['method'] === 'UPDATE') {
                    Modelsvehicle::$modelId = $params[0];
                    $isEmptyField = false;
                
                    foreach ($_POST as $post) {
                    
                        if (empty($post)) {
                            $isEmptyField = true;
                            
                        }
                    }
          
                    if ($isEmptyField) {
                        RequestError::error(" Certains champs sont vides.");
                    } else {
                        Modelsvehicle::$model = $_POST['model'];
                        Modelsvehicle::$puissanceM = $_POST['puissanceM'];
                        Modelsvehicle::$puissanceA = $_POST['puissanceA'];
                        Modelsvehicle::$bvitesse = $_POST['bvitesse'];
                        Modelsvehicle::$reservoir = $_POST['reservoir'];
                        Modelsvehicle::$vtypeUuid = $_POST['vtypeUuid'];
                        Modelsvehicle::$place = $_POST['place'];
                        Modelsvehicle::$typec = $_POST['typec'];
                        Modelsvehicle::updatemodelsvehicle();
                    }
                }
            }
        } else {
            RequestError::error("Vous n'êtes pas autorisé(e) à effectuer cette action.");
        }
    } else {
        RequestError::error("Réorienter");
    }
}
