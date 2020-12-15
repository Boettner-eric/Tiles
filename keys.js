var result = 1; // default to first tile
var url = "https://tiles-backend.herokuapp.com/";
var user = {};
var back = ["home"];
var pages = {};
var width = 4;
var height = 3;

window.onload = async function() {
    var theme = localStorage.getItem('theme');
    if (theme != null) {
        set_theme(theme.split(","));
    };
    var token = localStorage.getItem('token');
    if (token == "null" || token == null) {
        generate_table(4,3); // default config
        set_tile(default_tiles["login_tile"], 1);
        set_tile(default_tiles["register_tile"], 2);
        set_tile(default_tiles["helper_tile"], 3);
    } else {
        user_init() // user preferences
    };
};

async function login(username, password) {
    var raw = await api_set("users", "login", {"user":username, "pass":password});
    if (raw.token != null) {
        console.log(username + " logged in");
        localStorage.token = raw.token;
        user_init();
    } else {
        alert("Invalid login");
        console.log("Invalid login attempt");
    };
};

async function user_init() {
    var user_res = await api_get("users", "data", "")
    if (user_res.error || !user_res) {
        console.log("Server Offline");
        generate_table(4,3); // make user profile set width and height
        set_tile(default_tiles["server_tile"]);
        set_tile(default_tiles["reload_tile"]);
    } else {
        window.user = user_res
        generate_table(user.dimensions[0], user.dimensions[1]); // make user profile set width and height
        if (user.theme != "default" && localStorage.theme != null && JSON.stringify(user.theme) != JSON.stringify(localStorage.theme.split(","))) {
            set_theme(user.theme);
            localStorage.theme = user.theme;
        };
        set_font(user.font);
        page_gen("home");
    };
};

async function user_update() {
    localStorage.theme = user.theme;
    await api_set("users", "update", user);
};

async function tiles_update(tiles) { // push updates to server
    for (var i=0; i<tiles.length; i++){
        api_set("tiles", "edit", tiles[i]);
        if (tiles[i].position > (width*height)){
            var position = tiles[i].position - (width*height);
        };
        set_tile(tiles[i], position);
    };
};

async function api_get(category, type, name) {
    // tiles: (theme/page/search)
    // users: (data/login/new)
    var req = url + category +"/"+ type +"/"+ name;
    var params = {
        headers: {"content-type": "application/json; charset=UTF-8","Authorization": "Bearer " + localStorage.getItem('token')},
        method: "GET"
    };
    let res = await fetch(req, params).then(response => {
        return response.json();
    }).then(json => {
        return json;
    }).catch(error => {
        return {"error" : error};
    });
    return res;
};

async function api_set(category, type, data) {
    // tiles: (new/edit/delete)
    // users: (new/update)
    var req = url + category +"/"+ type;
    var params = {
        headers: {"content-type": "application/json; charset=UTF-8","Authorization": "Bearer " + localStorage.getItem('token')},
        method: "POST",
        body: JSON.stringify(data)
    };
    let res = await fetch(req, params).then(response => {
        return response.json();
    }).then(json =>  {
        return json;
    }).catch(error => {
        return {"error" : error};
    });
    return res;
};

