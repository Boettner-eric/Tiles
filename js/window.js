// Window events and global variables
let result = 1; // default to first tile
/* exported url */
let url = 'https://tiles-backend.herokuapp.com/';
/* exported back */
let back = ['home'];
/* exported pages */
let pages = { }; // storage for tiles dictionary
let width = 4;
let height = 3;
let num_tiles = 0;
/* exported user */
let user = { }; // user settings

window.onload = async () => {
  const theme = localStorage.getItem('theme');
  if (theme) set_theme(theme.split(','));
  const token = localStorage.getItem('token');
  if (token === 'null' || !token) {
    invalid_login();
  } else {
    user_init(); // user preferences
  }
};

const invalid_login = () => {
  generate_table(4, 3); // default config
  set_tile(default_tiles.login_tile, 1);
  set_tile(default_tiles.register_tile, 2);
  set_tile(default_tiles.helper_tile, 3);
  document.getElementById('add-btn').disabled = true;
  document.getElementById('edit-btn').disabled = true;
  document.getElementById('settings-btn').disabled = true;
  open_form('form-login');
};

// background-color/image main-color complementary-color sub-text main-text
const set_theme = (theme) => {
  if (theme[0].includes('http')) { // background image condition
    document.body.style.backgroundImage = 'url('+ theme[0] +')';
    document.body.style.backgroundSize = 'cover';
    document.documentElement.style.setProperty('--background', '#ccccc');
  } else {
    document.body.style.backgroundImage = 'none';
    document.documentElement.style.setProperty('--background', theme[0]);
  }
  document.documentElement.style.setProperty('--main-cl', theme[1]);
  document.documentElement.style.setProperty('--comp-cl', theme[2]);
  document.documentElement.style.setProperty('--base-txt', theme[3]);
  document.documentElement.style.setProperty('--sub-txt', theme[4]);
};

const set_font = (font) => {
  if (font !== user.font) user.font = font;
  for (let i = 1; i <= (width * height); i++) {
    document.getElementById(i.toString()).style.fontFamily = font;
  }
  document.getElementById('search-form').style.fontFamily = font;
};

document.onclick = (e) => {
  if (e.target === form_background) form_background.style.display = 'none';
  if (document.activeElement.id !== 'search' &&
    form_background.style.display !== 'block') {
    document.getElementById(result).focus();
    // if user clicks on background keep highlighting tile
  }
};

// on key up to ensure it gets current key
document.onkeyup = (e) => {
  const key = e.keyCode;
  if (document.activeElement.id === 'search') {
    const current = document.getElementById('search').value;
    if (current.length > 1 && key !== 8 && current[0] !== '!') {
      search(current);
    }
  }
};

document.onkeydown = (e) => {
  const key = e.keyCode;
  if (document.activeElement.id === 'search') {
    const current = document.getElementById('search').value;
    if (key === 27) { // esc
      document.getElementById('search').value = '';
      page_gen('home');
    } else if (key === 13) { // enter
      document.activeElement.blur();
      document.getElementById('2').focus();
      result = 2;
      if (current === '') return true;
      else if (current[0].includes('!') && user !== {}) commands(current);
    }
    return true;
  } else if (form_background.style.display === 'block') {
    if (key === 27) {
      form_background.style.display = 'none';
      document.getElementById(result).focus();
    }
    return true;
  }
  if ( key === 32 ) { // Space -> focus search bar but dont log a space
    document.getElementById('search').focus();
    return false; // ignore space in search field
  } else if (key === 220) { // '\' key -> theme menu
    page_gen('themes', '~technology-items');
  } else if (key === 13) {
    return true;
  } else if (key === 191) { // '/' -> calls external search
    document.getElementById('search').value = '?';
    document.getElementById('search').focus();
    return false;
  } else if ( key === 38 || key === 75) { // Up, go back (width) blocks
    result = parseInt(result) - width;
    if (result < 1) result += num_tiles;
  } else if ( key === 40 || key === 74) { // Down, go forward (width) blocks
    result = parseInt(result) + width;
    if (result > num_tiles) result -= num_tiles;
  } else if ( key === 39 || key === 76 || key === 9) { // Right, go forward
    result = result === num_tiles ?
      parseInt(result) - (num_tiles-1) : parseInt(result) + 1;
    if (result > num_tiles) result -= num_tiles;
  } else if ( key === 37 || key === 72) { // Left, go back 1 block or reset row
    result = result === (num_tiles+1) ?
      parseInt(result) + height : parseInt(result) - 1;
    if (result < 1) result += num_tiles;
  }
  if (key >= 49 && key <= 57) result = key-48;
  if (key === 48) {// 0 -> 10
    result = 10;
  } else if (key === 189) { // - -> 11
    result = 11;
  } else if (key === 187) { // = -> 12
    result = 12;
  }
  if (result && result <= num_tiles) {
    document.getElementById(String(result)).focus();
    if (result !== 1 && ![9, 37, 72, 39, 76, 40, 74, 38, 75].includes(key) &&
      back[0] === 'themes') {
      document.getElementById(String(result)).click(); // change theme
    }
  }
};

const generate_table = (w, h) => {
  width = w;
  height = h;
  // Adjust number of divs in container
  const flex_container = document.getElementById('flex_container');
  if ((h * w) > num_tiles) { // add divs to fill in gap
    for (let i = num_tiles+1; i <= (h * w); i++) {
      const img = document.createElement('img');
      img.setAttribute('id', 'i' + i);
      img.setAttribute('class', 'tile-icon');
      const h3 = document.createElement('h3');
      h3.setAttribute('id', 't' + i);
      const p = document.createElement('p');
      p.setAttribute('id', 's' + i);
      const div = document.createElement('a');
      div.setAttribute('id', i.toString());
      div.setAttribute('class', 'tile');
      div.appendChild(img);
      div.appendChild(h3);
      div.appendChild(p);
      flex_container.appendChild(div);
    }
  } else if ((h * w) < num_tiles) { // get rid of divs in page
    const children = flex_container.childNodes;
    for (let i=0; i < num_tiles - (h * w); i++) {
      children[children.length - 1].remove();
    }
  } // do nothing if equal
  num_tiles = (h * w);
  const x = Math.round(98 / (w+1)).toString();
  const elems = document.getElementsByClassName('tile');
  for (let i=0; i< elems.length; i++) {
    elems[i].style.width = x + 'vw';
  }
};
