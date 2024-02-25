-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 15, 2024 at 01:45 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `maysarv5`
--

-- --------------------------------------------------------

--
-- Table structure for table `carburant`
--

CREATE TABLE `carburant` (
  `id` int(11) NOT NULL,
  `date` varchar(50) NOT NULL,
  `obeservation` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `quantite` int(11) NOT NULL,
  `prix` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `ordreId` int(11) NOT NULL,
  `driverUuid` varchar(255) NOT NULL,
  `excursionUuid` varchar(255) NOT NULL,
  `vehicleUuid` varchar(255) NOT NULL,
  `createdBy` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `drivers`
--

CREATE TABLE `drivers` (
  `id` int(11) NOT NULL,
  `driverFullName` varchar(255) NOT NULL,
  `bateOfBirth` varchar(255) DEFAULT NULL,
  `driverIdNo` varchar(255) DEFAULT NULL,
  `phoneHome` varchar(30) DEFAULT NULL,
  `phoneMobile` varchar(30) DEFAULT NULL,
  `idNumber` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `driverUuid` varchar(255) NOT NULL,
  `dateAdded` varchar(50) NOT NULL,
  `etat` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `excursion`
--

CREATE TABLE `excursion` (
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `ligne` varchar(50) DEFAULT NULL,
  `duree` int(11) DEFAULT NULL,
  `excursionUuid` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `excursion`
--

INSERT INTO `excursion` (`id`, `type`, `nom`, `destination`, `ligne`, `duree`, `excursionUuid`) VALUES
(3, 'transferet', 'Tunis Carthage International Airport', 'Tunis', NULL, 5, 'dfb211f3-3e2b-48f5-9b23-9193ccfaeb82'),
(4, 'transferet', 'Depart Djerba Zarzis International Airport', 'Djerba', 'inverse', NULL, 'dc33206b-b615-4f93-ba81-d7ce6712cb8f'),
(5, 'transferet', 'Enfidha Hammamet International Airport', 'Enfidha', NULL, NULL, '3fb16797-5a23-4914-8605-e108449c85a3'),
(6, 'transferet', 'Monastir Habib Bourguiba International Airport', 'Monastir', NULL, NULL, 'bff8e948-227c-492a-baa9-513b290a0ead'),
(7, 'transferet', 'Sfax Thyna International Airport', 'Sfax', NULL, NULL, '3cf3d65f-31dc-4287-a1d6-9fdd046500ab'),
(8, 'transferet', 'Tozeur Nefta International Airport', 'Tozeur', NULL, NULL, '6aca6028-1465-4c06-b7dc-2520e8ee1d3b'),
(9, 'transferet', 'Tabarka AÃ¯n Draham International Airport', 'Tabarka', NULL, NULL, '5b17a268-7ad3-480d-a934-bc3a5e39f762'),
(10, 'transferet', 'Gafsa Ksar International Airport', 'Gafsa', NULL, NULL, '9c6b042b-1731-4305-b4b0-ba8a7a618599'),
(11, 'transferet', 'GabÃ¨s Matmata International Airport', 'GabÃ¨s', NULL, NULL, '61e85ff9-e303-4a68-a8d1-980d6578e901'),
(12, 'transferet', 'Remada Airport', 'Remada', NULL, NULL, '56e138a2-622f-45d3-9931-9da3a12b3b48'),
(13, 'excursion', 'Tour de l\'ile 1/2 journee', 'Djerba', NULL, NULL, '7b05a3bf-c9af-43e9-81fc-29d386e3befd'),
(14, 'excursion', 'Tour de l\'ile 1 journee', 'Djerba', NULL, NULL, '092d54cb-4830-4be5-a317-e536c931d262'),
(15, 'excursion', 'Balade en mer', 'Djerba', NULL, NULL, '9afc4edd-23b7-49f7-b6e5-08388072398f'),
(16, 'excursion', 'Tataouine ChÃ©nini Bus', 'Tatouine', NULL, NULL, '59c2bb73-1d7f-4df9-acd9-38e62010272c'),
(18, 'excursion', 'Matmata Douz Avec Dromadaire', 'Sud de tunisie', NULL, NULL, 'e3ed5ae0-dd25-427c-b0ae-8ae6f8fd8110'),
(19, 'excursion', 'Sud 2 jours (Tamerza)', 'Sud de tunisie', NULL, NULL, '1a435c89-33f5-469e-971b-9271b4856d38'),
(20, 'excursion', 'Excursion 1/2 Journee Djerba Explore', 'Djerba', 'inverse', NULL, '84b7ef43-18b6-46ad-83a7-bf8bae0851be'),
(21, 'excursion', 'Tataouine ChÃ©nini 4*4', 'Tatouine', NULL, NULL, '73a13225-4b94-4a0e-94a0-aa0691c1710c'),
(22, 'excursion', '2 jours Douz', 'Douz', NULL, NULL, '10ca0bce-3f8b-4f86-b87d-8b6891f8cf89'),
(23, 'excursion', 'Ksar Ghilen 1 jour', 'Ksar Ghilen', NULL, NULL, '1b1eb6a0-2c26-4d29-be72-6e041ab10207'),
(24, 'excursion', 'Ksar Ghilen 2 jours', 'Ksar Ghilen', NULL, NULL, '6249e418-b590-4dd1-961a-c3a3532ac186'),
(25, 'excursion', '2jours Tozeur OASIS', 'Tozeur', NULL, NULL, '7253fea3-fb19-42ea-8ec5-1ec9619c6273'),
(26, 'excursion', 'Ksar Ghilen Matmata', 'Sud', NULL, NULL, '42dfcce5-5bb3-41b2-bf38-d4cb881e8e04'),
(27, 'excursion', 'Matmata Toujane', 'su*', NULL, NULL, 'aa0940f8-7a60-47c2-978f-e64a4d121ca6'),
(28, 'excursion', 'test', 'test', 'direct', NULL, 'e2826b31-0074-491c-b005-2e0ef33a0266'),
(29, 'mission', 'djerba', 'Djerba', 'inverse', 1, 'ffe127c0-d265-4a7f-8979-1bc8353e4927'),
(30, 'transferet', 'Arrive Djerba Zarzis International Airport', 'Djerba', 'inverse', 0, '2eadb3a3-9c5d-4a61-af2c-ffe2687f1651');

-- --------------------------------------------------------

--
-- Table structure for table `hotels`
--

CREATE TABLE `hotels` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `localisation` varchar(255) DEFAULT NULL,
  `zone` int(11) DEFAULT NULL,
  `numero` int(11) DEFAULT NULL,
  `hotelUuid` varchar(255) DEFAULT NULL,
  `etat` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `hotels`
--

INSERT INTO `hotels` (`id`, `nom`, `localisation`, `zone`, `numero`, `hotelUuid`, `etat`) VALUES
(32, 'Radisson Blu Palace Resort & Thalasso', 'Djerba', 1, 1, '1c63e20e-d0b0-4175-8dcb-9d1a84c775b8', NULL),
(33, 'Tui Blue Ulysse Palace', 'Djerba', 1, 2, '37f7c69b-24eb-433f-a8c6-6bf644a3154a', NULL),
(34, 'Djerba Orient', 'Djerba', 1, 3, '5b9f14c2-a703-4934-a84d-7bce9fa73707', NULL),
(35, 'Djerba Holiday Beach', 'Djerba', 1, 4, 'ddbb6a48-159d-41f6-9a51-cae0aa88c515', NULL),
(36, 'Djerba Sun Club', 'Djerba', 1, 5, 'e86d0876-29a2-4505-b8bb-e7d542f47fe7', NULL),
(37, 'Hasdrubal Prestige Thalassa & Spa', 'Djerba', 1, 7, 'f616b126-d55d-483a-a933-9da73bd48e48', NULL),
(38, 'HÃ´tel TÃ©lÃ©maque Beach & Spa Djerba', 'Djerba', 1, 6, '43377b0b-07f7-491f-9b05-b7c4a13fbe48', NULL),
(39, 'Djerba Playa Club', 'Djerba', 1, 9, 'df2f1a48-3aa1-43fb-a598-3dc921f64c4a', NULL),
(40, 'Club Marmara Palm Beach Djerba', 'Djerba', 1, 10, 'f16eb781-20c5-4b9f-8f11-24e82e953b7a', NULL),
(41, 'TUI BLUE Palm Beach Palace', 'Djerba', 1, 11, 'f6efe020-ec9f-465b-aeea-71467305ab5e', NULL),
(42, 'MAGIC DJERBA MARE', 'Djerba', 1, 12, 'aa558cfd-64cd-4fd5-b605-4f55e36f1114', NULL),
(43, 'Fiesta Beach Djerba', 'Djerba', 1, 13, 'daa7beef-2984-401f-9bb4-16c66cc6d27c', NULL),
(44, 'Les Jardins de Toumana', 'Djerba', 1, 14, 'f2b953e7-b77a-46d7-bd74-976851e2d7a3', NULL),
(45, 'TUI MAGIC LIFE Penelope Beach', 'Djerba', 1, 15, 'ffa582f9-b0a9-493d-b4bd-6606b0bdace9', NULL),
(46, 'Novostar Iris Djerba Hotel & Thalasso', 'Djerba', 1, 16, '0b70dc98-2a6b-4c0c-8422-fda0155e194e', NULL),
(47, 'Hotel Djerba Resort', 'Djerba', 1, 17, '2b21603c-1b35-4b44-954d-080990bd6a4c', NULL),
(48, 'Joya paradise & Spa Djerba', 'Djerba', 1, 18, '9e3858b4-9821-41b6-b4c7-93111e8f96bd', NULL),
(49, 'The Ksar Djerba', 'Djerba', 1, 19, '55007094-ee96-4e54-a64d-d818dceb1d2d', NULL),
(50, 'BAYA BEACH Aquapark', 'Djerba', 1, 20, '2bff3791-79b1-45af-aa2a-4b1942432e55', NULL),
(51, 'Vincci Dar Midoun', 'Djerba', 1, 21, '3bcc3f33-66b6-4620-941b-f73a5a9b09d9', NULL),
(52, 'Sentido Djerba Beach', 'Djerba', 1, 22, '14ddf12e-0699-4abf-8cb9-9ece95b00962', NULL),
(53, 'Hasdrubal Thalassa & Spa Djerba Hotel', 'Djerba', 1, 23, '87f289d3-49b3-4ea9-b819-01190218dbdf', NULL),
(54, 'Cedriana Hotel', 'Djerba', 1, 24, '97541d34-9cde-4542-8ce1-7a4e00a9c451', NULL),
(55, 'Diar Yassine', 'Djerba', 1, 25, 'ccdf7f82-7fce-41c5-a1d3-92362fc19503', NULL),
(56, 'Hotel Riad Meninx Djerba', 'Djerba', 1, 26, '7704e876-6b15-4089-90bc-2728bd2da7e9', NULL),
(57, 'Djerba Aqua Resort', 'Djerba', 1, 27, '6725be3e-69c2-4d53-821d-1779504f4063', NULL),
(58, 'Cesar Thalasso & Convention', 'Djerba', 2, 28, '3b55a1ac-fd05-4476-9356-143993ee8a49', NULL),
(59, 'Djerba Plaza Thalasso & Spa', 'Djerba', 2, 29, '9ed4e369-b98a-4db7-8510-231162b90600', NULL),
(60, 'Yadis Djerba Golf Thalasso & Spa', 'Djerba', 2, 30, 'b9ef5add-3c62-4c5b-bb0c-c1101bea3f7d', NULL),
(61, 'HÃ´tel Royal Garden Palace', 'djerba', 2, 31, '69834949-13fb-4581-a186-920c752df759', NULL),
(62, 'Iberostar Mehari Djerba', 'Djebra', 2, 32, '363b0b49-7130-4048-8887-6aa2b58d72ae', NULL),
(63, 'Djerba Golf Resort & Spa', 'Djerba', 2, 33, 'd3cd136b-eb84-447f-aa61-67196dfacd4e', NULL),
(64, 'HÃ´tel Green Palm', 'djerba', 2, 36, '0587e798-88c8-49e5-bc10-759b32475a8d', NULL),
(65, 'Djerba Holiday Club HÃ´tel Dar el Manara', 'djerba', 3, 37, 'cfe347d4-6f42-432e-87c2-0aeb8ab064f5', NULL),
(66, 'Club Marmara Zahra ', 'Djerba', 3, 39, 'a55eb5cc-f15b-44fd-8ef0-eaa2e4d4aa06', NULL),
(67, 'Club Marmara Narjess', 'Djerba', 3, 40, '050e2951-3e4c-44c8-aa08-11cfa7f7c0ea', NULL),
(68, 'Dar Yasmine (Dar Jerba)', 'Djerba', 3, 41, '3758cc8b-f339-40ca-ac7e-e34fd9571a63', NULL),
(69, 'Dar Zahra (Dar Jerba)', 'Djerba', 3, 42, 'fc952be7-2114-4661-86f0-2a1fc84a795b', NULL),
(70, 'HÃ´tel Welcome Meridiana Beach', 'Djerba', 3, 43, 'e467adcc-0c51-42a7-b73f-f71c71ac17ee', NULL),
(71, 'Seabel Rym Beach Djerba', 'Djerba', 3, 45, '33e8b0cf-3e56-4ca6-b7a3-dd3d10f402bd', NULL),
(72, 'Club Calimera Yati Beach', 'Djerba', 3, 46, 'c3bdaed0-2aea-42bc-939c-1fedc2be60ef', NULL),
(73, 'ROBINSON DJERBA BAHIYA', 'Djerba', 3, 47, 'e20536ec-0009-4643-98be-ef22dcb6158a', NULL),
(74, 'HÃ´tel Magic Iliade Djerba', 'Djerba', 3, 48, '6a209f4b-f396-4a1a-83f7-d1d7c27361a3', NULL),
(75, 'HÃ´tel Vincci Helios Beach', 'Djerba', 3, 49, 'f42be903-2022-4b5b-b8e5-91d362f2c673', NULL),
(76, 'Hotel Bougainvillier Djerba', 'Djerba', 3, 50, 'eddb2031-01a8-4292-9878-7d05427cd215', NULL),
(77, 'HÃ´tel Sidi Mansour Resort & Spa', 'Djerba', 3, 51, '9329c485-729a-4787-ada4-4667b9a31e0f', NULL),
(78, 'El Mouradi Djerba Menzel', 'Djerba', 4, 52, '70d37aee-4445-42eb-b728-960cc8e0390a', NULL),
(79, 'Club Med Djerba', 'Djerba', 4, 53, '2fbad35c-4840-4118-83f4-7713cc44f0dd', NULL),
(80, 'Royal Karthago Resort & Thalasso', 'Djerba', 4, 54, '66cd164d-43a0-4e4e-8071-da7bf7f6f00d', NULL),
(81, 'Hotel Golf Beach', 'Djerba', 4, 55, '583ef052-4a16-4f7e-8949-4256f2c95bfe', NULL),
(82, 'Hari Club Beach Resort', 'Djerba', 4, 56, 'fcba11c9-1c1a-4c08-a9d3-9cf9a4f95fbc', NULL),
(83, 'HÃ´tel Djerba Castille', 'Djerba', 4, 57, '9b2729ea-3302-493c-a871-6fc717c70555', NULL),
(84, 'Seabel Aladin Djerba', 'Djerba', 4, 58, '5767df76-1d89-4295-afa7-c0a2afdfdda9', NULL),
(85, 'Hotel Palm Azur Djerba', 'Djerba', 4, 59, '3608b1d1-6011-410f-b268-dad9539ca677', NULL),
(86, 'Yadis Imperial Beach & Spa Resort', 'Djerba', 4, 60, 'a459260e-e2df-418e-9a00-d73e9381e2b3', NULL),
(87, 'Cap djerba resort', 'Djerba', 4, 61, '0e5ef338-8c18-4b6f-b534-cbb8583dfca5', NULL),
(88, 'Alkantara Thalassa Hotel', 'Djerba', 4, 62, '8d832139-8af5-4b7f-ad1f-785f6c3cb7cd', NULL),
(89, 'HÃ´tel Rais Club', 'Djerba', 4, 63, '00f43b0a-f56c-46b0-bda0-2e22bbfdafc8', NULL),
(90, 'Djerba paradise resort', 'Djerba', 4, 65, 'd5ac30c4-ceba-4218-82e4-3d8420774f4d', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `km`
--

CREATE TABLE `km` (
  `id` int(11) NOT NULL,
  `depart` int(11) DEFAULT NULL,
  `arrive` int(11) DEFAULT NULL,
  `diff` int(11) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `vehicleUuid` varchar(255) DEFAULT NULL,
  `excursionUuid` varchar(255) DEFAULT NULL,
  `driverUuid` varchar(255) DEFAULT NULL,
  `createdBy` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `modelsvehicle`
--

CREATE TABLE `modelsvehicle` (
  `id` int(11) NOT NULL,
  `model` varchar(255) DEFAULT NULL,
  `vtypeUuid` varchar(255) DEFAULT NULL,
  `puissanceA` int(11) DEFAULT NULL,
  `puissanceM` int(11) DEFAULT NULL,
  `bvitesse` int(11) DEFAULT NULL,
  `reservoir` int(11) DEFAULT NULL,
  `typec` varchar(255) DEFAULT NULL,
  `place` int(11) DEFAULT NULL,
  `modelUuid` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `modelsvehicle`
--

INSERT INTO `modelsvehicle` (`id`, `model`, `vtypeUuid`, `puissanceA`, `puissanceM`, `bvitesse`, `reservoir`, `typec`, `place`, `modelUuid`) VALUES
(3, 'Hyundai H350 Solati	', '9e28c36f-f1d4-4c89-a2ba-e0bade7c1c6e', 7, 170, 6, 75, NULL, 16, '2e715f23-9293-4870-b0b7-07883101e899'),
(4, 'Golden Dragon', '61aa3177-90dc-40d9-bb0d-2189acef485d', 8, 200, 5, 70, NULL, 9, 'd57953da-5c5e-437f-96c7-e361e1e195ca'),
(5, 'Peugeot Expert Combi ', '61aa3177-90dc-40d9-bb0d-2189acef485d', 9, 150, 6, 0, NULL, 9, '43fcb59c-411e-4d70-8c81-0d993b5bc72f'),
(6, 'Toyota Hiace', '61aa3177-90dc-40d9-bb0d-2189acef485d', 10, 102, 5, 1, 'Mazout', 9, '3d4a9068-d2bf-475e-9315-7d677f60372f'),
(7, 'Ford Transit', '9e28c36f-f1d4-4c89-a2ba-e0bade7c1c6e', 6, 154, 6, 5, 'Mazout', 15, 'e4412710-3240-4c70-bd35-3b86879acfb1'),
(9, 'King Long Kingo ', '9e28c36f-f1d4-4c89-a2ba-e0bade7c1c6e', 6, 110, 5, 70, 'Mazout', 15, '8d5d40b5-084d-40f9-84a1-83b550f1a72d'),
(10, 'Toyota Hiace', '9e28c36f-f1d4-4c89-a2ba-e0bade7c1c6e', 10, 102, 5, 70, 'Mazout', 16, '7fec8efc-5210-406e-a6f1-d87006d21173'),
(11, ' Golden Dragon', '6f79b1b2-7717-41fb-82de-c4c3bce300e3', 0, 170, 6, 200, 'Mazout', 30, 'fe7d0407-3bb4-4d3e-94e3-b88ad799b1c1'),
(12, 'Isuzu Eco Classic', '6f79b1b2-7717-41fb-82de-c4c3bce300e3', 12, 120, 5, 0, 'Mazout', 30, 'e7bd4964-ac8d-4cd0-946d-dc948341d7ae'),
(13, 'Iveco Italcar ', '6f79b1b2-7717-41fb-82de-c4c3bce300e3', 12, 170, 6, 120, 'Mazout', 29, '46aaa6a4-4365-45ad-b53d-3eaaa5d6eefa'),
(14, 'King Long', '6f79b1b2-7717-41fb-82de-c4c3bce300e3', 0, 180, 0, 256, 'Mazout', 30, '778836b9-0bc2-4e42-9fd5-d98cede09750'),
(15, 'Otokar Navigo', '6f79b1b2-7717-41fb-82de-c4c3bce300e3', 0, 0, 0, 0, 'Mazout', 29, '2019e0a7-6aaa-43a3-ab8b-f81b266f8f5b'),
(16, 'Setcar', '6f79b1b2-7717-41fb-82de-c4c3bce300e3', 12, 146, 6, 105, 'Mazout', 29, '7d629079-d247-4b20-8ea0-c5cd2e5058e9'),
(17, 'Temsa Prestij', '6f79b1b2-7717-41fb-82de-c4c3bce300e3', 0, 0, 0, 120, 'Mazout', 30, '5412effe-983e-48c0-8413-fa210d6329dc'),
(18, 'Toyota Coaster', '6f79b1b2-7717-41fb-82de-c4c3bce300e3', 11, 130, 0, 0, 'Mazout', 23, 'f742c99f-b0da-4410-9738-daf78d0e87cb'),
(19, 'Golden Dragon', 'bcd2b3e3-6d6a-458e-9921-8d0e5c3e8ec2', 18, 220, 6, 280, 'Mazout', 41, '6b1d5be1-1902-4ea0-815e-505df5eb731a'),
(20, 'King Long ', 'bcd2b3e3-6d6a-458e-9921-8d0e5c3e8ec2', 18, 375, 6, 480, 'Mazout', 53, '565a3d01-d0ce-444f-b18a-31dc3a80c9f3'),
(21, 'MAN Autocar Confort', 'bcd2b3e3-6d6a-458e-9921-8d0e5c3e8ec2', 0, 350, 6, 415, 'Mazout', 53, '44361de5-1135-4beb-939d-b354f5ba25de'),
(22, 'Mercedes-Benz OC500', 'bcd2b3e3-6d6a-458e-9921-8d0e5c3e8ec2', 0, 0, 0, 0, 'Mazout', 53, 'ca3c6d37-f6aa-498d-a09c-96713688df90'),
(23, 'Volvo B11R', 'bcd2b3e3-6d6a-458e-9921-8d0e5c3e8ec2', 0, 370, 0, 450, 'Mazout', 53, 'b8380de1-44d6-4b81-854e-5139876a817b');

-- --------------------------------------------------------

--
-- Table structure for table `ordre`
--

CREATE TABLE `ordre` (
  `id` int(11) NOT NULL,
  `agence` varchar(50) DEFAULT NULL,
  `heure` varchar(10) NOT NULL,
  `excursion` varchar(50) NOT NULL,
  `heurer` varchar(50) DEFAULT NULL,
  `dater` varchar(50) DEFAULT NULL,
  `driverUuid` varchar(255) NOT NULL,
  `excursionUuid` varchar(255) NOT NULL,
  `vehicleUuid` varchar(255) NOT NULL,
  `gasoil` int(11) DEFAULT NULL,
  `kmtotal` int(11) DEFAULT NULL,
  `placeocu` int(11) DEFAULT NULL,
  `dateAdded` varchar(50) DEFAULT NULL,
  `createdBy` varchar(255) DEFAULT NULL,
  `etat` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `siteLogo` varchar(255) DEFAULT NULL,
  `siteName` varchar(255) DEFAULT NULL,
  `siteNumber1` int(11) DEFAULT NULL,
  `siteNumber2` int(11) DEFAULT NULL,
  `siteEmail` varchar(50) DEFAULT NULL,
  `siteAdresse` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tarifs`
--

CREATE TABLE `tarifs` (
  `id` int(11) NOT NULL,
  `excursionUuid` varchar(255) DEFAULT NULL,
  `tarifsenf` int(11) DEFAULT NULL,
  `tarifsadu` int(11) DEFAULT NULL,
  `typev` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `id` int(11) NOT NULL,
  `numero` varchar(255) DEFAULT NULL,
  `depart` varchar(50) DEFAULT NULL,
  `client` varchar(255) DEFAULT NULL,
  `adulte` int(11) DEFAULT NULL,
  `enfant` int(11) DEFAULT NULL,
  `bebe` int(11) DEFAULT NULL,
  `adulter` int(11) DEFAULT NULL,
  `enfantr` int(11) DEFAULT NULL,
  `beber` int(11) DEFAULT NULL,
  `chambre` varchar(50) DEFAULT NULL,
  `hotel` varchar(255) DEFAULT NULL,
  `observation` varchar(255) DEFAULT NULL,
  `ordreId` int(11) DEFAULT NULL,
  `etat` varchar(255) DEFAULT NULL,
  `tarifstadu` varchar(255) DEFAULT NULL,
  `tarifstenf` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `typevehicle`
--

CREATE TABLE `typevehicle` (
  `id` int(11) NOT NULL,
  `vtype` varchar(255) DEFAULT NULL,
  `placemi` int(11) DEFAULT NULL,
  `placemx` int(11) DEFAULT NULL,
  `vtypeUuid` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `typevehicle`
--

INSERT INTO `typevehicle` (`id`, `vtype`, `placemi`, `placemx`, `vtypeUuid`) VALUES
(5, 'micro Bus', 9, 9, '61aa3177-90dc-40d9-bb0d-2189acef485d'),
(6, 'Mini-Bus', 15, 20, '9e28c36f-f1d4-4c89-a2ba-e0bade7c1c6e'),
(7, 'Mini-Bus', 21, 30, '6f79b1b2-7717-41fb-82de-c4c3bce300e3'),
(8, 'Bus', 31, 55, 'bcd2b3e3-6d6a-458e-9921-8d0e5c3e8ec2');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `bateOfBirth` varchar(255) DEFAULT NULL,
  `phoneOne` varchar(30) DEFAULT NULL,
  `phoneTwo` varchar(30) DEFAULT NULL,
  `idNumber` varchar(50) DEFAULT NULL,
  `userEmail` varchar(255) NOT NULL,
  `userUuid` varchar(255) NOT NULL,
  `userRole` varchar(255) NOT NULL,
  `userPassword` varchar(255) NOT NULL,
  `userStatus` varchar(50) NOT NULL DEFAULT 'active',
  `userDefaultPass` varchar(50) NOT NULL DEFAULT 'yes'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL,
  `modelUuid` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  `regisNumber` varchar(255) DEFAULT NULL,
  `dateAdded` varchar(255) NOT NULL,
  `vehicleUuid` varchar(255) NOT NULL,
  `etat` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carburant`
--
ALTER TABLE `carburant`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `excursion`
--
ALTER TABLE `excursion`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hotels`
--
ALTER TABLE `hotels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `km`
--
ALTER TABLE `km`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `modelsvehicle`
--
ALTER TABLE `modelsvehicle`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ordre`
--
ALTER TABLE `ordre`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tarifs`
--
ALTER TABLE `tarifs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `typevehicle`
--
ALTER TABLE `typevehicle`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carburant`
--
ALTER TABLE `carburant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `drivers`
--
ALTER TABLE `drivers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `excursion`
--
ALTER TABLE `excursion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `hotels`
--
ALTER TABLE `hotels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `km`
--
ALTER TABLE `km`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `modelsvehicle`
--
ALTER TABLE `modelsvehicle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `ordre`
--
ALTER TABLE `ordre`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tarifs`
--
ALTER TABLE `tarifs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ticket`
--
ALTER TABLE `ticket`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `typevehicle`
--
ALTER TABLE `typevehicle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;