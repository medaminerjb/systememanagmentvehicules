<?php
    class Carburants extends DataBase{
        public static int|string $currentPage;
        public static int|string $excursionUuid;
        public static int|string $ordreId;
        public static int|string $vehicleIdd;

        public static int|string $driverUuid;
        public static $diff;
        public static $etat;
        public static $date;
        public static $total;
        public static $prix;
        public static $quantite;
        public static $typec;
        public static $obeservation;
        public static int|string $depart;
        public static int|string $arrive;
        public static string $filter;
        public static $vehicleUuid;
        public static $carburantId;

        public static function addcarburant():void{
            (new self)->__construct();

            $adds = "INSERT INTO km(depart, arrive ,diff ,date ,vehicleUuid , excursionUuid,driverUuid,createdBy) VALUES (:depart, :arrive, :diff, :date,:vehicleUuid ,:excursionUuid,:driverUuid,:createdBy)";
            $addsStmt = self::$pdo->prepare($adds);
            $addsStmt->execute([
                ':diff' => self::$diff,
                ':depart' => self::$depart,
                ':arrive' => self::$arrive,
                ':date'=>self::$date,
                ':vehicleUuid'=>self::$vehicleUuid,
                ':excursionUuid'=>self::$excursionUuid,
                ':driverUuid'=>self::$driverUuid,
                ':createdBy'=>$_SESSION['userUuid']
            ]);

         $add = "INSERT INTO carburant( date, obeservation, type, quantite, prix, total,ordreId ,driverUuid,vehicleUuid,excursionUuid,createdBy) VALUES (:date, :obeservation, :type, :quantite,:prix , :total,:ordreId,:driverUuid,:vehicleUuid,:excursionUuid,:createdBy)";
            $addStmt = self::$pdo->prepare($add);
            $addStmt->execute([
                ':date' => self::$date,
                ':obeservation' => self::$obeservation,
                ':type' => self::$typec,
                ':quantite'=>self::$quantite,
                ':prix'=>self::$prix,
                ':total'=>self::$total,
                ':ordreId'=>self::$ordreId,
                ':vehicleUuid'=>self::$vehicleUuid,
                ':excursionUuid'=>self::$excursionUuid,
                ':driverUuid'=>self::$driverUuid,
                ':createdBy'=>$_SESSION['userUuid']
            ]);
        $update = "UPDATE ordre SET kmtotal=:kmtotal,gasoil=:quantite WHERE id =:id";
            $stmt = parent::$pdo->prepare($update);
            $stmt->execute([
                ':kmtotal' => self::$diff,
                ':quantite' => self::$quantite,
                ':id' => self::$ordreId
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
                "message" => "carburant a été Ajoutée!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }


        public static function getcarburants():void{
            (new self)->__construct();

            $total = "SELECT id FROM carburant";
          
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalSalary = $totalStmt->rowCount();

            $perPage = 15;
            $totalPages = ceil($totalSalary/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
        
                $carburant = "SELECT carburant.id, carburant.obeservation,carburant.date, carburant.type , carburant.total , vehicles.regisNumber, excursion.nom ,users.fullName,drivers.driverFullName FROM carburant LEFT JOIN users ON users.userUuid=carburant.createdBy LEFT JOIN excursion ON excursion.excursionUuid = carburant.excursionUuid LEFT JOIN vehicles ON vehicles.vehicleUuid = carburant.vehicleUuid LEFT JOIN drivers ON drivers.driverUuid = carburant.driverUuid ORDER BY carburant.id DESC LIMIT :s, :t";
            $carburantStmt = self::$pdo->prepare($carburant);
            $carburantStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $carburantStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "totalSalaries" => $totalSalary,
                "role" => $_SESSION['userRole'],
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }
        public static function searchCarburant($search):void{
  
        
            (new self)->__construct();

   
            $total = "SELECT vehicles.regisNumber FROM carburant LEFT JOIN vehicles ON vehicles.vehicleUuid=carburant.vehicleUuid WHERE vehicles.regisNumber LIKE :search";
    

            
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute([
                ':search' => '%' . $search . '%'
            ]);
            $totalDrivers = $totalStmt->rowCount();
       
            $perPage = 15;
            $totalPages = ceil($totalDrivers / $perPage);
            $offset = (self::$currentPage - 1) * $perPage;
         
            $carburant = "SELECT carburant.id, carburant.obeservation,carburant.date, carburant.type , carburant.total , vehicles.regisNumber, excursion.nom ,drivers.driverFullName FROM carburant LEFT JOIN excursion ON excursion.excursionUuid = carburant.excursionUuid LEFT JOIN vehicles ON vehicles.vehicleUuid = carburant.vehicleUuid LEFT JOIN drivers ON drivers.driverUuid = carburant.driverUuid WHERE vehicles.regisNumber LIKE :search ORDER BY carburant.id DESC LIMIT :s, :t";
         
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
        
        public static function getCarburant():array {
                        
            $carburant = "SELECT carburant.id,users.fullName, carburant.obeservation,carburant.date, carburant.quantite,carburant.prix, carburant.type , carburant.total , vehicles.regisNumber,carburant.vehicleUuid, excursion.nom,carburant.excursionUuid ,carburant.driverUuid,drivers.driverFullName FROM carburant LEFT JOIN users ON carburant.createdBy=users.userUuid LEFT JOIN excursion ON excursion.excursionUuid = carburant.excursionUuid LEFT JOIN vehicles ON vehicles.vehicleUuid = carburant.vehicleUuid LEFT JOIN drivers ON drivers.driverUuid = carburant.driverUuid WHERE carburant.id=:id";
            $stmt = parent::$pdo->prepare($carburant);
            $stmt->execute([
                ':id' => self::$carburantId
            ]);

            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            $count = $stmt->rowCount();

            return [
                "status" => true,
                "data" => $data,
                "count" => $count
            ];
        }
        public static function deleteCarburant():void{
            (new self)->__construct();
            $delete = "DELETE FROM carburant WHERE id =:id";
            $carburantStmt = self::$pdo->prepare($delete);
            $carburantStmt->execute([
                ':id' => self::$carburantId
            ]);

            echo json_encode([
                "StatusCode" => 200,
                "status" => true,
                "message" => "ordre a été supprimer"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }
        public static function updateCarburant(){
            /*  $regisNo = "SELECT id FROM ordre WHERE id =:id";
                $regisNoStmt = parent::$pdo->prepare($regisNo);
                $regisNoStmt->execute([
                    ':id' => self::$ordreId
                ]);*/
                $update = "UPDATE carburant SET date=:date, obeservation=:obeservation, type=:type, quantite=:quantite, prix=:prix, total=:total, driverUuid=:driverUuid, vehicleUuid=:vehicleUuid, excursionUuid=:excursionUuid WHERE id =:id";
                $ordreStmt = parent::$pdo->prepare($update);
                $ordreStmt->execute([
                    ':date' => self::$date,
                    ':obeservation' => self::$obeservation,
                    ':type' => self::$typec,
                    ':quantite'=>self::$quantite,
                    ':prix'=>self::$prix,
                    ':total'=>self::$total,
                    ':vehicleUuid'=>self::$vehicleUuid,
                    ':excursionUuid'=>self::$excursionUuid,
                    ':driverUuid'=>self::$driverUuid,
                    ':id'=>self::$carburantId
                ]);
        
                RequestError::success("carburant Mis à jour avec succès!");
               
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