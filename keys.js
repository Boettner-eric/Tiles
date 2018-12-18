var focused = 1; // default to first tile
var images = {}; // dict of image files to preload and reference
/*
  *************************************************
  Page load functions (in order)
  - load all images
  - pull theme cookie and apply theme
  - log current theme
  - call themes_dropdown() on all lib.themes to generate dropdown menu based on theme names
  - generate index.html page with pages["Home"]
  - focus first tile
  *************************************************
*/
window.onload = function(){
  images = image_load(); // Load all images on page
  var tmp = decodeURIComponent(document.cookie).split(';'); // Loads cookie w/ window and splits list of cookies
  tmp = tmp[0].split("="); // splits key/value pair
  set_theme(tmp[1]); // sets theme from cookie data
  console.log("\"" + tmp[1] + "\" theme loaded on page load");
  for(var i = 0;i < themes.length;i++){
    themes_dropdown(themes[i][0], i+1); // adds each theme to dropdown
  };
  page_gen();  // defaults to pages["Home"]
  document.getElementById(focused).focus(); // Focus at start and when window is focused again.
};
/*
  *************************************************
  Image Load
  - loads all images referenced in "lib.js/pages" on page load
  - allows for much quicker hosting and prevents lag on new pages
  * only con is potentially long "first" load times *
  *************************************************
*/
function image_load() {
  image = new Image();
  image.src = "src/ba.png"; // loads image from server
  images["ba"] = "src/ba.png"; // saves to dict by name
  image.src = "src/ab.png";
  images["ab"] = "src/ab.png";
  for (key in pages) {
    page = pages[key];
    for (var i=0; i< page.length; i++) {
      tile = page[i];
      if (tile.length >= 2){ // ignores references
        image = new Image();
        image.src = "src/" + tile[1] + ".png"
        images[tile[1]] = image.src;
      };
    };
  };
  return images;
};
/*
  *************************************************
  Page Gen
  - Creates new div#grid based off of a given page

  Notes
  - page : Array[12] of tiles
  - tiles : Array[4] : [URL,ICN,TITLE,SUBTITLE,OPT] (see lib.js)
  - '#...' in tile[0] denotes a page with name '...'
  *************************************************
*/
function page_gen(page) {
  if (page == undefined) { // page_gen() -> defaults to pages["Home"]
    page = pages["Home"];
  } else if (page[0][2] != "Back") { // checks for custom back button -> ignores if one exists
    page.unshift(["#Home","ba","Back","To the Future?","*"]);
  }
  /*
    *** If more than 12 tile "next" key generates 12-24 tiles ***
  */
  if (page.length > 12) {
    /*
      TODO :: Implement for loop for more than 24 results
        for set of 12 {
          next = Array.from(page);
          page.splice(11, 11, ["#next"+String(i),"ab","Next",String(page.length -11) + " More Results","*"]); [page shrinks by 11 tiles]
          next.splice(0,11,["#back"+String(i),"ba","Back","Previous Results","*"]);
          pages["next" + i] = next
          pages["back" + i] = page
        }
      - i denotes level of depth
    */
    next = Array.from(page); // de references array
    page.splice(11, 11, ["#>","ab","Next",String(page.length - 11) + " More Results","*"]); // stores results 12+
    next.splice(0,11,["#<","ba","Back","Previous Results","*"]); // stores current page (for back button)
    pages[">"] = next; // stores temporary back page
    pages["<"] = page; // stores temp next page
  }
  try {
    for (var num =1; num<13;num++) {
        tile = page[num-1];
        if (tile == undefined) { // less than 12 tiles
          tile = ["","","",""] // placeholder blank tile
        }
        n = num.toString();
        tile = reference(tile); // see reference() below
        url = tile[0];
        if (url == "#Home") {
          url = url.replace("#", "");
          document.getElementById(num).href = "javascript:page_gen(); javascript:document.getElementById(\"1\").focus(); javascript:focused=1; javascript:result=1; javascript:document.title=\"Home\"";
        } else if (url[0] == "#") { // checks for folder urls
          url = url.replace("#", "");
          document.getElementById(num).href = "javascript:page_gen(pages[\""+url+"\"]); javascript:document.getElementById(\"2\").focus(); javascript:focused=2; javascript:result=2; javascript: document.title = \"" +url +"\";"; // Opens folder and sets cursor to 2
        /*
          I might implement "&", "@" here for more functions within tiles
          "@tv" -> quick search call i.e. "javascript:search_live("tv")"
          "&" -> quick function calls for debuging i.e. "&gen:home" : javascript:page_gen(pages["Home"])
        */
        } else { // for normal url redirects
          document.getElementById(num).href = url.replace("VAR",document.getElementById("search").value.replace(term,""));
          /*
            VAR : used for variables in search url schemes
            term : search command (ignored in actual search)
            This does not alter normal urls as VAR (if it does, rename VAR with a name that is less used)
          */
        }
        if (tile[1] == ""){ // Blank images have no outline box
          document.getElementById("i"+n).style.width = 0;
          document.getElementById("i"+n).src = "";
        } else {
          document.getElementById("i"+n).style.width = "50px";
          document.getElementById("i"+n).src = images[tile[1]];
        }
        document.getElementById("t"+n).innerHTML = tile[2]; // Title
        document.getElementById("s"+n).innerHTML = tile[3].replace("VAR",document.getElementById("search").value).replace(term,""); //potentially add easy search here
    }
  } catch (err) {
    console.log("\"" + err + "\" error logged in page_gen of " + tile);
  }
};
/*
  *************************************************
  Reference
  - if a tile == ["~...."] -> check pages["~"] for the full tile
  - else return the original tile
  *************************************************
*/
function reference(tile) {
  if (tile[0][0] == "~") {
    local = Array.from(pages["~"]);
    for (var x=0; x<local.length; x++) {
      if (local[x][2] == tile[0].replace("~","")) { // If title == reference
        return local[x];
      }
    }
  }
  return tile;
};
/*
  *************************************************
  Search Functions
  - rank(string,string) -> finds number of matching charactors between two normalized strings
  - search_live(string) -> finds best 11 pages for a given search term
  - pages_to_list() -> converts "pages" (in lib.js) from Dict(key:Array[tile]) to Array[tile] (allows for quicker search and optimal algorithms)

  Notes
  - normalized : no spaces and all lower case
  *************************************************
*/
function rank(attempt, known) {
  if (attempt == undefined || known == undefined) {
    return 0;
  }
  attempt = attempt.replace(" ","").toLowerCase(); // converts strings to universal form
  known = known.replace(" ","").toLowerCase();
  var a = 0;
  for (var i = 0; i < Math.min(attempt.length,known.length); i++) {
      if (attempt[i] == known[i]){
        a++; // # of matches
      };
  };
  return a;
};

