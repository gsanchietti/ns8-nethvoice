/*!40101 SET NAMES binary*/;
/*!40014 SET FOREIGN_KEY_CHECKS=0*/;

/*!40103 SET TIME_ZONE='+00:00' */;
CREATE TABLE `bosssecretary_chief` (
  `id_group` int(10) unsigned NOT NULL,
  `chief_extension` varchar(20) NOT NULL,
  PRIMARY KEY (`id_group`,`chief_extension`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;