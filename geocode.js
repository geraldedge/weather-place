const http = require("http");
const https = require("https");
const take = require("./take");
const StringDecoder = require("string_decoder").StringDecoder;
let buffer = "";

const decoder = new StringDecoder("utf-8");

const geocode = (address) => {
  return new Promise((resolve, reject) => {
    var reqdetails1 = {
      protocol: "https:",
      hostname: "api.mapbox.com",
      path:
        "/geocoding/v5/mapbox.places/" +
        encodeURIComponent(address) +
        ".json?access_token=pk.eyJ1IjoiZ2VlZWRnZSIsImEiOiJja3BzaDVzbzIwOWx3MnZub3g4YmtxcTZ1In0.okkdnDi8fGuenm1FAfGEIQ",
      auth:
        "pk.eyJ1IjoiZ2VlZWRnZSIsImEiOiJja3BzaDVzbzIwOWx3MnZub3g4YmtxcTZ1In0.okkdnDi8fGuenm1FAfGEIQ",
      method: "GET",
    };

    var send1 = https.request(reqdetails1, (res) => {
      console.log(res.statusCode);
      let buffer1 = "";
      res.on("data", function (d) {
        buffer1 = buffer1 + decoder.write(d);
      });
      res.on("end", () => {
        buffer1 = buffer1 + decoder.end();
        var a = JSON.parse(buffer1);
        if (a.message || a.features.length === 0) {
          return resolve({
            error: "Location not found",
          });
        } else {
          var data = {
            longitude: a.features[0].center[0],
            latitude: a.features[0].center[1],
            place: a.features[0].place_name,
          };
          var x = a;
          resolve(data);
        }
      });
    });

    send1.end();

    send1.on("error", function (e) {
      return resolve({
        error: "Unable to connect",
      });
    });
  });
};

module.exports = geocode;
