<?php
    class typevehicle extends DataBase{
        public static int|string $currentPage;
     
        public static int|string $placemi;
        public static int|string $placemx;

        public static string $filter;
        public static int|string $vtype;

        public static $typevehicleId;


        public static function addtype(){
          
            $newUuid = UuidGenerator::guidv4();
            $validate = "SELECT vtypeUuid FROM typevehicle WHERE vtypeUuid =:vtypeUuid";
            $validateStmt = parent::$pdo->prepare($validate);
            $validateStmt->execute([
                ':vtypeUuid' => $newUuid
            ]);


            $count = $validateStmt->rowCount();
            if($count > 0){
                $vtypeUuid = $newUuid.'-'.time();
            }else{
                $vtypeUuid = $newUuid;
            }
            

            $add = "INSERT INTO typevehicle( vtype, placemi,placemx, vtypeUuid) VALUES ( :vtype, :placemi,:placemx, :vtypeUuid)";
            $stmt = parent::$pdo->prepare($add);
            $stmt->execute([
              
               ':vtype' => self::$vtype, 
               ':placemi'=>self::$placemi,
               ':placemx'=>self::$placemx,
               ':vtypeUuid'=>$vtypeUuid
            ]);
            
          

            RequestError::success("Vehicle Ajouter!");
        }

        public static function gettypes(){
            (new self)->__construct();
            $total = "SELECT vtypeUuid FROM typevehicle";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalVehicles = $totalStmt->rowCount();

            $perPage = 15;
            $totalPages = ceil($totalVehicles/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
            $vehicles = "SELECT typevehicle.id,typevehicle.vtype, typevehicle.vtypeUuid, typevehicle.placemi,typevehicle.placemx FROM typevehicle ORDER BY typevehicle.id DESC LIMIT :s, :t";
            $vehiclesStmt = self::$pdo->prepare($vehicles);
            $vehiclesStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $vehiclesStmt->fetchAll(PDO::FETCH_ASSOC);

            RequestError::array(name: "totalVehicles", totalItem: $totalVehicles, data: $data, totalPages: $totalPages, currentPage: self::$currentPage);

        }
        

        
        public static function deletetypevehicle():void{
            (new self)->__construct();
            $delete = "DELETE FROM typevehicle WHERE id =:id";
            $typevehicleStmt = self::$pdo->prepare($delete);
            $typevehicleStmt->execute([
                ':id' => self::$typevehicleId
            ]);

            echo json_encode([
                "StatusCode" => 200,
                "status" => true,
                "message" => "typevehicle a été supprimer"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }
         public static function gettypevehicle():array {
            $get = "SELECT typevehicle.id,typevehicle.vtype, typevehicle.vtypeUuid, typevehicle.placemi,typevehicle.placemx FROM typevehicle ORDER BY typevehicle.id DESC LIMIT :s, :t";
            $stmt = parent::$pdo->prepare($get);
            $stmt->execute([
                ':id' => self::$typevehicleId
            ]);

            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            $count = $stmt->rowCount();

            return [
                "status" => true,
                "data" => $data,
                "count" => $count
            ];
        }

        
        public static function alltypevehiclesall(){
            $typevehicleCheck = "SELECT typevehicle.placemi,typevehicle.placemx, typevehicle.vtype,typevehcle.vtypeUuid FROM typevehicle ORDER BY typevehicle.id ASC";
            $typevehicleCheckStmt = self::$pdo->prepare($typevehicleCheck);
            $typevehicleCheckStmt->execute();

            $data = $typevehicleCheckStmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }

        public static function searchType($search):void{
  
        
            (new self)->__construct();

            $total = "SELECT vtype FROM typevehicle WHERE vtype LIKE :search";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute([
                ':search' => '%' . $search . '%'
            ]);
            $totalDrivers = $totalStmt->rowCount();
       
            $perPage = 15;
            $totalPages = ceil($totalDrivers / $perPage);
            $offset = (self::$currentPage - 1) * $perPage;
       
            $vehicles = "SELECT typevehicle.id,typevehicle.vtype, typevehicle.vtypeUuid, typevehicle.placemi,typevehicle.placemx FROM typevehicle WHERE vtype LIKE :search ORDER BY typevehicle.id DESC LIMIT :s, :t";
            $stmt = parent::$pdo->prepare($vehicles);
            $stmt->execute([
                ':s' => $offset,
                ':t' => $perPage,
                ':search' => '%'.$search.'%'
            ]);
            $stmt->execute();
        
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data,
                "totalPages" => $totalPages,
                "role" => $_SESSION['userRole'],
                "totalDrivers" => $totalDrivers,
                "currentPage" => self::$currentPage
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
        
        public static function updatetypevehicle(){
            $regisNo = "SELECT id FROM typevehicle WHERE id =:id";
            $regisNoStmt = parent::$pdo->prepare($regisNo);
            $regisNoStmt->execute([
                ':id' => self::$typevehicleId
            ]);

      
            
           
            $update = "UPDATE typevehicle SET vtype =:vtype, placemi =:placemi,placemx =:placemx WHERE id =:id";
            $stmt = parent::$pdo->prepare($update);
            $stmt->execute([
               
               ':vtype' => self::$vtype, 
               ':placemi' => self::$placemi, 
               ':placemx' => self::$placemx, 
             
               ':id' => self::$typevehicleId
            ]);
    
            RequestError::success("type vehicle Mis à jour avec succès!");
           
        }
        


        
    }