function search_live(curr) {
  var final = [];
  var page = Array.from(pages_to_list());
  for (var j = 0; j< page.length; j++){
    tile = Array.from(page[j]); // make sure array is values not references (important for live tiles)
    if (tile[4] == term && curr.includes(term)) {
      final.push({'match': tile,"rank":10});
    } else if (tile[4] != "*" && !curr.includes(term) && tile[4] != term) { // "*" -> Hidden from search : term -> search external only : term -> ignore search tiles outside of search mode
      value = Math.max(rank(tile[2],curr),rank(tile[4],curr)); // max of name and tag
      if (value > 1) {
        if (tile[0].includes("VAR")) {
          tile[3] = tile[3];
        } else if (tile[0].includes("#")) { // "#" -> Folder url
          tile[3] = "Folder (" + String(value) + ")"; // changes subtitle to type of page and rank
        } else {
          tile[3] = "Tile (" + String(value) + ")";
        };
        final.push({'match': tile,"rank":value});
      };
    };
  };
  final = final.sort(function(a, b) {   // Sorting of all results (tiles, folders and livetiles)
    return ((a.rank > b.rank) ? -1 : ((a.rank == b.rank) ? 0 : 1));});
  var ranking = [];
  ranking.push(["#Home","ba", "Back","Exit Search"]); // Preappend back button
  for (var k = 0; k < Math.min(final.length,20); k++) { // add all matches in ranked order (max of two pages)
    ranking[k+1] = final[k].match;
  };
  ranking[k+1] = ["https://www.google.com/search?q=" + curr.replace(term,""),"go","Google","\""+ curr.replace(term,"") +"\"","*"];
  page_gen(Array.from(ranking));
  return ranking;
};

