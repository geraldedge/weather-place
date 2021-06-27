const http = require("http");
const https = require("https");

const StringDecoder = require("string_decoder").StringDecoder;
let buffer = "";

const decoder = new StringDecoder("utf-8");

const forecast = (lat, lon) => {
  return new Promise((resolve, reject) => {
    var reqdetails = {
      protocol: "http:",
      hostname: "api.weatherstack.com",
      path:
        "/current?access_key=37ce0ce9a3d141402fa06af858dc225b&query=" +
        encodeURIComponent(lat) +
        "," +
        encodeURIComponent(lon),
      auth: "0a4ed6066e59193843cfdce426586f06",
      method: "GET",
    };

    var send = http.request(reqdetails, (res) => {
      const chunks = [];
      res.on("data", function (d) {
        chunks.push(d);
      });
      res.on("end", () => {
        const body = Buffer.concat(chunks);
        var a = JSON.parse(body);
        if (a.error) {
          return resolve({
            error: "Location not found",
          });
        } else {
          resolve(a);
        }
      });
    });

    send.end();

    send.on("error", function (e) {
      return resolve({
        error: "Unable to connect",
      });
    });
  });
};

parseJSONToObject = function (str) {
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

module.exports = forecast;
