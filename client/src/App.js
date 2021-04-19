import { useEffect, useState } from "react";
import "./App.css";
import file from "./vpd.csv";
import { subscribe, disconnect } from "./utils/events";

import Papa from "papaparse";
import Vpd from "./Vpd";

import Fab from "@material-ui/core/Fab";
import VideocamIcon from "@material-ui/icons/Videocam";
import BarChartIcon from "@material-ui/icons/BarChart";
import { makeStyles } from "@material-ui/core";
import { green } from "@material-ui/core/colors";

import io from "socket.io-client";

// const host = window.location.hostname+"3002";
// const address = `${
//   window.location.origin.includes("localhost") ? "ws" : "wss"
// }://${host /*window.location.host*/}`;

const address = `${
  "ws"
}://${window.location.host /*window.location.host*/}`;


// console.log("location", window.location)
// const ws = new WebSocket('ws://192.168.1.184:8080');

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
    position: "relative",
    minHeight: 200,
  },
  fab: {
    position: "absolute",
    top: theme.spacing(2),
    left: theme.spacing(2),
    width: theme.spacing(10),
    height: theme.spacing(10),
    zIndex: 99,
    "&:hover": {
      backgroundColor: green[600],
    },
  },
  icon: {
    fontSize: theme.spacing(6),
  },
}));

const colors = ["#634573", "#FF0000", "#FFA200", "#D8FF00", "#36FF00"];

function App() {
  const classes = useStyles();

  
  const [ioTData, setIoTData] = useState();
  const [tempC, setTempC] = useState(0);
  const [tempF, setTempF] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [deviceId, setDeviceId] = useState("");
  const [bgColor, setColor] = useState(colors[0]);
  const [camPage, setCamPage] = useState(true);

  const [selectedVPD, setSelectedVPD] = useState([-1, -1]);

  const [dataRows, setRows] = useState([]);

  useEffect(() => {
    async function getData() {
      console.log("===============================");
      const response = await fetch(file);
      const reader = response.body.getReader();
      const result = await reader.read(); // raw array
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result.value); // the csv text
      const results = Papa.parse(csv, {
        header: false,
        transform: (val) => Number(val),
      }); // object with { data, errors, meta }
      const rows = results.data; // array of objects
      setRows(rows);
      console.log("===============================");
      console.log(rows);
    }
    getData();
  }, []); // [] means just do this once, after initial render

  //set up event hub listener
  const callback = (evtType, result) => {
    console.log("got camera heartbeat from event hub", result);
    console.log(result);
    if (result.messageSource === "Telemetry") {
      // debugger
      // setDeviceId(result.deviceId);
      console.log(result.iotData);
      setIoTData(result)
      // if (result.iotData.temp) setTemp(result.iotData.temp);
      // setHumidity(result.iotData.humidity);
      // setPressure(result.iotData.pressure);
    }
  };
  useEffect(() => {
    // subscribe(callback);
    // setTimeout(() => {
    //   setTemp(22.4);
    //   setHumidity(48.1);
    // }, 5000);
    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    // const counts = [4, 9, 15, 6, 2];
    // const goal = 5;

    // const output = counts.reduce((prev, curr) =>
    //   Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
    // );

    // console.log(output);

    if (dataRows) {
      const humHeaders = dataRows[0];
      dataRows.map((r, irow) => {
        const rowTemp = r[0];
        if (
          rowTemp === parseInt(tempF) ||
          rowTemp === parseInt(tempF) + 1
        ) {
          //Selected row

          let icol = humHeaders.indexOf(parseInt(humidity));
          if (icol <= 0) {
            icol = humHeaders.indexOf(parseInt(humidity) + 1);
          }
          const value = r[icol];
          setSelectedVPD([irow, icol]);
          setColor(colors[value]);
        }
      });
    }

    return () => {};
  }, [tempF, humidity, dataRows]);

  useEffect(() => {
    console.log("socket address: ", address);
    const socket = io(address);

    socket.on("cam_update", (update) => {
      const sensorData = JSON.parse(update);
      console.log("camera event fired ", sensorData);
      setTempC(sensorData.temperature_C);
      setTempF(sensorData.temperature_F);
      setHumidity(sensorData.humidity);
    });
  }, []);

  const hostIp = window.location.hostname //process.env.REACT_APP_DEVICE_IP_ADDRESS; //

  return (
    <>
      <div
        className="grid-app-container"
        style={{
          display: camPage ? "none" : "block",
          backgroundColor: bgColor,
        }}
      >
        <div className="xAxis">Humidity %</div>
        <div className="yAxis">Temperature °F</div>
        <Vpd data={dataRows} colors={colors} selectedVPD={selectedVPD} />
      </div>
      {/* <iframe className="iframe" src={`${process.env.REACT_APP_DEVICE_IP_ADDRESS}:8088/`}  scrolling="yes" height="100%" width="100%" ></iframe> */}
      <div
        className="App-body"
        style={{ display: camPage ? "flex" : "none", backgroundColor: bgColor }}
      >
        <h2 className="title">Greenroom 1</h2>
        <iframe
          className="iframe"
          id="frm"
          src={`http://${hostIp}:8080`}
          scrolling="yes"
          height="100%"
          width="100%"
        ></iframe>
      </div>
      <div className="stats">
        <div className="row">
          {/* <div class="column">
            <h3>{deviceId}</h3>
          </div> */}
          <div className="column">
            <h1>{`Temperature: ${
              tempF ? parseInt(tempF) : "---"
            }°F`}</h1>
          </div>
          <div className="column">
            <h1>{`Hunidity: ${humidity ? parseInt(humidity) : "---"}%`}</h1>
          </div>
          {/* <div className="column">
              <h1>{`Pressure: ${pressure}%`}</h1>
            </div> */}
        </div>
      </div>
      <Fab
        className={classes.fab}
        size="large"
        color="primary"
        aria-label="flip"
        onClick={() => {
          setCamPage(!camPage);
          console.log("camPage", camPage);
        }}
      >
        {camPage ? (
          <VideocamIcon className={classes.icon} />
        ) : (
          <BarChartIcon className={classes.icon} />
        )}
      </Fab>
    </>
  );
}

export default App;
