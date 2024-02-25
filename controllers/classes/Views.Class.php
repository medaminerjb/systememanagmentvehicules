<?php 
    class Views{
        public function Home(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/index.phtml';
        
        
        
        
        }

        public function Login(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Authentication/login.phtml';
        }

        public function Workers(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Users/workers.phtml';
        }
        public function Ordredmission(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/ordredm/ordredmission.phtml';
        }
        public function Ordredmissionh(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/ordredm/ordredmissionh.phtml';
        }
        public function ImprimerOrdre(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/ordredm/pdfgene.phtml';
        }

        public function Drivers(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Users/drivers.phtml';
        }
        public function Carburants(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/carburant/carburant.phtml';
        }
        public function Settings(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Settings/settings.phtml';
        }

        public function Profile(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Users/profile.phtml';
        }
        public function Workshop(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Workshop/all-workshop.phtml';
        }
        public function AddWorkshop(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Workshop/workshop.phtml';
        }

        public function Vehicles(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Vehicles/vehicles.phtml';
        }
        public function TypeVehicle(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Vehicles/typevehicle.phtml';
        }
        public function Modelsvehicle(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/Vehicles/modelsvehicle.phtml';
        }


        public function tarifsexcursion(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/excursion/tarifsexcursion.phtml';
        }

        public function Addkm(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/kilometerage/addkm.phtml';
        }
        public function Kilometerges(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/kilometerage/kilometerges.phtml';
        }
        public function Excursion(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/excursion/excursion.phtml';
        }
        public function Mission(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/ordredm/mission.phtml';
        }

        public function hotels(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/hotels/hotels.phtml';
        }
       
        public function alltickets(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/tickets/alltickets.phtml';
        }
        public function listvehiclesmain(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/maintenance/vehiculesamain.phtml';
        }
        public function hismain(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/maintenance/historiquemain.phtml';
        }



        public function Statistique(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/statistique/vehicles.phtml';
        }
        public function StatistiqueOrdres(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/statistique/ordres.phtml';
        }
        public function StatistiqueChauffeurs(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/statistique/chauffeurs.phtml';
        }
        public function StatistiqueExcursions(){
            include $_SERVER['DOCUMENT_ROOT'].'/views/statistique/excursions.phtml';
        }
        public function EditInventories($params){
            $inventory = Inventory::getInventory($params[0]);
            if($inventory['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/Inventories/edit-inventory.phtml';
        }
        public function mainvehicule($params){
            Vehicles::$vehicleId = $params[0];
            $vehicle = Vehicles::getVehicle();
            if($vehicle['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/maintenance/ajoutermain.phtml';
        }

        public function Editmain($params){
            Maintenance::$maintenanceId = $params[0];
            $maintenance = Maintenance::getmaintenance();
            if($maintenance['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/maintenance/editmain.phtml';
        }
        public function EditVehicles($params){
            Vehicles::$vehicleId = $params[0];
            $vehicle = Vehicles::getVehicle();
            if($vehicle['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/Vehicles/edit-vehicle.phtml';
        }
        public function EditModelsvehicle($params){
            Modelsvehicle::$modelId = $params[0];
            $model = Modelsvehicle::getmodelsvehicle();
            if($model['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/Vehicles/edit-modelvehicle.phtml';
        }
        public function Edittypevehicle($params){
            typevehicle::$typevehicleId = $params[0];
            $typevehicle = typevehicle::gettypevehicle();
            if($typevehicle['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/Vehicles/edit-typevehicle.phtml';
        }
        public function EditExcursion($params){
            Excursion::$excursionId = $params[0];
            $excursion = Excursion::getExcursion();
            if($excursion['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/excursion/editexcursion.phtml';
        }
        public function Edittarifs($params){
            tarifs::$tarifsId = $params[0];
            $tarifs = tarifs::gettarifs();
            if($tarifs['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/excursion/edittarifs.phtml';
        }
        public function EditHotel($params){
            Hotel::$hotelId = $params[0];
            $hotel = Hotel::getHotel();
            if($hotel['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/hotels/edithotel.phtml';
        }
        public function EditCarburant($params){
            Carburants::$carburantId = $params[0];
            $carburant = Carburants::getCarburant();
            if($carburant['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/carburant/editcarburant.phtml';
        }
        
        public function EditKm($params){
            Km::$kilometergeId = $params[0];
            $kilometerge = Km::getKm();
            if($kilometerge['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/kilometerage/editkm.phtml';
        }






        public function ajouterKm($params){
            Ordre::$ordreId = $params[0];
            $ordre = Ordre::getOrdre();
            
            if($ordre['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/kilometerage/addkmchauffeur.phtml';
        }
        public function ajouterCarburant($params){
            Ordre::$ordreId = $params[0];
            $ordre = Ordre::getOrdre();
            
            if($ordre['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/carburant/ajoutercarburant.phtml';
        }
        public function EditOrdre($params){
            Ordre::$ordreId = $params[0];
            $ordre = Ordre::getOrdre();
            if($ordre['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/ordredm/editordre.phtml';
        }

        public function ConfirmerOrdres($params){
            Ordre::$ordreId = $params[0];
            $ordre = Ordre::getOrdre();
           
            Ticket::$ordreId = $params[0];
            $tickets = Ticket::getTickets();
        
            if ($ordre['count'] < 1) { // Check if the array of tickets is empty
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/ordredm/confiramtionordre.phtml';
        }
        
        public function ImprimerOrdres($params){
            Ordre::$ordreId = $params[0];
            $ordre = Ordre::getOrdre();
           
            Ticket::$ordreId = $params[0];
            $tickets = Ticket::getTickets();
        
            if ($ordre['count'] < 1) { // Check if the array of tickets is empty
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/ordredm/pdfgene.phtml';
        }
        public function printTicket($params){
            Ordre::$ordreId = $params[0];
            $ordre = Ordre::getOrdre();
            Ticket::$numero = $params[0];
            $ticket = Ticket::getATicket();
            if($ticket['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/tickets/ticket.phtml';
        }
       public function getTickets($params){
            Ticket::$ordreId = $params[0];
            $tickets = Ticket::getTickets();
            if(empty($tickets)){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/tickets/tickets.phtml';
        }


        public function ajouterticket($params){
          
            Ordre::$ordreId = $params[0];  
            $ordre = Ordre::getOrdre();
            Ticket::$ordreId = $params[0];
            $ticket = Ticket::getlastTicket();

            include $_SERVER['DOCUMENT_ROOT'].'/views/tickets/ajouterticket.phtml';
        }
        public function EditWorkers($params){
            $worker = Worker::getAWorker($params[0]);
            if($worker['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/Users/edit-worker.phtml';
        }

        public function EditDriver($params){
            $driver = Driver::getADriver($params[0]);
            if($driver['count'] < 1){
                include $_SERVER['DOCUMENT_ROOT'].'/views/404.php';
                return;
            }
            include $_SERVER['DOCUMENT_ROOT'].'/views/Users/edit-driver.phtml';
        }
    }
