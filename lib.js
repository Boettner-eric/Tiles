var term = "? ";
const time = new Date();
var unixtime = time.getTime();

var pages = {
  /*
    ******** FORMAT ********
    PAGENAME : [
      [URL,ICN,TITLE,SUBTITLE,OPT]
    ]

    ******** OPT ********
    @.  -> keycode i.e. @13 -> enter (not implemented)
    #.  -> local url reference i.e. #KEY -> pages[KEY]
    *  -> hide file from search (useful for back buttons or other repeated tiles)
    '' -> does nothing (still compiles normally)
    ~.  -> reference to known tile

    ******** NOTES ********
    - do not redefine (or use as a key):
      "Next" -> currently used for search_live and larger folders
      "Back" -> same as next
      "~" -> used for references
      "Home" -> for main page of tiles
      "Themes" -> saves all of the themes
    - if you use a tile in more than one page, put it in reference to prevent duplicate search results
    - "~" is a useful place to put pages that you want searchable even if they arent on a speciic page (i.e. tv shows)
  */
  "Back":[
    // Leave Blank (for search/page overflow only)
  ],
  "Next":[
    // Leave Blank (for search/page overflow only)
  ],
  "~":[ // References -> use exact string of title (mostly for duplicates)
    ["@w","weather/01d","Weather","Updating..."],
    ["#","ab","Next"," More Results","*"],
    ["#","ba", "Back","To the Future","*"],
    // Put Pages here
    ["https://github.com","gh","Github","Open Source"],
    // Put folders here
    ["#","go","Themes","Colors"],
    ["#","ct","Keyboards","Ctrl Alt Del"],
    ["#","me","Media","Stream"],
    ["#","mt","Code","~/hack.sh"],
  ],
  "Home":[ // Index page loads at and resets to on end of search or 'esc'
    ["https://github.com/Boettner-eric/Tiles","ba","Back","To Github"],
    ["~Github"], // example of reference
    ["https://gmail.com","gm","Gmail","Inbox","google"],
    ["https://todoist.com/app#start","td","Todoist","Tasks"],
    ["https://pcpartpicker.com","pc","PcParts","Pcpartpicker"],
    ["https://news.ycombinator.com","yc","Ycombinator","Tech News"],
    ["https://www.reddit.com","re","Reddit","r/startpages"],
    ["https://icons8.com","ic","Icons8","Icon Set"],
    ["~Media"],
    ["~Code"],
    ["~Keyboards"],
    ["~Themes"],
  ],
  "Keyboards":[ // example folder
    ["#","esc","Back","Endgame Achieved?","*"],
    ["https://www.massdrop.com/mechanical-keyboards","ct","Massdrop","GBs"],
    ["https://www.reddit.com/r/MechanicalKeyboards/","re","r/mk","Reddit"],
    ["https://www.rpi.edu/dept/arc/training/latex/LaTeX_symbols.pdf","pi","Latex","Symbol Dictionary"],
    ["https://www.paypal.com/us/home","pp","Paypal","Market Buys"],
    ["http://www.keyboard-layout-editor.com","ke","Keylayout","QMK Editor"],
    ["https://github.com/qmk/qmk_firmware/blob/master/docs/keycodes.md","qmk","QMK Keycodes","hyper(kc)"],
    ["https://keycode.info","ct","Keycodes","Javascript"],
    ["https://geekhack.org/index.php","gk","Geekhack","IC GB Keebs"],
  ],
  "Media":[
    ["https://hbogo.com/","hb","HBO GO","Westworld"],
    ["https://www.youtube.com/","yt","Youtube","Tech Content"],
    ["https://netflix.com","nt","Netflix","Originals"],
    ["https://www.hulu.com","hu","Hulu","Live Tv"],
    ["https://soundcloud.com","su","Soundcloud","Mixtape Madness"],
    ["https://twitch.com","tt","Twitch","Livestreams"]
  ],
  "Code":[
    ["http://codepen.io","mt","Codepen","Online IDE","code"],
    ["~Github"],
    ["http://stackoverflow.com","st","Stack Overflow","Java?"],
    ["https://atom.io","at","Atom.io","IDE"],
    ["https://internetingishard.com/html-and-css/","go","Interneting is hard","HTML Guide"],
    ["https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet","md","Markdown","Cheatsheet"],
    ["https://discordapp.com","ds","Discord","Chat Channels"]
  ],
  /*
    Dict of possible live tiles
    - Search -> Search possible source with VAR placeholder for parser to fill
    - Get -> `https://api.darksky.net/forecast/f672ff13193bfcc40427a678ebfdbc71/${lat},${long}` + `?format=jsonp&callback=displayWeather`;
  */
  "Search":[
    ["@d","sc","Word","Definition",term],
    ["https://www.reddit.com/r/VAR/","re","Reddit","r/VAR",term],
    ["https://stackoverflow.com/search?q=VAR","st","Stack Overflow","\"VAR\"",term],
    ["https://en.wikipedia.org/wiki/VAR","wi","Wiki","\"VAR\"",term],
    ["https://translate.google.com/#view=home&op=translate&sl=auto&tl=en&text=VAR","tr","Translate","Translate: \"VAR\"",term],
    ["https://www.rottentomatoes.com/search/?search=VAR","rt","Rotten Tomatoes","\"VAR\"",term],
    ["https://www.youtube.com/results?search_query=VAR","yt","Youtube","\"VAR\"",term],
    ["https://www.netflix.com/search?q=VAR","nt","Netflix","\"VAR\"",term],
    ["https://play.hbogo.com/search","hb","HBO GO","\"VAR\"",term], // partial url : no api for external search
    ["https://www.hulu.com/search","hu","Hulu","\"VAR\"",term],
  ],
  "Themes":[ // put tiles for each theme here
    ["$","ds","Discord","Purple, Black, Grey",['#23272A','#2C2F33','#7289DA','#7289DA','#99AAB5']],
    ["$","sk","Skeletor","Green, Purple, Green",  ["#2b2836","#93b4ff","#bd93f9","#84fba2","#ffffff"]],
    ["$","tm","Terminal","Green Black",["#282828","#282828","#33FF33","#33FF33","#33FF33"]],
    ["$","pnr","Gogh","Blue Green Yellow",["#0375B4","#007849","#FECE00","#FFFFFF","#FFFFFF"]],
    ["$","td","Todoist","Grey Red Yellow",["#1f1f1f","#fccf1b","#cd5650","#ffffff","#ffffff"]],
    ["$","me","Switch","Grey Red Blue",["#414548","#ff4554","#00c3e3","#ffffff","#ffffff"]],
    ["$","lv","Lava","Red Black",["#000000","#D32F2F","#DD4132","#99AAB5","#99AAB5"]],
    ["$","tt","Purple","Purple Red Blue",["#6B5B95","#FF383F","#223A5E","#F0EDE5","#F0EDE5"]]
  ]
};
var zip = ""; // changes when searching valid zips / or when zip is saved
var oldzip = "";
var weather = ["@w","weather/01d","Weather","Updating..."];

function weather_tile(num) { // returns tile
  var api = ""; // your key here
  var url = "http://api.openweathermap.org/data/2.5/weather?zip="+ zip + ",us&appid=" + api;

  set_tile(num, [url,"50px",images[weather[1]],weather[2],weather[3]]); // placeholder tile
  if (zip != oldzip) {
    wtile = weather; // TODO change to new tile for multiple zips
    var request = new Request(url);
    fetch(request).then(function(request) {
      return request.json();
    }).then(function(json) {
      wwtile[0] = "@w";
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
      console.log("updated weather for " + zip + " - " + wtile);
      set_tile(num,["https://darksky.net/zipcode/"+zip+"/us12/en"].concat("50px",images[wtile[1]],wtile[2],wtile[3]));
    }).catch(function(error){
      set_tile(num,["javascript:alert(\""+error+"\");","50px","src/weather/error.png","Weather","Error"]);
    });
  } else {
    set_tile(num,["https://darksky.net/zipcode/"+zip+"/us12/en","50px",images[weather[1]],weather[2],weather[3]]);
  };
};

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
    set_tile(num,["@d","50px",images["sc"],"Word","Definition"]);
  });
}
