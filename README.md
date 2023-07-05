# WebTexting

Install notes:
* enable websockets on the SIP profile, must be on the same host and port as the web UI. Recommended way is to enable insecure websockets (ws) and bind it to 127.0.0.1, then pass /ws through from nginx:
```
location /ws {
    proxy_pass http://127.0.0.1:7080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 300s;
}
```
* install chatplan: `ln -s /var/www/fusionpbx/app/webtexting/chatplan.xml /etc/freeswitch/chatplan/default.xml`
  * probably have to reloadxml after doing this
* install lua script for outbound messages: `ln -s /var/www/fusionpbx/app/webtexting/lua /usr/share/freeswitch/scripts/app/webtexting`
* ensure `mod_curl` is loaded (add to `/etc/freeswitch/autoload_configs/modules.conf.xml`)
* to install dependencies: `composer install`
* as with most FusionPBX apps, must run schema and menu upgrade after installation.

## Current limitations
* Contacts are displayed to users who don't have contact_read_* permissions
* Contact edit button may be displayed to users who do not have contact edit permission (they will see a "permission denied" screen when they click)
* Threads list does not update when new messages are received
* Having a thread open registers a SIP client on the extension, calls to which will be ignored


## Developing
Frontend build requires a bunch of javascript stuff. To do it without installing a bunch of javascript stuff, install podman and use `build-frontend.sh`
