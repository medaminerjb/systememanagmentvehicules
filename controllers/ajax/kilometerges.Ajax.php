<?php 


// Use JavaScript to output the message to the browser's console

    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        CheckUser::$userUuid = $_SESSION['userUuid'];
        CheckUser::checkUserAvailable();
            if(CheckUser::$userAvailable === true){
                if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'|| $_SESSION['userRole'] === 'chauffeur'||$_SESSION['userRole']==='Agent'){
                header('Content-Type: application/json; charset=utf-8');
                
                if($_SERVER['REQUEST_METHOD'] === 'GET'){

                 
                     if($_GET['method'] === 'allKilometerge'){
                        if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'|| $_SESSION['userRole'] === 'Agent'){
                      
                            if(isset($_GET['search']) && trim($_GET['search']) !== '' && $_GET['search'] !== NULL){
                                Km::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                                Km::searchKm($_GET['search']);
                                  }
                              else 
                   {    
                        Km::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        Km::getKilometerge();
                        new Km();}

                    }
                    else {
                     
                        Km::$filter = isset($_GET['filter']) ? $_GET['filter'] : 'all';
                        Km::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        km::$userUuid = $_SESSION['userUuid'];
                        Km::getKilometergechauffeur();
                        new Km();

                    }

                } else if($_GET['method'] === 'kmhis'){
                        Km::$filter = isset($_GET['filter']) ? $_GET['filter'] : 'all';
                        Km::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        Km::kmhis();
                        new Km();

                    }
                }elseif($_SERVER['REQUEST_METHOD'] === 'POST'){
                    
                    
                   
                    if($_POST['method'] === 'POST'){
                       if($_POST['method'] === 'POST'){
                            if(empty($_POST['depart']) || empty($_POST['arrive']) ||empty($_POST['vehicleUuid'])){
                                RequestError::error("Données invalides!");
                                return;
                            }
                            if($_POST['depart'] > $_POST['arrive']){
                                RequestError::error("Le kilométrage de départ doit être inférieur au kilométrage d'arrivée!");
                                return;
                            }
                            Km::$driverUuid = $_POST['driverUuid'];
                            if($_SESSION['userRole']==='chauffeur'){
                                $driverid=$_SESSION['userUuid'];
                                Km::$driverUuid=$driverid;
                            }                            
                        
                               if(isset($_POST['etat']))
                               {
                           km::$etat= $_POST['etat'];
                               }

                    
                            km::$ordreId = $params[0];
                            km::$diff = $_POST['diff'];
                            km::$date=$_POST['formattedDate'];
                            Km::$depart = $_POST['depart'];
                            Km::$arrive = $_POST['arrive'];
                            Km::$vehicleUuid = $_POST['vehicleUuid'];
                            Km::$excursionUuid = $_POST['excursionUuid'];
                            Km::addkilometerge();
                        }
                       
                    } else if($_POST['method'] === 'GET'){
                    //for button detail
                        //getting kilometerge view
                        Km::$kilometergeId = isset($_POST['kilometergeId']) ? $_POST['kilometergeId'] : $params[0];
                        echo json_encode(Km::getKm(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                    }//deleting excursion 
                    else if($_POST['method'] === 'DELETE'){
                        if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
                            Km::$kilometergeId = $_POST['kilometergeId'];
                            Km::deleteKm();
                        }else{
                            RequestError::error("
                            Vous n'êtes pas autorisé à supprimer le kilométrage!");
                        }
                    }elseif ($_POST['method'] === 'UPDATE') {
                        Km::$kilometergeId = $params[0];
                        $isEmptyField = false;

                        foreach($_POST as $post){
                            if(empty($post)){
                                $isEmptyField = true;
                            }
                        }

                        if($isEmptyField){
                            RequestError::error("
                            Certains champs sont vides.");
                        }else{
                            
                   
                            Km::$depart = $_POST['depart'];
                            Km::$arrive = $_POST['arrive'];
                            Km::$excursionUuid = $_POST['excursionUuid'];
                            Km::$vehicleUuid = $_POST['vehicleUuid'];
                            Km::$driverUuid = $_POST['driverUuid'];
                            Km::updateKm();
                        }
                    }
                }
            }else{
                RequestError::error("Vous n'êtes pas autorisé(e) à effectuer cette action.");
            }
        }else{
            RequestError::error("Réorienter");

        }
}else{

    RequestError::error("Réorienter");

}