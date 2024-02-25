<?php
    class Vehicles extends DataBase {
        public static $photo;
        public static $modelUuid;
        public static $type;
        public static $vtype;
        public static $typec;
        public static $place;

        public static $color;
        public static $regisNumber;
        public static $vehicleId;
        public static $vehicleIdg;
        public static $currentPage;
        public static $currentRegisNumber;
        public static $nom;
        public static $destination;
        public static $excursionUuid;
        public static $vehicleUuid;
        public static $puissance;
        public static $km;


        private static array $filter = [];


        public static function addVehicle (){
            $newUuid = UuidGenerator::guidv4();
            $validate = "SELECT vehicleUuid FROM vehicles WHERE vehicleUuid =:vehicleUuid";
            $validateStmt = parent::$pdo->prepare($validate);
            $validateStmt->execute([
                ':vehicleUuid' => $newUuid
            ]);

            $regisNo = "SELECT regisNumber FROM vehicles WHERE regisNumber =:regisNumber";
            $regisNoStmt = parent::$pdo->prepare($regisNo);
            $regisNoStmt->execute([
                ':regisNumber' => self::$regisNumber
            ]);

           

            $regisNoCount = $regisNoStmt->rowCount();
            if($regisNoCount > 0){
                RequestError::error("Vehicle with registration Number [".self::$regisNumber."] already exists!");
                return;
            }

            $count = $validateStmt->rowCount();
            if($count > 0){
                $vehicleUuid = $newUuid.'-'.time();
            }else{
                $vehicleUuid = $newUuid;
            }
            $add = "INSERT INTO km( depart, arrive  ,vehicleUuid ,date) VALUES (:depart, :arrive, :vehicleUuid,:date)";
            $addStmt = self::$pdo->prepare($add);
            $addStmt->execute([
                ':depart' => self::$km,
                ':arrive' => self::$km,
                ':vehicleUuid'=>$vehicleUuid,
                ':date'=>date('Y-m-d'),
            ]);

            $add = "INSERT INTO vehicles( modelUuid, color, regisNumber, dateAdded, vehicleUuid,etat) VALUES ( :modelUuid, :color, :regisNumber, :dateAdded, :vehicleUuid,'not in use')";
            $stmt = parent::$pdo->prepare($add);
            $stmt->execute([
               ':modelUuid' => self::$modelUuid, 
               ':color' => self::$color,  
               ':regisNumber' => self::$regisNumber, 
               ':dateAdded' => date('Y-m-d'),
               ':vehicleUuid' => $vehicleUuid,
                       ]);
            
          

            RequestError::success("Vehicle Ajouter!");
        }
        
       
        public static function getVehicles(){
            (new self)->__construct();
            $total = "SELECT vehicleUuid FROM vehicles";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalVehicles = $totalStmt->rowCount();

            $perPage = 15;
            $totalPages = ceil($totalVehicles/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
            
            $vehicles = "SELECT vehicles.etat,vehicles.obeservation,vehicles.color,typevehicle.vtype, vehicles.regisNumber, vehicles.vehicleUuid , modelsvehicle.model,modelsvehicle.place,modelsvehicle.vtypeUuid FROM vehicles LEFT JOIN modelsvehicle ON modelsvehicle.modelUuid = vehicles.modelUuid LEFT JOIN typevehicle ON typevehicle.vtypeUuid = modelsvehicle.vtypeUuid ORDER BY vehicles.id DESC LIMIT :s, :t";
            $vehiclesStmt = self::$pdo->prepare($vehicles);
            $vehiclesStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $vehiclesStmt->fetchAll(PDO::FETCH_ASSOC);

            RequestError::array(name: "totalVehicles", totalItem: $totalVehicles, data: $data, totalPages: $totalPages, currentPage: self::$currentPage);

        }
        public static function gettypes(){
            (new self)->__construct();
            $total = "SELECT vtypeUuid FROM typevehicle";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalVehicles = $totalStmt->rowCount();

            $perPage = 15;
            $totalPages = ceil($totalVehicles/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
            $vehicles = "SELECT typevehicle.vtype, typevehicle.vtypeUuid, typevehicle.place FROM typevehicle ORDER BY typevehicle.id DESC LIMIT :s, :t";
            $vehiclesStmt = self::$pdo->prepare($vehicles);
            $vehiclesStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $vehiclesStmt->fetchAll(PDO::FETCH_ASSOC);

            RequestError::array(name: "totalVehicles", totalItem: $totalVehicles, data: $data, totalPages: $totalPages, currentPage: self::$currentPage);

        }
        public static function getVehiclesstat(){
            (new self)->__construct();
            $total = "SELECT vehicleUuid FROM vehicles";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalVehicles = $totalStmt->rowCount();

            $perPage = 15;
            $totalPages = ceil($totalVehicles/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
            $vehicles = "SELECT modelsvehicle.model, vehicles.regisNumber,vehicles.vehicleUuid, COALESCE(km.arrive) AS kmtotal FROM vehicles LEFT JOIN km ON km.vehicleUuid = vehicles.vehicleUuid LEFT JOIN modelsvehicle ON modelsvehicle.modelUuid=vehicles.modelUuid ORDER BY vehicles.id DESC LIMIT :s, :t";
            $vehiclesStmt = self::$pdo->prepare($vehicles);
            $vehiclesStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $vehiclesStmt->fetchAll(PDO::FETCH_ASSOC);

            RequestError::array(name: "totalVehicles", totalItem: $totalVehicles, data: $data, totalPages: $totalPages, currentPage: self::$currentPage);

        }

        public static function updateVehicle (){
            $regisNo = "SELECT regisNumber FROM vehicles WHERE regisNumber =:regisNumber";
            $regisNoStmt = parent::$pdo->prepare($regisNo);
            $regisNoStmt->execute([
                ':regisNumber' => self::$regisNumber
            ]);
            $regisNoCount = $regisNoStmt->rowCount();
            
            if(self::$regisNumber !== self::$currentRegisNumber){
                if($regisNoCount > 0){
                    RequestError::error("Vehicle with registration Number [".self::$regisNumber."] already exists!");
                    return;
                }
            }
           
            $update = "UPDATE vehicles SET modelUuid =:modelUuid, color =:color, regisNumber =:regisNumber WHERE vehicleUuid =:vehicleUuid";
            $stmt = parent::$pdo->prepare($update);
            $stmt->execute([
               
               ':modelUuid' => self::$modelUuid, 
               ':color' => self::$color, 
               ':regisNumber' => self::$regisNumber, 
               ':vehicleUuid' => self::$vehicleId
            ]);
    
            RequestError::success("Vehicle Mis à jour avec succès!");
           
        }

        public static function deleteVehicle() {
            $delete = "DELETE FROM vehicles WHERE vehicleUuid =:vehicleUuid";
            $stmt = parent::$pdo->prepare($delete);
            $stmt->execute([
                ':vehicleUuid' => self::$vehicleId
            ]);
            RequestError::success("Vehicle a été supprimer!");
        }
        public static function allVehicles(){
            $driverCheck = "SELECT vehicles.regisNumber, modelsvehicle.place, modelsvehicle.model, typevehicle.vtype, vehicles.vehicleUuid, MAX(km.arrive) AS kmvalue FROM vehicles LEFT JOIN km ON km.vehicleUuid = vehicles.vehicleUuid LEFT JOIN modelsvehicle ON modelsvehicle.modelUuid = vehicles.modelUuid LEFT JOIN typevehicle ON typevehicle.vtypeUuid = modelsvehicle.vtypeUuid WHERE etat = 'not in use' GROUP BY vehicles.vehicleUuid;";
            $driverCheckStmt = self::$pdo->prepare($driverCheck);
            $driverCheckStmt->execute();
        
            $data = $driverCheckStmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        
        }

        public static function tousVehicles(){
            $driverCheck = "SELECT vehicles.regisNumber,vehicles.etat,vehicles.obeservation, modelsvehicle.place, modelsvehicle.model, typevehicle.vtype, vehicles.vehicleUuid FROM vehicles LEFT JOIN modelsvehicle ON modelsvehicle.modelUuid = vehicles.modelUuid LEFT JOIN typevehicle ON typevehicle.vtypeUuid = modelsvehicle.vtypeUuid ";
            $driverCheckStmt = self::$pdo->prepare($driverCheck);
            $driverCheckStmt->execute();
        
            $data = $driverCheckStmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        
        }
        public static function Vehiclesenpanne(){
            $driverCheck = "SELECT vehicles.regisNumber,vehicles.etat, modelsvehicle.place, modelsvehicle.model, typevehicle.vtype, vehicles.vehicleUuid, MAX(km.arrive) AS kmvalue FROM vehicles LEFT JOIN km ON km.vehicleUuid = vehicles.vehicleUuid LEFT JOIN modelsvehicle ON modelsvehicle.modelUuid = vehicles.modelUuid LEFT JOIN typevehicle ON typevehicle.vtypeUuid = modelsvehicle.vtypeUuid WHERE vehicles.etat = 'problem' GROUP BY vehicles.etat;";
            $driverCheckStmt = self::$pdo->prepare($driverCheck);
            $driverCheckStmt->execute();
        
            $data = $driverCheckStmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        
        }
        public static function searchVehicle($search):void{
  
        
            (new self)->__construct();

            $total = "SELECT regisNumber FROM vehicles WHERE regisNumber LIKE :search";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute([
                ':search' => '%' . $search . '%'
            ]);
            $totalDrivers = $totalStmt->rowCount();
       
            $perPage = 15;
            $totalPages = ceil($totalDrivers / $perPage);
            $offset = (self::$currentPage - 1) * $perPage;
       
            $vehicles = "SELECT vehicles.color,vehicles.etat,vehicles.obeservation, typevehicle.vtype, vehicles.regisNumber, vehicles.vehicleUuid, modelsvehicle.model, modelsvehicle.place, modelsvehicle.vtypeUuid FROM vehicles LEFT JOIN modelsvehicle ON modelsvehicle.modelUuid = vehicles.modelUuid LEFT JOIN typevehicle ON typevehicle.vtypeUuid = modelsvehicle.vtypeUuid WHERE vehicles.regisNumber LIKE :search ORDER BY vehicles.id DESC LIMIT :s, :t";
            $driversStmt = self::$pdo->prepare($vehicles);
            $driversStmt->execute([
                ':s' => $offset,
                ':t' => $perPage,
                ':search' => '%'.$search.'%'
            ]);
            $driversStmt->execute();
        
            $data = $driversStmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "role" => $_SESSION['userRole'],
                "totalDrivers" => $totalDrivers,
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
        


        public static function getVehicle():array {
            $get = "SELECT vehicles.color,vehicles.etat,vehicles.obeservation,typevehicle.vtype,modelsvehicle.puissanceA,modelsvehicle.puissanceM,modelsvehicle.modelUuid, vehicles.regisNumber, vehicles.vehicleUuid , modelsvehicle.model,modelsvehicle.place,modelsvehicle.vtypeUuid FROM vehicles LEFT JOIN modelsvehicle ON modelsvehicle.modelUuid = vehicles.modelUuid LEFT JOIN typevehicle ON typevehicle.vtypeUuid = modelsvehicle.vtypeUuid WHERE vehicles.vehicleUuid =:vehicleUuid";
            $stmt = parent::$pdo->prepare($get);
            $stmt->execute([
                ':vehicleUuid' => self::$vehicleId
            ]);

            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            $count = $stmt->rowCount();

            return [
                "status" => true,
                "data" => $data,
                "count" => $count
            ];
        }
        public static function getcarbrantstatall(){
  
        
            $get = "SELECT ordre.kmtotal,ordre.excursion, ordre.gasoil,vehicles.regisNumber FROM ordre LEFT JOIN vehicles ON ordre.vehicleUuid = vehicles.vehicleUuid ORDER BY ordre.excursion ASC ";
            $stmt = parent::$pdo->prepare($get);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
         
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
        public static function getVehiclestat(){

        
            $get = "SELECT km.diff, km.date FROM km WHERE km.vehicleUuid =:vehicleUuid ORDER BY km.date ASC ";
            $stmt = parent::$pdo->prepare($get);
            $stmt->execute([':vehicleUuid' => self::$vehicleId]);

            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
         
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }


        public static function getVehiclegasoilstat(){
            $get = "SELECT ordre.kmtotal, ordre.excursion,ordre.gasoil FROM ordre WHERE ordre.vehicleUuid =:vehicleUuid ORDER BY ordre.excursion ASC ";     
            $stmt = parent::$pdo->prepare($get);
            $stmt->execute([
                ':vehicleUuid' => self::$vehicleIdg ]);

            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
         

            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
    }

