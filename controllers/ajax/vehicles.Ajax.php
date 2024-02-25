

<?php 


// Use JavaScript to output the message to the browser's console




// Use JavaScript to output the message to the browser's console

    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        CheckUser::$userUuid = $_SESSION['userUuid'];
        CheckUser::checkUserAvailable();
            if(CheckUser::$userAvailable === true){
                if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'||$_SESSION['userRole']==='chauffeur'||$_SESSION['userRole']==='Agent'){
                header('Content-Type: application/json; charset=utf-8');
                //GETINNG ALL VEHICLES FOR VEHICLES TABLE
            
                if($_SERVER['REQUEST_METHOD'] === 'GET'){
                                     
                    if($_GET['methode'] === 'tousVehicles'){
                        Vehicles::tousVehicles();
                    }
                   if($_GET['methode'] === 'allVehicles'){
                        Vehicles::allVehicles();
                    }
                      elseif($_GET['methode'] === 'vehicles')
                      {  
                      if(isset($_GET['search']) && trim($_GET['search']) !== '' && $_GET['search'] !== NULL){
                
                        Vehicles::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        Vehicles::searchVehicle($_GET['search']);
                        
                          }
                     else{   
                        Vehicles::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        Vehicles::getVehicles();}
                    }
                   
                }
                
                
                elseif($_SERVER['REQUEST_METHOD'] === 'POST'){
                    if($_POST['method'] === 'POST'){
                        Vehicles::$modelUuid = $_POST['modelUuid'];
                        Vehicles::$regisNumber = $_POST['regisNo'];
                        Vehicles::$color = $_POST['color'];
                        Vehicles::$km = $_POST['km'];
                        Vehicles::addVehicle();
           
           
           
                    }else if($_POST['method'] === 'GET'){
                        Vehicles::$vehicleId = isset($_POST['vehicleId']) ? $_POST['vehicleId'] : $params[0];
                        echo json_encode(Vehicles::getVehicle(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                    }elseif ($_POST['method'] === 'DELETE'  ) {
                        Vehicles::$vehicleId = isset($_POST['vehicleId']) ? $_POST['vehicleId'] : $params[0];
                        Vehicles::deleteVehicle();
                    }elseif ($_POST['methode'] === 'UPDATE') {
                        Vehicles::$vehicleId = $params[0];
                        $isEmptyField = false;

                        foreach($_POST as $post){
                            if(empty($post)){
                                $isEmptyField = true;
                            }
                        }

                        if($isEmptyField){
                            RequestError::error("Some of the fields are empty!");
                        }else{
                            Vehicles::$currentRegisNumber = $vehicle['data']['regisNumber'];
                            Vehicles::$modelUuid = $_POST['modelUuid'];
                            Vehicles::$regisNumber = $_POST['regisNo'];
                            Vehicles::$color = $_POST['color'];
                            Vehicles::updateVehicle();
                        }
                    }
                }
                }
            }else{
                RequestError::error("Vous n'êtes pas autorisé(e) à effectuer cette action.");
            }
        }else{
            RequestError::error("Réorienter
");

        }

