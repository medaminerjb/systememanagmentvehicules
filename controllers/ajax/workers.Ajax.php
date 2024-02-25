<?php 
    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
            CheckUser::$userUuid = $_SESSION['userUuid'];
            CheckUser::checkUserAvailable();
            if(CheckUser::$userAvailable === true){
                if($_SERVER['REQUEST_METHOD'] === 'GET'){

                    if($_GET['methode']=== 'tousEmployes' ){
                          Worker::tousWorkers();
                    }else
                    {
                        Worker::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                    Worker::getWorkers();}

                }else if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['method']) && $_POST['method'] === 'DELETE'){
                    Worker::$userUuid = $_POST['workerId'];
                    Worker::deleteWorker();
                }else if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['method']) && $_POST['method'] === 'UPDATEPASS'){
                    Worker::$userUuid = $_POST['workerId'];
                    Worker::updateWorkerPassword();
                }else if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['method']) && $_POST['method'] === 'UPDATE'){
             
                    $fullName = $_POST['fullName'];
                    $DoB = $_POST['DoB'];
                    $workerPhone1 = $_POST['workerPhone1'];
                    $workerPhone2 = $_POST['workerPhone2'];
                    $workerId = $_POST['workerId'];
                    $workerEmail = $_POST['workerEmail'];
               
                    $userRole = $_POST['userRole'];
                  
                    if(!empty($fullName) && !empty($workerEmail) && !empty($userRole) && !empty($userRole)){
           
                 
                        Worker::$fullName = $fullName;
                        Worker::$DoB = $DoB;
                        Worker::$workerPhone1 = $workerPhone1;
                        Worker::$workerPhone2 = $workerPhone2;
                  
                        Worker::$workerId = $workerId;
                        Worker::$workerEmail = $workerEmail;
                        Worker::$userRole = $userRole;
                        if(Worker::getAWorker($_GET['uid'])['data']['userEmail'] === Worker::$workerEmail){
                         
                            Worker::$userUuid = $_GET['uid'];
                            Worker::updateWorker();
                                 
                    
                        }else{
                            if(!Worker::checkEmail()){
                                Worker::$userUuid = $_GET['uid'];
                                Worker::updateWorker();
                                                                     
                            }else{
                                echo json_encode([
                                    "status" => false,
                                    "message" => "Email deja existé!"
                                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

                            }
                        }
            
            
                    }else{
                        echo json_encode([
                            "status" => false,
                            "message" => "des champs sont vides!"
                        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            
                    }
                }else if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['method']) && $_POST['method'] === 'GET'){
                    Worker::getWorker($_POST['workerId']);
                }
            }else{
                RequestError::error("Réorienter");

            }
        }else{
            RequestError::error("Interdite!");
        }
}else{
   RequestError::error("Réorienter");

}