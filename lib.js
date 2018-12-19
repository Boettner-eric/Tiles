var term = "? ";
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
      ">" -> currently used for search_live and larger folders
      "<" -> same as next
      "~" -> used for references
    - if you use a tile in more than one page, put it in reference to prevent duplicate search results
    - "~" is a useful place to put pages that you want searchable even if they arent on a speciic page (i.e. tv shows)
  */
  "<":[
    // Leave Blank (for search/page overflow only)
  ],
  ">":[
    // Leave Blank (for search/page overflow only)
  ],
  "~":[ // References -> use exact string of title (mostly for duplicates)
    // Put Pages here
    ["https://github.com","gh","Github","Open Source"],
    // Put folders here
    ["#Themes","go","Themes","Colors"],
    ["#Keys","ct","Keyboards","Ctrl Alt Del"],
    ["#Media","me","Media","Stream"],
    ["#Code","mt","Code","~/hack.sh"],
  ],
  "Home":[ // Index page loads at and resets to on end of search or 'esc'
    ["https://github.com/Boettner-eric/Tiles","ba","Back","To Github"],
    ["~Github"], // example of reference
    ["https://gmail.com","gm","Gmail","email","google"],
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
  "Keys":[ // example folder
    ["#Home","esc","Back","Endgame Achieved?","*"],
    ["https://www.massdrop.com/mechanical-keyboards","ct","Massdrop","GBs"],
    ["https://www.reddit.com/r/MechanicalKeyboards/","re","r/mk","Reddit"],
    ["https://www.rpi.edu/dept/arc/training/latex/LaTeX_symbols.pdf","pi","Latex","Symbol Dictionary"],
    ["https://www.paypal.com/us/home","pp","Paypal","Market Buys"],
    ["http://www.keyboard-layout-editor.com","ke","Keylayout","QMK Editor"],
    ["https://github.com/qmk/qmk_firmware/blob/master/docs/keycodes.md","qmk","QMK Keycodes","hyper(kc)"],
    ["https://geekhack.org/index.php","gk","Geekhack","IC GB Keebs"],
  ],
  "Media":[
    ["https://hbogo.com/","hb","HBO GO","Westworld"],
    ["https://www.youtube.com/","yt","Youtube","Indie Content"],
    ["https://netflix.com","nt","Netflix","US Proxy"],
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
    ["https://keycode.info","ct","Keycodes","Javascript"],
    ["https://discordapp.com","ds","Discord","Chat Channels"]
  ],
  /*
    Dict of possible live tiles
    - Search -> Search possible source with VAR placeholder for parser to fill
    - Get -> `https://api.darksky.net/forecast/f672ff13193bfcc40427a678ebfdbc71/${lat},${long}` + `?format=jsonp&callback=displayWeather`;
  */
  "Search":[
    ["https://www.reddit.com/r/VAR/","re","Reddit","r/VAR",term],
    ["https://stackoverflow.com/search?q=VAR","st","Stack Overflow","\"VAR\"",term],
    ["https://www.youtube.com/results?search_query=VAR","yt","Youtube","\"VAR\"",term],
    ["https://www.netflix.com/search?q=VAR","nt","Netflix","\"VAR\"",term],
    ["https://play.hbogo.com/search","hb","HBO GO","\"VAR\"",term], // partial url : no api for external search
    ["https://www.hulu.com/search","hu","Hulu","\"VAR\"",term],
    ["https://en.wikipedia.org/wiki/VAR","wi","Wiki","\"VAR\"",term]
  ],
  "Themes":[ // put tiles for each theme here
    ["$Discord","ds","Discord","Purple, Black, Grey"],
    ["$Skeletor","sk","Skeletor","Green, Purple, Green"],
    ["$Terminal","tm","Terminal","Green Black"],
    ["$Gogh","pnr","Gogh","Blue Green Yellow"],
    ["$Todoist","td","Todoist","Grey Red Yellow"],
    ["$Switch","me","Switch","Grey Red Blue"],
    ["$Lava","lv","Lava","Red Black"]
  ]
};

var themes = [
  /*
    ******** FORMAT ********
    [NAME, BACKGROUND, MAIN COLOR, COMP COLOR, SUBTXT COLOR, TXT COLOR]

    ******** NOTES ********
    - Themes are in order they will be displayed in the theme menu
  */
  ["Skeletor","#2b2836","#93b4ff","#bd93f9","#84fba2","#ffffff"],
  ["Switch","#414548","#ff4554","#00c3e3","#ffffff","#ffffff"],
  ["Gogh","#0375B4","#007849","#FECE00","#FFFFFF","#FFFFFF"],
  ["Todoist","#1f1f1f","#fccf1b","#cd5650","#ffffff","#ffffff"],
  ["Terminal","#282828","#282828","#33FF33","#33FF33","#33FF33"],
  ["Discord",'#23272A','#2C2F33','#7289DA','#7289DA','#99AAB5'],
  ["Lava","#000000","#D32F2F","#DD4132","#99AAB5","#99AAB5"],
  ["Purple","#6B5B95","#FF383F","#223A5E","#F0EDE5","#F0EDE5"],
];
