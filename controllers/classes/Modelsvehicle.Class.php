<?php
    class Modelsvehicle extends DataBase{
        public static int|string $currentPage;
     
        public static int|string $place;
        public static string $filter;
        public static int|string $vtype;
        public static int|string $typec;
        public static $modelId;
        public static $model;
        public static $puissanceM; 
        public static $puissanceA; 
        public static $bvitesse;
        public static $reservoir; 
      
        public static $vtypeUuid; 
        public static $modelsUuid;




        public static function modelsvehicle(){
            $newUuid = UuidGenerator::guidv4();
            
            $validate = "SELECT modelUuid FROM modelsvehicle WHERE modelUuid = :modelUuid";
            $validateStmt = parent::$pdo->prepare($validate);
            $validateStmt->execute([
                ':modelUuid' => $newUuid
            ]);
        
            $count = $validateStmt->rowCount();
            if($count > 0){
                $modelsUuid = $newUuid.'-'.time();
            }else{
                $modelsUuid = $newUuid;
            }
        
            $add = "INSERT INTO modelsvehicle (model, place, puissanceM, puissanceA, bvitesse, reservoir,typec, vtypeUuid, modelUuid) 
                    VALUES (:model, :place, :puissanceM, :puissanceA, :bvitesse, :reservoir,:typec, :vtypeUuid, :modelUuid)";
            $stmt = parent::$pdo->prepare($add);
            $stmt->execute([
                ':model' => self::$model, 
                ':place' => self::$place,
                ':puissanceM' => self::$puissanceM, 
                ':puissanceA' => self::$puissanceA, 
                ':bvitesse' => self::$bvitesse, 
                ':reservoir' => self::$reservoir, 
                ':typec' => self::$typec, 
                ':vtypeUuid' => self::$vtypeUuid, 
                ':modelUuid' => $modelsUuid
            ]);
        
            RequestError::success("Nouvelle Model a été Ajouté!");
        }
        public static function getmodelsall(){
            $vehicles = "SELECT modelsvehicle.id,modelsvehicle.modelUuid,modelsvehicle.model, typevehicle.vtype, modelsvehicle.puissanceA, modelsvehicle.puissanceM, modelsvehicle.bvitesse, modelsvehicle.reservoir, modelsvehicle.place FROM modelsvehicle LEFT JOIN typevehicle ON typevehicle.vtypeUuid = modelsvehicle.vtypeUuid ORDER BY modelsvehicle.id DESC ";
            $hotelCheckStmt = self::$pdo->prepare($vehicles);
            $hotelCheckStmt->execute();

            $data = $hotelCheckStmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                "status" => true,
                "data" => $data
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            
        }

        public static function getmodels(){
            (new self)->__construct();
            $total = "SELECT modelUuid FROM modelsvehicle";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute();
            $totalVehicles = $totalStmt->rowCount();

            $perPage = 15;
            $totalPages = ceil($totalVehicles/$perPage);
            $offset = (self::$currentPage - 1) * $perPage;
            $vehicles = "SELECT modelsvehicle.id, modelsvehicle.model, typevehicle.vtype, modelsvehicle.puissanceA, modelsvehicle.puissanceM, modelsvehicle.bvitesse, modelsvehicle.reservoir, modelsvehicle.place FROM modelsvehicle LEFT JOIN typevehicle ON typevehicle.vtypeUuid = modelsvehicle.vtypeUuid ORDER BY modelsvehicle.id DESC LIMIT :s, :t";
            $vehiclesStmt = self::$pdo->prepare($vehicles);
            $vehiclesStmt->execute([
                ':s' => $offset,
                ':t' => $perPage
            ]);

            $data = $vehiclesStmt->fetchAll(PDO::FETCH_ASSOC);

            RequestError::array(name: "totalVehicles", totalItem: $totalVehicles, data: $data, totalPages: $totalPages, currentPage: self::$currentPage);

        }
        

        
        public static function deletemodelsvehicle():void{
            (new self)->__construct();
            $delete = "DELETE FROM modelsvehicle WHERE id =:id";
            $modelsvehicleStmt = self::$pdo->prepare($delete);
            $modelsvehicleStmt->execute([
                ':id' => self::$modelId
            ]);

            echo json_encode([
                "StatusCode" => 200,
                "status" => true,
                "message" => "modelsvehicle a été supprimer"
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        }
         public static function getmodelsvehicle():array {
            $get = "SELECT modelsvehicle.id,modelsvehicle.typec, modelsvehicle.bvitesse ,modelsvehicle.model, typevehicle.vtype,typevehicle.vtypeUuid, modelsvehicle.puissanceA, modelsvehicle.puissanceM, modelsvehicle.bvitesse, modelsvehicle.reservoir, modelsvehicle.place FROM modelsvehicle LEFT JOIN typevehicle ON typevehicle.vtypeUuid = modelsvehicle.vtypeUuid WHERE modelsvehicle.id =:id";
            $stmt = parent::$pdo->prepare($get);
            $stmt->execute([
                ':id' => self::$modelId
            ]);

            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            $count = $stmt->rowCount();

            return [
                "status" => true,
                "data" => $data,
                "count" => $count
            ];
        }

        public static function searchModel($search):void{
  
        
            (new self)->__construct();

            $total = "SELECT model FROM modelsvehicle WHERE model LIKE :search";
            $totalStmt = self::$pdo->prepare($total);
            $totalStmt->execute([
                ':search' => '%' . $search . '%'
            ]);
            $totalDrivers = $totalStmt->rowCount();
       
            $perPage = 15;
            $totalPages = ceil($totalDrivers / $perPage);
            $offset = (self::$currentPage - 1) * $perPage;
       
            $get = "SELECT modelsvehicle.id,modelsvehicle.typec, modelsvehicle.bvitesse ,modelsvehicle.model, typevehicle.vtype,typevehicle.vtypeUuid, modelsvehicle.puissanceA, modelsvehicle.puissanceM, modelsvehicle.bvitesse, modelsvehicle.reservoir, modelsvehicle.place FROM modelsvehicle LEFT JOIN typevehicle ON typevehicle.vtypeUuid = modelsvehicle.vtypeUuid WHERE modelsvehicle.model LIKE :search ORDER BY modelsvehicle.id DESC LIMIT :s, :t";
            $stmt = parent::$pdo->prepare($get);
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
        
    
        public static function updatemodelsvehicle() {
            $regisNo = "SELECT COUNT(*) FROM modelsvehicle WHERE id = :id";
            $regisNoStmt = parent::$pdo->prepare($regisNo);
            $regisNoStmt->execute([
                ':id' => self::$modelId
            ]);
            
            $recordExists = (bool)$regisNoStmt->fetchColumn();
            
            if ($recordExists) {
                $update = "UPDATE modelsvehicle SET 
                    model = :model, 
                    place = :place, 
                    puissanceM = :puissanceM,
                    puissanceA = :puissanceA,
                    reservoir = :reservoir,
                    vtypeUuid = :vtypeUuid,
                    bvitesse = :bvitesse,
                    typec = :typec
                    WHERE id = :id";
                
                $stmt = parent::$pdo->prepare($update);
                $success = $stmt->execute([
                    ':model' => self::$model, 
                    ':place' => self::$place,
                    ':puissanceM' => self::$puissanceM, 
                    ':puissanceA' => self::$puissanceA, 
                    ':reservoir' => self::$reservoir, 
                    ':vtypeUuid' => self::$vtypeUuid,
                    ':bvitesse' => self::$bvitesse,
                    ':typec'=>self::$typec,
                    ':id' => self::$modelId
                ]);
        
                if ($success) {
                    RequestError::success("model vehicule mis à jour avec succès!");
                } else {
                    RequestError::error("Échec de la mise à jour du model de véhicule.");
                }
            } else {
                RequestError::error("ID de modèle de véhicule invalide.");
            }
        }
        
        


        
    }