function set_tile(tile, position) { // optional position for changing position w/o changing tile.position
    var num = position ? position.toString(): tile.position.toString();
    if (tile.type == "page") { // tile types
        document.getElementById(num).href = "#";
        document.getElementById(num).onclick = function() { page_gen(tile.url); return false; };
    } else if (tile.type == "theme") {
        document.getElementById(num).href = "#";
        document.getElementById(num).onclick = function() { set_theme(tile.theme); return false; };
    } else if (tile.type == "command") { // tiles for running commands (will be used for forms in next version)
        document.getElementById(num).href = "#";
        document.getElementById(num).onclick = function() { commands(tile.url); return false; };
    }/* TODO: next version will add info tiles with popup forms and interactive data
        else if (tile.type == "info") { // settings, apis, weather, etc
        document.getElementById(n).href = "#";
        document.getElementById(n).onclick = function() { open_form(tile.form); return false; };
    }*/else if (tile.type == "blank") { // placeholder tiles used in page_gen
        document.getElementById(num).href = "#";
        document.getElementById(num).onclick = function() { return false; }; // do nothing
    } else if (tile.type == "search") {
        document.getElementById(num).href = tile.url + tile.subtitle.replaceAll("\"","");
        document.getElementById(num).onclick = function() { return true; };
    } else { // normal tile
        document.getElementById(num).href = tile.url;
        document.getElementById(num).onclick = function() { return true; }; // act like normal link
    };
    if (tile.img[0] == "~") { // api shortcut
        document.getElementById("i"+num).width = 48;
        document.getElementById("i"+num).src = (user.api || "https://img.icons8.com/color/96/000000/") + tile.img.replace("~","") + ".png";
    } else {
        document.getElementById("i"+num).width = 0;
        document.getElementById("i"+num).src = "";
    };
    document.getElementById("t"+num).innerHTML = tile.title;
    document.getElementById("s"+num).innerHTML = tile.subtitle;
};

// Cache page from server
async function get_page(page_id) {
    if (!pages[page_id.replace(" next","")]) {
        pages[page_id] = await api_get("tiles", "page", page_id.replace(" next",""));
    };
    return pages[page_id.replace(" next","")];
};

async function page_gen(page_id) {
    document.title = page_id;
    var page = await get_page(page_id);
    console.log(page);
    if (page_id != "home") {
        var back_tile = default_tiles["back_tile"];
        if (back[0] == page_id) { // if page is the same as last page (!delete, !tile, etc)
            back.splice(0,1);// just pop off current page
        } else if (back.indexOf(page_id) != -1) { // if the page has already been visited
            back.splice(0,2);// get rid of loop of last two
        };
        back_tile.url = back[0]; // go to top of stack
        back.unshift(page_id); // add current page to stack
        set_tile(back_tile);
    } else {
        back = ["home"]; // reset back stack (home has no back button)
    };
    if (page.length > (width * height)) {
        if (page_id.includes(" next")) { // second page
            for (var i = (width*height); i < page.length; i++) {
                set_tile(page[i], page[i].position - (width*height) + 1);
            };
            var blanks = Math.abs((width*height)-page.length)+2;
        } else { // first page
            for (var i = 0; i < (width*height)-1; i++) {
                set_tile(page[i]);
            };
            var next_tile = default_tiles["next_tile"];
            next_tile.url = page_id + " next";
            set_tile(next_tile, (width*height));
            var blanks = (width*height)+1; /// no blanks
        };
    } else { // pages with less than or equal to numTiles tiles
        for (var i = 0; i < page.length; i++) {
            set_tile(page[i]);
        };
        var blanks = page.length+2;
    };
    for (var i = blanks; i<=(width*height); i++) {
        set_tile(default_tiles["blank_tile"], i); // fill rest of grid with empty tiles
    };
    result = 1;
    document.getElementById("1").focus();
};

async function search(terms) {
    if (terms[0] != "?") {
        pages["search_"] = await api_get("tiles", "search", terms);
    } else {
        var page = await get_page("search");
        for (let x = 0; x < page.length; x++) {
            page[x].subtitle = "\"" + terms.replace("?","") + "\"";
        };
        pages["search_"] = page;
    };
    page_gen("search_"); // generate search page
};

// background-color/image main-color complementary-color sub-text main-text
function set_theme(theme) {
    if (theme[0].includes("http")){ // background image condition
        document.body.style.backgroundImage = "url("+ theme[0] +")";
        document.body.style.backgroundSize = "cover";
        document.documentElement.style.setProperty('--background', "#ccccc");
    } else {
        document.body.style.backgroundImage = "none";
        document.documentElement.style.setProperty('--background', theme[0]);
    };
    document.documentElement.style.setProperty('--main-cl', theme[1]);
    document.documentElement.style.setProperty('--comp-cl', theme[2]);
    document.documentElement.style.setProperty('--base-txt', theme[3]);
    document.documentElement.style.setProperty('--sub-txt', theme[4]);
};