function pages_to_list() {
  list = [];
  for (key in pages) {
    if (key != "<" && key != ">") { // ignores these search keys
      page = Array.from(pages[key]);
      for (var i = 0; i< page.length; i++){
        if (page[i].length >= 4) { // ignores "~" tiles
          list.push(page[i]);
        }
      }
    }
  }
  return list;
};
/*
  *************************************************
  Themeing
    - setCookie(theme) -> saves current theme to cookie
    - set_theme(name) -> styles the page with a theme array
    - themes_dropdown(name,i) -> adds a theme to a dropdown menu

  Notes
    - set cookie overwrites previous theme cookie : do not change expiration
    - set_theme(name) : searches themes var in lib.js for a theme of matching name
  *************************************************
*/
function set_cookie(theme) {
  document.cookie = "theme=" + theme + "; expires=Thu, 18 Dec 2021 12:00:00 UTC"; // saves the cookie
  console.log("\"" + theme + "\" theme saved to cookie");
};

function set_theme(name) { // 4
  for(var i = 0;i < themes.length;i++){
    if (themes[i][0] == name) {
      x = themes[i];
      document.documentElement.style.setProperty('--background', x[1]);
      document.documentElement.style.setProperty('--main-cl', x[2]);
      document.documentElement.style.setProperty('--comp-cl', x[3]);
      document.documentElement.style.setProperty('--sub-txt', x[4]);
      document.documentElement.style.setProperty('--base-txt', x[5]);
      set_cookie(name);
      return 0;
    }
  }
  console.log("\"" + name + "\" theme not loaded from lib.js")
  return 1;
};
// Creates list of valid themes
function themes_dropdown(name,i) {
  var button = document.createElement("button");
  button.innerHTML = String(i) + ". " + name;
  button.type="button";
  var parent = document.getElementById("night-content");
  button.addEventListener("touchstart", function (){
    set_theme(name); // button tap -> set to theme
    document.getElementById("night").onblur();
    document.getElementById(1).focus();
  });
  button.onclick = function (){
    set_theme(name); // button click -> set to theme
    document.getElementById("night").onblur();
    document.getElementById(focused).focus();
  };
  parent.appendChild(button);
};
/*
  *************************************************
  Helper Functions
    * Search
      - highlights bottom bar and engadges live_search mode
      - adds tab name "Search"
    * Night
      - hides the night icon and shows a list instead
      - dropdown list is in beta*
  *************************************************
*/
document.getElementById("search").onblur = function(){ // Unfocusing search bar
	document.getElementById(focused).focus();
};
document.getElementById("search").onfocus = function(){ // Focusing search bar
  document.getElementById(focused).blur();
  document.title = "Search";
};

document.getElementById("night").onfocus = function(){
  document.getElementById("night-content").style.display = "block";
  document.getElementById("night").style.display = "none";
};

document.getElementById("night").onblur = function(){
  document.getElementById("night-content").style.display = "none";
  document.getElementById("night").style.display = "block";
};

document.getElementById("dropdown").onmouseover = function(){
  document.getElementById(focused).blur();
  document.getElementById("night").onfocus();
};
document.getElementById("dropdown").onmouseout = function(){
  document.getElementById("night").onblur();
  document.getElementById(focused).focus();
};
/*
  *************************************************
  Key up
    - if live search is enabled it searches given the value after each key up

  Key down
    - 1-12 navigation keys for default binding (11 is -) (12 is =)
    - 1-12 theme menu for selecting themes from dropdown
    - left,right,up,down (hjkl) for navigation
    - enter for searching and clicking on links
    - esc for leaving search live and returning to homepage

  *************************************************
*/
window.onclick = function(e){
	if ( document.activeElement.id != "search" ) {
		document.getElementById(focused).focus();
	}
};

