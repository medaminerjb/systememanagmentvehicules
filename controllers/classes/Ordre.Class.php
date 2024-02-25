<?php
    class Ordre extends DataBase{
        public static $currentPage;
        public static $excursionUuid;
        public static $heure;
        public static $excursion;
        public static $id;
        public static string $filter;
        public static $vehicleUuid;
        public static $driverUuid;
        public static $adulte;
        public static $enfant;
        public static $bebe;
        public static $agence;
        public static $ordreId;
        public static $hotel;
        public static $userUuid;
        public static $chauffeurId;
        public static $chambre;
        public static $depart;
        public static $numero;
        public static $etat;
        public static $heurer;
        public static $dater;
        public static $tarifstadu;
        public static $tarifstenf;



        public static function addOrdre():void{
            (new self)->__construct();
    
        
            $add = "INSERT INTO ordre(agence, heure, excursion,heurer, dater, driverUuid, vehicleUuid,excursionUuid,dateAdded,createdBy) VALUES (:agence, :heure, :excursion,:heurer, :dater, :driverUuid, :vehicleUuid, :excursionUuid ,:dateAdded,:createdBy )";
            $addStmt = self::$pdo->prepare($add);
            $addStmt->execute([
                ':agence' => self::$agence,
                ':heure' => self::$heure,
                ':excursion'=>self::$excursion,
                ':heurer' => self::$heurer,
                ':dater'=>self::$dater,
                ':driverUuid'=>self::$driverUuid,
                ':vehicleUuid'=>self::$vehicleUuid,
                ':excursionUuid'=>self::$excursionUuid,
                ':dateAdded' => date('F j, Y'),
                ':createdBy'=>$_SESSION['userUuid']
            ]);
            $update = "UPDATE vehicles SET etat = 'in use' WHERE vehicleUuid =:vehicleUuid";
            $ordreStmt = parent::$pdo->prepare($update);
            $ordreStmt->execute([
                ':vehicleUuid'=>self::$vehicleUuid,
            ]);
            $update = "UPDATE drivers SET etat = 'in use' WHERE driverUuid =:driverUuid";
            $ordreStmt = parent::$pdo->prepare($update);
            $ordreStmt->execute([
                ':driverUuid'=>self::$driverUuid,
            ]);
            echo json_encode([
                "status" => true,
                "message" => "ordre de mission Ajoutée"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
     
        }

      

    

public static function getOrdre():array {
    
    $get = "SELECT ordre.id,ordre.heurer,ordre.dater,users.fullName, ordre.etat,ordre.agence, ordre.dateAdded, ordre.heure, ordre.excursion, modelsvehicle.place, typevehicle.vtype, ordre.placeocu, vehicles.regisNumber, excursion.nom,excursion.ligne, drivers.driverFullName, ordre.driverUuid, drivers.phoneMobile, excursion.type, MAX(km.arrive) as kmdepart, excursion.excursionUuid, vehicles.vehicleUuid
    FROM ordre
    LEFT JOIN excursion ON excursion.excursionUuid = ordre.excursionUuid
    LEFT JOIN vehicles ON vehicles.vehicleUuid = ordre.vehicleUuid
    LEFT JOIN drivers ON drivers.driverUuid = ordre.driverUuid
    LEFT JOIN km ON km.vehicleUuid = ordre.vehicleUuid
    LEFT JOIN users ON users.userUuid = ordre.createdBy

    LEFT JOIN modelsvehicle ON modelsvehicle.modelUuid = vehicles.modelUuid
    INNER JOIN typevehicle ON typevehicle.vtypeUuid = modelsvehicle.vtypeUuid
    WHERE ordre.id = :id";
        $stmt = parent::$pdo->prepare($get);
    $stmt->execute([
        ':id' => self::$ordreId
    ]);

    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    $count = $stmt->rowCount();

    return [
        "status" => true,
        "data" => $data,
        "count" => $count
    ];

}


public static function searchOrdre($search):void{
  
        
    (new self)->__construct();
    
    $total = "SELECT ordre.excursion  FROM ordre WHERE ordre.excursion LIKE :search";
    $totalStmt = self::$pdo->prepare($total);
    $totalStmt->execute([
        ':search' => '%' . $search . '%'
    ]);
    $totalDrivers = $totalStmt->rowCount();

    $perPage = 15;
    $totalPages = ceil($totalDrivers / $perPage);
    $offset = (self::$currentPage - 1) * $perPage;

    $get = "SELECT ordre.id,ordre.heurer,ordre.dater,users.fullName, ordre.etat,ordre.agence, ordre.dateAdded, ordre.heure, ordre.excursion, modelsvehicle.place, typevehicle.vtype, ordre.placeocu, vehicles.regisNumber, excursion.nom,excursion.ligne, drivers.driverFullName, ordre.driverUuid, drivers.phoneMobile, excursion.type, MAX(km.arrive) as kmdepart, excursion.excursionUuid, vehicles.vehicleUuid
    FROM ordre
    LEFT JOIN excursion ON excursion.excursionUuid = ordre.excursionUuid
    LEFT JOIN vehicles ON vehicles.vehicleUuid = ordre.vehicleUuid
    LEFT JOIN drivers ON drivers.driverUuid = ordre.driverUuid
    LEFT JOIN km ON km.vehicleUuid = ordre.vehicleUuid
    LEFT JOIN users ON users.userUuid = ordre.createdBy

    LEFT JOIN modelsvehicle ON modelsvehicle.modelUuid = vehicles.modelUuid
    INNER JOIN typevehicle ON typevehicle.vtypeUuid = modelsvehicle.vtypeUuid
    WHERE ordre.excursion LIKE :search ORDER BY ordre.id DESC LIMIT :s,:t";
        $driversStmt = self::$pdo->prepare($get);
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



public static function getOrdrestat(){
    (new self)->__construct();
        $total = "SELECT id FROM ordre";
    
    $totalStmt = self::$pdo->prepare($total);
    $totalStmt->execute();
    $totalOrdre = $totalStmt->rowCount();

    $ordre = "SELECT ordre.id, ordre.excursion,ordre.excursionUuid,excursion.nom, typevehicle.placemi,typevehicle.placemx,typevehicle.vtype FROM ordre LEFT JOIN excursion ON excursion.excursionUuid = ordre.excursionUuid LEFT JOIN vehicles ON ordre.vehicleUuid =vehicles.vehicleUuid  LEFT JOIN modelsvehicle ON modelsvehicle.modelUuid = vehicles.modelUuid
    INNER JOIN typevehicle ON typevehicle.vtypeUuid = modelsvehicle.vtypeUuid WHERE excursion.type != 'mission' ORDER BY ordre.id DESC";
    $statStmt = self::$pdo->prepare($ordre);
    $statStmt->execute();

    $data = $statStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => true,
        "data" => $data,
        "totalOrdre" => $totalOrdre,
        "role" => $_SESSION['userRole'],
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
}
 public static function getOrdrestatexcursion(){
    (new self)->__construct();
    if(self::$filter === 'all'){
        $total = "SELECT id FROM ordre";
    }
    else{
        $total = "SELECT id FROM ordre";
    }
    $totalStmt = self::$pdo->prepare($total);
    $totalStmt->execute();
    $totalOrdre = $totalStmt->rowCount();

    $perPage = 15;
    $totalPages = ceil($totalOrdre/$perPage);
    $offset = (self::$currentPage - 1) * $perPage;
    if(self::$filter === 'all'){
        $ordre = "SELECT ordre.id, ordre.excursion , ordre.excursionUuid FROM ordre INNER JOIN excursion ON ordre.excursionUuid = excursion.excursionUuid WHERE excursion.type = 'excursion' ORDER BY ordre.excursion ASC LIMIT :s, :t";
    }else{
        $ordre = "SELECT ordre.id, ordre.excursion , ordre.excursionUuid FROM ordre INNER JOIN excursion ON ordre.excursionUuid = excursion.excursionUuid WHERE excursion.type = 'excursion' ORDER BY ordre.excursion ASC LIMIT :s, :t";
    }

    $statStmt = self::$pdo->prepare($ordre);
    $statStmt->execute([
        ':s' => $offset,
        ':t' => $perPage
    ]);

    $data = $statStmt->fetchAll(PDO::FETCH_ASSOC);

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
public static function getOrdrestatmission(){
    (new self)->__construct();
    if(self::$filter === 'all'){
        $total = "SELECT id FROM ordre";
    }
    else{
        $total = "SELECT id FROM ordre";
    }
    $totalStmt = self::$pdo->prepare($total);
    $totalStmt->execute();
    $totalOrdre = $totalStmt->rowCount();

    $perPage = 15;
    $totalPages = ceil($totalOrdre/$perPage);
    $offset = (self::$currentPage - 1) * $perPage;
    if(self::$filter === 'all'){
        $ordre = "SELECT ordre.id, ordre.excursion , ordre.excursionUuid FROM ordre INNER JOIN excursion ON ordre.excursionUuid = excursion.excursionUuid WHERE excursion.type = 'mission' ORDER BY ordre.excursion ASC LIMIT :s, :t";
    }else{
        $ordre = "SELECT ordre.id, ordre.excursion , ordre.excursionUuid FROM ordre INNER JOIN excursion ON ordre.excursionUuid = excursion.excursionUuid WHERE excursion.type = 'mission' ORDER BY ordre.excursion ASC LIMIT :s, :t";
    }

    $ordreStmt = self::$pdo->prepare($ordre);
    $ordreStmt->execute([
        ':s' => $offset,
        ':t' => $perPage
    ]);

    $data = $ordreStmt->fetchAll(PDO::FETCH_ASSOC);

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


        public static function getOrdres():void{
            
            (new self)->__construct();
           
                $total = "SELECT id FROM ordre";
 
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalOrdre = $totalStmt->rowCount();

            $perPage = 15;
            $totalPages = ceil($totalOrdre/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
       
                $ordre = "SELECT 
                ordre.id, 
                ordre.excursion, 
                ordre.agence, 
                ordre.gasoil,
                ordre.etat, 
                users.fullName,
                typevehicle.vtype,
                vehicles.regisNumber, 
                ordre.heure, 
                excursion.nom, 
                excursion.type, 
                drivers.driverUuid, 
                drivers.driverFullName, 
                ordre.kmtotal, 
                ordre.placeocu, 
                modelsvehicle.place
              FROM ordre
              LEFT JOIN excursion ON excursion.excursionUuid = ordre.excursionUuid
              LEFT JOIN vehicles ON vehicles.vehicleUuid = ordre.vehicleUuid
              LEFT JOIN drivers ON drivers.driverUuid = ordre.driverUuid
              LEFT JOIN users ON users.userUuid = ordre.createdBy
              LEFT JOIN modelsvehicle ON modelsvehicle.modelUuid = vehicles.modelUuid
         
              INNER JOIN typevehicle ON typevehicle.vtypeUuid = modelsvehicle.vtypeUuid
              ORDER BY ordre.id DESC 
              LIMIT :s, :t;";
            $ordreStmt = self::$pdo->prepare($ordre);
            $ordreStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $ordreStmt->fetchAll(PDO::FETCH_ASSOC);

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
        public static function getOrdresChauffeur():void{
            
            (new self)->__construct();
            if(self::$filter === 'all'){
                $total = "SELECT id FROM ordre";
            }
            else{
                $total = "SELECT id FROM ordre";
            }
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalOrdre = $totalStmt->rowCount();
            
            $perPage = 15;
            $totalPages = ceil($totalOrdre/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
            if(self::$filter === 'all'){
                $ordre = "SELECT ordre.id, ordre.excursion, ordre.agence, vehicles.regisNumber,ordre.heure, excursion.nom ,excursion.type,drivers.driverUuid,ordre.gasoil,ordre.kmtotal  FROM ordre LEFT JOIN excursion ON excursion.excursionUuid = ordre.excursionUuid LEFT JOIN vehicles ON vehicles.vehicleUuid = ordre.vehicleUuid LEFT JOIN drivers ON drivers.driverUuid = ordre.driverUuid WHERE ordre.driverUuid =:driverUuid ";
            }else{
                $ordre = "SELECT ordre.id, ordre.excursion, vehicles.regisNumber, excursion.nom ,ordre.heure, km.depart, excursion.type,ordre.gasoil,ordre.kmtotal FROM ordre LEFT JOIN excursion ON excursion.excursionUuid = ordre.excursionUuid LEFT JOIN vehicles ON vehicles.vehicleUuid = ordre.vehicleUuid LEFT JOIN km ON km.vehicleUuid = ordre.vehicleUuid LEFT JOIN drivers ON drivers.driverUuid = ordre.driverUuid WHERE ordre.driverUuid =:driverUuid ";
            }

            $ordreStmt = self::$pdo->prepare($ordre);
            $ordreStmt->execute([
                ':driverUuid'=>self::$userUuid
            ]);

            $data = $ordreStmt->fetchAll(PDO::FETCH_ASSOC);

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

        public static function updateOrdre(){
        /*    $regisNo = "SELECT id FROM ordre WHERE id =:id";
            $regisNoStmt = parent::$pdo->prepare($regisNo);
            $regisNoStmt->execute([
                ':id' => self::$ordreId
            ]);*/
            $update = "UPDATE ordre SET agence=:agence, heure=:heure, excursion=:excursion,  driverUuid=:driverUuid, vehicleUuid=:vehicleUuid, excursionUuid=:excursionUuid WHERE id =:id";
            $ordreStmt = parent::$pdo->prepare($update);
            $ordreStmt->execute([
                ':agence' => self::$agence,
                ':heure' => self::$heure,
                ':excursion'=>self::$excursion,
                ':driverUuid'=>self::$driverUuid,
                ':vehicleUuid'=>self::$vehicleUuid,
                ':excursionUuid'=>self::$excursionUuid,
               ':id' => self::$ordreId
            ]);
    
            RequestError::success("ordre Mis à jour avec succès!");
           
        }
        public static function confiermerticket(){

            $update = "UPDATE ticket SET depart =:depart,adulter=:adulte,enfantr=:enfant,beber=:bebe,etat=:etat,tarifstadu=:tarifstadu,tarifstenf=:tarifstenf WHERE numero =:numero";
            $ordreStmt = parent::$pdo->prepare($update);
            $ordreStmt->execute([

                ':depart' => self::$depart,
                ':numero' => self::$numero,
                ':adulte'=>self::$adulte,
                ':enfant'=>self::$enfant,
                ':bebe'=>self::$bebe,
                ':etat'=>self::$etat,
                ':tarifstadu'=>self::$tarifstadu,
                ':tarifstenf'=>self::$tarifstenf,

            ]);
            RequestError::success("ticket Confirmer avec succès!");

        }
        public static function confirmerordre(){
            $update = "UPDATE ordre SET etat = :etat WHERE id = :id";
            $ordreStmt = parent::$pdo->prepare($update);
            $ordreStmt->execute([
                ':etat' => self::$etat,
                ':id' => self::$ordreId
            ]);
            RequestError::success("ordre Confirmer avec succès!");
        
            // Redirect to another page
            header("/ordres");
            exit();
        }
        

        public static function deleteOrdre():void{
            (new self)->__construct();
            $delete = "DELETE FROM ordre WHERE id =:id";
            $ordreStmt = self::$pdo->prepare($delete);
            $ordreStmt->execute([
                ':id' => self::$ordreId
            ]);

            echo json_encode([
                "StatusCode" => 200,
                "status" => true,
                "message" => "ordre a été supprimer"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

    }
