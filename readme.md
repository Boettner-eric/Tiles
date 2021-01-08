# Tiles
A keyboard-centric, feature-rich, responsive design homepage.

[![GitHub Issues](https://img.shields.io/github/issues/boettner-eric/tiles.svg?style=flat-square)](https://github.com/boettner-eric/homepage/issues)
![License](https://img.shields.io/github/license/boettner-eric/tiles?style=flat-square)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-orange.svg?style=flat-square)
![Github last commit](https://img.shields.io/github/last-commit/boettner-eric/tiles.svg?style=flat-square)
![Website](https://img.shields.io/website/https/boettner-eric.github.io/Tiles/index.html.svg?style=flat-square&down_color=red&down_message=offline&up_color=green&up_message=online)
![Server](https://img.shields.io/website?style=flat-square&down_color=red&down_message=offline&label=server&up_color=green&up_message=online&url=https%3A%2F%2Ftiles-backend.herokuapp.com)

## [**Live Site**](https://boettner-eric.github.io/Tiles/index.html)

![Skeletor theme](Screenshots/skeletor.png)

## Features
* Keyboard navigation
* Mobile support
* Form interface for adding tiles
* Support for custom color schemes
* Tile search and search engine integration

### Recent Changes
* Custom form interfaces for user input (replaces commands)
* Better server/client communication
* Faster searching
* General Optimizations
* Refactored of JS code

### Keyboard Shortcuts

Function | Key | Description
--- | --- | ---
up | `k` / `up` | up one tile
down | `j` / `down` | down one tile
left | `h` / `left` | left one tile
right | `l` / `right` | right one tile
hop | `1...0`, `-`, `+` | hop to any tile #
search | `[space]` | starts live search
api search | `/` | searches external sources
themes | `\` | opens theme menu
enter | `[enter]` | go to tile / exit search
esc | `[esc]` | close search, return to homepage


### Forms
* Simple popup forms allow for user input
[screenshot here]

### Themes
* Since this version of tiles is customization focused I omitted the default themes.
* To add them to your page I included commands for most of the old themes here. (just copy and paste each line into the search bar)

```
!theme Discord Purple-Black-Grey ~discord-logo #23272A #2C2F33 #7289DA #99AAB5 #7289DA

!theme Skeletor Green-Purple-Green ~thriller #2b2836 #93b4ff #bd93f9 #ffffff #84fba2

!theme Terminal Green-Black ~console #282828 #282828 #33FF33 #33FF33 #33FF33

!theme Gogh Blue-Green-Yellow ~field #0375B4 #007849 #FECE00 #FFFFFF #FFFFFF

!theme Todoist Grey-Red-Yellow ~reminders #1f1f1f #fccf1b #cd5650 #ffffff #ffffff

!theme Switch Grey-Red-Blue ~nintendo-switch #414548 #ff4554 #00c3e3 #ffffff #ffffff

!theme Lava Red-Black ~volcano #000000 #D32F2F #DD4132 #99AAB5 #99AAB5

!theme Purple Purple-Red-Blue ~purple-man #6B5B95 #FF383F #223A5E #F0EDE5 #F0EDE5

!theme Blues Blue-Grey ~sapphire #25274D #2E9CCA #29648A #ffffff #AAABB8
```
* The format for themes is `background/image, main color, complementary color, title text, subtitle text`

## Hosting Notes
- The server is set to be most responsive from 8-24 PST.
- My hosting goes through a sleep schedule so initial response times will be delayed for requests outside of that time range.
- Maintenance will occur during these evening periods.

### Icons8
To add an icon for a tile/page/theme:
- Go to [icons8.com](icons8.com)
- Search for the icon you want (set the style to color)

![Icons8 search](Screenshots/search.png)
- Click on the icon you want and find the icons real name

![Icons8 search](Screenshots/icon.png)

- Use this icon name in your command or in the input form

    `!tile https://google.com Google Search ~google-logo`
- Make sure to use the tilde in front of the image name

## Notes
* Backend will be open-sourced in the next few weeks.
* Spaces are replaced by `-` in commands.
    * ex. `!tile url Bon-Apétit Recipes ~cooking`
* There are still some bugs involving pages longer than the grid
* If you run into some bug involving blank tiles reload the page and it should resolve.
* I would recommend leaving the `Themes` and `Search` pages on your homepage to hold all theme and search tiles.

 (If you don't themes and searches will still function but the page to edit them will be unreachable)
* Feel free to reach out if you have any questions/bugs.

![Todoist theme](Screenshots/todoist.png)

## Credits
1. Icons from [Icons 8](https://icons8.com)
2. Theme hex colors from multiple brands and themes
3. Original code from my other [`repo`](https://github.com/Boettner-eric/Homepage) which started as [`Decaux`](https://github.com/Boettner-eric/Decaux) which has been abandoned
5. Kishlaya's fork for dynamic html generation
