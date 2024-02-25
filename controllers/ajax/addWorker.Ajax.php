<?php 

    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'){
        if(isset($_POST['email'])){
        

            CheckUser::$userUuid = $_SESSION['userUuid'];
            CheckUser::checkUserAvailable();
            if(CheckUser::$userAvailable === true){
                $fullName = $_POST['fullName'];
                $DoB = $_POST['DoB'];
                $mobilePhone = $_POST['phoneMobile'];
                $email = $_POST['email'];
                $userRole = $_POST['userRole'];
                if(!empty($fullName) && !empty($email) && !empty($userRole) && !empty($userRole)){
                    
                    $userPassword = strtolower(explode(" ", $fullName)[0]);

                    Worker::$fullName = $fullName;
                    Worker::$DoB = $DoB;
                    Worker::$mobilePhone = $mobilePhone;
                    Worker::$email = $email;
                    Worker::$userRole = $userRole;
                    Worker::$userPassword = $userPassword;
        
                    if(Worker::$userExist === true){
                        echo json_encode([
                            "status" => false,
                            "message" => "Email deja inscripté"
                        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                    }else{

                            Worker::addWorker();
                        
                        echo json_encode([
                            "status" => true,
                            "message" => "Employe a été ajouté avec success!",
                            "Password" => $userPassword
                        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        
                    }
        
        
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
                "message" => "Svp essayer aprés !"
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