// Changing form display and dynamic form generation
const form_background = document.querySelector('.form-background');

const open_form = (id) => {
  if (id === 'form-settings') {
    const user_settings = document.getElementById(id);
    update_select('user-theme', pages.themes);
    user_settings.elements['width'].value = width;
    user_settings.elements['height'].value = height;
    user_settings.elements['user-theme'].value = user.theme;
    user_settings.elements['user-font'].placeholder = user.font;
    user_settings.elements['user-api'].placeholder = user.api;
  } else if (id === 'form-edit') {
    const edit_form = document.getElementById(id);
    edit_form.elements['edit-title'].placeholder = '';
    edit_form.elements['edit-sub'].placeholder = '';
    edit_form.elements['edit-img'].placeholder = '';
    edit_form.elements['edit-img'].value = '';
    edit_form.elements['edit-url'].placeholder = '';
    update_select('edit-tile',
      ['select tile'].concat(pages[back[0].replace(' next', '')]));
    update_select('edit-page', Object.keys(pages));
  } else if (id === 'form-add') {
    update_select('tile-page', Object.keys(pages));
  }
  form_background.style.display = 'block';
  for (let i = 0; i < document.getElementsByTagName('form').length; i++) {
    const form = document.getElementsByTagName('form')[i];
    if (form.id !== 'search-form' && form.id !== id) {
      form.style.display = 'none';
    } else if (form.id === id) {
      form.style.display = 'block';
    }
  }
  document.getElementById(id).elements[0].focus();
};

/* updates a given select element with array values */
const update_select = (id, options) => {
  const select = document.getElementById(id);
  for (_ in select.options) select.options.remove(0);
  for (const j in options) {
    const option = document.createElement('option');
    option.text = options[j].title ? options[j].title : options[j];
    option.value = options[j].title ? options[j].title : options[j];
    select.add(option);
  }
  document.getElementById(id).value = options[0];
};

// https://stackoverflow.com/questions/8069315/create-array-of-all-integers-between-two-numbers-inclusive-in-javascript-jquer/8069367
const range = (start, end) => {
  return Array(end - start + 1).fill().map((_, idx) => start + idx);
};

const update_edit = (title) => {
  const form = document.getElementById('form-edit');
  const tile = find_tile(title, pages[back[0].replace(' next', '')]);
  if (tile) {
    form.elements['edit-title'].placeholder = tile.title;
    form.elements['edit-sub'].placeholder = tile.subtitle;
    form.elements['edit-img'].value =
      tile.img.replace(user.api, '').replace('~', '');
    icon_find(document.getElementById('edit-img'));
    form.elements['edit-url'].placeholder = tile.url;
    form.elements['edit-page'].value = tile.page;
    const pos_array = back[0] === 'home' ?
      range(1, pages[tile.page].length) : range(2, pages[tile.page].length);
    update_select('edit-position', pos_array);
    form.elements['edit-position'].value = tile.position;
  }
};

/* exported submit_form */
const submit_form = (id) => {
  form_background.style.display = 'none';
  const fields = document.getElementById(id).elements;
  switch (id) {
    case 'form-add': {
      if (fields[0].value === 'tile') {
        new_tile(fields['tile-type'].value, fields['tile-url'].value,
          fields['tile-title'].value, fields['tile-sub'].value,
          '~' + fields['tile-icon'].value, fields['tile-page'].value);
      } else if (fields[0].value === 'theme') {
        open_form('form-theme');
        return false; // don't reset form we still need it
      } else if (fields[0].value === 'page') {
        new_tile('page', fields[1].value.toLowerCase(), fields[1].value,
          fields[2].value, '~' + fields[4].value, fields['tile-page'].value);
      } else if (fields[0].value === 'search') {
        new_tile('search', fields[3].value, fields[1].value, fields[2].value,
          '~' + fields[4].value, 'search');
      }
      break;
    } case 'form-register': {
      register(fields.username.value, fields['new-password'].value);
      break;
    } case 'form-login': {
      login(fields.username.value, fields.password.value);
      break;
    } case 'form-theme': {
      const x = document.getElementById('form-add').elements;
      const theme = [fields[0].value, fields[2].value,
        fields[1].value, fields[3].value, fields[4].value];
      new_tile(x[0].value, '', x[1].value, x[2].value,
        '~' + x[4].value, 'themes', theme);
      document.getElementById('form-add').reset();
      return false; // don't reset theme -> error for color input
    } case 'form-settings': {
      if (fields['user-theme'].value) user.theme = fields['user-theme'].value;
      if (fields['user-api'].value) user.api = fields['user-api'].value;
      if (fields['user-font'].value) set_font(fields['user-font'].value);
      if (fields.height.value != height || fields.width.value != width) {
        [height, width] = [parseInt(fields.height.value, 10),
          parseInt(fields.width.value, 10)];
        generate_table(width, height);
        user.dimensions = [width, height];
        page_gen('home');
      }
      user_update();
      break;
    } case 'form-edit': {
      const tile = find_tile(fields['edit-tile'].value,
        pages[back[0].replace(' next', '')]);
      const page = pages[tile.page];
      if (fields['edit-title'].value) tile.title = fields['edit-title'].value;
      if (fields['edit-sub'].value) tile.subtitle = fields['edit-sub'].value;
      if (fields['edit-img'].value) tile.img = '~' + fields['edit-img'].value;
      // TODO field for changing theme colors -> next version
      if (fields['edit-page'].value !== tile.page) {
        const new_page = pages[fields['edit-page'].value];
        const new_pos = fields['edit-page'].value === 'home' ?
          new_page.length + 1 : new_page.length + 2;
        for (const i in page) {
          if (page[i].position >= tile.position && tile !== page[i]) {
            page[i].position -= 1;
          } // shift tiles into gap
        }
        page.splice(page.indexOf(tile), 1); // get rid of tile in cache
        tiles_update(page);
        if (tile.position !== (width * height) + 1) { // bend page around corner
          set_tile(default_tiles.blank_tile, tile.page === 'home' ?
            page.length+1: page.length+2);
        }
        tile.position = new_pos;
        tile.page = fields['edit-page'].value;
        new_page.unshift(tile);
      } else if (fields['edit-position'].value) { // conditional on page
        const old_pos = tile.position; // const doesn't change here
        const new_pos = parseInt(fields['edit-position'].value, 10);
        // TODO add logic for next / refactor back array for longer pages
        // two cases
        if (page.length < new_pos) {
          // out of bounds -> place at end of page and fill gap
          for (const i in page) {
            if (page[i].position >= old_pos) page[i].position -= 1;
            // shift tiles into gap
          }
          tile.position = page.length + 1;
        } else {
          // insert -> fill old gap and create new gap
          for (const i in page) {
            if (page[i].position >= old_pos) page[i].position -= 1;
            // shift tiles into old gap
            if (page[i].position >= new_pos) page[i].position += 1;
            // create new gap
          }
          tile.position = new_pos;
        }
        tiles_update(page);
      }
      tiles_update([tile]);
      break;
    } default: {
      alert('bad form');
    }
  }
  document.getElementById(id).reset();
  return false;
};

/* exported icon_find */
const icon_find = (icon) => {
  if (icon.value == '') {
    icon.style.backgroundImage = 'url("https://img.icons8.com/color/48/000000/icons8")';
  } else {
    icon.style.backgroundImage = 'url(\'' + user.api + icon.value +'\')';
  }
};