async function set_font(font) {
    for (var i=1; i<=(width*height); i++) {
        document.getElementById(i.toString()).style.fontFamily = font;
    };
    document.getElementsByName("q")[0].style.fontFamily = font;
};

function find_tile(title, page) {
    for (var i=0; i < page.length; i++){
        if (page[i].title == title.replace("-"," ")){
            return page[i];
        };
    };
    return undefined;
};

async function new_tile(type, url, title, sub, img, page, position, theme=null) {
    var tile = {
        "url" : url.replace(/ /g,"-").toLowerCase(),
        "title" : title.replace(/-/g," "),
        "subtitle" : sub.replace(/-/g," "),
        "img" : img,
        "type" : type,
        "page" : page.replace(" next", ""),
        "position" : position
    };
    if (type == "theme") {
        tile.theme = [theme[0], theme[1], theme[2], theme[3], theme[4]];
        set_theme(tile.theme);
    };
    api_set("tiles","new", tile); // don't await this
    new_page = await get_page(page);
    new_page.push(tile);
    if (page.replace("next ","") == document.title) { // only reload if tile is on current page
        if (position <= (width*height) || page.includes("next")) {
            set_tile(tile);
        } else if (position == (width*height)+1) { // add new page
            page_gen(page);
        };
    };
    return tile;
};

async function delete_tile(tile, page, page_id) {
    api_set("tiles","delete", tile);
    page.splice(page.indexOf(tile),1); // get rid of tile in cache
    if (tile.position != page.length) {
        for (var i=0; i<page.length; i++) {
            if (page[i].position > tile.position) { // modify cache
                page[i].position -= 1;// shift later tiles back
            };
        };
        tiles_update(page);
    };
    console.log(page);
    if (tile.position <= (width*height) || ((page_id.includes("next") && page.length > (width*height)))) {
        set_tile(default_tiles["blank_tile"], tile.page == "home" ? page.length+1: page.length+2);
    };
};

