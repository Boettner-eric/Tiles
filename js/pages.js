// Page generation and formatting
const set_tile = (tile, position, next) => { // optional position
  const num = position ? position.toString(): tile.position.toString();
  const tile_url = document.getElementById(num);
  tile_url.href = '#';
  if (tile.type === 'page') { // tile types
    tile_url.onclick = () => {
      page_gen(tile.url, tile.img, next); return false;
    };
  } else if (tile.type === 'theme') {
    tile_url.onclick = () => {
      set_theme(tile.theme); return false;
    };
  } else if (tile.type === 'command') { // tiles for running commands
    tile_url.onclick = () => {
      commands(tile.url); return false;
    };
  } else if (tile.type === 'form') { // settings, apis, weather, etc
    tile_url.onclick = () => {
      open_form(tile.form); return false;
    };
  } else if (tile.type === 'blank') { // placeholder tiles used in page_gen
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
    document.getElementById('i' + num).src = (user.api || 'https://img.icons8.com/color/96/000000/') +
      tile.img.slice(1) + '.png';
  } else if (tile.img) { // custom images by url
    document.getElementById('i' + num).width = 48;
    document.getElementById('i' + num).src = tile.img;
  } else {
    document.getElementById('i' + num).width = 0;
    document.getElementById('i' + num).src = '';
  }
  document.getElementById('t' + num).innerHTML = tile.title;
  document.getElementById('s' + num).innerHTML = tile.subtitle;
};

// NOTE: transition from next bool to index int for longer pages
// const page_gen = (page_id, icon, index) => {
// change logic for next page to utalize indices for range of pages
const page_gen = (page_id, icon, next) => {
  // NOTE: tab icons are not supported for safari or opera
  icon = (!icon || icon === '~back--v2') ? '~tiles' : icon;
  document.title = 'Tiles - ' + page_id;
  document.querySelector('link[rel~="icon"]').href = user.api + icon.slice(1);
  if (!pages[page_id]) pages[page_id] = [];
  const page = pages[page_id];
  if (page_id !== 'home' || next) {
    const back_tile = default_tiles.back_tile;
    if (back[0] === page_id && !next) { // the page is the same as last page
      back.splice(0, 1); // just pop off current page
    } else if (back.indexOf(page_id) !== -1 && !next) { // the page was visited
      back.splice(0, 2); // get rid of loop
      // back.splice(0, back.indexOf(page_id)+1);
    } // TODO check this with more tests
    back_tile.url = back[0]; // go to top of stack
    if (!next) back.unshift(page_id); // add current page to stack (not next)
    set_tile(back_tile);
  } else {
    back = ['home']; // reset back stack (home has no back button)
  }
  let blanks = 1; // add case for pages
  const page_size = page_id === 'home' ? (width * height): (width * height) - 1;
  if (page.length > page_size) { // split larger pages into two halves
    if (next) { // second page
      for (let i = page_size-1; i < page.length; i++) {
        set_tile(page[i], i - page_size + 3); // back, next, 0->1 = 3
      }
      blanks = Math.abs(page_size - page.length) + 3;
    } else { // first page
      for (let i = 0; i < page_size - 1; i++) set_tile(page[i]);
      const next_tile = default_tiles.next_tile;
      next_tile.url = page_id;
      set_tile(next_tile, (width * height), true);
      blanks = (width * height) + 1; // no blanks
    }
  } else { // pages with less than or equal to numTiles tiles
    for (const i in page) set_tile(page[i]);
    blanks = page.length + 2;
  }
  for (let i = blanks; i <= (width * height); i++) {
    set_tile(default_tiles.blank_tile, i); // fill rest of grid with empty tiles
  }
  if (page_id != 'search_') { // don't focus while seaching
    result = 1;
    document.getElementById('1').focus();
  }
};
