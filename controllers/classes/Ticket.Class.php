<?php
    class Ticket extends DataBase{
        public static int|string $currentPage;
            public static $client;
            public static $depart;
            public static $excursion;
            public static $id;
            public static string $filter;
            public static $numero;
            public static $adulte;
            public static $enfant;
            public static $bebe;
            public static $obeservation;
            public static $ordreId;
            public static $ticketId;
            public static $hotel;
            public static $chambre;
            public static $placeocu;
            public static $etat;
            public static $paiments;
            public static function addTicket():void{
                (new self)->__construct();
    
            
                    // Generate a random number within the range of numeric UUIDs
                    $min = 1; // Minimum numeric UUID
                    $max = 1000000000; // Maximum numeric UUID
                    $numero = random_int($min, $max);
          
                $validate = "SELECT numero FROM ticket WHERE numero =:numero";
                $validateStmt = parent::$pdo->prepare($validate);
                $validateStmt->execute([
                    ':numero' => $numero
                ]);

     
                $count = $validateStmt->rowCount();
                if($count > 0){
                    $numero = $numero.'-'.time();
                }else{
                    $numero = $numero;
                }
             

                $add = "INSERT INTO ticket(numero ,hotel,chambre, adulte, enfant, bebe, observation,client,ordreId,etat) VALUES ( :numero, :hotel,:chambre, :adulte, :enfant, :bebe, :obeservation, :client, :ordreId ,:etat)";
                $addStmt = self::$pdo->prepare($add);
                $addStmt->execute([
                    ':numero'=>$numero,

                    ':hotel'=>self::$hotel,
                    ':chambre'=>self::$chambre,
                    ':adulte'=>self::$adulte,
                    ':enfant'=>self::$enfant,
                    ':bebe'=>self::$bebe,
                    ':obeservation'=>self::$obeservation,
                    ':client'=>self::$client,
                    ':ordreId'=>self::$ordreId,
                     ':etat'=>self::$etat     
                ]);
                
                $update = "UPDATE ordre SET placeocu =:increment WHERE id = :id";
                $stmt = parent::$pdo->prepare($update);
                $stmt->execute([
                    ':increment' => self::$placeocu, // Assuming self::$placeocu contains the value by which you want to increment placeocu
                    ':id' => self::$ordreId
                ]);
                
   
                echo json_encode([
                    "status" => true,
                    "numero"=>$numero
                    ,
                    "message" => "Nouvelle Ticket a été Ajoutée"
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
         
            }
    
          
    
        
            public static function getTickets(): array {
                $get = "SELECT ticket.id,ticket.etat,tarifs.tarifsadu,tarifs.tarifsenf, ticket.numero AS numeroticket,
                            ticket.depart,hotels.zone,hotels.numero, hotels.nom AS hotel, ticket.adulte, ticket.enfant,
                            ticket.bebe,ticket.adulter,ticket.enfantr,ordre.excursionUuid,ticket.beber, ticket.chambre, ticket.client,
                            ticket.observation, typevehicle.vtypeUuid,ticket.ordreId FROM ticket 
                            LEFT JOIN hotels ON hotels.hotelUuid = ticket.hotel
                            LEFT JOIN ordre ON ordre.id = ticket.ordreId 
                            LEFT JOIN vehicles ON ordre.vehicleUuid =vehicles.vehicleUuid 
                            LEFT JOIN modelsvehicle ON modelsvehicle.modelUuid = vehicles.modelUuid
                            INNER JOIN typevehicle ON typevehicle.vtypeUuid = modelsvehicle.vtypeUuid 
                            LEFT JOIN tarifs ON tarifs.excursionUuid = ordre.excursionUuid AND tarifs.typev=typevehicle.vtypeUuid WHERE ticket.ordreId = :ordreId ";
                $stmt = parent::$pdo->prepare($get);
                $stmt->execute([
                    ':ordreId' => self::$ordreId
                ]);
            
                $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
                return $data; // Return the array of ticket data directly
            }
            
    
    
    
    
    public static function getTicketstat(){
        (new self)->__construct();
        if(self::$filter === 'all'){
            $total = "SELECT id FROM ticket";
        }
        else{
            $total = "SELECT id FROM ticket";
        }
        $totalStmt = self::$pdo->prepare($total);
        $totalStmt->execute();
        $totalTicket = $totalStmt->rowCount();
        $paiments ='payer';
        $perPage = 15;
        $totalPages = ceil($totalTicket/$perPage);
        $offset = (self::$currentPage - 1) * $perPage;
        if(self::$filter === 'all'){
            $Ticket = "SELECT ticket.id,ticket.adulter,ticket.enfantr,ticket.etat, ticket.numero,ticket.tarifstadu,ticket.tarifstenf, ordre.excursionUuid,ordre.excursion,typevehicle.vtypeUuid FROM ticket LEFT JOIN ordre ON ordre.id = ticket.ordreId LEFT JOIN vehicles ON ordre.vehicleUuid =vehicles.vehicleUuid  LEFT JOIN modelsvehicle ON modelsvehicle.modelUuid = vehicles.modelUuid
            INNER JOIN typevehicle ON typevehicle.vtypeUuid = modelsvehicle.vtypeUuid LEFT JOIN tarifs ON tarifs.excursionUuid = ordre.excursionUuid AND tarifs.typev=typevehicle.vtypeUuid WHERE ticket.etat ='payer' ORDER BY ticket.id DESC Limit :s, :t";
        }else{
            $Ticket = "SELECT ticket.id,ticket.adulter,ticket.enfantr,ticket.etat, ticket.numero,ticket.tarifstadu,ticket.tarifstenf, ordre.excursionUuid,ordre.excursion,typevehicle.vtypeUuid FROM ticket LEFT JOIN ordre ON ordre.id = ticket.ordreId LEFT JOIN vehicles ON ordre.vehicleUuid =vehicles.vehicleUuid  LEFT JOIN modelsvehicle ON modelsvehicle.modelUuid = vehicles.modelUuid
            INNER JOIN typevehicle ON typevehicle.vtypeUuid = modelsvehicle.vtypeUuid LEFT JOIN tarifs ON tarifs.excursionUuid = ordre.excursionUuid AND tarifs.typev=typevehicle.vtypeUuid WHERE ticket.etat ='payer' ORDER BY ticket.id DESC Limit :s, :t";
        }    
        $statStmt = self::$pdo->prepare($Ticket);
        $statStmt->execute([
            ':s' => $offset,
            ':t' => $perPage
        ]);
    
        $data = $statStmt->fetchAll(PDO::FETCH_ASSOC);
    
        echo json_encode([
            "status" => true,
            "data" => $data,
            "totalPages" => $totalPages,
            "totalTicket" => $totalTicket,
            "role" => $_SESSION['userRole'],
            "userUuid" => $_SESSION['userUuid'],
            "currentPage" => self::$currentPage
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    
    
    }

    public static function searchTicket($search): void
{
    (new self)->__construct();

    $total = "SELECT ordre.excursion  FROM ticket LEFT JOIN ordre ON ordre.id = ticket.ordreId  WHERE ordre.excursion LIKE :search";
    $totalStmt = self::$pdo->prepare($total);
    $totalStmt->execute([
        ':search' => '%' . $search . '%'
    ]);
    $totalDrivers = $totalStmt->rowCount();

    $perPage = 15;
    $totalPages = ceil($totalDrivers / $perPage);
    $offset = (self::$currentPage - 1) * $perPage;

    $Ticket = "SELECT ticket.id,ticket.adulter,ticket.enfantr,excursion.nom,ordre.excursion,hotels.nom AS nomh,ticket.etat, ticket.numero, ordre.excursionUuid,ordre.excursion,typevehicle.vtypeUuid 
               FROM ticket 
               LEFT JOIN ordre ON ordre.id = ticket.ordreId 
               LEFT JOIN excursion ON excursion.excursionUuid = ordre.excursionUuid
               LEFT JOIN hotels ON hotels.hotelUuid = ticket.hotel
               LEFT JOIN vehicles ON ordre.vehicleUuid =vehicles.vehicleUuid  
               LEFT JOIN modelsvehicle ON modelsvehicle.modelUuid = vehicles.modelUuid
               INNER JOIN typevehicle ON typevehicle.vtypeUuid = modelsvehicle.vtypeUuid 
               LEFT JOIN tarifs ON tarifs.excursionUuid = ordre.excursionUuid AND tarifs.typev=typevehicle.vtypeUuid 
               WHERE ordre.excursion LIKE :search 
               ORDER BY ticket.id DESC 
               LIMIT :offset, :perPage";
    $driversStmt = self::$pdo->prepare($Ticket);
    $driversStmt->execute([
        ':offset' => $offset,
        ':perPage' => $perPage,
        ':search' => '%' . $search . '%'
    ]);

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


    public static function getATicket():array {
        $get = "SELECT ticket.id, ticket.numero, ticket.depart,ticket.etat, ticket.hotel, ticket.adulte, ticket.enfant, ticket.bebe, ticket.chambre, ticket.client, ticket.observation, ticket.ordreId ,excursion.nom,ordre.excursion FROM ticket LEFT JOIN ordre ON ordre.id=ticket.ordreId LEFT JOIN excursion ON excursion.excursionUuid = ordre.excursionUuid WHERE ticket.numero = :numero";
        $stmt = parent::$pdo->prepare($get);
        $stmt->execute([
            ':numero' => self::$numero
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        $count = $stmt->rowCount();

        return [
            "status" => true,
            "data" => $data,
            "count" => $count
        ];
    }
    public static function getlastTicket(){
        $get = "SELECT ticket.id, ticket.numero,ticket.etat, ticket.depart, ticket.hotel, ticket.adulte, ticket.enfant, ticket.bebe, ticket.chambre, ticket.client, ticket.observation, ticket.ordreId ,excursion.nom,ordre.excursion FROM ticket LEFT JOIN ordre ON ordre.id=ticket.ordreId LEFT JOIN excursion ON excursion.excursionUuid = ordre.excursionUuid WHERE ticket.ordreId = :ordreId ORDER BY ticket.id DESC limit 1 ";
        $stmt = parent::$pdo->prepare($get);
        $stmt->execute([
            ':ordreId' => self::$ordreId
        ]);
    
    
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        $count = $stmt->rowCount();
    
        return [
            "status" => true,
            "data" => $data,
            "count" => $count
        ];
    }
    public static function getTicket():array {
        $get = "SELECT ticket.id, ticket.numero, ticket.depart,ticket.etat, ticket.hotel, ticket.adulte, ticket.enfant, ticket.bebe, ticket.chambre, ticket.client, ticket.observation, ticket.ordreId ,excursion.nom,ordre.excursion FROM ticket LEFT JOIN ordre ON ordre.id=ticket.ordreId LEFT JOIN excursion ON excursion.excursionUuid = ordre.excursionUuid WHERE ticket.id = :id";
        $stmt = parent::$pdo->prepare($get);
        $stmt->execute([
            ':id' => self::$ticketId
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        $count = $stmt->rowCount();

        return [
            "status" => true,
            "data" => $data,
            "count" => $count
        ];
    }



     public static function getTicketstatexcursion(){
        (new self)->__construct();
        if(self::$filter === 'all'){
            $total = "SELECT id FROM Ticket";
        }
        else{
            $total = "SELECT id FROM Ticket";
        }
        $totalStmt = self::$pdo->prepare($total);
        $totalStmt->execute();
        $totalTicket = $totalStmt->rowCount();
    
        $perPage = 15;
        $totalPages = ceil($totalTicket/$perPage);
        $offset = (self::$currentPage - 1) * $perPage;
        if(self::$filter === 'all'){
            $Ticket = "SELECT Ticket.id, Ticket.excursion , Ticket.excursionUuid FROM Ticket INNER JOIN excursion ON Ticket.excursionUuid = excursion.excursionUuid WHERE excursion.type = 'excursion' ORDER BY Ticket.excursion ASC LIMIT :s, :t";
        }else{
            $Ticket = "SELECT Ticket.id, Ticket.excursion , Ticket.excursionUuid FROM Ticket INNER JOIN excursion ON Ticket.excursionUuid = excursion.excursionUuid WHERE excursion.type = 'excursion' ORDER BY Ticket.excursion ASC LIMIT :s, :t";
        }
    
        $statStmt = self::$pdo->prepare($Ticket);
        $statStmt->execute([
            ':s' => $offset,
            ':t' => $perPage
        ]);
    
        $data = $statStmt->fetchAll(PDO::FETCH_ASSOC);
    
        echo json_encode([
            "status" => true,
            "data" => $data,
            "totalPages" => $totalPages,
            "totalTicket" => $totalTicket,
            "role" => $_SESSION['userRole'],
            "userUuid" => $_SESSION['userUuid'],
            "currentPage" => self::$currentPage
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    
    
    }
    public static function getTicketstatmission(){
        (new self)->__construct();
        if(self::$filter === 'all'){
            $total = "SELECT id FROM Ticket";
        }
        else{
            $total = "SELECT id FROM Ticket";
        }
        $totalStmt = self::$pdo->prepare($total);
        $totalStmt->execute();
        $totalTicket = $totalStmt->rowCount();
    
        $perPage = 15;
        $totalPages = ceil($totalTicket/$perPage);
        $offset = (self::$currentPage - 1) * $perPage;
        if(self::$filter === 'all'){
            $Ticket = "SELECT Ticket.id, Ticket.excursion , Ticket.excursionUuid FROM Ticket INNER JOIN excursion ON Ticket.excursionUuid = excursion.excursionUuid WHERE excursion.type = 'mission' ORDER BY Ticket.excursion ASC LIMIT :s, :t";
        }else{
            $Ticket = "SELECT Ticket.id, Ticket.excursion , Ticket.excursionUuid FROM Ticket INNER JOIN excursion ON Ticket.excursionUuid = excursion.excursionUuid WHERE excursion.type = 'mission' ORDER BY Ticket.excursion ASC LIMIT :s, :t";
        }
    
        $TicketStmt = self::$pdo->prepare($Ticket);
        $TicketStmt->execute([
            ':s' => $offset,
            ':t' => $perPage
        ]);
    
        $data = $TicketStmt->fetchAll(PDO::FETCH_ASSOC);
    
        echo json_encode([
            "status" => true,
            "data" => $data,
            "totalPages" => $totalPages,
            "totalTicket" => $totalTicket,
            "role" => $_SESSION['userRole'],
            "userUuid" => $_SESSION['userUuid'],
            "currentPage" => self::$currentPage
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    
    
    }

    public static function getTicketsall(){
        (new self)->__construct();
        $total = "SELECT id FROM ticket";
        $totalStmt = self::$pdo->prepare($total);
        $totalStmt->execute();
        $totalhotels = $totalStmt->rowCount();
        $perPage = 15;
        $totalPages = ceil($totalhotels/$perPage);
        $offset = (self::$currentPage - 1) * $perPage;
        $get = "SELECT ticket.id, ticket.numero,ticket.etat, ticket.depart, hotels.nom AS nomh, ticket.adulte, ticket.enfant, ticket.bebe, ticket.chambre, ticket.client, ticket.observation, ticket.ordreId ,excursion.nom,ordre.excursion FROM ticket LEFT JOIN ordre ON ordre.id=ticket.ordreId LEFT JOIN excursion ON excursion.excursionUuid = ordre.excursionUuid LEFT JOIN hotels ON ticket.hotel = hotels.hotelUuid ORDER BY ticket.id DESC Limit :s, :t";
        $hotelsStmt = self::$pdo->prepare($get);
        $hotelsStmt->execute([
            ':s' => $offset,
            ':t' => $perPage
        ]);
        $perPage = 15;
        $totalPages = ceil($totalhotels/$perPage);
        $offset = (self::$currentPage - 1) * $perPage;
        $get = "SELECT ticket.id, ticket.numero, ticket.depart,ticket.etat, hotels.nom AS nomh, ticket.adulte, ticket.enfant, ticket.bebe, ticket.chambre, ticket.client, ticket.observation, ticket.ordreId ,excursion.nom,ordre.excursion FROM ticket LEFT JOIN ordre ON ordre.id=ticket.ordreId LEFT JOIN excursion ON excursion.excursionUuid = ordre.excursionUuid LEFT JOIN hotels ON ticket.hotel = hotels.hotelUuid ORDER BY ticket.id DESC Limit :s, :t";
        $hotelsStmt = self::$pdo->prepare($get);
        $hotelsStmt->execute([
            ':s' => $offset,
            ':t' => $perPage
        ]);

        $data = $hotelsStmt->fetchAll(PDO::FETCH_ASSOC);

        RequestError::array(name: "totalVehicles", totalItem: $totalhotels, data: $data, totalPages: $totalPages, currentPage: self::$currentPage);

    }
    
    
    
            
            
    
            public static function deleteTicket():void{
                (new self)->__construct();
                $delete = "DELETE FROM ticket WHERE id =:id";
                $TicketStmt = self::$pdo->prepare($delete);
                $TicketStmt->execute([
                    ':id' => self::$ticketId
                ]);
    
                echo json_encode([
                    "StatusCode" => 200,
                    "status" => true,
                    "message" => "Ticket a été supprimer"
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    
            }

    
        }
    
    
    
    
    
    
    
    
    
    
    
