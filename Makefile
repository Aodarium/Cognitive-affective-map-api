
fetch:
	git clone https://github.com/Camel-app/Camel-Api

build:
	npm install .
    npm install pm2 
	npm run build

update:
    pm2 stop server-api
	git pull

start:
	pm2 start build/server.js --name server-api
