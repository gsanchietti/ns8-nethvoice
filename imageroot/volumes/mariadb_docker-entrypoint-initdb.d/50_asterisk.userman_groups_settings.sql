/*!40101 SET NAMES binary*/;
/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40103 SET TIME_ZONE='+00:00' */;
USE `asterisk`;
INSERT INTO `userman_groups_settings` (`gid`,`module`,`key`,`val`,`type`) VALUES
(1,"conferencespro","ivr","1",NULL),
(1,"conferencespro","link","1",NULL),
(1,"contactmanager","groups","[\"*\"]","json-arr"),
(1,"contactmanager","show","1",NULL),
(1,"contactmanager","showingroups","[\"*\"]","json-arr"),
(1,"fax","attachformat","pdf",NULL),
(1,"fax","enabled","1",NULL),
(1,"faxpro","localstore","true",NULL),
(1,"restapps","callflow_enable","1",NULL),
(1,"restapps","callflows","[\"*\"]","json-arr"),
(1,"restapps","cf_enable","1",NULL),
(1,"restapps","conference_enable","1",NULL),
(1,"restapps","conferences","[\"linked\"]","json-arr"),
(1,"restapps","contact_enable","1",NULL),
(1,"restapps","contacts","[\"*\"]","json-arr"),
(1,"restapps","dnd_enable","1",NULL),
(1,"restapps","fmfm_enable","1",NULL),
(1,"restapps","lilo_enable","1",NULL),
(1,"restapps","login","1",NULL),
(1,"restapps","menuover","1",NULL),
(1,"restapps","parking_enable","1",NULL),
(1,"restapps","presence_enable","1",NULL),
(1,"restapps","qa_enable","1",NULL),
(1,"restapps","queue_enable","1",NULL),
(1,"restapps","queues","[\"*\"]","json-arr"),
(1,"restapps","timecondition_enable","1",NULL),
(1,"restapps","timeconditions","[\"*\"]","json-arr"),
(1,"restapps","voicemail_enable","1",NULL),
(1,"sysadmin","vpn_link","1",NULL),
(1,"ucp|Cdr","assigned","[\"self\"]","json-arr"),
(1,"ucp|Cdr","download","1",NULL),
(1,"ucp|Cdr","enable","1",NULL),
(1,"ucp|Cdr","playback","1",NULL),
(1,"ucp|Cel","assigned","[\"self\"]","json-arr"),
(1,"ucp|Cel","download","1",NULL),
(1,"ucp|Cel","enable","1",NULL),
(1,"ucp|Cel","playback","1",NULL),
(1,"ucp|Conferencespro","assigned","[\"linked\"]","json-arr"),
(1,"ucp|Conferencespro","enable","1",NULL),
(1,"ucp|Endpoint","assigned","[\"self\"]","json-arr"),
(1,"ucp|Endpoint","enable","1",NULL),
(1,"ucp|Global","allowLogin","1",NULL),
(1,"ucp|Global","originate","1",NULL),
(1,"ucp|Presencestate","enabled","1",NULL),
(1,"ucp|Settings","assigned","[\"self\"]","json-arr"),
(1,"ucp|Sysadmin","vpn_enable","1",NULL),
(1,"ucp|Voicemail","assigned","[\"self\"]","json-arr"),
(1,"ucp|Voicemail","download","1",NULL),
(1,"ucp|Voicemail","enable","1",NULL),
(1,"ucp|Voicemail","greetings","1",NULL),
(1,"ucp|Voicemail","playback","1",NULL),
(1,"ucp|Voicemail","settings","1",NULL),
(1,"ucp|Voicemail","vmxlocater","1",NULL),
(1,"xmpp","enable","1",NULL),
(1,"zulu","enable","1",NULL),
(1,"zulu","enable_fax","1",NULL),
(1,"zulu","enable_phone","1",NULL),
(1,"zulu","enable_sms","1",NULL);