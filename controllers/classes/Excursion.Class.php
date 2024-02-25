<?php
    class Excursion extends DataBase{
        public static int|string $currentPage;
        public static $destination;
        public static $nom;
        public static $type;
        public static $ligne;
        public static int|string $excursionUuid;
        public static int|string $excursionId;
        public static int|string $depart;
        public static int|string $arrive;
        public static string $filter;
        public static int|string $vehicleUuid;

        public static $duree;



        public static function addexcursion(){
            $newUuid = UuidGenerator::guidv4();
            $validate = "SELECT excursionUuid FROM excursion WHERE excursionUuid =:excursionUuid";
            $validateStmt = parent::$pdo->prepare($validate);
            $validateStmt->execute([
                ':excursionUuid' => $newUuid
            ]);

            
            $count = $validateStmt->rowCount();
            if($count > 0){
                $excursionUuid = $newUuid.'-'.time();
            }else{
                $excursionUuid = $newUuid;
            }

            $add = "INSERT INTO excursion( type ,nom, destination,ligne,duree, excursionUuid) VALUES ( :type,:nom, :destination,:ligne,:duree, :excursionUuid)";
            $stmt = parent::$pdo->prepare($add);
            $stmt->execute([
                ':type'=>self::$type,
                ':nom' => self::$nom, 
                ':destination' => self::$destination, 
                ':ligne'=>self::$ligne,
                ':duree'=>self::$duree,

                ':excursionUuid' => $excursionUuid
            ]);

            RequestError::success("excursion Ajouter!");
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
            $excursions = "SELECT excursion.id, excursion.nom,excursion.duree,excursion.ligne, excursion.type, excursion.destination, excursion.excursionUuid FROM excursion GROUP BY excursion.type ORDER BY excursion.id DESC LIMIT :s, :t";
            $excursionsStmt = self::$pdo->prepare($excursions);
            $excursionsStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);
            $perPage = 15;
            $totalPages = ceil($totalexcursions/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
            $excursions = "SELECT excursion.id, excursion.nom,excursion.duree,excursion.ligne, excursion.type,excursion.destination, excursion.excursionUuid FROM excursion ORDER BY excursion.type DESC LIMIT :s, :t";
            $excursionsStmt = self::$pdo->prepare($excursions);
            $excursionsStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $excursionsStmt->fetchAll(PDO::FETCH_ASSOC);

            RequestError::array(name: "totalVehicles", totalItem: $totalexcursions, data: $data, totalPages: $totalPages, currentPage: self::$currentPage);

        }
        

        ///// getting excursion from database for select input 
        public static function allexcurisons(){
            $driverCheck = "SELECT nom,duree, excursionUuid,type FROM excursion";
            $driverCheckStmt = self::$pdo->prepare($driverCheck);
            $driverCheckStmt->execute();

            $data = $driverCheckStmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
        public static function allmission(){
            $types = 'excursion';
            $driverCheck = "SELECT nom, excursionUuid FROM excursion WHERE excursion.type = :types"; // Removed excursion. prefix from type
            $driverCheckStmt = self::$pdo->prepare($driverCheck);
            $driverCheckStmt->execute([
                ':type' => $types // Fixed the array structure to pass parameters to execute()
            ]);
        
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
            $get = "SELECT excursion.nom,excursion.ligne,excursion.duree, excursion.destination FROM excursion WHERE excursion.id =:id";
            $stmt = parent::$pdo->prepare($get);
            $stmt->execute([
                ':id' => self::$excursionId
            ]);

            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            $count = $stmt->rowCount();

            return [
                "status" => true,
                "data" => $data,
                "count" => $count
            ];
        }
        public static function searchExcursion($search):void{
  
        
            (new self)->__construct();

            $total = "SELECT nom FROM excursion WHERE nom LIKE :search";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute([
                ':search' => '%' . $search . '%'
            ]);
            $totalDrivers = $totalStmt->rowCount();
       
            $perPage = 15;
            $totalPages = ceil($totalDrivers / $perPage);
            $offset = (self::$currentPage - 1) * $perPage;

            $excursions = "SELECT excursion.id, excursion.nom,excursion.duree,excursion.ligne, excursion.type, excursion.destination, excursion.excursionUuid FROM excursion WHERE excursion.nom LIKE :search ORDER BY excursion.id DESC LIMIT :s, :t";
            $driversStmt = self::$pdo->prepare($excursions);
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
        


        public static function getExcursionstat() {
            $get = "SELECT ordre.excursion, ordre.id FROM ordre WHERE ordre.excursionUuid =:excursionUuid";
            $stmt = parent::$pdo->prepare($get);
            $stmt->execute([
                'excursionUuid' => self::$excursionId
            ]);

            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
       
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);


            
        }



        public static function updateExcursion(){
            $regisNo = "SELECT id FROM excursion WHERE id =:id";
            $regisNoStmt = parent::$pdo->prepare($regisNo);
            $regisNoStmt->execute([
                ':id' => self::$excursionId
            ]);

           
            
           
            $update = "UPDATE excursion SET nom =:nom, destination =:destination,ligne=:ligne WHERE id =:id";
            $stmt = parent::$pdo->prepare($update);
            $stmt->execute([
               
               ':nom' => self::$nom, 
               ':destination' => self::$destination, 
               ':ligne' => self::$ligne,
               ':id' => self::$excursionId
            ]);
    
            RequestError::success("Excursion Mis à jour avec succès!");
           
        }
        


        
    }