<?php 


// Use JavaScript to output the message to the browser's console

    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        CheckUser::$userUuid = $_SESSION['userUuid'];
        CheckUser::checkUserAvailable();
            if(CheckUser::$userAvailable === true){
                if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'|| $_SESSION['userRole'] === 'chauffeur'||$_SESSION['userRole']==='Agent'){
                header('Content-Type: application/json; charset=utf-8');
                
                if($_SERVER['REQUEST_METHOD'] === 'GET'){
                  
                        if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'|| $_SESSION['userRole'] === 'Agent'){
                     
                            if(isset($_GET['search']) && trim($_GET['search']) !== '' && $_GET['search'] !== NULL){
                       
                                Carburants::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                                Carburants::searchCarburant($_GET['search']);
                
                            }
                              else 
                         {   
                           
                        Carburants::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        Carburants::getcarburants();
                        new Carburants();}
                        }
                }
                elseif($_SERVER['REQUEST_METHOD'] === 'POST'){
                    
                    if($_POST['method'] === 'POST'){
                       if($_POST['method'] === 'POST'){
                            if(empty($_POST['total']) || empty($_POST['arrive']) ||empty($_POST['ordreId'])){
                                RequestError::error("Données invalides!");
                                return;
                            }
                            if($_POST['depart'] > $_POST['arrive']){
                                RequestError::error("Le kilométrage de départ doit être inférieur au kilométrage d'arrivée!");
                                return;
                            }
                            if(isset($_POST['etat']))
                            {
                                Carburants::$etat= $_POST['etat'];
                            }

                            Carburants::$obeservation = $_POST['obeservation'];
                            Carburants::$prix = $_POST['prix'];
                            Carburants::$quantite = $_POST['quantite'];
                            Carburants::$typec = $_POST['typec'];
                            Carburants::$total = $_POST['total'];
                            Carburants::$diff = $_POST['diff'];
                            Carburants::$date=$_POST['date'];
                            Carburants::$depart = $_POST['depart'];
                            Carburants::$arrive = $_POST['arrive'];
                            Carburants::$vehicleUuid = $_POST['vehicleUuid'];
                            Carburants::$excursionUuid = $_POST['excursionUuid'];
                            Carburants::$driverUuid = $_POST['driverUuid'];
                            Carburants::$ordreId = $_POST['ordreId'];
                            Carburants::addcarburant();
                        }
                       
                    } else if($_POST['method'] === 'GET'){ 
                
                        Carburants::$carburantId = isset($_POST['carburantId']) ? $_POST['carburantId'] : $params[0];
                        echo json_encode(Carburants::getCarburant(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                    }//deleting excursion 
                    else if($_POST['method'] === 'DELETE'){
                        if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
                            Carburants::$carburantId = $_POST['carburantId'];
                            Carburants::deleteCarburant();
                        }else{
                            RequestError::error("
                            Vous n'êtes pas autorisé à supprimer le kilométrage!");
                        }
                    }elseif ($_POST['method'] === 'UPDATE') {
                        Carburants::$carburantId = $params[0];
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
                            
                            Carburants::$obeservation = $_POST['obeservation'];
                            Carburants::$prix = $_POST['prix'];
                            Carburants::$quantite = $_POST['quantite'];
                            Carburants::$typec = $_POST['typec'];
                            Carburants::$total = $_POST['total'];
                            Carburants::$date=$_POST['date'];                         
                            Carburants::$vehicleUuid = $_POST['vehicleUuid'];
                            Carburants::$excursionUuid = $_POST['excursionUuid'];
                            Carburants::$driverUuid = $_POST['driverUuid'];
                            Carburants::updateCarburant();
                        }
                    }
                 } }
            }
            else{
                RequestError::error("Vous n'êtes pas autorisé(e) à effectuer cette action.");
            }
        }else{
            RequestError::error("Réorienter");

        }
