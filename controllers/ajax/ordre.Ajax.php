<?php 


// Use JavaScript to output the message to the browser's console

    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        CheckUser::$userUuid = $_SESSION['userUuid'];
        CheckUser::checkUserAvailable();
            if(CheckUser::$userAvailable === true){
                if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'|| $_SESSION['userRole'] === 'chauffeur'||$_SESSION['userRole']==='Agent'){
                header('Content-Type: application/json; charset=utf-8');
                
                if($_SERVER['REQUEST_METHOD'] === 'GET'){
                    if($_GET['methode'] === 'allordre' ){
                        if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'|| $_SESSION['userRole'] === 'Agent')
                        {
                            if(isset($_GET['search']) && trim($_GET['search']) !== '' && $_GET['search'] !== NULL){
                
                   
                                Ordre::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;                              
                                Ordre::searchOrdre($_GET['search']);
             
                 
                                  }
                             else{  
                        Ordre::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        Ordre::getOrdres();}
                    }
                        else{
                         
                        Ordre::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        Ordre::$userUuid = $_SESSION['userUuid'];
                        Ordre::getOrdresChauffeur();
                        }
                    }elseif($_GET['method'] === 'getdepartkm')
                    {Ordre::$ordreId = isset($_POST['ordreId']) ? $_POST['ordreId'] : $params[0];
                        echo json_encode(Ordre::getOrdre(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

                    }
              
                }elseif($_SERVER['REQUEST_METHOD'] === 'POST'){
                    if($_POST['method'] === 'POST'){
                        if($_POST['type'] === 'addOrdre'){
                            if(empty($_POST['excursionUuid']) || empty($_POST['vehicleUuid']) ){
                                RequestError::error("Données invalides!");
                                return;
                            }
                            Ordre::$driverUuid = $_POST['driverUuid'];
                            if($_SESSION['userRole']==='chauffeur'){
                                $driverid=$_SESSION['userUuid'];
                                Ordre::$driverUuid=$driverid;

                            }
                          
                           
                            Ordre::$heurer = $_POST['heurer'];
                            Ordre::$dater = $_POST['dater'];
                            Ordre::$heure = $_POST['heure'];
                            Ordre::$excursion = $_POST['excursion'];
                            Ordre::$agence = $_POST['agence'];
                           
                            Ordre::$vehicleUuid = $_POST['vehicleUuid'];
                            Ordre::$excursionUuid = $_POST['excursionUuid'];
                            Ordre::addOrdre();
                        }
                    }else if($_POST['method'] === 'GET'){
                            //for button detail    getting data
                        Ordre::$ordreId = isset($_POST['ordreId']) ? $_POST['ordreId'] : $params[0];
                        echo json_encode(Ordre::getOrdre(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                    }
                    else if($_POST['method'] === 'DELETE'){
                        if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
                            
                            Ordre::$ordreId = $_POST['ordreId'];
                            Ordre::deleteOrdre();
                        }else{
                            RequestError::error("You are not allowed to delete ordre!");
                        }
                    }elseif ($_POST['method'] === 'UPDATE') {
                        Ordre::$ordreId = $params[0];
                        $isEmptyField = false;

                       
                            
                          
                            Ordre::$agence = $_POST['agence'];
                            Ordre::$heure = $_POST['heure'];
                            Ordre::$excursion = $_POST['excursion'];
                            Ordre::$driverUuid = $_POST['driverUuid'];
                            Ordre::$vehicleUuid = $_POST['vehicleUuid'];
                            Ordre::$excursionUuid = $_POST['excursionUuid'];
                           
                            Ordre::updateOrdre();
                        
                    }elseif ($_POST['method'] === 'confiermerticket') {
                  
                        Ordre::$numero = $_POST['numero'];
                        Ordre::$depart = $_POST['depart'];
                        Ordre::$adulte = $_POST['adulter'];
                        Ordre::$enfant = $_POST['enfantr'];
                        Ordre::$bebe = $_POST['beber'];
                        Ordre::$etat = $_POST['etat'];
                        Ordre::$tarifstadu = $_POST['tarifstadu'];
                        Ordre::$tarifstenf = $_POST['tarifstenf'];
                        if(isset($_POST['etat']))
                        {Ordre::confiermerticket();
                        }else{
                            RequestError::error("etat no confirmé");
                        }
                    }

                    elseif ($_POST['method'] === 'confirmerordre') {
                        Ordre::$ordreId = $params[0];
                        Ordre::$etat = $_POST['confirmer'];
                        Ordre::confirmerordre();
                    }
                }
            }else{
                RequestError::error("tu ne pas l'accées!");
            }
        }else{
            RequestError::error("Réorienter");

        }
}else{

    RequestError::error("Réorienter");

}