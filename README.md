# WebTexting

Install notes:
* must enable websockets on the SIP profile, must be on port 7443
* must install [fork of fusionpbx-apps.git/sms](https://github.com/AccelerateNetworks/fusionpbx-sms-fork)
  * must put https://github.com/fusionpbx/fusionpbx-apps/blob/master/sms/resources/templates/conf/chatplan/default.xml in /etc/freeswitch/chatplan/default.xml (overwrite existing)
  * above is not documented anywhere that i can find, but appears to be required to install the stock sms app
  * probably have to reloadxml after doing this
  * our fork does not involve any changes to this file, it's fine to use upstream's

## Current limitations
* Contacts are displayed to users who don't have contact_read_* permissions
* Contact edit button may be displayed to users who do not have contact edit permission (they will see a "permission denied" screen when they click)
* Threads list does not update when new messages are received
* Having a thread open registers a SIP client on the extension, calls to which will be ignored
