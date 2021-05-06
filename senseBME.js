/******************************************************************************
 * Created Date: Tuesday April 13th 2021                                      *
 * Author: Sean W.                                                            *
 * -----                                                                      *
 * Last Modified: Wed May 05 2021                                             * 
 * Modified By: Sean W.                                                       * 
 * -----                                                                      *
 * File: /senseBme.js                                                         *
 * Copyright (c) 2021 Kuva                                                    *
 ******************************************************************************/

const BME280 = require("bme280-sensor");

let socket;
// The BME280 constructor options are optional.
//
const options = {
  i2cBusNo: 1, // defaults to 1
  i2cAddress: 0x76// BME280.BME280_DEFAULT_I2C_ADDRESS(), // defaults to 0x77
};

let bme280;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

try {
  bme280 = new BME280(options);
} catch (error) {
  bme280 = {
    init: () => {
      return new Promise((resolve, reject) => {
        console.log("inited fake sensor");
        resolve();
      });
    },

    readSensorData: () => {
      return new Promise((resolve, reject) => {
        const data = {};
        data.temperature_C =  getRandomInt(25,30);
        data.pressure_hPa = getRandomInt(20,30);
        data.humidity = getRandomInt(55,65);

        console.log(`data = ${JSON.stringify(data, null, 2)}`);
        resolve(data);
      });
    },
  };
}

// Read BME280 sensor data, repeat
//
const readSensorData = () => {
  bme280
    .readSensorData()
    .then((data) => {
      // temperature_C, pressure_hPa, and humidity are returned by default.
      // I'll also calculate some unit conversions for display purposes.
      data.temperature_F = BME280.convertCelciusToFahrenheit(
        data.temperature_C
      );
      data.pressure_inHg = BME280.convertHectopascalToInchesOfMercury(
        data.pressure_hPa
      );

      console.log(`data = ${JSON.stringify(data, null, 2)}`);
      if(socket){
        socket.emit("cam_update", JSON.stringify(data, null, 2));
        // ws.send(JSON.stringify(data, null, 2));
      }
      setTimeout(readSensorData, 20000);
    })
    .catch((err) => {
      console.log(`BME280 read error1: ${err}`);
      setTimeout(readSensorData, 20000);
      //TODO: semd over websockets
    });
};
const readOnce = () => {
  return new Promise((resolve, reject) => {
    bme280
      .readSensorData()
      .then((data) => {
        // temperature_C, pressure_hPa, and humidity are returned by default.
        // I'll also calculate some unit conversions for display purposes.
        //
        data.temperature_F = BME280.convertCelciusToFahrenheit(
          data.temperature_C
        );
        data.pressure_inHg = BME280.convertHectopascalToInchesOfMercury(
          data.pressure_hPa
        );

        console.log(`data = ${JSON.stringify(data, null, 2)}`);
        resolve(data);
      })
      .catch((err) => {
        console.log(`BME280 read error2: ${err}`);
        reject(err);
      });
  });
};
// Initialize the BME280 sensor

const init = (_ws)=>{
  socket = _ws
  bme280
    .init()
    .then(() => {
      console.log("BME280 initialization succeeded");
      readSensorData();
    })
    .catch((err) => console.error(`BME280 initialization failed: ${err} `));
}

module.exports = { readOnce, init };