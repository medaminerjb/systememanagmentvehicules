<?php
    class Driver extends DataBase {
        public static $currentPage;
        public static $driverId;
        public static $userRole;
        public static $userPassword;
        public static $photo;
        public static $fullName;
        public static $bateOfBirth;
        public static $driverIdNo;
        public static $phoneHome;
        public static $phoneMobile;
        public static $idNumber;
        public static $email;
        public static $curAddress;
        public static $prevAddress;
        public static $prevCity;
        public static $prevRegion;
        public static $emergence;
        public static $crime;
        public static $position;
        public static $salary;
        public static $workedInCompany;
        public static $currentlyEmp;
        public static $preventedLawful;
        public static $convictedFelony;
        public static $drivingLicense;
        public static $highestEdu;
        public static $fullKnowledge;
        public static $expTractor;
        public static $expTruck;
        public static $expTrailer;
        public static $expBus;
        public static $expVan;
        public static $expTaxi;
        public static $accidentRecord;
        public static $traffic;
        public static $chauffeurId;
        public static function guidv4($data = null):string {
            // Generate 16 bytes (128 bits) of random data or use the data passed into the function.
            $data = $data ?? random_bytes(16);
            assert(strlen($data) == 16);
        
            // Set version to 0100
            $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
            // Set bits 6-7 to 10
            $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        
            // Output the 36 character UUID.
            return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
        }

        
        public static function driverId():string | array {
            $newDriverId = sprintf("%06d", mt_rand(1, 999999));
            $idCheck = "SELECT driverIdNo FROM drivers WHERE driverIdNo =:id";
            $idCheckStmt = self::$pdo->prepare($idCheck);
            $idCheckStmt->execute([
                ':id' => $newDriverId
            ]);
            $idCount = $idCheckStmt->rowCount();
            if($idCount > 0){
                return $newDriverId + 5;
            }else{
                return $newDriverId;
            }
        }

        public static function getDrivers():void{
            (new self)->__construct();
            $total = "SELECT driverUuid FROM drivers";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalDrivers = $totalStmt->rowCount();

            $perPage = 15;
            $totalPages = ceil($totalDrivers/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;

            $drivers = "SELECT drivers.driverUuid, drivers.driverFullName, drivers.driverIdNo, drivers.phoneMobile, drivers.email FROM drivers ORDER BY drivers.id DESC LIMIT :s, :t";
            $driversStmt = self::$pdo->prepare($drivers);
            $driversStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $driversStmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "totalDrivers" => $totalDrivers,
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

        public static function searchDrivers($search):void{
            (new self)->__construct();
            $total = "SELECT driverUuid FROM drivers WHERE driverFullName LIKE :search";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute([
                ':search' => '%'.$search.'%'
            ]);
            $totalDrivers = $totalStmt->rowCount();

            $perPage = 15;
            $totalPages = ceil($totalDrivers/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;

            $drivers = "SELECT drivers.driverUuid, drivers.driverFullName, drivers.driverIdNo, drivers.phoneMobile, drivers.email FROM drivers WHERE drivers.driverFullName LIKE :search ORDER BY drivers.id DESC LIMIT :s, :t";
            $driversStmt = self::$pdo->prepare($drivers);
            $driversStmt->execute([
                ':s' => $offset,
                ':t' => $perPage,
                ':search' => '%'.$search.'%'
            ]);

            $data = $driversStmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "totalDrivers" => $totalDrivers,
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

        public static function addDriver():void{
            (new self)->__construct();
            $newUuid = self::guidv4();
    
            $searchUuid = "SELECT driverUuid FROM drivers WHERE driverUuid =:uuid";
            $searchUuidStmt = self::$pdo->prepare($searchUuid);
            $searchUuidStmt->execute([
                ':uuid' => $newUuid
            ]);
            $uuidCount = $searchUuidStmt->rowCount();

            if($uuidCount > 0){
                $driverUuid = $newUuid.'-'.time();
            }else{
                $driverUuid = $newUuid;
            }

            $userRole = 'chauffeur';
            $newDriverId = self::driverId();

            $idCheck = "SELECT driverIdNo FROM drivers WHERE driverIdNo =:id";
            $idCheckStmt = self::$pdo->prepare($idCheck);
            $idCheckStmt->execute([
                ':id' => $newDriverId
            ]);
            $idCount = $idCheckStmt->rowCount();
            if($idCount > 0){
                self::$driverIdNo = $newDriverId.'DR';
            }else{
                self::$driverIdNo = $newDriverId;
            }

           $userPassword = password_hash(self::$userPassword, PASSWORD_DEFAULT);
            $adduser = "INSERT INTO users (fullName, bateOfBirth, phoneOne, phoneTwo, idNumber, userEmail, userRole,userPassword,userUuid) VALUES (:fullName, :bateOfBirth, :phoneHome, :phoneMobile, :idNumber, :email, :userRole,:userPassword,:userUuid)";
            $adduserstmt = self::$pdo->prepare($adduser);
            $adduserstmt->execute([
                ':fullName' => self::$fullName, 
                ':bateOfBirth' => self::$bateOfBirth, 
                ':phoneHome' => self::$phoneHome, 
                ':phoneMobile' => self::$phoneMobile, 
                ':idNumber' => self::$phoneMobile, 
                ':email' => self::$email, 
                ':userRole' => $userRole,
                ':userPassword'=>$userPassword,
                ':userUuid'=>$driverUuid
            ]);
            $addDriver = "INSERT INTO drivers(driverFullName, bateOfBirth, driverIdNo, phoneHome, phoneMobile, idNumber, email, driverUuid, dateAdded,etat) VALUES (:fullName, :bateOfBirth, :driverIdNo, :phoneHome, :phoneMobile, :idNumber, :email, :driverUuid, :dateAdded,'not in use')";
            $addDriverStmt = self::$pdo->prepare($addDriver);
            $addDriverStmt->execute([
               
               
                ':fullName' => self::$fullName, 
                ':bateOfBirth' => self::$bateOfBirth, 
                ':driverIdNo' => self::$driverIdNo, 
                ':phoneHome' => self::$phoneHome, 
                ':phoneMobile' => self::$phoneMobile, 
                ':idNumber' => self::$idNumber, 
                ':email' => self::$email, 
                ':driverUuid' => $driverUuid, 
                ':dateAdded' => date('F j, Y')
            ]);
        }
        public static function alldrivers(){
            $drivers = "SELECT drivers.driverUuid, drivers.driverFullName, drivers.driverIdNo, drivers.phoneMobile, drivers.email FROM drivers WHERE etat = 'not in use' ORDER BY drivers.id ";
            $driverCheckStmt = self::$pdo->prepare($drivers);
            $driverCheckStmt->execute();
        
            $data = $driverCheckStmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        
        }

        public static function updateDriver():void{
            (new self)->__construct();

            $addDriver = "UPDATE drivers SET  driverFullName =:fullName, bateOfBirth =:bateOfBirth, phoneHome =:phoneHome, phoneMobile =:phoneMobile, idNumber =:idNumber, email =:email WHERE driverUuid =:driverUuid";
            $addDriverStmt = self::$pdo->prepare($addDriver);
            $addDriverStmt->execute([
               
                ':fullName' => self::$fullName, 
                ':bateOfBirth' => self::$bateOfBirth,
                ':phoneHome' => self::$phoneHome, 
                ':phoneMobile' => self::$phoneMobile, 
                ':idNumber' => self::$idNumber, 
                ':email' => self::$email, 
                
                ':driverUuid' => self::$driverId, 
            ]);
        }

        public static function getDriver():void{

            $drivers = "SELECT drivers.driverUuid, drivers.driverFullName, drivers.driverIdNo, drivers.bateOfBirth, drivers.phoneHome, drivers.phoneMobile, drivers.idNumber,drivers.email ,drivers.dateAdded FROM drivers WHERE drivers.driverUuid =:did";
            $driversStmt = self::$pdo->prepare($drivers);
            $driversStmt->execute([
                ':did' => self::$driverId
            ]);

            $data = $driversStmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

        public static function getADriver($driverId): array{

            $drivers = "SELECT drivers.driverUuid, drivers.driverFullName, drivers.driverIdNo,  drivers.email, drivers.bateOfBirth, drivers.phoneHome, drivers.phoneMobile, drivers.idNumber, drivers.dateAdded FROM drivers WHERE driverUuid =:did";
            $driversStmt = self::$pdo->prepare($drivers);
            $driversStmt->execute([
                ':did' => $driverId
            ]);

            $data = $driversStmt->fetch(PDO::FETCH_ASSOC);
            $count = $driversStmt->rowCount();
           return [
                "data" => $data,
                "count" => $count
            ];

        }

        public static function deleteDriver($driverId): void{

            $delete1 = "DELETE FROM users WHERE userUuid =:did";
            $driversStmt1 = self::$pdo->prepare($delete1);
            $driversStmt1->execute([
                ':did' => $driverId
            ]);
            $delete = "DELETE FROM drivers WHERE driverUuid =:did";
            $driversStmt = self::$pdo->prepare($delete);
            $driversStmt->execute([
                ':did' => $driverId
            ]);

            echo json_encode([
                "status" => true,
                "data" => 'deleted'
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
        public static function getdriverstat(){

        
            $get = "SELECT ordre.id, ordre.excursion , ordre.excursionUuid FROM ordre INNER JOIN excursion ON ordre.excursionUuid = excursion.excursionUuid WHERE excursion.type = 'excursion' AND ordre.driverUuid =:driverUuid ORDER BY ordre.excursion ASC";
            $statStmt = parent::$pdo->prepare($get);
            $statStmt->execute([
                ':driverUuid' => self::$chauffeurId
            ]);
        
            $data = $statStmt->fetchAll(PDO::FETCH_ASSOC);
         
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
        

    }