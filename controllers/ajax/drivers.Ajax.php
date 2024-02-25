<?php 
    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'|| $_SESSION['userRole'] === 'Agent'){
            CheckUser::$userUuid = $_SESSION['userUuid'];
            CheckUser::checkUserAvailable();
            if(CheckUser::$userAvailable === true){
                if($_SERVER['REQUEST_METHOD'] === 'GET'){
                    if($_GET['methode']==='alldrivers')
                    {     
                        Driver::alldrivers();}
                      else { 
                   if(isset($_GET['search']) && trim($_GET['search']) !== '' && $_GET['search'] !== NULL){
        Driver::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        Driver::searchDrivers($_GET['search']);
    }else{
        Driver::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        Driver::getDrivers();

    } 
}
                 

                }else if($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['method'] === 'DELETE'){
                    if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
                        Driver::deleteDriver($_POST['driverId']);
                    }else{
                        echo json_encode([
                            "status" => false,
                            "message" => "tu ne as pas l'access"
                        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                    }
                }else if($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['method'] === 'UPDATE'){
                    Driver::$fullName = $_POST['fullName'];
                    Driver::$bateOfBirth = $_POST['DoB'];
                    Driver::$phoneHome = $_POST['phoneOne'];
                    Driver::$phoneMobile = $_POST['phoneTwo'];
                    Driver::$idNumber = $_POST['idNumber'];
                    Driver::$email = $_POST['driverEmail'];
                  
                if(!empty(Driver::$fullName) && !empty(Driver::$phoneHome) && !empty(Driver::$bateOfBirth) && !empty(Driver::$idNumber)){
                    
                        Driver::$driverId = $_GET['did'];
                        Driver::updateDriver();
                        echo json_encode([
                            "status" => true,
                            "message" => "chauffeur Mis à jour avec succès!  "
                        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

                    }else{
                        echo json_encode([
                            "status" => false,
                            "message" => "des champs sont vides"
                        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            
                    }
                }else if($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['method'] === 'GET'){
                    Driver::$driverId = $_POST['driverId'];
                    Driver::getDriver();
                }
            }else{
                echo json_encode([
                    "status" => false,
                    "message" => "Réorienter
"
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

            }
        }else{
            echo json_encode([
                "status" => false,
                "message" => "Interdite
!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
}else{
    echo json_encode([
        "status" => false,
        "message" => "Réorienter
"
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

}