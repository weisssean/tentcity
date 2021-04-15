/******************************************************************************
 * Created Date: Tuesday April 13th 2021                                      *
 * Author: Sean W.                                                            *
 * -----                                                                      *
 * Last Modified: Thu Apr 15 2021                                             * 
 * Modified By: Sean W.                                                       * 
 * -----                                                                      *
 * File: /senseDHT.js                                                         *
 * Copyright (c) 2021 Kuva                                                    *
 ******************************************************************************/
var sensor = require("node-dht-sensor");

//DHT 22, pin 4
sensor.setMaxRetries(10);
sensor.initialize(22, 4);

if (process.env.FAKE_SENSOR) {
  //DHT fake implementation
  console.log("Initializing fake sensor", process.env.FAKE_SENSOR);
  sensor.setMaxRetries(10);
  sensor.initialize({
    test: {
      fake: {
        temperature: 21,
        humidity: 60,
      },
    },
  });
} else {
  //DHT 22, pin 4
  sensor.setMaxRetries(5);
  sensor.initialize(22, 4);
}

// Read DHT sensor data, repeat
const readSensorData = () => {
  sensor.read(22, 4, function (err, temperature, humidity) {
    if (!err) {
      console.log(
        `temp: ${temperature.toFixed(1)}°C, ` +
          `humidity: ${humidity.toFixed(1)}%`
      );
    }
    setTimeout(readSensorData, 2000);
  });

  // sensor.read()
  //   .then((data) => {
  //     // temperature_C, pressure_hPa, and humidity are returned by default.
  //     // I'll also calculate some unit conversions for display purposes.
  //     // data.temperature_F = BME280.convertCelciusToFahrenheit(
  //     //   data.temperature
  //     // );
  //     // data.pressure_inHg = BME280.convertHectopascalToInchesOfMercury(
  //     //   data.pressure
  //     // );

  //     console.log(`data = ${JSON.stringify(data, null, 2)}`);
  //     setTimeout(readSensorData, 2000);
  //     //send via websocket?
  //   })
  //   .catch((err) => {
  //     console.log(`DHT read error1: ${err}`);
  //     setTimeout(readSensorData, 2000);
  //     //TODO: semd over websockets
  //   });
};
const readOnce = () => {
  return new Promise((resolve, reject) => {
    sensor.read(22, 4, function (err, temperature, humidity) {
      if (!err) {
        console.log(
          `temp: ${temperature.toFixed(1)}°C, ` +
            `humidity: ${humidity.toFixed(1)}%`
        );
      }
      resolve({ temperature, humidity, err });
    });

    // sensor.read()
    //   .then((data) => {
    //     // temperature_C, pressure_hPa, and humidity are returned by default.
    //     // I'll also calculate some unit conversions for display purposes.
    //     //
    //     // data.temperature_F = BME280.convertCelciusToFahrenheit(
    //     //   data.temperature_C
    //     // );
    //     // data.pressure_inHg = BME280.convertHectopascalToInchesOfMercury(
    //     //   data.pressure_hPa
    //     // );

    //     console.log(`data = ${JSON.stringify(data, null, 2)}`);
    //     resolve(data);
    //   })
    //   .catch((err) => {
    //     console.log(`DHT read error2: ${err}`);
    //     reject(err);
    //   });
  });
};
// Initialize the DHT sensor
readSensorData();

module.exports = { readOnce };
