// functions for tile creation and edits
const find_tile = (title, page) => {
  for (const i in page) {
    if (page[i].title === title.replace('-', ' ')) return page[i];
  }
  return undefined;
};

const new_tile = async (type, url, title, sub, img, page, theme=null) => {
  const tile_page = pages[page];
  if (type == 'search' || type == 'theme') url = type;
  if (type == 'page') pages[url] = []; // create key for new page
  const position = page === 'home' ? tile_page.length+1 : tile_page.length+2;
  const tile = {
    url: url.replace(/ /g, '-').toLowerCase(),
    title: title.replace(/-/g, ' '),
    subtitle: sub.replace(/-/g, ' '),
    img: img,
    type: type,
    page: page.replace(' next', ''),
    position: position,
  };
  if (type === 'theme') tile.theme = theme;
  api_set('tiles', 'new', tile); // don't await this update
  tile_page.push(tile); // replicate it locally instead
  if (page === back[0]) { // only reload if tile is on current page
    if (position <= (width*height) || page.includes('next')) {
      set_tile(tile);
    } else if (position === (width*height)+1) { // add new page
      page_gen(page);
    }
  }
  return tile;
};

const tiles_update = async (tiles) => { // push updates to server
  for (const i in tiles) {
    api_set('tiles', 'edit', tiles[i]);
    if (tiles[i].page === back[0] && (tiles[i].position <= (width * height) ||
     back[0].includes(' next'))) {
      set_tile(tiles[i]); // if on current page
    }
  }
};

const delete_tile = async (tile, page_id) => {
  const page = pages[page_id.replace(' next', '')];
  if (!page) return 'error';
  await api_set('tiles', 'delete', tile);
  page.splice(page.indexOf(tile), 1); // get rid of tile in cache
  if (tile.position !== page.length) {
    for (const i in page) {
      if (page[i].position > tile.position) { // modify cache
        page[i].position -= 1;// shift later tiles back
      }
    }
    tiles_update(page);
  }
  page_gen(page_id.replace(' next', ''));
};
