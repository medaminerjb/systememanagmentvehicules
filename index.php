<?php 
session_start();
include __DIR__.'/vendor/autoloader.php';
include __DIR__.'/vendor/autoloader.php';
//require_once __DIR__ . '/vendor/autoload.php';
//require_once realpath("vendor/autoload.php");
use controllers\classes\Router;
//include $_SERVER['DOCUMENT_ROOT'].'/vendor/autoloader.php';
if(file_exists(__DIR__.'/controllers/classes/DataBase.Class.php') && class_exists('DataBase') && Settings::getSettings() !== NULL){
    Settings::getSettings();
    if(isset($_SESSION['userUuid'], $_SESSION['userEmail'], $_SESSION['userRole']) && isset($_COOKIE['userUuid'])){
        $loggedInUser = LoginUser::getLoginUser();
    }
}
// Use the Router class

// Create a new instance of the Router class
$router = new Router();

//Routes for views


$router->newRoute('/', 'Views@Home');
$router->newRoute('/about', 'Views@About');
$router->newRoute('/login', 'Views@Login');
$router->newRoute('/workers', 'Views@Workers');
$router->newRoute('/workers/:uuid', 'Views@EditWorkers');
$router->newRoute('/imprimerordre','Views@ImprimerOrdre');
//drivers routes 
$router->newRoute('/drivers', 'Views@Drivers');
$router->newRoute('/ordre', 'Views@Ordredmission');
$router->newRoute('/drivers/:uuid', 'Views@EditDriver');
$router->newRoute('/profile', 'Views@Profile');
$router->newRoute('/settings', 'Views@Settings');
//vehicles routes
$router->newRoute('/vehicles', 'Views@Vehicles');
$router->newRoute('/tarifsexcursion', 'Views@tarifsexcursion');
$router->newRoute('/tarifsexcursion/:uuid', 'Views@Edittarifs');

$router->newRoute('/excursion', 'Views@Excursion');
//maintenance 
$router->newRoute('/listevehiculesmaintenance', 'Views@listvehiclesmain');
$router->newRoute('/historiquesmaintenance', 'Views@hismain');
$router->newRoute('/maintenirvehicule/:uuid', 'Views@mainvehicule');

$router->newRoute('/maintenance/:uuid', 'Views@Editmain');



$router->newRoute('/mission', 'Views@Mission');

$router->newRoute('/add-expense', 'Views@AddWorkshop');
$router->newRoute('/pay-worker', 'Views@PayWorker');
$router->newRoute('/pay-driver', 'Views@PayDriver');
$router->newRoute('/ordres', 'Views@Ordredmissionh');
$router->newRoute('/ordres/:uuid','Views@EditOrdre');
$router->newRoute('/ordres/imprimer/:uuid','Views@ImprimerOrdres');
$router->newRoute('/ordres/confirmation/:uuid','Views@ConfirmerOrdres');
///vehicles et types 
$router->newRoute('/typevehicle/:uuid', 'Views@Edittypevehicle');
$router->newRoute('/vehicles/:uuid', 'Views@EditVehicles');
$router->newRoute('/modelsvehicle', 'Views@Modelsvehicle');
$router->newRoute('/modelvehicle/:uuid', 'Views@EditModelsvehicle');

$router->newRoute('/typevehicle', 'Views@TypeVehicle');
$router->newRoute('/excursion/:uuid', 'Views@EditExcursion');
$router->newRoute('/statistiques/vehicles','Views@Statistique');
$router->newRoute('/statistiques/ordres','Views@StatistiqueOrdres');
$router->newRoute('/statistiques/chauffeurs','Views@StatistiqueChauffeurs');
$router->newRoute('/statistiques/excursions','Views@StatistiqueExcursions');
$router->newRoute('/chauffeurs','Views@Chauffeurs');
$router->newRoute('/carburants','Views@Carburants');
$router->newRoute('/carburants/nouvelle/:uuid', 'Views@ajouterCarburant');
$router->newRoute('/carburants/:uuid', 'Views@EditCarburant');
//kilometerages route 
$router->newRoute('/add-km', 'Views@Addkm');
$router->newRoute('/kilometerges', 'Views@Kilometerges');
$router->newRoute('/kilometerges/:uuid', 'Views@EditKm');
$router->newRoute('/add-km/chauffeur/:uuid', 'Views@ajouterKm');
//hotels
$router->newRoute('/hotels', 'Views@hotels');
$router->newRoute('/hotel/:uuid', 'Views@EditHotel');

///tikcet
$router->newRoute('/tickets', 'Views@alltickets');
$router->newRoute('/tickets/:uuid', 'Views@getTickets');
$router->newRoute('/ticket/:uuid', 'Views@printTicket');
$router->newRoute('/ordres/ticket/:uuid', 'Views@ajouterticket');

//Routes for AJAX
$router->newRoute('/installation', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/installer.Ajax.php';
});

$router->newRoute('/logout', function(){
    $logIn = new Login;
    $logIn->logUserOut();
});

$router->newRoute('/api/login', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/login.Ajax.php';
});
$router->newRoute('/api/statistiques', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/statistiques.Ajax.php';
});
$router->newRoute('/api/ticket', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/ticket.Ajax.php';
});

$router->newRoute('/api/workers', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/workers.Ajax.php';
});

