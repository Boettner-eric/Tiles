var term = "?";
const time = new Date();
var unixtime = time.getTime();

function loadJSON(callback) {

   var xobj = new XMLHttpRequest();
       xobj.overrideMimeType("application/json");
   xobj.open('GET', 'data.json', true);
   xobj.onreadystatechange = function () {
         if (xobj.readyState == 4 && xobj.status == "200") {
           callback(xobj.responseText);
         }
   };
   xobj.send(null);
};

function init() {
 loadJSON(function(response) {
  // Parse JSON string into object
    var pages = JSON.parse(response);
    //console.log(pages)
 });
}

function update_tiles(){ // for all tiles to load on start or other events
    /*update_weather();
    for (i = 1; i < pages["News"].length-1; i++){
      update_news(pages["News"][i]);
  };*/
};

/*
  API Format :

  var name = [@L, "icon", "Title","Loading","Tags"]
  function update_name(null){
    // call api here
    change name varaible based on changes in data
  }
  function name_tile(num){
    set_tile(num, name);
}
*/

var zip = "97202"; // changes when searching valid zips / or when zip is saved
var oldzip = "";
var weather = ["@w","weather/01d","Weather","Updating...","weather"]; // default tile

function update_weather(num){
  var api = "676fed7baf0fa449b76b320a14187224";
  var url = "https://api.openweathermap.org/data/2.5/weather?zip="+ zip + ",us&appid=" + api;

  if (num != undefined){
    set_tile(num, [url,"50px",images[weather[1]],weather[2],weather[3]]); // placeholder tile
  };

  if (zip != oldzip) {
    wtile = weather; // TODO change to new tile for multiple zips
    var request = new Request(url);
    fetch(request).then(function(request) {
      return request.json();
    }).then(function(json) {
      wtile[0] = "@w";
      if (unixtime - json.sys.sunrise <= 30 * 60) {
        wtile[1] = "sunrise";
      } else if (json.sys.sunset - unixtime >= 30 * 60) {
        wtile[1] = "sunset";
      } else if (Math.round((json.main.temp - 273.15) * 9/5 + 32) < 32) {
        wtile[1] = "cold";
      } else if (Math.round((json.main.temp - 273.15) * 9/5 + 32) > 95){
        wtile[1] = "hot";
      } else {
        wtile[1] = json.weather[0].icon;
      };
      image = new Image();
      image.src = "src/weather/" + wtile[1] + ".png";
      images[wtile[1]] = image.src;
      wtile[2] = json.name;
      wtile[3] = json.weather[0].description + " " + Math.round((json.main.temp - 273.15) * 9/5 + 32) + "F, " + json.main.humidity + "% humidity " + (weather.rain == undefined ? "" : json.rain);
      wtile[4] = zip;
      weather = wtile;
      oldzip = zip;
      if (num != undefined){
        set_tile(num, [url,"50px",images[weather[1]],weather[2],weather[3]]);
      };
      console.log("updated weather for " + zip + " - " + wtile);
    }).catch(function(error){
      console.log("weather update error: " + error);
    });
  };
}


var last = "";

function dict_tile(num,current){
  var url = "https://api.datamuse.com/words?sp=" + current + "&md=d";
  var request = new Request(url);
  if (current == last){
    tile = pages["Search"][0];
    set_tile(num,["@d","50px",images[tile[1]],tile[2],tile[3]]);
    return null;
  };
  last = current;
  fetch(request).then(function(request) {
    return request.json();
  }).then(function(json) {
    tile = pages["Search"][0];
    if (json != undefined) {
      console.log(json);
      tile[2] = json[0].word;
      tile[3] = json[0].defs[0];
    };
    set_tile(num,["@d","50px",images[tile[1]],tile[2],tile[3]]);
  }).catch(function(error){
    set_tile(num,["@d","50px",images["~dictionary"],"Word","Definition"]);
  });
}


function update_news(tile){
  var start = "https://newsapi.org/v2/top-headlines?sources=";
  var api = "&apiKey=136cb894cf1645769184e7bf91842a06";
  if (api == ""){
    tile[2] = "No Api Key";
    console.log("need api key for this");
    return;
  }
  url = start + tile[0] + api;
  var request = new Request(url);
  fetch(request).then(function(request) {
    return request.json();
  }).then(function(json) {
    tile[0] = json.articles[0].url;
    tile[2] = json.articles[0].title;
  }).catch(function(error){
    console.log(error)
    tile[0] = "No Api Key";
    tile[2] = "https://newsapi.org";
  });
};