async function commands(current) {
    var terms = current.split(" ");
    if (current.includes("!reload")) {
        user_init();
    } else if (current.includes("!login")) {
        login(terms[1], terms[2]);
    } else if (current.includes("!logout")) {
        user = {};
        localStorage.token = "";
        user_init();
    } else if (current.includes("register")) {
        if (terms.length < 3) {
            alert("usage: !register (1)username (2)password");
        } else {
            var new_user = {
                "username" : terms[1],
                "password" : terms[2],
                "dimensions" : [4,3],
                "theme" : ["#23272A", "#2C2F33", "#7289DA", "#7289DA", "#99AAB5"],
                "admin" : false,
                "api" : "https://img.icons8.com/color/96/000000/"
            };
            let res = await api_set("users", "new", new_user);
            if (res.error){
                alert("Username taken")
            } else {
                await login(terms[1], terms[2]); // TODO clean this up
                var themes_tile = default_tiles["themes"];
                themes_tile.user = terms[1];
                var search_tile = default_tiles["search"];
                search_tile.user = terms[1];
                api_set("tiles","new", themes_tile);
                api_set("tiles","new", search_tile);
                set_tile(themes_tile, 1);
                set_tile(search_tile, 2);
                set_tile(default_tiles["helper_tile"], 3);
            };
        };
    } else if (user.username) { // only allow logged in users to edit pages
        var page_id = document.title;
        var page = await get_page(page_id);
        var position = page_id == "home" ? (page.length != 0 ? page.length+1 : 1) : page.length+2;
        position = page_id.includes(" next") ? position + 1 : position;
        if (current.includes("set")) {
            if (current.includes("theme")) {
                let tile = find_tile(terms[2], await get_page("themes"));
                if (!tile) {
                    alert("invalid theme name");
                } else {
                    set_theme(tile.theme);
                    user.theme = tile.theme;
                }
            } else if (current.includes("font")) {
                user.font = current.replace("!set font ","");
                set_font(user.font);
            } else if (current.includes("grid")) {
                if (parseInt(terms[2],10) < 3 || parseInt(terms[2],10) < 3) {
                    alert("Invalid dimensions (min 3x3)");
                } else if (confirm("Reload page with new grid")) {
                    generate_table(parseInt(terms[2],10),parseInt(terms[3],10));
                    user.dimensions = [parseInt(terms[2],10), parseInt(terms[3],10)];
                    page_gen("home");
                };
            };
            user_update();
        } else if (current.includes("!theme")){ // !theme title subtitle img [bg, sub, main, base-txt, comp] num
            if (terms.length < 9) {
                alert("usage: !theme (1)title (2)subtitle (3)img (4)bg (5)sub (6)main (7)base-txt (8)comp");
            } else {
                var theme_page = await get_page("themes");
                var theme = [terms[4], terms[5], terms[6], terms[7], terms[8]];
                new_tile("theme", "#", terms[1], terms[2], terms[3], "themes", theme_page.length+2, theme);
            };
        } else if (current.includes("!tile")) { // !tile url title subtitle img number
            if (terms.length < 5) {
                alert("usage: !tile (1)url (2)title (3)subtitle (4)~img");
            } else {
                new_tile("tile", terms[1], terms[2], terms[3], terms[4], page_id, position);
            };
        } else if (current.includes("!search")) { // !search url title subtitle img number
            if (terms.length < 5) {
                alert("usage: !search (1)url (2)title (3)subtitle (4)~img");
            } else {
                var search_page = await get_page("search");
                new_tile("search", terms[1], terms[2], terms[3], terms[4], "search", search_page.length+2);
            };
        } else if (current.includes("!folder")) {
            if (terms.length < 4) {
                alert("usage: !folder (1)title (2)subtitle (3)img");
            } else {
                new_tile("page", terms[1], terms[1], terms[2], terms[3], page_id, position);
            };
        } else if (current.includes("!edit")) { // update tiles/pages/themes here (can't change title)
            if (terms.length < 2) {
                alert("usage: !edit (1)title");
            } else {
                var tile = find_tile(terms[1], page); // by reference not value
                if (!tile){
                    alert("Invalid tile name");
                } else {
                    for (var i = 2; i<terms.length; i++) {
                        [field,value] = terms[i].split("=");
                        if (field == "folder") {
                            delete_tile(tile, page, page_id);
                            const new_page = await get_page(value.toLowerCase());
                            var new_pos = value == "home" ? (new_page.length != 0 ? new_page.length+1 : 1) : new_page.length+2
                            var tile = new_tile(tile.type, tile.url, tile.title, tile.subtitle, tile.img, value.toLowerCase(), new_pos, tile.theme);
                            return 0;
                        } else if (field == "theme") {
                            tile["theme"] = value.split(",");
                        } else if (field == "position") {
                            tile[field] = parseInt(value, 10);
                        } else if (tile[field]) {
                            tile[field] = field == "img" ? value : value.replace(/-/g," ");
                        } else {
                            console.log("Invalid field", field);
                            return 0;
                        };
                    }; // add to cache and remove old tile here
                    tiles_update([tile]);
                };
            };
        } else if (current.includes("!delete")) {
            if (terms.length < 2) {
                alert("usage: !delete (1)title");
            } else {
                var tile = find_tile(terms[1], page);
                if (!tile) {
                    alert("Invalid tile")
                } else if (confirm("Delete " + tile.title + "?")) {
                    delete_tile(tile, page, page_id);
                };
            };
        } else if (current.includes("!swap")) {
            if (terms.length < 2) {
                alert("usage: !edit (1)tile-name");
            } else { // swap tiles around
                var a = find_tile(terms[1], page);
                var b = find_tile(terms[2], page);
                if (!a || !b){
                    alert("Invalid tile names");
                } else {
                    console.log(a.position, b.position);
                    [a.position, b.position] = [b.position, a.position];
                    tiles_update([a,b]); // swaping over pages needs a reload for now
                };
            };
        } else if (current.includes("!help")) {
            window.location.href = "https://github.com/Boettner-eric/Tiles#Commands";// readme url
        };
    };
    document.getElementById("search").value = '';
};

