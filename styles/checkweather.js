
var a=''
checkweather=function(s){
if(s.indexOf('sun')>-1||s.indexOf('clear')>-1){
    a="fas fa-sun"
}if(s.indexOf('rain')){
    a="fas fa-cloud-rain"
}
if(s.indexOf('cloud')){
    a="fas fa-cloud"
}
if(s.indexOf('snow')){
    a="fas fa-snowflake"
}
if(s.indexOf('wind')){
    a="fas fa-wind"
}

else{
    a="fas fa-sun"
}

return a
}

module.exports=checkweather