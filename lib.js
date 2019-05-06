var term = "?";
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
    $. -> theme name -> sets theme on focus
    *  -> hide file from search (useful for back buttons or other repeated tiles)
    '' -> does nothing (still compiles normally)
    ~.  -> reference to known tile

    ******** NOTES ********
    - do not redefine (or use as a key):
      ">" -> currently used for search_live and larger folders
      "<" -> same as next
      "~" -> used for references (also for non local images)
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
    // utility tiles
    ["@w","weather/01d","Weather","Updating..."],
    ["#","ab","Next"," More Results","*"],
    ["#","ba", "Back","To the Future","*"],
    // links
    ["https://www.linkedin.com","~linkedin","Linkedn","Professional"],
    ["https://github.com","gh","Github","Repos"],
    // folders
    ["#","go","Themes","Colors"],
    ["#","~e_learning","News","Headlines"],
    ["#","~ctrl","Keyboards","Ctrl Alt Del"],
    ["#","me","Media","Stream"],
    ["#","~twitter","Networks","Social Media"],
    ["#","mt","Code","~/hack.sh"],
  ],
  "Home":[ // Index page loads at and resets to on end of search or 'esc'
    ["https://github.com/Boettner-eric/Tiles","ba","Back","To Github","*"],
    ["~Github"], // example of reference
    ["https://gmail.com","gm","Gmail","Inboxes","google"],
    ["https://todoist.com/app#start","td","Todoist","Tasks"],
    ["https://pcpartpicker.com","pc","PcParts","Pcpartpicker"],
    ["~News"],
    ["~Media"],
    ["~Networks"],
    ["~Code"],
    ["~Keyboards"],
    ["https://icons8.com","ic","Icons8","Icon Set"],
    ["~Themes"],
  ],
  "Keyboards":[
    ["#Home","esc","Back","Endgame Achieved?","*"],
    ["https://www.massdrop.com/mechanical-keyboards","ct","Massdrop","GBs"],
    ["https://www.reddit.com/r/MechanicalKeyboards/","re","r/MK","Reddit"],
    ["https://mitormk.com","mt","MitoMK","Laser SA"],
    ["https://www.jellykey.com","jy","JellyKeys","Artisans"],
    ["https://keyhive.xyz/shop","hc","Key hive","Honeycomb"],
    ["https://keeb.io","kb","Keeb.io","Iris/Split"],
    ["https://discordapp.com","ds","Discord","QMK/PDXKBC"],
    ["https://www.rpi.edu/dept/arc/training/latex/LaTeX_symbols.pdf","pi","Latex","Symbol Dictionary"],
    ["http://www.keyboard-layout-editor.com","~ctrl","Keylayout","QMK Editor"],
    ["https://thomasbaart.nl","key","QMK Basics","Tutorials"],
    ["https://github.com/qmk/qmk_firmware/blob/master/docs/keycodes.md","qmk","QMK Keycodes","hyper(kc)"],
  ],
  "Media":[
    ["https://hbogo.com/","hb","HBO GO","Westworld"],
    ["https://www.youtube.com/","yt","Youtube","Daily Tech Fix"],
    ["https://netflix.com","nt","Netflix","US Proxy"],
    ["https://www.hulu.com","hu","Hulu","Top Chef !!!"],
    ["https://soundcloud.com","su","Soundcloud","Mixtape Madness"],
    ["https://twitch.com","tt","Twitch","Livestream"],
    ["https://vimeo.com","vo","Vimeo","Video Platform"],
    ["https://www.fubo.tv/welcome","ad","FuboTv","Futbol"],
  ],
  "Code":[
    ["~Github"],
    ["http://stackoverflow.com","st","Stack Overflow","Java?"],
    ["https://1password.com","op","1Password","Database"],
    ["https://icons8.com","ic","Icons8","Icon Set"],
    ["https://github.com/amix/vimrc","vm","Vimrc","runtime config"],
    ["https://atom.io","at","Atom.io","IDE"],
    ["https://internetingishard.com/html-and-css/","go","Interneting is hard","HTML Guide"],
    ["https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet","md","Markdown","Cheatsheet"],
    ["https://keycode.info","ct","Keycodes","Javascript"],
  ],
  "Networks":[
    ["https://twitter.com","~twitter","Twitter","Internet News"],
    ["https://facebook.com","fa","Facebook","Delete me"],
    ["https://reddit.com/","re","Reddit","r/unixporn"],
    ["https://www.instagram.com","im","Instagram","Photos"],
    ["~Linkedn"],
    ["https://discordapp.com","ds","Discord","Chat Channels"],
  ],
  "News":[
    ["~Weather"], // syntax for referencing functions
    ["bbc-news","~bbc","BBC","","news"],
    ["the-new-york-times","~globe","New York Times","","news"],
    ["reuters","ru","Reuters","","news"],
    ["ars-technica","ars","Ars Technica","","news"],
    ["cnn","cnn","CNN","","news"],
    ["ign","ign","ign","","news"],
    ["the-verge","ver","The Verge","","news"],
    ["hacker-news","~hacker_news","Ycombinator","","news"],
    ["national-geographic","~world_map","Nat Geo","","news"],
    ["https://newsapi.org","n","News Api","Headlines"],
  ],
  /*
    Dict of possible live tiles
    - Search -> Search possible source with VAR placeholder for parser to fill
    - Get -> `https://api.darksky.net/forecast/f672ff13193bfcc40427a678ebfdbc71/${lat},${long}` + `?format=jsonp&callback=displayWeather`;
  */
  "Search":[
    ["@d","~dictionary","Word","Definition",term],
    ["https://www.reddit.com/r/VAR/","re","Reddit","r/VAR",term],
    ["https://stackoverflow.com/search?q=VAR","st","Stack Overflow","\"VAR\"",term],
    ["https://en.wikipedia.org/wiki/VAR","wi","Wiki","\"VAR\"",term],
    ["https://translate.google.com/#view=home&op=translate&sl=auto&tl=en&text=VAR","tr","Translate","Translate: \"VAR\"",term],
    ["https://www.rottentomatoes.com/search/?search=VAR","rt","Rotten Tomatoes","\"VAR\"",term],
    ["https://www.youtube.com/results?search_query=VAR","yt","Youtube","\"VAR\"",term],
    ["https://www.netflix.com/search?q=VAR","nt","Netflix","\"VAR\"",term],
    ["https://stardewvalleywiki.com/mediawiki/index.php?search=VAR","sv","Stardew Valley","\"VAR\"",term],
    ["https://www.wolframalpha.com/input/?i=VAR","wp","Wolfram","\"VAR\"",term],
  ],
  "Themes":[ // put tiles for each theme here
    ["$","ds","Discord","Purple, Black, Grey",['#23272A','#2C2F33','#7289DA','#7289DA','#99AAB5']],
    ["$","sk","Skeletor","Green, Purple, Green",  ["#2b2836","#93b4ff","#bd93f9","#84fba2","#ffffff"]],
    ["$","tm","Terminal","Green Black",["#282828","#282828","#33FF33","#33FF33","#33FF33"]],
    ["$","pnr","Gogh","Blue Green Yellow",["#0375B4","#007849","#FECE00","#FFFFFF","#FFFFFF"]],
    ["$","td","Todoist","Grey Red Yellow",["#1f1f1f","#fccf1b","#cd5650","#ffffff","#ffffff"]],
    ["$","me","Switch","Grey Red Blue",["#414548","#ff4554","#00c3e3","#ffffff","#ffffff"]],
    ["$","lv","Lava","Red Black",["#000000","#D32F2F","#DD4132","#99AAB5","#99AAB5"]],
    ["$","tt","Purple","Purple Red Blue",["#6B5B95","#FF383F","#223A5E","#F0EDE5","#F0EDE5"]],
    ["$","bl","Blues","Blue, Grey",["#25274D","#2E9CCA","#29648A","#AAABB8","#ffffff"]],
    ["$","pnr","Starry Night","Blue Green Yellow",["src/wall/starry.jpg","#007849","#FECE00","#FFFFFF","#FFFFFF"]],
  ]
};


function update_tiles(){ // for all tiles to load on start or other events
    update_weather();
    for (i = 1; i < pages["News"].length-1; i++){
      update_news(pages["News"][i]);
    };
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
  var url = "http://api.openweathermap.org/data/2.5/weather?zip="+ zip + ",us&appid=" + api;

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
  var api = ""; // need to get an api key to use this feature
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
