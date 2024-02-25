<?php
    class Km extends DataBase{
        public static int|string $currentPage;
        public static int|string $excursionUuid;
        public static int|string $kilometergeId;
        public static int|string $driverUuid;
public static $userUuid;
public static $diff;
public static $date;
public static $ordreId;
public static int|string $depart;
        public static int|string $arrive;
        public static string $filter;
        public static int|string $vehicleUuid;
        public static int|string $etat;


        public static function addkilometerge():void{
           (new self)->__construct();

   
          
        
         $update = "UPDATE ordre SET kmtotal=:kmtotal WHERE id =:id";
             $stmt = parent::$pdo->prepare($update);
             $stmt->execute([
                 ':kmtotal' => self::$diff,
                 ':id' => self::$ordreId
                    ]);

            $add = "INSERT INTO km(depart, arrive ,diff ,date ,vehicleUuid , excursionUuid,driverUuid,createdBy) VALUES (:depart, :arrive, :diff, :date,:vehicleUuid , :excursionUuid,:driverUuid,:createdBy)";
            $addStmt = self::$pdo->prepare($add);
            $addStmt->execute([
                ':diff' => self::$diff,
                ':depart' => self::$depart,
                ':arrive' => self::$arrive,
                ':date'=>self::$date,
                ':vehicleUuid'=>self::$vehicleUuid,
                ':excursionUuid'=>self::$excursionUuid,
                ':driverUuid'=>self::$driverUuid,
                ':createdBy'=>$_SESSION['userUuid']
            ]);
            if(isset(self::$etat)){
                $update = "UPDATE vehicles SET etat =:etat WHERE vehicleUuid =:vehicleUuid";
            $ordreStmt = parent::$pdo->prepare($update);
            $ordreStmt->execute([
                ':etat'=>self::$etat,
                ':vehicleUuid'=>self::$vehicleUuid,
            ]);
            }
            else{$update = "UPDATE vehicles SET etat = 'not in use' WHERE vehicleUuid =:vehicleUuid";
            $ordreStmt = parent::$pdo->prepare($update);
            $ordreStmt->execute([
                ':vehicleUuid'=>self::$vehicleUuid,
            ]);}
            $update = "UPDATE drivers SET etat = 'not in use' WHERE driverUuid =:driverUuid";
            $ordreStmt = parent::$pdo->prepare($update);
            $ordreStmt->execute([
                ':driverUuid'=>self::$driverUuid,
            ]);

            echo json_encode([
                "status" => true,
                "message" => "Kilometerage a été Ajoutée!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }

      
///geting kilometerge 
        public static function getKilometerge():void{
            (new self)->__construct();
          
                $total = "SELECT depart FROM km";
          
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalSalary = $totalStmt->rowCount();

            $perPage = 15;
            $totalPages = ceil($totalSalary/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
          
                $kilometrege = "SELECT km.id, km.depart, km.arrive , vehicles.regisNumber, excursion.nom ,drivers.driverFullName,users.fullName FROM km LEFT JOIN users ON users.userUuid=km.createdBy LEFT JOIN excursion ON excursion.excursionUuid = km.excursionUuid LEFT JOIN vehicles ON vehicles.vehicleUuid = km.vehicleUuid  LEFT JOIN drivers ON drivers.driverUuid = km.driverUuid ORDER BY km.id DESC LIMIT :s, :t";
    
            $kmStmt = self::$pdo->prepare($kilometrege);
            $kmStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $kmStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "totalSalaries" => $totalSalary,
                "role" => $_SESSION['userRole'],
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

        public static function searchKm($search):void{
  
        
            (new self)->__construct();

            $total = "SELECT vehicles.regisNumber FROM vehicles LEFT JOIN km ON km.vehicleUuid=vehicles.vehicleUuid WHERE vehicles.regisNumber LIKE :search";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute([
                ':search' => '%' . $search . '%'
            ]);
            $totalDrivers = $totalStmt->rowCount();
       
            $perPage = 15;
            $totalPages = ceil($totalDrivers / $perPage);
            $offset = (self::$currentPage - 1) * $perPage;
       
            $kilometrege = "SELECT km.id, km.depart, km.arrive , vehicles.regisNumber, excursion.nom ,drivers.driverFullName FROM km LEFT JOIN excursion ON excursion.excursionUuid = km.excursionUuid LEFT JOIN vehicles ON vehicles.vehicleUuid = km.vehicleUuid  LEFT JOIN drivers ON drivers.driverUuid = km.driverUuid WHERE vehicles.regisNumber LIKE :search ORDER BY km.id DESC LIMIT :s, :t";
            $driversStmt = self::$pdo->prepare($kilometrege);
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
        
        public static function getKilometergechauffeur():void{
            (new self)->__construct();
            if(self::$filter === 'all'){
                $total = "SELECT depart FROM km";
            }
            else{
                $total = "SELECT depart FROM km";
            }
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalSalary = $totalStmt->rowCount();

            $perPage = 15;
            $totalPages = ceil($totalSalary/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
            if(self::$filter === 'all'){
                $kilometrege = "SELECT km.id, km.depart, km.arrive , vehicles.regisNumber, excursion.nom ,drivers.driverFullName FROM km LEFT JOIN excursion ON excursion.excursionUuid = km.excursionUuid LEFT JOIN vehicles ON vehicles.vehicleUuid = km.vehicleUuid  LEFT JOIN drivers ON drivers.driverUuid = km.driverUuid WHERE km.driverUuid =:driverUuid";
            }else{
                $kilometrege = "SELECT km.id, km.depart, km.arrive , vehicles.regisNumber, excursion.nom ,drivers.driverFullName FROM km LEFT JOIN excursion ON excursion.excursionUuid = km.excursionUuid LEFT JOIN vehicles ON vehicles.vehicleUuid = km.vehicleUuid  LEFT JOIN drivers ON drivers.driverUuid = km.driverUuid WHERE km.driverUuid =:driverUuid";
            }/*
            if(self::$filter === 'all'){
                $kilometrege = "SELECT km.id, km.vehicleUuid, km.driverUuid, km.depart, km.arrive FROM km LEFT JOIN vehicles ON vehicles.vehicleUuid = km.vehicleUuid ORDER BY km.id DESC LIMIT :s, :t";
            }else{
                $kilometrege ="SELECT km.id, km.vehicleUuid, km.driverUuid, km.depart, km.arrive FROM km LEFT JOIN vehicles ON vehicles.vehicleUuid = km.vehicleUuid ORDER BY km.id DESC LIMIT :s, :t";
            }
*/
            $kmStmt = self::$pdo->prepare($kilometrege);
            $kmStmt->execute([
                ':driverUuid'=>self::$userUuid
            ]);

            $data = $kmStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "totalSalaries" => $totalSalary,
                "role" => $_SESSION['userRole'],
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

        

        public static function deleteKm():void{
            (new self)->__construct();
            $delete = "DELETE FROM km WHERE id =:id";
            $salaryStmt = self::$pdo->prepare($delete);
            $salaryStmt->execute([
                ':id' => self::$kilometergeId
            ]);

            echo json_encode([
                "StatusCode" => 200,
                "status" => true,
                "message" => "kilometerge a été supprimer"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }
        public static function getKm():array {
            $get = "SELECT km.depart, km.arrive ,users.fullName, vehicles.regisNumber, excursion.nom ,vehicles.vehicleUuid,excursion.excursionUuid ,drivers.driverFullName FROM km LEFT JOIN users ON users.userUuid=km.createdBy LEFT JOIN excursion ON excursion.excursionUuid = km.excursionUuid LEFT JOIN vehicles ON vehicles.vehicleUuid = km.vehicleUuid LEFT JOIN drivers ON drivers.driverUuid = km.driverUuid WHERE km.id =:id";
            $stmt = parent::$pdo->prepare($get);
            $stmt->execute([
                ':id' => self::$kilometergeId
            ]);

            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            $count = $stmt->rowCount();

            return [
                "status" => true,
                "data" => $data,
                "count" => $count
            ];
        }


        

      
        //"SELECT k1.* FROM km k1 WHERE NOT EXISTS ( SELECT 1 FROM km k2 WHERE k2.vehicle_id = k1.vehicle_id AND k2.date_time > k1.date_time );";
         public static function kmhis(){
            $kmCheck="SELECT vehicleUuid, MAX(arrive) FROM km GROUP BY vehicleUuid;" ;
            $kmCheckStmt = self::$pdo->prepare($kmCheck);
            $kmCheckStmt->execute();

            $data = $kmCheckStmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
         }



         
         public static function updateKm(){
            $regisNo = "SELECT id FROM km WHERE id =:id";
            $regisNoStmt = parent::$pdo->prepare($regisNo);
            $regisNoStmt->execute([
                ':id' => self::$kilometergeId
            ]);

           
            
           
            $update = "UPDATE km SET depart =:depart, arrive =:arrive ,excursionUuid =:excursionUuid ,vehicleUuid =:vehicleUuid ,driverUuid =:driverUuid WHERE id =:id";
            $stmt = parent::$pdo->prepare($update);
            $stmt->execute([
               
               ':depart' => self::$depart, 
               ':arrive' => self::$arrive, 
               ':vehicleUuid' => self::$vehicleUuid, 
               ':excursionUuid' => self::$excursionUuid,
               ':driverUuid'=> self::$driverUuid, 
             
               ':id' => self::$kilometergeId
            ]);
    
            RequestError::success("kilometerage Mis à jour avec succès!");
           
        }


        
    }