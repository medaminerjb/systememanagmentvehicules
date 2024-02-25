<?php
    class Maintenance extends DataBase{
        public static $etat;
        public static $dateen;
        public static $datesor;
        public static $total;
        public static $type;
        public static $obeservation;
        public static $vehicleUuid;
        public static $maintenanceId;
        public static int|string $currentPage;
        public static function addmain():void{
            (new self)->__construct();
          
            $add = "INSERT INTO maintenance(dateen, datesor, total, obeservation, createdby, vehicleUuid, type) VALUES (:dateen, :datesor, :total, :obeservation, :createdby, :vehicleUuid, :type)";
            $addStmt = self::$pdo->prepare($add);
            $addStmt->execute([
                ':dateen' => self::$dateen,
                ':datesor' => self::$datesor,
                ':total' => self::$total,
                ':obeservation' => self::$obeservation,
                ':createdby' => $_SESSION['userUuid'],
                ':vehicleUuid' => self::$vehicleUuid,
                ':type'=>self::$type
            ]);
            $update = "UPDATE vehicles SET etat = 'not in use' WHERE vehicleUuid =:vehicleUuid";
                $ordreStmt = parent::$pdo->prepare($update);
                $ordreStmt->execute([
                    ':vehicleUuid'=>self::$vehicleUuid,
                ]);
            echo json_encode([
                "status" => true,
                "message" => "La maintenance du véhicule a été ajoutée avec succès!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }


        public static function getMaintenances(){
            (new self)->__construct();
            $total = "SELECT id FROM maintenance";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalVehicles = $totalStmt->rowCount();

            $perPage = 15;
            $totalPages = ceil($totalVehicles/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
            
            $maintenance = "SELECT maintenance.id, maintenance.obeservation,maintenance.dateen,maintenance.datesor, maintenance.type , maintenance.total , vehicles.regisNumber FROM maintenance LEFT JOIN users ON users.userUuid=maintenance.createdby LEFT JOIN vehicles ON vehicles.vehicleUuid = maintenance.vehicleUuid ORDER BY maintenance.id DESC LIMIT :s, :t";
            $vehiclesStmt = self::$pdo->prepare($maintenance);
            $vehiclesStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $vehiclesStmt->fetchAll(PDO::FETCH_ASSOC);

            RequestError::array(name: "totalVehicles", totalItem: $totalVehicles, data: $data, totalPages: $totalPages, currentPage: self::$currentPage);

        }
        public static function searchmaintenance($search):void{
  
        
            (new self)->__construct();

   
            $total = "SELECT vehicles.regisNumber FROM maintenance LEFT JOIN vehicles ON vehicles.vehicleUuid=maintenance.vehicleUuid WHERE vehicles.regisNumber LIKE :search";
    

            
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute([
                ':search' => '%' . $search . '%'
            ]);
            $totalDrivers = $totalStmt->rowCount();
       
            $perPage = 15;
            $totalPages = ceil($totalDrivers / $perPage);
            $offset = (self::$currentPage - 1) * $perPage;
         
            $carburant = "SELECT maintenance.id, maintenance.obeservation,maintenance.dateen,maintenance.datesor, maintenance.type , maintenance.total , vehicles.regisNumber FROM maintenance LEFT JOIN users ON users.userUuid=maintenance.createdby LEFT JOIN vehicles ON vehicles.vehicleUuid = maintenance.vehicleUuid WHERE vehicles.regisNumber LIKE :search ORDER BY maintenance.datesor DESC LIMIT :s, :t";
         
            $driversStmt = self::$pdo->prepare($carburant);
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
        
        public static function getmaintenance():array {
              
            $carburant = "SELECT maintenance.id, maintenance.obeservation,maintenance.dateen,maintenance.datesor, maintenance.type , maintenance.total , vehicles.regisNumber,vehicles.vehicleUuid FROM maintenance LEFT JOIN users ON users.userUuid=maintenance.createdby LEFT JOIN vehicles ON vehicles.vehicleUuid = maintenance.vehicleUuid  WHERE maintenance.id=:id";
            $stmt = parent::$pdo->prepare($carburant);
            $stmt->execute([
                ':id' => self::$maintenanceId
            ]);

            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            $count = $stmt->rowCount();

            return [
                "status" => true,
                "data" => $data,
                "count" => $count
            ];
        }
        public static function deletemaintenance():void{
            (new self)->__construct();
            $delete = "DELETE FROM maintenance WHERE id =:id";
            $carburantStmt = self::$pdo->prepare($delete);
            $carburantStmt->execute([
                ':id' => self::$maintenanceId
            ]);

            echo json_encode([
                "StatusCode" => 200,
                "status" => true,
                "message" => "ordre a été supprimer"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }
        public static function updatemaintenance(){
       
                $update = "UPDATE maintenance SET dateen=:dateen,datesor=:datesor,total=:total, obeservation=:obeservation,createdby=:createdby,vehicleUuid=:vehicleUuid ,type=:type WHERE id =:id";
                $ordreStmt = parent::$pdo->prepare($update);
                $ordreStmt->execute([
                    ':dateen' => self::$dateen,
                    ':datesor' => self::$datesor,
                    ':total' => self::$total,
                    ':obeservation' => self::$obeservation,
                    ':createdby' => $_SESSION['userUuid'],
                    ':vehicleUuid' => self::$vehicleUuid,
                    ':type'=>self::$type,
                    ':id'=>self::$maintenanceId
                ]);
        
                RequestError::success("maintenance Mis à jour avec succès!");
               
            }


        
            public static function getdepensesstat(){
        
                $get = "SELECT carburant.total, carburant.date FROM carburant WHERE carburant.vehicleUuid =:vehicleUuid";     
                $stmt = parent::$pdo->prepare($get);
                $stmt->execute([
                    ':vehicleUuid' => self::$vehicleIdd]);
    
                $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
             
    
                echo json_encode([
                    "status" => true,
                    "data" => $data
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            }

    }