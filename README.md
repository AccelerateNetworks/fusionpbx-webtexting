# WebTexting

Install notes:
* must enable websockets on your profile, must be on port 7443 for now
* must install [fork of fusionpbx-apps.git/sms](https://github.com/AccelerateNetworks/fusionpbx-sms-fork)
  * must put https://github.com/fusionpbx/fusionpbx-apps/blob/master/sms/resources/templates/conf/chatplan/default.xml in /etc/freeswitch/chatplan/default.xml (overwrite existing)
  * above is not documented anywhere that i can find
  * probably have to reloadxml after doing this
  * our fork does not involve any changes to this file
* Has no schema or permissions of it's own

## Current limitations
* Contacts are displayed to users who don't have contact_read_* permissions
* Contact edit button may be displayed to users who do not have contact edit permission (they will see a "permission denied" screen when they click)
* Threads list does not update when new messages are received
* Having a thread open registers a SIP client on the extension, calls to which will be ignored
* no native notifications, even when the page is open
