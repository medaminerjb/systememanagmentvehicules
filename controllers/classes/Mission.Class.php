<?php
    class Mission extends DataBase{
        public static int|string $currentPage;
        public static $destination;
        public static $nom;
        public static int|string $missionUuid;
        public static int|string $missionId;
        public static int|string $depart;
        public static int|string $arrive;
        public static string $filter;
        public static int|string $vehicleUuid;





        public static function addmission(){
            $newUuid = UuidGenerator::guidv4();
            $validate = "SELECT missionUuid FROM mission WHERE missionUuid =:missionUuid";
            $validateStmt = parent::$pdo->prepare($validate);
            $validateStmt->execute([
                ':missionUuid' => $newUuid
            ]);

            
            $count = $validateStmt->rowCount();
            if($count > 0){
                $excursionUuid = $newUuid.'-'.time();
            }else{
                $excursionUuid = $newUuid;
            }

            $add = "INSERT INTO mission( nom, destination, missionUuid) VALUES ( :nom, :destination, :missionUuid)";
            $stmt = parent::$pdo->prepare($add);
            $stmt->execute([
              
               ':nom' => self::$nom, 
               ':destination' => self::$destination, 
               ':excursionUuid' => $missionUuid
            ]);

            RequestError::success("Mission a été Ajouter!");
        }

        public static function getexcursions(){
            (new self)->__construct();
            $total = "SELECT excursionUuid FROM excursion";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalexcursions = $totalStmt->rowCount();

            $perPage = 15;
            $totalPages = ceil($totalexcursions/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
            $excursions = "SELECT excursion.id, excursion.nom, excursion.destination, excursion.excursionUuid FROM excursion ORDER BY excursion.id DESC LIMIT :s, :t";
            $excursionsStmt = self::$pdo->prepare($excursions);
            $excursionsStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);
            $perPage = 15;
            $totalPages = ceil($totalexcursions/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
            $excursions = "SELECT excursion.id, excursion.nom, excursion.destination, excursion.excursionUuid FROM excursion ORDER BY excursion.id DESC LIMIT :s, :t";
            $excursionsStmt = self::$pdo->prepare($excursions);
            $excursionsStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $excursionsStmt->fetchAll(PDO::FETCH_ASSOC);

            RequestError::array(name: "totalVehicles", totalItem: $totalexcursions, data: $data, totalPages: $totalPages, currentPage: self::$currentPage);

        }
        

        ///// getting excursion from database for select input 
        public static function allexcursion(){
            $driverCheck = "SELECT nom, excursionUuid FROM excursion";
            $driverCheckStmt = self::$pdo->prepare($driverCheck);
            $driverCheckStmt->execute();

            $data = $driverCheckStmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
        

        public static function deleteexcursion():void{
            (new self)->__construct();
            $delete = "DELETE FROM excursion WHERE id =:id";
            $salaryStmt = self::$pdo->prepare($delete);
            $salaryStmt->execute([
                ':id' => self::$excursionId
            ]);

            echo json_encode([
                "StatusCode" => 200,
                "status" => true,
                "message" => "excursion a été supprimer"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }
         public static function getExcursion():array {
            $get = "SELECT excursion.nom, excursion.destination FROM excursion WHERE excursion.id =:id";
            $stmt = parent::$pdo->prepare($get);
            $stmt->execute([
                ':id' => self::$missionId
            ]);

            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            $count = $stmt->rowCount();

            return [
                "status" => true,
                "data" => $data,
                "count" => $count
            ];
        }
        public static function updateExcursion(){
            $regisNo = "SELECT id FROM excursion WHERE id =:id";
            $regisNoStmt = parent::$pdo->prepare($regisNo);
            $regisNoStmt->execute([
                ':id' => self::$missionId
            ]);

           
            
           
            $update = "UPDATE excursion SET nom =:nom, destination =:destination WHERE id =:id";
            $stmt = parent::$pdo->prepare($update);
            $stmt->execute([
               
               ':nom' => self::$nom, 
               ':destination' => self::$destination, 
             
               ':id' => self::$missionId
            ]);
    
            RequestError::success("Excursion Mis à jour avec succès!");
           
        }
        


        
    }