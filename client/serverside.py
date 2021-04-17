#!/usr/bin/env python3
# -*- coding:utf-8 -*-
###############################################################################
# Created Date: Monday April 12th 2021                                        # 
# Author: Sean W.                                                             # 
# -----                                                                       # 
# Last Modified: Mon Apr 12 2021                                              # 
# Modified By: Sean W.                                                        # 
# -----                                                                       # 
# File: /serverside.py                                                        # 
# Copyright (c) 2021 Kuva                                                     # 
###############################################################################
import asyncio
import websockets

async def echo(websocket, path):
    async for message in websocket:
        await websocket.send(message)
        print(message)

asyncio.get_event_loop().run_until_complete(
    websockets.serve(echo, 'localhost', 8765))
asyncio.get_event_loop().run_forever()