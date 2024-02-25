<?php
declare(strict_types = 1);


    class Models extends DataBase{
        public static string $userName;
        public static string $userPass;
        public static string $userEmail;
        public static string $siteLogo;
        public static string $siteName;
        protected static string $tableName;

        static public function websiteSettings(){
            self::$tableName = 'settings';
            $websiteSettings = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
            siteLogo varchar(255) NULL DEFAULT NULL,
            siteName varchar(255) NULL DEFAULT NULL,
            siteNumber1 int(11) NULL DEFAULT NULL,
            siteNumber2 int(11) NULL DEFAULT NULL,
            siteEmail varchar(50) NULL DEFAULT NULL,
            siteAdresse varchar(255) NULL DEFAULT NULL
            ) ENGINE = InnoDB";
            $websiteSettingsStmt = self::$pdo->prepare($websiteSettings);
            $websiteSettingsStmt->execute();
        }

        static public function guidv4($data = null) {
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
        
        static public function users(){
            self::$tableName = 'users';

            $dropDatabase = "DROP TABLE IF EXISTS `".self::$tableName."`";
            $dropDatabaseStmt = self::$pdo->prepare($dropDatabase);
            $dropDatabaseStmt->execute();
            $users = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
                id int(11) NOT NULL AUTO_INCREMENT,
              
                fullName varchar(255) NOT NULL,
                bateOfBirth varchar(255) DEFAULT NULL,
                phoneOne varchar(30) DEFAULT NULL,
                phoneTwo varchar(30) DEFAULT NULL,
                idNumber varchar(50) DEFAULT NULL,
                userEmail varchar(255) NOT NULL,
                userUuid varchar(255) NOT NULL,
                userRole varchar(255) NOT NULL,
                userPassword varchar(255) NOT NULL,
                userStatus varchar(50) NOT NULL DEFAULT 'active',
                userDefaultPass varchar(50) NOT NULL DEFAULT 'yes',
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
            $usersStmt = self::$pdo->prepare($users);
            $usersStmt->execute();
        }

        
        static public function drivers(){
            self::$tableName = 'drivers';

            $dropDatabase = "DROP TABLE IF EXISTS `".self::$tableName."`";
            $dropDatabaseStmt = self::$pdo->prepare($dropDatabase);
            $dropDatabaseStmt->execute();
            $drivers = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
                id int(11) NOT NULL AUTO_INCREMENT,
                driverFullName varchar(255) NOT NULL,
                bateOfBirth varchar(255) DEFAULT NULL,
                driverIdNo varchar(255) DEFAULT NULL,
                phoneHome varchar(30) DEFAULT NULL,
                phoneMobile varchar(30) DEFAULT NULL,
                idNumber varchar(50) DEFAULT NULL,
                email varchar(255) DEFAULT NULL,
                driverUuid varchar(255) NOT NULL,
                dateAdded varchar(50) NOT NULL,
                etat varchar(255) DEFAULT NULL,

                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
            $driversStmt = self::$pdo->prepare($drivers);
            $driversStmt->execute();
        }

        
        static public function vehicles(){
            self::$tableName = 'vehicles';

            $dropDatabase = "DROP TABLE IF EXISTS `".self::$tableName."`";
            $dropDatabaseStmt = self::$pdo->prepare($dropDatabase);
            $dropDatabaseStmt->execute();
            $vehicles = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
                id int(11) NOT NULL AUTO_INCREMENT,
                modelUuid varchar(255) NOT NULL,
                color varchar(255) NOT NULL,
                regisNumber varchar(255) DEFAULT NULL,
                dateAdded varchar(255) NOT NULL,
                vehicleUuid varchar(255) NOT NULL,
                etat varchar(255) DEFAULT NULL,

                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
            $vehiclesStmt = self::$pdo->prepare($vehicles);
            $vehiclesStmt->execute();
        }
        static public function typevehicle(){
            self::$tableName = 'typevehicle';

            $dropDatabase = "DROP TABLE IF EXISTS `".self::$tableName."`";
            $dropDatabaseStmt = self::$pdo->prepare($dropDatabase);
            $dropDatabaseStmt->execute();
            $typevehicle = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
                id int(11) NOT NULL AUTO_INCREMENT,
                vtype varchar(255) DEFAULT NULL,
                placemi int(11) DEFAULT NULL,
                placemx int(11) DEFAULT NULL,
                vtypeUuid varchar(255) DEFAULT NULL,

                vtypeUuid varchar(255) DEFAULT NULL,
               

                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
            $typevehiclestmt = self::$pdo->prepare($typevehicle);
            $typevehiclestmt->execute();
        }
        static public function ordre(){
            self::$tableName = 'ordre';

            $dropDatabase = "DROP TABLE IF EXISTS `".self::$tableName."`";
            $dropDatabaseStmt = self::$pdo->prepare($dropDatabase);
            $dropDatabaseStmt->execute();
            $vehicles = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
            id int(11) NOT NULL AUTO_INCREMENT,
            agence varchar(50) DEFAULT NULL ,
            heure varchar(10) NOT NULL,
            excursion varchar(50) NOT NULL,
            heurer varchar(10) NOT NULL,
            dater varchar(50) NOT NULL,
            driverUuid varchar(255) NOT NULL,
            excursionUuid varchar(255) NOT NULL,
            vehicleUuid varchar(255) NOT NULL,
            gasoil int(11) DEFAULT NULL,
            kmtotal int(11) DEFAULT NULL,
            placeocu int(11) DEFAULT NULL,
            dateAdded varchar(50) DEFAULT NULL,
            etat varchar(50) DEFAULT NULL,
            PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
        $vehiclesStmt = self::$pdo->prepare($vehicles);
        $vehiclesStmt->execute();
            }
        static public function excursion(){
            self::$tableName = 'excursion';

            $dropDatabase = "DROP TABLE IF EXISTS `".self::$tableName."`";
            $dropDatabaseStmt = self::$pdo->prepare($dropDatabase);
            $dropDatabaseStmt->execute();
            $excursion = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
                id int(11) NOT NULL AUTO_INCREMENT,
                type varchar(255) NOT NULL,
                nom varchar(255) NOT NULL,
                destination varchar(255) NOT NULL,
                ligne varchar(50) NOT NULL,
                duree int(11) DEFAULT NULL,
                excursionUuid varchar(255) NOT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
            $excursionStmt = self::$pdo->prepare($excursion);
            $excursionStmt->execute();
        }
       
        static public function carburant(){
            self::$tableName = 'carburant';

            $dropDatabase = "DROP TABLE IF EXISTS `".self::$tableName."`";
            $dropDatabaseStmt = self::$pdo->prepare($dropDatabase);
            $dropDatabaseStmt->execute();
            $carburant = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
                id int(11) NOT NULL AUTO_INCREMENT,
                date varchar(50) NOT NULL,
                obeservation varchar(255) NOT NULL,
                type varchar(255) NOT NULL,
                quantite int(11) NOT NULL,
                prix int(11) NOT NULL,
                total int(11) NOT NULL,
                ordreId int(11) NOT NULL,
                driverUuid varchar(255) NOT NULL,
                excursionUuid varchar(255) NOT NULL,
                vehicleUuid varchar(255) NOT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
            $carburantStmt = self::$pdo->prepare($carburant);
            $carburantStmt->execute();
        }
        static public function tarifs(){
            self::$tableName = 'tarifs';

            $dropDatabase = "DROP TABLE IF EXISTS `".self::$tableName."`";
            $dropDatabaseStmt = self::$pdo->prepare($dropDatabase);
            $dropDatabaseStmt->execute();
            $tarifs = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
                id int(11) NOT NULL AUTO_INCREMENT,
                excursionUuid varchar(255) DEFAULT NULL,
                tarifsadu int(11) DEFAULT NULL,
                tarifsenf int(11) DEFAULT NULL,
               

                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
            $tarifsstmt = self::$pdo->prepare($tarifs);
            $tarifsstmt->execute();
        }
        static public function hotels(){
            self::$tableName = 'hotels';

            $dropDatabase = "DROP TABLE IF EXISTS `".self::$tableName."`";
            $dropDatabaseStmt = self::$pdo->prepare($dropDatabase);
            $dropDatabaseStmt->execute();
            $hotels = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
                id int(11) NOT NULL AUTO_INCREMENT,
                nom varchar(255) DEFAULT NULL,
                localisation varchar(255) DEFAULT NULL,
                zone int(11) DEFAULT NULL,
                numero int(11) DEFAULT NULL,
                hotelUuid varchar(255) DEFAULT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
            $hotelsstmt = self::$pdo->prepare($hotels);
            $hotelsstmt->execute();
        }

       
        static public function ticket(){
            self::$tableName = 'ticket';
        
            $dropTable = "DROP TABLE IF EXISTS `" . self::$tableName . "`";
            $dropTableStmt = self::$pdo->prepare($dropTable);
            $dropTableStmt->execute();
        
            $createTable = "CREATE TABLE IF NOT EXISTS `" . self::$tableName . "` (
                id int(11) NOT NULL AUTO_INCREMENT,
                numero varchar(255) DEFAULT NULL,
                depart varchar(50) DEFAULT NULL,
                client varchar(255) DEFAULT NULL,
                adulte int(11) DEFAULT NULL,
                enfant int(11) DEFAULT NULL,
                bebe int(11) DEFAULT NULL,
                adulter int(11) DEFAULT NULL,
                enfantr int(11) DEFAULT NULL,
                beber int(11) DEFAULT NULL,
                chambre varchar(50) DEFAULT NULL,
                hotel varchar(255) DEFAULT NULL,
                observation varchar(255) DEFAULT NULL,
                ordreId int(11) DEFAULT NULL,
                etat varchar(255) DEFAULT NULL,
                tarifsadu int(11) DEFAULT NULL,
                tarifsenf int(11) DEFAULT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
            $createTableStmt = self::$pdo->prepare($createTable);
            $createTableStmt->execute();
        }
        static public function modelsvehicle(){
            self::$tableName = 'modelsvehicle';
        
            $dropTable = "DROP TABLE IF EXISTS `" . self::$tableName . "`";
            $dropTableStmt = self::$pdo->prepare($dropTable);
            $dropTableStmt->execute();
        
            $createTable = "CREATE TABLE IF NOT EXISTS `" . self::$tableName . "` (
                id int(11) NOT NULL AUTO_INCREMENT,
                model varchar(255) DEFAULT NULL,
                vtypeUuid varchar(255) DEFAULT NULL,
                puissanceA int(11) DEFAULT NULL,
                puissanceM int(11) DEFAULT NULL,
                bvitesse int(11) DEFAULT NULL,
                reservoir int(11) DEFAULT NULL,
                typec varchar(255) DEFAULT NULL,
                place int(11) DEFAULT NULL,
                modelUuid varchar(255) DEFAULT NULL,
            
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
            $createTableStmt = self::$pdo->prepare($createTable);
            $createTableStmt->execute();
        }


        static public function km(){
            self::$tableName = 'km';

            $dropDatabase = "DROP TABLE IF EXISTS `".self::$tableName."`";
            $dropDatabaseStmt = self::$pdo->prepare($dropDatabase);
            $dropDatabaseStmt->execute();
            $excursion = "CREATE TABLE IF NOT EXISTS 
            ".self::$tableName." (
                id int(11) NOT NULL AUTO_INCREMENT,
                depart int(11) DEFAULT NULL,
                arrive int(11) DEFAULT NULL,
                diff int(11) DEFAULT NULL,
                date varchar(255) DEFAULT NULL,
                vehicleUuid varchar(255) DEFAULT NULL,
                excursionUuid varchar(255) DEFAULT NULL,
                driverUuid varchar(255) DEFAULT NULL,

                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC";
            $excursionStmt = self::$pdo->prepare($excursion);
            $excursionStmt->execute();
        }

  

        static public function addUser(){
            $passHash = password_hash(self::$userPass, PASSWORD_DEFAULT);
            $myuuid = self::guidv4();
            $addUser = "INSERT INTO users(userEmail, fullName, userPassword, userUuid, userRole, userDefaultPass) VALUES (:uemail, :uname, :upass, :uuid, :urole, :userDefaultPass)";
            $addUserStmt = self::$pdo->prepare($addUser);
            $addUserStmt->execute([
                ':uemail' => self::$userEmail,
                ':uname' => self::$userName,
                ':upass' => $passHash,
                ':uuid' => $myuuid,
                ':urole' => 'superAdmin',
                ':userDefaultPass' => 'no'
            ]);
        }

        static public function addWebsite(){
            $addWebsite = "INSERT INTO settings(siteLogo, siteName) VALUES (:siteLogo, :siteName)";
            $addWebsiteStmt = self::$pdo->prepare($addWebsite);
            $addWebsiteStmt->execute([
                ':siteLogo' => self::$siteLogo,
                ':siteName' => self::$siteName
            ]);
        }
    }