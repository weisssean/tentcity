Install on rpi

## 1##
`wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.58tar.gz`
`tar zxvf bcm2835-1.58.tar.gz` 
`cd bcm2835-1.58` 
`./configure`
`make`
`sudo make check`
`sudo make install`


## 2##
`sudo npm install --unsafe-perm -g node-dht-sensor`