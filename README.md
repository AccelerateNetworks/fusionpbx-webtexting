# WebTexting

Install notes:
* must enable websocket connections on an internal SIP profile, must be on port 7443 for now
* must install fusionpbx-apps.git/sms
  * must put https://github.com/fusionpbx/fusionpbx-apps/blob/master/sms/resources/templates/conf/chatplan/default.xml in /etc/freeswitch/chatplan/default.xml (overwrite existing)
  * above is not documented anywhere that i can find
  * when this is in a more stable state it will likely require a custom chatplan xml that will call FusionPBX scripts as well as ours
