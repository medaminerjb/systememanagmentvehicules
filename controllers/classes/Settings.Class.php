<?php
    class Settings extends DataBase{
        public static $newLogo;
        public static $newSiteName;
        public static $getSiteName;
        public static $getLogo;
       public static $getSiteEmail ;
        public static $getSiteNumber1 ;
        public static $getSiteNumber2 ;
        public static $getSiteAdresse ;
        public static $newSiteEmail ;
        public static $newSiteNumber1 ;
        public static $newSiteNumber2 ;
        public static $newSiteAdresse ;



        public static function getSettings() {
            (new self)->__construct();
            $settings = "SELECT * FROM settings";
            $stmt = self::$pdo->prepare($settings);
            $stmt->execute();
            
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            self::$getLogo = $data['siteLogo'];
            self::$getSiteName = $data['siteName'];
            self::$getSiteEmail = $data['siteEmail'];
            self::$getSiteNumber1 = $data['siteNumber1'];
            self::$getSiteNumber2 = $data['siteNumber2'];
            self::$getSiteAdresse = $data['siteAdresse'];

        }

        public static function updateSettings(){
            $updateWebsite = "UPDATE settings SET siteLogo = :siteLogo, siteName = :siteName, siteEmail = :siteEmail, siteNumber1 = :siteNumber1, siteNumber2 = :siteNumber2, siteAdresse = :siteAdresse";
            $updateWebsiteStmt = self::$pdo->prepare($updateWebsite);
            $updateWebsiteStmt->execute([
                ':siteLogo' => self::$newLogo,
                ':siteName' => self::$newSiteName,
                ':siteEmail' => self::$newSiteEmail,
                ':siteNumber1' => self::$newSiteNumber1,
                ':siteNumber2' => self::$newSiteNumber2,
                ':siteAdresse' => self::$newSiteAdresse
            ]);
        
            echo json_encode([
                "status" => true,
                "message" => "Settings Mis à jour avec succés!"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
    }        