<?php
if (
    isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) 
    && isset($_COOKIE['userUuid'])
) {
    CheckUser::$userUuid = $_SESSION['userUuid'];
    CheckUser::checkUserAvailable();

    if (CheckUser::$userAvailable === true) {
        if ($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin'|| $_SESSION['userRole']==='chauffeur'||$_SESSION['userRole']==='Agent') {
            header('Content-Type: application/json; charset=utf-8');
             if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                if(isset($_GET['search']) && trim($_GET['search']) !== '' && $_GET['search'] !== NULL){
                    Ticket::$currentPage = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                    Ticket::searchTicket($_GET['search']);
                    
                      }
               else {Ticket::$currentPage = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                Ticket::getTicketsall();
                new Ticket();}
            } 
            
            elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
                if ($_POST['method'] === 'POST') {
                    Ticket::$ordreId = $params[0];
                    Ticket::$hotel =$_POST['hotel'];
                    if(isset($_POST['chambre'])){
                        Ticket::$chambre = $_POST['chambre'];
                    }
                    
                    Ticket::$etat = $_POST['etat'];
                    Ticket::$adulte = $_POST['adulte'];
                    Ticket::$enfant = $_POST['enfant'];
                    Ticket::$bebe = $_POST['bebe'];
                    Ticket::$obeservation = $_POST['obeservation'];
                    Ticket::$client = $_POST['client'];
                    Ticket::$placeocu = $_POST['placeocu'];
                   Ticket::addTicket();
                } 
                elseif ($_POST['method'] === 'GET') {
                    // Getting Ticket view for button detail
                    Ticket::$ticketId = isset($_POST['ticketId']) ? $_POST['ticketId'] : $params[0];
                    echo json_encode(Ticket::getTicket(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                } 
                elseif ($_POST['method'] === 'DELETE') {
                    if ($_SESSION['userRole'] === 'admin' || $_SESSION['userRole'] === 'superAdmin') {
                        Ticket::$ticketId = $_POST['ticketId'];
                        Ticket::deleteTicket();
                    } 
                    else {
                        RequestError::error(" Vous n'êtes pas autorisé à supprimer le Ticket!");
                    }
                } 
                elseif ($_POST['method'] === 'UPDATE') {
                    Ticket::$TicketId = $params[0];
                    $isEmptyField = false;

                    foreach ($_POST as $post) {
                        if (empty($post)) {
                            $isEmptyField = true;
                        }
                    }

                    if ($isEmptyField) {
                        RequestError::error(" Certains champs sont vides.");
                    } else {
                        Ticket::$nom = $_POST['nom'];
                        Ticket::$destination = $_POST['destination'];
                        Ticket::updateTicket();
                    }
                }
            }
        } else {
            RequestError::error("Vous n'êtes pas autorisé(e) à effectuer cette action.");
        }
    } else {
        RequestError::error("Réorienter");
    }
}
