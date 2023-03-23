# NethVoice

NethVoice porting to NethServer 8

## Install

Instantiate the module with:

    add-module ghcr.io/nethesis/nethvoice:latest 1

The output of the command will return the instance name.
Output example:

    {"module_id": "nethvoice1", "image_name": "nethvoice", "image_url": "ghcr.io/nethserver/nethvoice:latest"}

## Configure

Let's assume that the nethvoice instance is named `nethvoice1`.

Launch `configure-module`, by setting the following parameters:
-  `nethcti_ui_host`: the NethCTI virtualhost, for instance "cti.makako.nethesis.it"
-  `user_domain`: the user domain where users should be taken that has been configured on NethServer interface
-  `nethvoice_host`: the nethvoice virtualhost, for instance "makako.nethesis.it"
-  `nethvoice_host_local_networks`: an array of local networks used for SIP NAT. Each network is an object with `network`, `netmask`, `gateway`
-  `subscription_systemid`: the id of the system registered on my.nethesis.it "XXXXXXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX"
-  `subscription_secret`: the secret of the system on my.nethesis.it "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
-  `nethcti_prefix`: phone prefix. Suggested: ""
-  `nethcti_autoc2c`: enable automatic click to call on NethCTI. Suggested: "enabled"
-  `nethcti_trunks_events`: enable events from trunks. Suggested: "enabled"
-  `nethcti_alerts`: enable alerts. Suggested: "false"
-  `nethcti_authentication_enabled`: enable authentication on CTI. Suggested: "true"
-  `nethcti_unauthe_call`: allow to launch calls without authentication using NethCTI APIs. Suggested: "disabled"
-  `nethcti_unauthe_call_ip`: IP from wich is possible to launch unauthenticated calls""
-  `nethcti_jabber_url`: ""
-  `nethcti_jabber_domain`: ""
-  `nethcti_cdr_script`: ""
-  `nethcti_cdr_script_timeout`: ""
-  `nethcti_cdr_script_call_in`: ""
-  `nethvoice_public_host`: same as nethvoice_host. for instance "makako.nethesis.it"
-  `nethcti_log_level`: NethCTI log level. Suggested for development: "info"
-  `conference_jitsi_url`: "https://jitsi.nethserver.net"
-  `nethcti_server_host`: "cti.makako.nethesis.it"

Example:

    api-cli run module/nethvoice1/configure-module --data '{"nethcti_ui_host":"cti.makako.nethesis.it","user_domain":"nsdc.nethesis.it", "nethvoice_host":"makako.nethesis.it", "nethvoice_host_local_networks":[ { "network":"192.168.5.0", "netmask":"255.255.255.0", "gateway":"192.168.5.1" }, { "network":"172.25.5.83", "netmask":"255.255.254.0", "gateway":"172.25.5.253" } ], "subscription_systemid":"XXXXXXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX", "subscription_secret":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", "nethcti_prefix":"", "nethcti_autoc2c":"enabled", "nethcti_trunks_events":"enabled", "nethcti_alerts":"false", "nethcti_authentication_enabled":"true", "nethcti_unauthe_call":"disabled", "nethcti_unauthe_call_ip":"", "nethcti_jabber_url":"", "nethcti_jabber_domain":"", "nethcti_cdr_script":"", "nethcti_cdr_script_timeout":"", "nethcti_cdr_script_call_in":"", "nethvoice_public_host":"makako.nethesis.it", "nethcti_log_level":"info", "conference_jitsi_url":"https://jitsi.nethserver.net","nethcti_server_host":"cti.makako.nethesis.it"}'

The above command will:
- start and configure the nethvoice instance
- (describe configuration process)
- ...

Send a test HTTP request to the nethvoice backend service:

    curl http://127.0.0.1/nethvoice/

## Uninstall

To uninstall the instance:

    remove-module --no-preserve nethvoice1

## Testing

Test the module using the `test-module.sh` script:


    ./test-module.sh <NODE_ADDR> ghcr.io/nethserver/nethvoice:latest

The tests are made using [Robot Framework](https://robotframework.org/)

