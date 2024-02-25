

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
             
                     if($_GET['methode'] === 'maintenance')
                      {  
                        if(isset($_GET['search']) && trim($_GET['search']) !== '' && $_GET['search'] !== NULL){
           
                            Maintenance::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                            Maintenance::searchmaintenance($_GET['search']);
                            
                              }
                     else{   
                       
                        Maintenance::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        Maintenance::getMaintenances();
                      
                    }
                    }
                   
                }
                
                
                elseif($_SERVER['REQUEST_METHOD'] === 'POST'){
                    if($_POST['method'] === 'POST'){
             
                        Maintenance::$vehicleUuid = $_POST['vehicleUuid'];
                        Maintenance::$type = $_POST['type'];
                        Maintenance::$dateen = $_POST['dateen'];
                        Maintenance::$datesor = $_POST['datesor'];
                        Maintenance::$obeservation = $_POST['obeservation'];
                        Maintenance::$total = $_POST['total'];
                        Maintenance::addmain();
           
           
           
                    }else if($_POST['method'] === 'GET'){
                        Maintenance::$maintenanceId = isset($_POST['maintenanceId']) ? $_POST['maintenanceId'] : $params[0];
                        echo json_encode(Maintenance::getmaintenance(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                    }elseif ($_POST['method'] === 'DELETE'  ) {
                
                        Maintenance::$maintenanceId = isset($_POST['maintenanceId']) ? $_POST['maintenanceId'] : $params[0];
                        Maintenance::deletemaintenance();
                    }elseif ($_POST['method'] === 'UPDATE') {
                
                        Maintenance::$maintenanceId = $params[0];
                        $isEmptyField = false;

                        foreach($_POST as $post){
                            if(empty($post)){
                                $isEmptyField = true;
                            }
                        }

                        if($isEmptyField){
                            RequestError::error("Some of the fields are empty!");
                        }else{
                            Maintenance::$vehicleUuid = $_POST['vehicleUuid'];
                            Maintenance::$type = $_POST['type'];
                            Maintenance::$dateen = $_POST['dateen'];
                            Maintenance::$datesor = $_POST['datesor'];
                            Maintenance::$obeservation = $_POST['obeservation'];
                            Maintenance::$total = $_POST['total'];
                            Maintenance::updatemaintenance();
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

