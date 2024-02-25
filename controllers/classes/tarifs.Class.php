<?php
    class tarifs extends DataBase{
        public static int|string $currentPage;
        public static $localisation;
        public static $excursion;
        public static $typev;
        public static $tarifsadu;
        public static $tarifsenf;
        public static int|string $excursionUuid;
        public static int|string $excursionId;
        public static int|string $depart;
        public static int|string $arrive;
        public static string $filter;
        public static int|string $vehicleUuid;

        public static $tarifsId;


        public static function addtarifs(){
            $add = "INSERT INTO tarifs(excursionUuid, typev, tarifsadu,tarifsenf) VALUES (:excursion, :typev, :tarifsadu,:tarifsenf)";
            $stmt = parent::$pdo->prepare($add);
            $stmt->execute([
                ':excursion' => self::$excursion, 
                ':typev' => self::$typev,
                ':tarifsadu' => self::$tarifsadu,
                ':tarifsenf' => self::$tarifsenf,


            ]);
        
            RequestError::success("tarifs Ajouter!");
        }

        public static function gettarifss(){
            (new self)->__construct();
    
            $total = "SELECT id FROM tarifs";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totaltarifss = $totalStmt->rowCount();

            $perPage = 15;
            $totalPages = ceil($totaltarifss/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
            $tarifss = "SELECT tarifs.id, typevehicle.vtype, typevehicle.placemi,typevehicle.placemx ,excursion.nom,excursion.type , tarifs.tarifsenf, tarifs.tarifsadu FROM tarifs LEFT JOIN typevehicle ON typevehicle.vtypeUuid =tarifs.typev LEFT JOIN excursion  ON excursion.excursionUuid = tarifs.excursionUuid ORDER BY tarifs.id ASC LIMIT :s, :t";
            $tarifssStmt = self::$pdo->prepare($tarifss);
            $tarifssStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);
            $perPage = 15;
            $totalPages = ceil($totaltarifss/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
            $tarifss = "SELECT tarifs.id, typevehicle.vtype, typevehicle.placemi,typevehicle.placemx ,excursion.nom,excursion.type , tarifs.tarifsenf, tarifs.tarifsadu FROM tarifs LEFT JOIN typevehicle ON typevehicle.vtypeUuid =tarifs.typev LEFT JOIN excursion  ON excursion.excursionUuid = tarifs.excursionUuid ORDER BY tarifs.id ASC LIMIT :s, :t";
            $tarifssStmt = self::$pdo->prepare($tarifss);
            $tarifssStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $tarifssStmt->fetchAll(PDO::FETCH_ASSOC);

            RequestError::array(name: "totalVehicles", totalItem: $totaltarifss, data: $data, totalPages: $totalPages, currentPage: self::$currentPage);

        }
        public static function gettarifsstat(){
            (new self)->__construct();
            $total = "SELECT id FROM tarifs";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totaltarifss = $totalStmt->rowCount();

            $perPage = 15;
            $totalPages = ceil($totaltarifss/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
            $tarifss = "SELECT tarifs.id, typevehicle.vtypeUuid, typevehicle.placemi,typevehicle.placemx ,excursion.nom,excursion.excursionUuid , tarifs.tarifsenf, tarifs.tarifsadu FROM tarifs LEFT JOIN typevehicle ON typevehicle.vtypeUuid =tarifs.typev LEFT JOIN excursion  ON excursion.excursionUuid = tarifs.excursionUuid ORDER BY tarifs.id ASC LIMIT :s, :t";
            $tarifssStmt = self::$pdo->prepare($tarifss);
            $tarifssStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);
            $perPage = 15;
            $totalPages = ceil($totaltarifss/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
            $tarifss = "SELECT tarifs.id, typevehicle.vtypeUuid, typevehicle.placemi,typevehicle.placemx ,excursion.nom,excursion.excursionUuid , tarifs.tarifsenf, tarifs.tarifsadu FROM tarifs LEFT JOIN typevehicle ON typevehicle.vtypeUuid =tarifs.typev LEFT JOIN excursion  ON excursion.excursionUuid = tarifs.excursionUuid ORDER BY tarifs.id ASC LIMIT :s, :t";
            $tarifssStmt = self::$pdo->prepare($tarifss);
            $tarifssStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $tarifssStmt->fetchAll(PDO::FETCH_ASSOC);


            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "totalOrdre" => $totalOrdre,
                "role" => $_SESSION['userRole'],
                "userUuid" => $_SESSION['userUuid'],
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
        

        ///// getting excursion from tarifs for select input 
    

        public static function deletetarifs():void{
            (new self)->__construct();
            $delete = "DELETE FROM tarifs WHERE id =:id";
            $tarifsStmt = self::$pdo->prepare($delete);
            $tarifsStmt->execute([
                ':id' => self::$tarifsId
            ]);

            echo json_encode([
                "StatusCode" => 200,
                "status" => true,
                "message" => "tarifs a été supprimer"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }
        public static function gettarifs(): array {

         
            $tarifss = "SELECT tarifs.id,typevehicle.vtype, typevehicle.vtypeUuid, typevehicle.placemi,typevehicle.placemx ,excursion.type,excursion.nom,excursion.excursionUuid , tarifs.tarifsenf, tarifs.tarifsadu FROM tarifs LEFT JOIN typevehicle ON typevehicle.vtypeUuid =tarifs.typev LEFT JOIN excursion  ON excursion.excursionUuid = tarifs.excursionUuid WHERE tarifs.id = :id";
            $stmt = parent::$pdo->prepare($tarifss);
            $stmt->execute([
                ':id' => self::$tarifsId
            ]);
        
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            $count = $stmt->rowCount();
        
            return [
                "status" => true,
                "data" => $data,
                "count" => $count
            ];
        }
        
        public static function searchtarifs($search):void{
  
        
            (new self)->__construct();

            $total = "SELECT excursion.nom FROM tarifs LEFT JOIN excursion ON excursion.excursionUuid=tarifs.excursionUuid WHERE excursion.nom LIKE :search";
    $totalStmt = self::$pdo->prepare($total);
    $totalStmt->execute([
        ':search' => '%' . $search . '%'
    ]);
    $totalDrivers = $totalStmt->rowCount();

    $perPage = 15;
    $totalPages = ceil($totalDrivers / $perPage);
    $offset = (self::$currentPage - 1) * $perPage;

    $tarifss = "SELECT tarifs.id, typevehicle.vtypeUuid,typevehicle.vtype, typevehicle.placemi, typevehicle.placemx, excursion.nom, excursion.excursionUuid, tarifs.tarifsenf, tarifs.tarifsadu FROM tarifs LEFT JOIN typevehicle ON typevehicle.vtypeUuid = tarifs.typev LEFT JOIN excursion ON excursion.excursionUuid = tarifs.excursionUuid WHERE excursion.nom LIKE :search ORDER BY tarifs.id ASC LIMIT :s, :t";
    $driversStmt = self::$pdo->prepare($tarifss);
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
        
        
        public static function alltarifs(){
            $tarifsCheck = "SELECT tarifs.id,typevehicle.vtype, excursion.nom, tarifs.tarifsenf, tarifs.tarifsadu FROM tarifs LEFT JOIN typevehicle ON typevehicle.vtypeUuid =tarifs.typev LEFT JOIN excursion  ON excursion.excursionUuid = tarifs.excursionUuid ORDER BY tarifs.id ASC";
            $tarifsCheckStmt = self::$pdo->prepare($tarifsCheck);
            $tarifsCheckStmt->execute();

            $data = $tarifsCheckStmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }


        public static function updatetarifs(){
            $regisNo = "SELECT id FROM tarifs WHERE id =:id";
            $regisNoStmt = parent::$pdo->prepare($regisNo);
            $regisNoStmt->execute([
                ':id' => self::$tarifsId
            ]);

    
           
            $update = "UPDATE tarifs SET tarifsadu =:tarifsadu,tarifsenf =:tarifsenf WHERE id =:id";
            $stmt = parent::$pdo->prepare($update);
            $stmt->execute([
               
               ':tarifsadu' => self::$tarifsadu, 
               ':tarifsenf' => self::$tarifsenf, 
             
               ':id' => self::$tarifsId
            ]);
    
            RequestError::success("tarifs Mis à jour avec succès!");
           
        }
        


        
    }