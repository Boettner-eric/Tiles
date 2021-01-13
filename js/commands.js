// console commands and search functions

// DEPRECIATED : minor support until forms are fully tested
const commands = async (current) => {
  const terms = current.split(' ');
  if (current.includes('!reload')) {
    user_init();
  } else if (current.includes('!testing')) {
    url = 'http://localhost:8000/';
    user_init();
  } else if (current.includes('!login')) {
    login(terms[1], terms[2]);
  } else if (current.includes('!logout')) {
    user = {};
    localStorage.token = '';
    user_init();
  } else if (current.includes('register')) {
    if (terms.length < 3) {
      alert('usage: !register (1)username (2)password');
    } else {
      register(terms[1], terms[2]);
    }
  } else if (user.username) { // only allow logged in users to edit pages
    const page = pages[back[0]];
    const position = back[0] === 'home' ? page.length + 1 : page.length + 2;
    if (current.includes('set')) {
      if (current.includes('theme')) {
        const tile = find_tile(terms[2], pages.themes);
        if (!tile) {
          alert('invalid theme name');
        } else {
          set_theme(tile.theme);
          user.theme = tile;
        }
      } else if (current.includes('font')) {
        set_font(current.replace('!set font ', ''));
      } else if (current.includes('grid')) {
        if (parseInt(terms[2], 10) < 3 || parseInt(terms[2], 10) < 3) {
          alert('Invalid dimensions (min 3x3)');
        } else if (confirm('Reload page with new grid')) {
          generate_table(parseInt(terms[2], 10), parseInt(terms[3], 10));
          user.dimensions = [parseInt(terms[2], 10), parseInt(terms[3], 10)];
          page_gen('home');
        }
      }
      user_update();
    } else if (current.includes('!theme')) {
      if (terms.length < 9) {
        alert('usage: !theme (1)title (2)subtitle' +
        '(3)img (4)bg (5)top (6)bot (7)txt (8)subtxt');
      } else {
        const theme = [terms[4], terms[6], terms[5], terms[7], terms[8]];
        new_tile('theme', '#', terms[1], terms[2], terms[3], 'themes', theme);
      }
    } else if (current.includes('!tile')) { // !tile url title subtitle img
      if (terms.length < 5) {
        alert('usage: !tile (1)url (2)title (3)subtitle (4)~img');
      } else {
        new_tile('tile', terms[1], terms[2],
          terms[3], terms[4], back[0], position);
      }
    } else if (current.includes('!search')) { // !search url title subtitle img
      if (terms.length < 5) {
        alert('usage: !search (1)url (2)title (3)subtitle (4)~img');
      } else {
        new_tile('search', terms[1], terms[2], terms[3], terms[4], 'search');
      }
    } else if (current.includes('!folder')) {
      if (terms.length < 4) {
        alert('usage: !folder (1)title (2)subtitle (3)img');
      } else {
        new_tile('page', terms[1], terms[1],
          terms[2], terms[3], back[0], position);
      }
    } else if (current.includes('!edit')) { // update tiles/pages/themes here
      if (terms.length < 2) {
        alert('usage: !edit (1)title');
      } else {
        const tile = find_tile(terms[1], page); // by reference not value
        if (!tile) {
          alert('Invalid tile name');
        } else {
          for (let i = 2; i< terms.length; i++) {
            [field, value] = terms[i].split('=');
            if (field === 'folder') {
              delete_tile(tile, page);
              const new_page = pages[value.toLowerCase()];
              const new_pos = value === 'home' ? new_page.length + 1 :
                new_page.length + 2;
              const tile = new_tile(tile.type, tile.url, tile.title,
                tile.subtitle, tile.img, value.toLowerCase(),
                new_pos, tile.theme);
              return 0;
            } else if (field === 'theme') {
              tile['theme'] = value.split(',');
            } else if (field === 'position') {
              tile[field] = parseInt(value, 10);
            } else if (tile[field]) {
              tile[field] = field === 'img' ? value : value.replace(/-/g, ' ');
            } else {
              console.log('Invalid field', field);
              return 0;
            }
          } // add to cache and remove old tile here
          tiles_update([tile]);
        }
      }
    } else if (current.includes('!delete')) {
      if (terms.length < 2) {
        alert('usage: !delete (1)title');
      } else {
        const tile = find_tile(terms[1], page);
        if (!tile) {
          alert('Invalid tile');
        } else if (confirm('Delete ' + tile.title + '?')) {
          delete_tile(tile, page);
        }
      }
    } else if (current.includes('!swap')) {
      if (terms.length < 2) {
        alert('usage: !edit (1)tile-name');
      } else { // swap tiles around
        const a = find_tile(terms[1], page);
        const b = find_tile(terms[2], page);
        if (!a || !b) {
          alert('Invalid tile names');
        } else {
          console.log(a.position, b.position);
          [a.position, b.position] = [b.position, a.position];
          tiles_update([a, b]); // swaping over pages needs a reload for now
        }
      }
    } else if (current.includes('!help')) {
      window.location.href = 'https://github.com/Boettner-eric/Tiles#Commands';// readme url
    }
  }
  document.getElementById('search').value = '';
};

const search = async (terms) => {
  if (terms[0] !== '?') {
    terms = terms.toLowerCase();
    pages.search_ = [];
    for (const x in pages) { // each page
      if (x !== 'search_') { // except this one
        for (const y in pages[x]) { // each tile
          if (pages[x][y].page.toLowerCase().includes(terms) ||
            pages[x][y].url.toLowerCase().includes(terms) ||
            pages[x][y].title.toLowerCase().includes(terms) ||
            pages[x][y].subtitle.toLowerCase().includes(terms) ) {
            const tile = JSON.parse(JSON.stringify(pages[x][y]));
            tile.position = pages.search_.length + 2;
            pages.search_.unshift(tile);
          }
        }
      }
    }
    pages.search_.sort((a, b) => a.position - b.position);
  } else {
    const page = pages.search;
    for (const x in page) page[x].terms = terms.replace('?', '');
    pages.search_ = page;
  }
  page_gen('search_', '~search'); // generate search page
};
