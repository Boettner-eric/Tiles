const set_tile = (tile, position) => { // optional position
  const num = position ? position.toString(): tile.position.toString();
  const tile_url = document.getElementById(num);
  if (tile.type === 'page') { // tile types
    tile_url.href = '#';
    tile_url.onclick = () => {
      page_gen(tile.url); return false;
    };
  } else if (tile.type === 'theme') {
    tile_url.href = '#';
    tile_url.onclick = () => {
      set_theme(tile.theme); return false;
    };
  } else if (tile.type === 'command') { // tiles for running commands
    tile_url.href = '#';
    tile_url.onclick = () => {
      commands(tile.url); return false;
    };
  } else if (tile.type === 'info') { // settings, apis, weather, etc
    tile_url.href = '#';
    tile_url.onclick = () => {
      open_form(tile.form); return false;
    };
  } else if (tile.type === 'blank') { // placeholder tiles used in page_gen
    tile_url.href = '#';
    tile_url.onclick = () => {
      return false;
    };
  } else if (tile.type === 'search') {
    tile_url.href = tile.url + tile.terms;
    tile_url.onclick = () => {
      return true;
    };
  } else { // normal tile
    tile_url.href = tile.url;
    tile_url.onclick = () => {
      return true;
    }; // act like normal link
  }
  if (tile.img[0] === '~') { // api shortcut
    document.getElementById('i' + num).width = 48;
    document.getElementById('i' + num).src = (user.api || 'https://img.icons8.com/color/48/000000/') +
      tile.img.replace('~', '') + '.png';
  } else {
    document.getElementById('i' + num).width = 0;
    document.getElementById('i' + num).src = '';
  }
  document.getElementById('t' + num).innerHTML = tile.title;
  document.getElementById('s' + num).innerHTML = tile.subtitle;
};

const page_gen = (page_id) => {
  document.title = page_id;
  let page = pages[page_id.replace(' next', '')];
  if (!pages[page_id.replace(' next', '')]) page = [];
  if (page_id !== 'home') {
    const back_tile = default_tiles.back_tile;
    if (back[0] === page_id) { // if page is the same as last page
      back.splice(0, 1); // just pop off current page
    } else if (back.indexOf(page_id) !== -1) { // if the page has been visited
      back.splice(0, 2); // get rid of loop of last two
    }
    back_tile.url = back[0]; // go to top of stack
    back.unshift(page_id); // add current page to stack
    set_tile(back_tile);
  } else {
    back = ['home']; // reset back stack (home has no back button)
  }
  let blanks = 1;
  if (page.length > (width * height)) {
    if (page_id.includes(' next')) { // second page
      for (let i = (width * height); i < page.length; i++) {
        set_tile(page[i], page[i].position - (width * height) + 1);
      }
      blanks = Math.abs((width * height) - page.length) + 2;
    } else { // first page
      for (let i = 0; i < (width * height) - 1; i++) set_tile(page[i]);
      const next_tile = default_tiles.next_tile;
      next_tile.url = page_id + ' next';
      set_tile(next_tile, (width * height));
      blanks = (width * height) + 1; // no blanks
    }
  } else { // pages with less than or equal to numTiles tiles
    for (const i in page) set_tile(page[i]);
    blanks = page.length+2;
  }
  for (let i = blanks; i <= (width * height); i++) {
    set_tile(default_tiles.blank_tile, i); // fill rest of grid with empty tiles
  }
  result = 1;
  document.getElementById('1').focus();
};
