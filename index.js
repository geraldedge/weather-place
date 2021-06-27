const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const forecast = require("./take");
const geocode = require("./geocode");
const pathdir = path.join(__dirname, "/templates/");
const pathdir1 = path.join(__dirname, "/styles/");
const StringDecoder = require("string_decoder").StringDecoder;
const port =process.env.PORT || 3000
var server = http.createServer((req, res) => {
  var parsedURL = url.parse(req.url, true);

  const queryStringObject = parsedURL.query;
  const path = parsedURL.pathname;
  const method = req.method;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const headers = req.headers;
  const decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", (data) => {
    buffer = buffer + decoder.write(data);
  });

  req.on("end", () => {
    buffer = buffer + decoder.end();
    var chosen =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : route.notfound;

    chosen = trimmedPath.indexOf("styles/") > -1 ? route.styles : chosen;

    var data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: parseJSONToObject(buffer),
    };

    chosen(data).then(({ statusCode, payload, contentType }) => {
      contentType = typeof contentType === "string" ? contentType : "json";
      //default status code which is 200 or the one in the handler
      statusCode = typeof statusCode === "number" ? statusCode : 200;
      var trimmedAsset = trimmedPath.replace("/templates", "");
      var payloadString = "";
      if (contentType === "json") {
        res.setHeader("Content-Type", "application/json");
        payload = typeof payload === "object" || "string" ? payload : {};
        payloadString = JSON.stringify(payload);
      }
      if (contentType === "html") {
        res.setHeader("Content-Type", "text/html");
        payloadString = typeof payload === "string" ? payload : "";
      }
      if (contentType == "css") {
        res.setHeader("Content-Type", "text/css");
        payloadString = typeof payload !== "undefined" ? payload : "";
      }
      if (contentType == "ttf") {
        res.setHeader("Content-Type", "text/tff");
        payloadString = typeof payload !== "undefined" ? payload : "";
      }
      if(contentType == 'plain'){
        res.setHeader('Content-Type', 'text/plain');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
      }


      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
});

server.listen(port, () => {
  console.log("running");
});

var route = {};

route.notfound = (d) => {
  return new Promise((resolve, reject) => {
    resolve("it is not found");
  });
};

route.about = (d) => {
  return new Promise((resolve, reject) => {
    fs.readFile(pathdir + "index.html", "utf-8", (err, data) => {
      if (err) return reject("error");
      resolve({
        statusCode: 200,
        payload: data,
        contentType: "html",
      });
    });
  });
};

route.styles = (d) => {
  return new Promise((resolve, reject) => {
    var c = d.trimmedPath;

    var a = c.replace("styles/", "");

    fs.readFile(pathdir1 + a, "utf-8", (err, data) => {
      if (err) return resolve("error in csss");
      resolve({
        statusCode: "200",
        payload: data,
        contentType: "css",
      });
    });
  });
};

route.weather = (d) => {
  return new Promise((resolve, reject) => {
    if(d.method==='POST'){

    
    geocode(d.payload.city).then((i) => {
    
      if (i.error) {
        resolve({
          statusCode: 400,
          payload: i,
          contentType: "json",
        });
      } else {
        forecast(i.latitude, i.longitude).then((g) => {
          var info = {
            weather: g,
            place: i.place,
          };

          resolve({
            statusCode: 200,
            payload: info,
            contentType: "json",
          });
        });
      }
    });
  }
  else{
    resolve({
      statusCode: 200,
      payload: 'not suited method',
      contentType: "json",
    });

  }
  });
};

route.trial=(d)=>{
  return new Promise((resolve,reject)=>{
    geocode(d.payload.city).then((i)=>{
      console.log(i)
     
        resolve({
          statusCode:200,
          payload:i,
          contentType:'json'
        })
   
    })
  })
}

parseJSONToObject = function (str) {
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};
var router = {
  "": route.about,
  about: route.about,
  weather: route.weather,
  styles: route.styles,
};
