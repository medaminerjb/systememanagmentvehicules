<?php 
    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
           

            if(isset($_POST['fullName'])){
      
            CheckUser::$userUuid = $_SESSION['userUuid'];
            CheckUser::checkUserAvailable();
            if(CheckUser::$userAvailable === true){
                $fullNames = $_POST['fullName'];
                $userRole = 'chauffeur';
                $email = $_POST['driverEmail'];
                Driver::$fullName = $_POST['fullName'];
                $userPassword = strtolower(explode(" ", $fullNames)[0]);
                Driver::$bateOfBirth = $_POST['DoB'];
                Driver::$phoneHome = $_POST['phoneOne'];
                Driver::$phoneMobile = $_POST['phoneTwo'];
                Driver::$idNumber = $_POST['idNumber'];
                Driver::$email = $_POST['driverEmail'];
                Driver::$userRole = $userRole;
                Driver::$userPassword = $userPassword;
                if(!empty(Driver::$fullName) && !empty(Driver::$phoneHome) && !empty(Driver::$bateOfBirth) && !empty(Driver::$idNumber)){
                 
                    
                    Driver::addDriver();
                    echo json_encode([
                        "status" => true,
                        "message" => "chauffeur a été ajouté ",
                        "driverId" => Driver::$driverIdNo,
                        "Password" => $userPassword,
                        "email" => $email
                    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        
        
                }else{
                    echo json_encode([
                        "status" => false,
                        "message" => "des champs sont vides!"
                    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        
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
                "message" => "SVP essayer aprés "
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
    }else{
        echo json_encode([
            "status" => false,
            "message" => "Interdite
"
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }
}else{
    echo json_encode([
        "status" => false,
        "message" => "Réorienter
"
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

}