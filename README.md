Install on rpi

## 1##
`wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.58tar.gz`
`tar zxvf bcm2835-1.58.tar.gz` 
`cd bcm2835-1.58` 
`./configure`
`make`
`sudo make check`
`sudo make install`



## 2## on development machine
`cd client`
`npm run build`
`scp -r html pi@tent2:/home/pi/projects/tentcity/client`

## 3## on raspberry pi
`sudo npm install --unsafe-perm`
`npm start`
<!-- `sudo npm install --unsafe-perm -g node-dht-sensor` -->




i2cdetect -y 1


pm2 start bin www
pm2 save
pm2 startup