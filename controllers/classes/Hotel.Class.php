<?php
    class Hotel extends DataBase{
        public static int|string $currentPage;
        public static $localisation;
        public static $nom;
        public static $type;
        public static $zone;
        public static $numero;
        public static int|string $excursionUuid;
        public static int|string $excursionId;
        public static int|string $depart;
        public static int|string $arrive;
        public static string $filter;
        public static int|string $vehicleUuid;
        public static int|string $hotelUuid;
        public static $hotelId;



        public static function addhotel(){


            $newUuid = UuidGenerator::guidv4();
            $validate = "SELECT hotelUuid FROM hotels WHERE hotelUuid =:hotelUuid";
            $validateStmt = parent::$pdo->prepare($validate);
            $validateStmt->execute([
                ':hotelUuid' => $newUuid
            ]);

            $numeroNo = "SELECT numero FROM hotels WHERE numero =:numero";
            $numeroNoStmt = parent::$pdo->prepare($numeroNo);
            $numeroNoStmt->execute([
                ':numero' => self::$numero
            ]);

           

            $numeroNoCount = $numeroNoStmt->rowCount();
            if($numeroNoCount > 0){
                RequestError::error("hotel avec ce Number [".self::$numero."] etait deja enregistré!");
                return;
            }

            $count = $validateStmt->rowCount();
            if($count > 0){
                $hotelUuid = $newUuid.'-'.time();
            }else{
                $hotelUuid = $newUuid;
            }
            $add = "INSERT INTO hotels(nom, localisation,zone,numero,hotelUuid) VALUES ( :nom, :localisation,:zone,:numero,:hotelUuid)";
            $stmt = parent::$pdo->prepare($add);
            $stmt->execute([
                ':nom' => self::$nom, 
                ':localisation' => self::$localisation,
                ':zone' => self::$zone, 
                ':numero' => self::$numero, 
                ':hotelUuid' =>$hotelUuid
            ]);

            RequestError::success("hotel Ajouter!");
        }

        public static function gethotels(){
            (new self)->__construct();
            $total = "SELECT id FROM hotels";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalhotels = $totalStmt->rowCount();
            $perPage = 15;
            $totalPages = ceil($totalhotels/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
            $hotels = "SELECT hotels.id, hotels.nom, hotels.zone,hotels.numero,hotels.localisation FROM hotels ORDER BY hotels.id ASC LIMIT :s, :t";
            $hotelsStmt = self::$pdo->prepare($hotels);
            $hotelsStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);
            $perPage = 15;
            $totalPages = ceil($totalhotels/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
            $hotels = "SELECT hotels.id, hotels.nom, hotels.zone,hotels.numero,hotels.localisation FROM hotels ORDER BY hotels.id ASC LIMIT :s, :t";
            $hotelsStmt = self::$pdo->prepare($hotels);
            $hotelsStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $hotelsStmt->fetchAll(PDO::FETCH_ASSOC);

            RequestError::array(name: "totalVehicles", totalItem: $totalhotels, data: $data, totalPages: $totalPages, currentPage: self::$currentPage);

        }
        

        ///// getting excursion from database for select input 
        public static function allexcursion(){
            $driverCheck = "SELECT nom, excursionUuid,type FROM excursion";
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

        public static function deletehotel():void{
            (new self)->__construct();
            $delete = "DELETE FROM hotels WHERE id =:id";
            $hotelStmt = self::$pdo->prepare($delete);
            $hotelStmt->execute([
                ':id' => self::$hotelId
            ]);

            echo json_encode([
                "StatusCode" => 200,
                "status" => true,
                "message" => "hotel a été supprimer"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }
         public static function getHotel():array {
            $get = "SELECT hotels.nom,hotels.localisation,hotels.hotelUuid, hotels.zone ,hotels.numero FROM hotels WHERE hotels.id =:id";
            $stmt = parent::$pdo->prepare($get);
            $stmt->execute([
                ':id' => self::$hotelId
            ]);

            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            $count = $stmt->rowCount();

            return [
                "status" => true,
                "data" => $data,
                "count" => $count
            ];
        }
        public static function searchHotel($search):void{
  
        
            (new self)->__construct();

            $total = "SELECT nom FROM hotels WHERE nom LIKE :search";
    $totalStmt = self::$pdo->prepare($total);
    $totalStmt->execute([
        ':search' => '%' . $search . '%'
    ]);
    $totalDrivers = $totalStmt->rowCount();

    $perPage = 15;
    $totalPages = ceil($totalDrivers / $perPage);
    $offset = (self::$currentPage - 1) * $perPage;

    $hotels = "SELECT hotels.id, hotels.nom, hotels.zone,hotels.numero,hotels.localisation FROM hotels WHERE hotels.nom LIKE :search ORDER BY hotels.id ASC LIMIT :s, :t";   
     $driversStmt = self::$pdo->prepare($hotels);
    $driversStmt->execute([
        ':s' => $offset,
        ':t' => $perPage,
        ':search' => '%' . $search . '%'
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

        public static function allhotels(){
            $hotelCheck = "SELECT hotels.nom,hotels.hotelUuid,hotels.numero,hotels.zone,hotels.localisation FROM hotels ORDER BY hotels.id ASC";
            $hotelCheckStmt = self::$pdo->prepare($hotelCheck);
            $hotelCheckStmt->execute();

            $data = $hotelCheckStmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }


        public static function updateHotel(){
            $regisNo = "SELECT id FROM hotels WHERE id =:id";
            $regisNoStmt = parent::$pdo->prepare($regisNo);
            $regisNoStmt->execute([
                ':id' => self::$hotelId
            ]);

           
        
           
            $update = "UPDATE hotels SET nom =:nom, numero=:numero,zone=:zone,localisation =:localisation WHERE id =:id";
            $stmt = parent::$pdo->prepare($update);
            $stmt->execute([
               
               ':nom' => self::$nom, 
               ':localisation' => self::$localisation, 
               ':numero' => self::$numero, ':zone' => self::$zone, 
               ':id' => self::$hotelId
            ]);
    
            RequestError::success("Hotel Mis à jour avec succès!");
           
        }
        


        
    }