$router->newRoute('/api/add-worker', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/addWorker.Ajax.php';
});

$router->newRoute('/api/add-driver', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/addDriver.Ajax.php';
});

$router->newRoute('/api/drivers', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/drivers.Ajax.php';
});

$router->newRoute('/api/hotels', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/hotels.Ajax.php';
});
$router->newRoute('/api/typevehicle', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/typevehicle.Ajax.php';
});
$router->newRoute('/api/maintenance', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/maintenance.Ajax.php';
});
$router->newRoute('/api/settings', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/settings.Ajax.php';
});

$router->newRoute('/api/profile', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/profile.Ajax.php';
});


$router->newRoute('/api/statistiuqes', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/vehicles.Ajax.php';
});
$router->newRoute('/api/vehicles', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/vehicles.Ajax.php';
});
$router->newRoute('/api/modelsvehicle', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/modelsvehicle.Ajax.php';
});
$router->newRoute('/api/tarifs', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/tarifs.Ajax.php';
});
$router->newRoute('/api/kilometerges', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/kilometerges.Ajax.php';
});
$router->newRoute('/api/excursion', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/excursion.Ajax.php';
});
$router->newRoute('/api/ordre', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/ordre.Ajax.php';
});
$router->newRoute('/api/carburants', function(){
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/carburants.Ajax.php';
});
$router->newRoute('/api/vehicles/:uuid', function($params){
    Vehicles::$vehicleId = $params[0];
    $vehicle = Vehicles::getVehicle();
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/vehicles.Ajax.php';
});
$router->newRoute('/api/maintenance/:uuid', function($params){
    Maintenance::$maintenanceId = $params[0];
    $maintenance = Maintenance::getmaintenance();
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/maintenance.Ajax.php';
});
$router->newRoute('/api/maintenirvehicule/:uuid', function($params){
    Vehicles::$vehicleId = $params[0];
    $vehicle = Vehicles::getVehicle();
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/maintenance.Ajax.php';
});
$router->newRoute('/api/typevehicle/:uuid', function($params){
    typevehicle::$typevehicleId = $params[0];
    $typevehicle = typevehicle::gettypevehicle();
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/typevehicle.Ajax.php';
});
$router->newRoute('/api/modelvehicle/:uuid', function($params){
    Modelsvehicle::$modelId = $params[0];
    $model = Modelsvehicle::getmodelsvehicle();
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/modelsvehicle.Ajax.php';
});


$router->newRoute('/api/excursion/:uuid', function($params){
    Excursion::$excursionId = $params[0];
    $excursion = Excursion::getExcursion();
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/excursion.Ajax.php';
});
$router->newRoute('/api/tarifsexcursion/:uuid', function($params){
    tarifs::$tarifsId = $params[0];
    $tarifs = tarifs::gettarifs();
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/tarifs.Ajax.php';
});
$router->newRoute('/api/hotel/:uuid', function($params){
    Hotel::$hotelId = $params[0];
    $hotel = Hotel::getHotel();
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/hotels.Ajax.php';
});
$router->newRoute('/api/kilometerges/:uuid', function($params){
    Ordre::$ordreId = $params[0];
    $ordre = Ordre::getOrdre();
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/ordre.Ajax.php';
});
$router->newRoute('/api/add-km/chauffeur/:uuid', function($params){
    Km::$kilometergeId = $params[0];
    $kilometerge = Km::getKm();
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/kilometerges.Ajax.php';
});
$router->newRoute('/api/carburants/nouvelle/:uuid', function($params){
    Km::$kilometergeId = $params[0];
    $kilometerge = Km::getKm();
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/kilometerges.Ajax.php';
});
$router->newRoute('/api/carburants/:uuid', function($params){
    Carburants::$carburantId = $params[0];
    $carburant = Carburants::getCarburant();
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/carburants.Ajax.php';
});
$router->newRoute('/api/ordres/:uuid', function($params){
    Ordre::$ordreId = $params[0];
    $ordre = Ordre::getOrdre();
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/ordre.Ajax.php';
});
$router->newRoute('/api/ordres/confirmation/:uuid', function($params){
    Ordre::$ordreId = $params[0];
    $ordre = Ordre::getOrdre();
    Ticket::$ordreId = $params[0];
    $tickets= Ticket::getTickets();
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/ordre.Ajax.php';
});
$router->newRoute('/api/ordres/imprimer/:uuid', function($params){
    Ordre::$ordreId = $params[0];
    $ordre = Ordre::getOrdre();
    Ticket::$ordreId = $params[0];
    $tickets= Ticket::getTickets();
});
$router->newRoute('/api/ordres/ticket/:uuid', function($params){
    Ordre::$ordreId = $params[0];
    $ordre = Ordre::getOrdre();
    Ticket::$ordreId = $params[0];
    $ticket = Ticket::getlastTicket();
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/ticket.Ajax.php';
});
$router->newRoute('/api/ticket/:uuid', function($params){
    Ticket::$numero = $params[0];
    $ticket = Ticket::getATicket();
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/ticket.Ajax.php';
});
$router->newRoute('/api/tickets/:uuid', function($params){
    Ticket::$ordreId = $params[0];
    $tickets = Ticket::getTickets();
    include $_SERVER['DOCUMENT_ROOT'].'/controllers/ajax/ticket.Ajax.php';
});


$router->run();