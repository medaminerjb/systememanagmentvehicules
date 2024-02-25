<?php
    class Stats extends DataBase{

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
        
        
        
        public static function getOrdrestat(){
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
                $ordre = "SELECT ordre.id, ordre.excursion FROM ordre ORDER BY ordre.id DESC Limit :s, :t";
            }else{
                $ordre = "SELECT ordre.id, ordre.excursion FROM ordre ORDER BY ordre.id DESC LIMIT :s, :t";
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
        

    }