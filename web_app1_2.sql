-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 29, 2024 at 09:19 AM
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
-- Database: `web_app1_2`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `slot_id` int(11) NOT NULL,
  `objective` text NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL,
  `action_by` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `booked_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `room_id`, `slot_id`, `objective`, `status`, `action_by`, `date`, `booked_at`) VALUES
(1, 1, 1, 3, 'Group meeting', 'approved', 3, '2024-04-18', '2024-04-17 13:33:50'),
(2, 2, 1, 8, 'Group meeting', 'pending', NULL, '2024-04-19', '2024-04-18 10:19:47');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `room_id` int(11) NOT NULL,
  `room_name` varchar(100) NOT NULL,
  `image_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`room_id`, `room_name`, `image_path`) VALUES
(1, '111', 'meetingroomart_0.jpg'),
(2, '112', NULL),
(3, '121', NULL),
(4, '122', NULL),
(5, '211', NULL),
(6, '221', NULL),
(7, '311', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `time_slots`
--

CREATE TABLE `time_slots` (
  `slot_id` int(11) NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `status` enum('free','pending','reserved','disabled') NOT NULL DEFAULT 'free'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `time_slots`
--

INSERT INTO `time_slots` (`slot_id`, `room_id`, `start_time`, `end_time`, `status`) VALUES
(1, 1, '08:00:00', '10:00:00', 'free'),
(2, 1, '10:00:00', '12:00:00', 'free'),
(3, 1, '13:00:00', '15:00:00', 'reserved'),
(4, 1, '15:00:00', '17:00:00', 'disabled'),
(5, 2, '08:00:00', '10:00:00', 'pending'),
(6, 2, '10:00:00', '12:00:00', 'free'),
(7, 2, '13:00:00', '15:00:00', 'disabled'),
(8, 2, '15:00:00', '17:00:00', 'pending'),
(9, 3, '08:00:00', '10:00:00', 'free'),
(10, 3, '10:00:00', '12:00:00', 'pending'),
(11, 3, '13:00:00', '15:00:00', 'free'),
(12, 3, '15:00:00', '17:00:00', 'pending'),
(13, 4, '08:00:00', '10:00:00', 'free'),
(14, 4, '10:00:00', '12:00:00', 'reserved'),
(15, 4, '13:00:00', '15:00:00', 'pending'),
(16, 4, '15:00:00', '17:00:00', 'free'),
(17, 5, '08:00:00', '10:00:00', 'reserved'),
(18, 5, '10:00:00', '12:00:00', 'free'),
(19, 5, '13:00:00', '15:00:00', 'pending'),
(20, 5, '15:00:00', '17:00:00', 'reserved'),
(21, 6, '08:00:00', '10:00:00', 'free'),
(22, 6, '10:00:00', '12:00:00', 'pending'),
(23, 6, '13:00:00', '15:00:00', 'free'),
(24, 6, '15:00:00', '17:00:00', 'disabled'),
(25, 7, '08:00:00', '10:00:00', 'free'),
(26, 7, '10:00:00', '12:00:00', 'pending'),
(27, 7, '13:00:00', '15:00:00', 'reserved'),
(28, 7, '15:00:00', '17:00:00', 'free');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(128) NOT NULL,
  `role` tinyint(3) NOT NULL DEFAULT 1 COMMENT '1=user,2=lecturer,3=staff'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `role`) VALUES
(1, 'Ezreal', 'ez@gmail.com', '$2b$10$9e9hAjYyhBNHslKFU5GkzeZu0KP4Cjtw4RP.jFksegM18l91QXI6K', 1),
(2, 'Lux', 'lu@gmail.com', '$2b$10$H8XleB63o2yoZMgZDoSlx.hM8MkedTby7qqBdEh9Kl6AdKFri9iAG', 1),
(3, 'Aj.Lee', 'le@gmail.com', '$2b$10$idjOPfONgRw9X.hZflv/qev9yHYUl1yFAPWOTHUBDPz6jwLRWqg9K', 2),
(4, 'Aj.Sin', 'si@gmail.com', '$2b$10$YOfQp44nE.2B4.FHxG0xH.niVXl3Yk3.o06oM/nJM2cQDe9KrTqSC', 2),
(5, 'Admin1', 'admin1@gmail.com', '$2b$10$.idRcDy9rKR522k150xg7ee.oUNy/sP02DNBlG43494qEJ0tXxhWK', 3),
(20, '123', '123', '$2b$10$Qgwyw7EkP4SE2qXeKCDILeXsiwpCFIzWnb4GLDZSTC1U486UPLR3e', 1),
(21, '456', '456', '$2b$10$LqDNIzAgVffK2VAuCfmUhO1aOVkyEHjOnNqjSAQvWOXe5yZUK03z2', 1),
(22, '789', '789', '$2b$10$Z/5nLuX5s1ujW9dOLgJjA.XWYtf0ufvEdBmc8JS6XTH6U/5VjIEGi', 1),
(23, '987', '987', '$2b$10$7fSPyG1rYY/KJCHSu72bfeKdGz/ZtXOucMOeYZzHsyiOs3FltCss.', 1),
(24, 'ter', 'ter', '$2b$10$/TjCTyPeW7PIY2eS/PRr0.t.V9YLBAJ0XJtVxLwBqLmwNF3LxjmoK', 2),
(25, '852', '852', '$2b$10$gEks48h4glzFGsOOm./lJeHb0K8n9SWC4i7kXW7vlS946CugHiVXi', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `slot_id` (`slot_id`),
  ADD KEY `bookings_ibfk_4` (`action_by`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`room_id`);

--
-- Indexes for table `time_slots`
--
ALTER TABLE `time_slots`
  ADD PRIMARY KEY (`slot_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `room_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `time_slots`
--
ALTER TABLE `time_slots`
  MODIFY `slot_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`),
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`slot_id`) REFERENCES `time_slots` (`slot_id`),
  ADD CONSTRAINT `bookings_ibfk_4` FOREIGN KEY (`action_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `time_slots`
--
ALTER TABLE `time_slots`
  ADD CONSTRAINT `time_slots_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`);

DELIMITER $$
--
-- Events
--
CREATE DEFINER=`root`@`localhost` EVENT `event_reset` ON SCHEDULE EVERY 24 HOUR STARTS '2024-04-24 12:59:09' ON COMPLETION NOT PRESERVE ENABLE DO UPDATE time_slots.status
    SET `status`=DEFAULT
    WHERE expire_date <= now( )$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
