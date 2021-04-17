#!/usr/bin/env python3
# -*- coding:utf-8 -*-
###############################################################################
# Created Date: Monday April 12th 2021                                        # 
# Author: Sean W.                                                             # 
# -----                                                                       # 
# Last Modified: Mon Apr 12 2021                                              # 
# Modified By: Sean W.                                                        # 
# -----                                                                       # 
# File: /clientside.py                                                        # 
# Copyright (c) 2021 Kuva                                                     # 
###############################################################################

import asyncio
import websockets

async def hello(uri):
    async with websockets.connect(uri) as websocket:
        await websocket.send("Hello world!")
        await websocket.recv()

asyncio.get_event_loop().run_until_complete(
    hello('ws://localhost:8765'))