document.onkeyup = function(e){
  if ( document.activeElement.id == "search") {
    if (e.keyCode != 13 && e.keyCode != 27){
      current = document.getElementById("search").value;
      search_live(current);
    }
  }
};

document.onkeydown = function(e) {
	var key = e.keyCode;
  var result = null;

	if ( document.activeElement.id == "search") {
		if (key == 27) { // esc
			document.activeElement.blur();
			document.getElementById(focused).focus();
      document.getElementById("search").value = "";
      page_gen();
      document.title = "Home";
		} else if (key == 13){ // enter
      document.activeElement.blur();
			document.getElementById("2").focus();
      result = 2;
      focused = 2;
    }
		return;
	} else if (document.activeElement.id == "night"){
    if ( key == 27 || key == 220) { // esc or slash
			document.activeElement.blur();
			document.getElementById(focused).focus();
		}
    var max = Math.max(themes.length+49,57)
    for (var i = 49; i < max; i++) { // 1-9 Keyshortcuts for themes
      if (key == i) {
        x = themes[i-49];
        set_theme(x[0]);
        document.activeElement.blur();
  			document.getElementById(focused).focus();
      }
    }
	  return;
  }
	if ( key == 32 ) { // Key space -> focus search bar but dont log a space in search
    document.getElementById(String("search")).focus();
    return false; // ignore space in search field
	} else if (key == 220) { // "\" key -> theme menu
    document.getElementById("night").focus();
  }else if (key == 191) { // "/" key -> calls external search
    document.getElementById("search").value = term;
    document.getElementById(String("search")).focus();
    return false;
  } if (key == 27) { // esc -> back to home screen
    page_gen();
    focused = 1;
    result = 1;
  } else if ( key == 38 || key == 75) { // Up key, go back 4 blocks (the one above).
		result = parseInt(focused) - 4;
		focused = parseInt(focused) - 4;
		if (result < 1) {
			result += 12;
			focused += 12;
		}
		result = !isNaN(document.activeElement.id) ? result : focused;
	} else if ( key == 40 || key == 74) { // Down key, go forward 4 blocks (the one below).
		result = parseInt(focused) + 4;
		focused = parseInt(focused) + 4;
		if (result > 12) {
			result -= 12;
			focused -= 12;
		}
		result = !isNaN(document.activeElement.id) ? result : focused;
	} else if ( key == 39 || key == 76) { // Right key, go forward 1 block or reset row if end.
		result = focused == 12 ? parseInt(focused) - 11 : parseInt(focused) + 1;
		focused = focused == 12 ? parseInt(focused) - 11 : parseInt(focused) + 1;
		if (result > 12) {
			result -= 12;
			focused -= 12;
		}
		result = !isNaN(document.activeElement.id) ? result : focused;
	} else if ( key == 37 || key == 72) { // left key, go back 1 block or reset row if end.
		result = focused == 13 ? parseInt(focused) + 3 : parseInt(focused) - 1;
		focused = focused == 13 ? parseInt(focused) + 3 : parseInt(focused) - 1;
		if (result < 1) {
			result += 12;
			focused += 12;
		}
		result = !isNaN(document.activeElement.id) ? result : focused;
	}
  /*
    Custom key shortcuts
  */
  for (var i = 49; i <= 57; i++) { // 1 to = -> tiles 1-12
    if (key == i) {
      result = i-48;
    };
  };
  if (key == 48) {
    result = 10;
  } else if (key == 189) {
    result = 11;
  } else if (key == 187) {
    result = 12;
  };

  if (result) {
		document.getElementById(String(result)).focus();
	};
};


/*
Obsolete debug functions

Debug Function for fixing missing cursor:
Made obsolete by bug fixes

window.onclick = function(e){
	if ( document.activeElement.id != "search" ) {
		document.getElementById(focused).focus();
	}
};

if (!document.activeElement.id) {
  // Keys for help and search still working even if no block selected, if it's another key, then select last block.
  if ( key == 32 ) { // Key space, focus search bar and show [ESP] instruction.
    document.getElementById("search").focus();
  } else {
    document.getElementById(focused).focus();
  }
  return;
}
*/
