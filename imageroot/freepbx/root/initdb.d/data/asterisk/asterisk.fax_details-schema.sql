/*!40101 SET NAMES binary*/;
/*!40014 SET FOREIGN_KEY_CHECKS=0*/;

/*!40103 SET TIME_ZONE='+00:00' */;
CREATE TABLE `fax_details` (
  `key` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` varchar(710) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;