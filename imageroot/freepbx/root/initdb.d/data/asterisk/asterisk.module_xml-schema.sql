/*!40101 SET NAMES binary*/;
/*!40014 SET FOREIGN_KEY_CHECKS=0*/;

/*!40103 SET TIME_ZONE='+00:00' */;
CREATE TABLE `module_xml` (
  `id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'xml',
  `time` int(11) NOT NULL DEFAULT '0',
  `data` longblob,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;