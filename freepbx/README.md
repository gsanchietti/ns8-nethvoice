# FreePBX container

Patches used after import:
```diff
--- imageroot/freepbx/root/var/www/html/freepbx/admin/libraries/BMO/PKCS.class.php.ori	2022-09-16 10:13:24.195498228 +0200
+++ imageroot/freepbx/root/var/www/html/freepbx/admin/libraries/BMO/PKCS.class.php	2022-09-16 10:12:58.523530475 +0200
@@ -478,14 +478,8 @@
 				throw new \Exception(sprintf(_("Could Not Create the Asterisk Keys Folder: %s"),$keyloc));
 			}
 		}
-
-		if (is_writable($keyloc)) {
-			// This is a good Directory, and we're happy.
-			$this->keylocation = $keyloc;
-			return $keyloc;
-		} else {
-			throw new \Exception(sprintf(_("Don't have permission/can't write to: %s"),$keyloc));
-		}
+		$this->keylocation = $keyloc;
+		return $keyloc;
 	}
 
 	private function validateName($name) {
--- imageroot/freepbx/root/var/www/html/freepbx/admin/libraries/php-asmanager.php.ori	2022-09-16 10:13:45.319471792 +0200
+++ imageroot/freepbx/root/var/www/html/freepbx/admin/libraries/php-asmanager.php	2022-09-16 10:12:34.739560437 +0200
@@ -1826,11 +1826,7 @@
 			$parameters['Module'] = $module;
 			return $this->send_request('Reload', $parameters);
 		} else {
-			//Until https://issues.asterisk.org/jira/browse/ASTERISK-25996 is fixed
-			$a = function_exists("fpbx_which") ? fpbx_which("asterisk") : "asterisk";
-			if(!empty($a)) {
-				return exec($a . " -rx 'core reload'");
-			}
+			return $this->send_request('Reload', $parameters);
 		}
 
 	}
--- imageroot/freepbx/root/var/www/html/freepbx/admin/modules/nethcti3/functions.inc.php.ori	2022-10-10 16:54:14.781108751 +0200
+++ imageroot/freepbx/root/var/www/html/freepbx/admin/modules/nethcti3/functions.inc.php	2022-10-10 17:00:32.984459476 +0200
@@ -379,7 +379,13 @@
         nethvoice_report_config();
 
         //Move provisioning files from /var/lib/tftpnethvoice to /var/lib/tftpboot
-        system("/usr/bin/sudo /usr/bin/scl enable rh-php56 -- php /var/www/html/freepbx/rest/lib/moveProvisionFiles.php");
+	system("/usr/bin/sudo /usr/bin/scl enable rh-php56 -- php /var/www/html/freepbx/rest/lib/moveProvisionFiles.php");
+
+	// Convert /etc/asterisk symlinks to file copied
+	if (file_exists('/var/lib/asterisk/bin/symlink2copies.sh')) {
+	        system("/var/lib/asterisk/bin/symlink2copies.sh");
+	}
+
         //Reload CTI
         system("/var/www/html/freepbx/rest/lib/ctiReloadHelper.sh > /dev/null 2>&1 &");
     } catch (Exception $e) {
```