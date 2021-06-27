var d = document.querySelector(".button");
var a = document.querySelector(".info");
var b = document.querySelector(".data");

var city = document.querySelector(".city");
var icon = document.getElementById("ss")
var time = document.querySelector(".time");
var weather_desctiptions = document.querySelector(".weather_descriptions");
var temperature = document.querySelector(".temperature");
var input = document.querySelector(".input");
var c = document.querySelector(".weather");
var notfound = document.querySelector(".notfound");
var inscrption = document.querySelector(".pnot");

request = (headers, path, method, queryStringObject, payload) => {
  return new Promise((resolve, reject) => {
    var requestUrl = path + "?";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", requestUrl, true);
    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onreadystatechange = function () {
      if ((xhr.readyState = XMLHttpRequest.DONE)) {
        var statusCode = xhr.status;
        var responsepayload = xhr.responseText;

        var responseparse = JSON.parse(responsepayload);

        resolve({
          statusCode,
          responseparse,
        });
      }
    };
    var payloadString = JSON.stringify(payload);

    xhr.send(payloadString);
  });
};

const setData = () => {
  var town = {
    city: "accra",
  };
  request(undefined, "/weather", "POST", undefined, town).then((i) => {
    
   
    if(i.statusCode===200){
      city.innerHTML = i.responseparse.place;
      temperature.innerHTML = i.responseparse.weather.current.temperature;
      time.innerHTML = i.responseparse.weather.location.localtime;
  
      var a = i.responseparse.weather.current.weather_descriptions[0];
      weather_desctiptions.innerHTML = a;
      var pic = checkweather(a)
      icon.className=pic


    }
    else{
      notfound.style.top = "0";
      notfound.style.opacity = "1";
      inscrption.innerHTML=i.responseparse.error
      setTimeout(() => {
        notfound.style.top = "";
        notfound.style.opacity = "";
      }, 4000);
    }
   
    
  });
};

setData();


const requestData=()=>{
  
  if (input.value === "") {
    notfound.style.top = "0";
    notfound.style.opacity = "1";
    setTimeout(() => {
      notfound.style.top = "";
      notfound.style.opacity = "";
    }, 4000);
  }
  else{

    var town = {
      city: input.value,
    };
  
  request(undefined, "/weather", "POST", undefined, town).then((i) => {
    var a = document.querySelector(".info");
    var b = document.querySelector(".data");
    if(i.statusCode===200){
      notfound.style.top = "";
      notfound.style.opacity = "";
      a.style.transition = "animation 0.5s ease 0s linear;";
      a.style.animation = "h2 1s ";
      //c.style.transition = "animation 0.5s ease 0s linear;";
      //c.style.animation = "h2 1s ";
      b.style.transition = "animation 0.5s ease 0s linear;";
      b.style.animation = "h1 1s ";
     
     
      city.innerHTML = i.responseparse.place;
      temperature.innerHTML = i.responseparse.weather.current.temperature;
      time.innerHTML = i.responseparse.weather.location.localtime;
  
      var a = i.responseparse.weather.current.weather_descriptions[0];
      weather_desctiptions.innerHTML = a;

      var pic = checkweather(a.toLowerCase())
      console.log(pic)
      icon.className=pic
  
      setTimeout(() => {
        var a = document.querySelector(".info");
        var b = document.querySelector(".data");
        a.style.animation = "";
        b.style.animation = "";
       
        
      }, 1000);

    

    }
    else{
      notfound.style.top = "0";
      notfound.style.opacity = "1";
      inscrption.innerHTML=i.responseparse.error
      setTimeout(() => {
        notfound.style.top = "";
        notfound.style.opacity = "";
      }, 4000);
    }
   
    
  });

}
 
}


d.addEventListener("click", requestData);


input.addEventListener('keyup',(event)=>{
  if(event.keyCode===13){
    d.click()
  }
})

 checkweather=function(s){
  var a=''
if(s.includes('cloud')){
a="fas fa-cloud"
}

if(s.includes('Rain')){
  a="fas fa-cloud-rain"
  }
  if(s.includes('shower')){
    a="fas fa-cloud-rain"
    }
    if(s.includes('light rain')){
      a="fas fa-cloud-rain"
      }
    if(s.includes('overcast')){
      a="fas fa-cloud"
      }
      if(s.includes('Overcast')){
        a="fas fa-cloud"
        }
  if(s.includes('Sun')){
    a="fas fa-sun"
  }
  if(s.includes('thunderstorm')){
    a="fas fa-poo-storm"
  }
  if(s.includes('clear')){
    a="fas fa-sun"
  }
   
  if(s.includes('haze')){
    a="fas fa-cloud-sun"
  }
   

return a
}
