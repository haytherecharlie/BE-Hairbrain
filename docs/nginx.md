------------------------------------
NGINX : Documentation
------------------------------------

IP Address
---------------------
159.203.176.175

COMMANDS
---------------------
1)  To stop your web server, you can type:
	$	sudo systemctl stop nginx

2)  To start the web server when it is stopped, type:
	$	sudo systemctl start nginx

3)  To stop and then start the service again, type:
	$	sudo systemctl restart nginx

4)  If you are simply making configuration changes, Nginx can often reload without dropping connections. 
   	To do this, this command can be used:
	$	sudo systemctl reload nginx

5)  By default, Nginx is configured to start automatically when the server boots. 
	If this is not what you want, you can disable this behavior by typing:
	$	sudo systemctl disable nginx

6)  To re-enable the service to start up at boot, you can type:
	$	sudo systemctl enable nginx