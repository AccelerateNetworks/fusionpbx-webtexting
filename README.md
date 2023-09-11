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
* Install frontend assets to `js/`. There area two ways to get them:
  * run `./build-frontend.sh` on a system with podman installed.
  * download the files from the latest GitHub Actions build

## Current limitations
* Contacts are displayed to users who don't have contact_read_* permissions
* Contact edit button may be displayed to users who do not have contact edit permission (they will see a "permission denied" screen when they click)
* Threads list does not update when new messages are received
* Having a thread open registers a SIP client on the extension, calls to which will be ignored


## Developing
Frontend build requires a bunch of javascript stuff. To do it without installing a bunch of javascript stuff, install podman and use `build-frontend.sh`
# Debugger
TO add a debugger to the project you'll need to set one up.
if you're using VS Code you'll want to download the PHP Debug extension https://marketplace.visualstudio.com/items?itemName=xdebug.php-debug
to get started with xdebug you'll want to isntall xdebug.
I highly recommend you make a simple test.php file, put a phpinfo(); statement in there, then copy the output and paste it into the Xdebug installation wizard (https://xdebug.org/wizard.php). 
It will analyze it and give you tailored installation instructions for your environment.

After xdebug is installed you need to get php configured to use xdebug.
Do this by following the steps here https://xdebug.org/docs/install#configure-php

for debugging on a remote machine you need to modify the php.ini you found in the last step.


For Xdebug v3.x.x You'll need to edit the php.ini to add:

xdebug.mode = debug
xdebug.start_with_request = yes

this should prompt the debugger to start when it first encounters a breakpoint


