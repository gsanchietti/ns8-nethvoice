<?php

// Connect to DBs
$db = new \PDO('mysql:host=127.0.0.1;port='.$_ENV['MARIADB_PORT'],
    'root',
    $_ENV['MARIADB_ROOT_PASSWORD']);

$cdrdb = new \PDO('mysql:host=127.0.0.1;port='.$_ENV['MARIADB_PORT'],
    'root',
    $_ENV['MARIADB_ROOT_PASSWORD']);

// load default data
$db->exec(file_get_contents("/initdb.d/asterisk.sql"));
$cdrdb->exec(file_get_contents("/initdb.d/asteriskcdrdb.sql"));

// update freepbx settings
$vars = array(
	'AMPDBUSER' => $_ENV['AMPDBUSER'],
	'AMPDBPASS' => $_ENV['AMPDBPASS'],
	'CDRDBHOST' => '127.0.0.1',
	'CDRDBPORT' => $_ENV['MARIADB_PORT'],
	'CDRDBNAME' => 'asteriskcdrdb',
	'CDRDBUSER' => $_ENV['CDRDBUSER'],
	'CDRDBPASS' => $_ENV['CDRDBPASS'],
);

$exec = [];
$sql = '';
foreach ($vars as $key => $value) {
	$sql .= 'UPDATE `asterisk`.`freepbx_settings` SET `value` = ? WHERE `keyword` = ?;';
	$exec[] = $value;
	$exec[] = $key;
}
$stmt = $db->prepare($sql);
$stmt->execute($exec);
$stmt->closeCursor();

$db->exec("GRANT ALL on asterisk.* to '".$vars['AMPDBUSER']."'@'127.0.0.1' identified by '".$vars['AMPDBPASS']."'");
$cdrdb->exec("GRANT ALL on asteriskcdrdb.* to '".$vars['CDRDBUSER']."'@'".$vars['CDRDBHOST']."' identified by '".$vars['CDRDBPASS']."'");