window.onclick = function(e){
    if ( document.activeElement.id != "search" ) {
        document.getElementById(result).focus(); // if user clicks on background keep highlighting tile
    };
};

document.onkeydown = function(e) {
    var key = e.keyCode;
    var numTiles = width * height;
    if ( document.activeElement.id == "search") {
        if (key == 27) { // esc
            document.getElementById("search").value = "";
            page_gen("home");
        } else if (key == 13) { // enter
            document.activeElement.blur();
            document.getElementById("2").focus();
            result = 2;
            current = document.getElementById("search").value;
            if (current == "") {
                return true;
            } else if (current[0].includes("!") && user != {}) { // custom command prefix
                commands(current);
            } else {
                search(current);
            };
        };
        return true;
    };
    if ( key == 32 ) { // Key space -> focus search bar but dont log a space in search
        document.getElementById("search").focus();
        return false; // ignore space in search field
    } else if (key == 220) { // "\" key -> theme menu
        page_gen("themes");
    } else if (key == 13) {
        return true;
    } else if (key == 191) { // "/" key -> calls external search
        document.getElementById("search").value = "?";
        document.getElementById("search").focus();
        return false;
    } else if ( key == 38 || key == 75) { // Up key, go back 4 blocks (the one above).
        result = parseInt(result) - width;
        if (result < 1) {
            result += numTiles;
        };
    } else if ( key == 40 || key == 74) { // Down key, go forward 4 blocks (the one below).
        result = parseInt(result) + width;
        if (result > numTiles) {
            result -= numTiles;
        };
    } else if ( key == 39 || key == 76 || key == 9) { // Right key, go forward 1 block or reset row if end.
        result = result == numTiles ? parseInt(result) - (numTiles-1) : parseInt(result) + 1;
        if (result > numTiles) {
            result -= numTiles;
        };
    } else if ( key == 37 || key == 72) { // Left key, go back 1 block or reset row if end.
        result = result == (numTiles+1) ? parseInt(result) + height : parseInt(result) - 1;
        if (result < 1) {
            result += numTiles;
        };
    }
    for (var i = 49; i <= 57; i++) { // 1 to 9
        if (key == i) {
            result = i-48;
        };
    };
    if (key == 48) {// 0 -> 10
        result = 10;
    } else if (key == 189) { // - -> 11
        result = 11;
    } else if (key == 187) { // = -> 12
        result = 12;
    };
    if (result && result <= numTiles) {
        document.getElementById(String(result)).focus();
        if (result != 1 && ![9,37,72,39,76,40,74,38,75].includes(key) && document.title == "themes") {
            document.getElementById(String(result)).click(); //change theme
        };
    };
};

function generate_table(w, h) {
    window.width = w;
    window.height = h;
    let table = document.querySelector("table");
    if (table.rows.length != 0){
        var x = table.rows.length;
        for (var i=0; i < x; i++){
            table.deleteRow(0);
        }; // clear existing table if it exists
    };
    for (var i=0; i< h; i++) {
        // credit goes to kishlaya for generating html dynamically in his fork
        // see his fork of the previous version of tiles here: https://github.com/kishlaya/Tiles
        let row = table.insertRow();
        for (var j=1; j<w+1; j++) {
            var index= i*(w)+j;
            let cell = row.insertCell();
            var img = document.createElement("img");
            img.setAttribute("id", "i" + index);
            var h3 = document.createElement("h3");
            h3.setAttribute("id", "t" + index);
            var btn = document.createElement("div");
            btn.setAttribute("class", "button");
            btn.appendChild(img);
            var p = document.createElement("p");
            p.setAttribute("id", "s" + index);
            var anchor = document.createElement("a");
            anchor.setAttribute("href", "#");
            anchor.setAttribute("id", index);
            anchor.appendChild(btn);
            anchor.appendChild(h3);
            anchor.appendChild(p);
            cell.appendChild(anchor);
        }
    }
}
