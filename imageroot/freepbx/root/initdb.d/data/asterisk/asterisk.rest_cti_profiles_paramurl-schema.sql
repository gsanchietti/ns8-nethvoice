/*!40101 SET NAMES binary*/;
/*!40014 SET FOREIGN_KEY_CHECKS=0*/;

/*!40103 SET TIME_ZONE='+00:00' */;
CREATE TABLE `rest_cti_profiles_paramurl` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `profile_id` int(10) unsigned NOT NULL,
  `url` varchar(255) NOT NULL DEFAULT '',
  `only_queues` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `profile_id_key` (`profile_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;