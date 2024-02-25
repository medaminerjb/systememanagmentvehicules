

<?php 


// Use JavaScript to output the message to the browser's console




// Use JavaScript to output the message to the browser's console

    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        CheckUser::$userUuid = $_SESSION['userUuid'];
        CheckUser::checkUserAvailable();
            if(CheckUser::$userAvailable === true){
                if($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'||$_SESSION['userRole']==='Agent'){
                header('Content-Type: application/json; charset=utf-8');
              
                if($_SERVER['REQUEST_METHOD'] === 'GET'){

                    if($_GET['methode']==='getcarbrantstatall'){
                        Vehicles::getcarbrantstatall();
                    }
                    if($_GET['method'] === 'allordre' ){
                     
                       Ordre::getOrdrestat();
                       
                    }
                    if($_GET['method'] === 'allordreexcursion' ){
                       
                        Ordre::$filter = isset($ss_GET['filter']) ? $_GET['filter'] : 'all';
                        Ordre::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        Ordre::getOrdrestatexcursion();
                       
                    }
                    if($_GET['method'] === 'allordremission' ){
                       
                        Ordre::$filter = isset($ss_GET['filter']) ? $_GET['filter'] : 'all';
                        Ordre::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        Ordre::getOrdrestatmission();
                       
                    }
                    if($_GET['method'] === 'allcarburants' ){
                       
                        Ordre::$filter = isset($ss_GET['filter']) ? $_GET['filter'] : 'all';
                        Ordre::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        Ordre::getallcarburants();
                       
                    }
                    if($_GET['method'] === 'alltarifs' ){
                       
                        tarifs::$filter = isset($ss_GET['filter']) ? $_GET['filter'] : 'all';
                        tarifs::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        tarifs::gettarifsstat();
                       
                    }
                    if($_GET['method'] === 'alltickets' ){
                       
                        Ticket::$filter = isset($ss_GET['filter']) ? $_GET['filter'] : 'all';
                        Ticket::$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
                        Ticket::getTicketstat();
                       
                    }
                    }
           if($_SERVER['REQUEST_METHOD'] === 'POST'){
                  if($_POST['method'] === 'GET'){
                       if(isset($_POST['vehicleId']))
                     {   Vehicles::$vehicleId = isset($_POST['vehicleId']) ? $_POST['vehicleId'] : $params[0];
                    Vehicles::getVehiclestat();}
                       
                    if(isset($_POST['vehicleIdg'])){
                        Vehicles::$vehicleIdg = isset($_POST['vehicleIdg']) ? $_POST['vehicleIdg'] : $params[0];
                        Vehicles::getVehiclegasoilstat();
                    }
                    if(isset($_POST['chauffeurId'])){
                   
                        Driver::$chauffeurId =$_POST['chauffeurId'];
                        Driver::getdriverstat();
                    }
                    if(isset($_POST['excursionId'])){
                   
                        Excursion::$excursionId =$_POST['excursionId'];
                        Excursion::getExcursionstat();
                    }
                    if(isset($_POST['vehicleIdd'])){
                        Carburants::$vehicleIdd = isset($_POST['vehicleIdd']) ? $_POST['vehicleIdd'] : $params[0];
                        Carburants::getdepensesstat();
                      //  Carburants::getdepensesstat();
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

