#!/usr/bin/env python3
# -*- coding:utf-8 -*-
###############################################################################
# Created Date: Thursday April 15th 2021                                      # 
# Author: Sean W.                                                             # 
# -----                                                                       # 
# Last Modified: Thu Apr 15 2021                                              # 
# Modified By: Sean W.                                                        # 
# -----                                                                       # 
# File: /senseDHT.py                                                          # 
# Copyright (c) 2021 Kuva                                                     # 
###############################################################################
import Adafruit_DHT
import time
 
DHT_SENSOR = Adafruit_DHT.DHT11
DHT_PIN = 4
 
while True:
    humidity, temperature = Adafruit_DHT.read(DHT_SENSOR, DHT_PIN)
    if humidity is not None and temperature is not None:
        print("Temp={0:0.1f}C Humidity={1:0.1f}%".format(temperature, humidity))
    else:
        print("Sensor failure. Check wiring.")
    time.sleep(3)