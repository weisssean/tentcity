#!/usr/bin/env python3
# -*- coding:utf-8 -*-
###############################################################################
# Created Date: Thursday April 15th 2021                                      # 
# Author: Sean W.                                                             # 
# -----                                                                       # 
# Last Modified: Sat Apr 17 2021                                              # 
# Modified By: Sean W.                                                        # 
# -----                                                                       # 
# File: /senseDHT.py                                                          # 
# Copyright (c) 2021 Kuva                                                     # 
###############################################################################
# SPDX-FileCopyrightText: 2021 ladyada for Adafruit Industries
# SPDX-License-Identifier: MIT
 
import time
import board
import adafruit_dht
 
# Initial the dht device, with data pin connected to:
dhtDevice = adafruit_dht.DHT22(board.D4)
 
# you can pass DHT22 use_pulseio=False if you wouldn't like to use pulseio.
# This may be necessary on a Linux single board computer like the Raspberry Pi,
# but it will not work in CircuitPython.
# dhtDevice = adafruit_dht.DHT22(board.D18, use_pulseio=False)
 
while True:
    try:
        # Print the values to the serial port
        temperature_c = dhtDevice.temperature
        temperature_f = temperature_c * (9 / 5) + 32
        humidity = dhtDevice.humidity
        
        print("got telemetry")
        print(temperature_c)
        print(temperature_f)
        print(humidity)
        print(
            "Temp: {:.1f} F / {:.1f} C    Humidity: {}% ".format(
                temperature_f, temperature_c, humidity
            )
        )
 
    except RuntimeError as error:
        # Errors happen fairly often, DHT's are hard to read, just keep going
        print(error.args[0])
        time.sleep(2.0)
        continue
    except Exception as error:
        dhtDevice.exit()
        raise error
 
    time.sleep(2.0)