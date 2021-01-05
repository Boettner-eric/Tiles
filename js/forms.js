// Changing form display and dynamic form generation
const form_background = document.querySelector('.form-background');

const update_forms = () => { // add info to forms
  update_select('tile-page', Object.keys(pages));
  update_select('user-theme', pages.themes);
};

const open_form = (id) => {
  form_background.style.display = 'block';
  for (let i = 0; i < document.getElementsByTagName('form').length; i++) {
    const form = document.getElementsByTagName('form')[i];
    if (form.id !== 'search-form' && form.id !== id) {
      form.style.display = 'none';
    } else if (form.id === id) {
      form.style.display = 'block';
    }
  }
  if (id === 'form-settings') {
    const user_settings = document.getElementById('form-settings');
    user_settings.elements['width'].value = width;
    user_settings.elements['height'].value = height;
    user_settings.elements['user-theme'].value = user.theme.title;
    user_settings.elements['user-font'].placeholder = user.font;
    user_settings.elements['user-api'].placeholder = user.api;
  } else if (id === 'form-edit') {
    update_select('edit-tile', ['select tile'].concat(pages[back[0]]));
    update_select('edit-page', Object.keys(pages));
  }
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
};

const update_edit = (title) => {
  const form = document.getElementById('form-edit');
  const tile = find_tile(title, pages[back[0]]);
  if (tile) {
    form.elements['edit-title'].placeholder = tile.title;
    form.elements['edit-subtitle'].placeholder = tile.subtitle;
    form.elements['edit-img'].placeholder = tile.img.replace(user.api, '');
    form.elements['edit-url'].placeholder = tile.url;
    form.elements['edit-page'].value = tile.page;
    const pos_array = back[0] === 'home' ?
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] :
      [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    update_select('edit-position', pos_array);
    // TODO: fix this array usage to reflect page size/indexes
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
          fields['tile-title'].value, fields['tile-subtitle'].value,
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
      if (fields['user-theme'].value) {
        user.theme = find_tile(fields['user-theme'].value, pages.themes);
      }
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
      const tile = find_tile(fields['edit-tile'].value, pages[back[0]]);
      if (fields['edit-theme'].value) {
        tile.theme = value.split(',');
      }
      if (fields['edit-position'].value) {
        tile.position = fields['edit-position'].value;
        // three cases
        // out of bounds (cover with check on array)
        // insert (move further down)
        // append to end
      }
      if (fields['edit-page'].value) {
        const new_page = pages[fields['edit-page'].value];
        const new_pos = value === 'home' ? (new_page.length !== 0 ?
          new_page.length+1 : 1) : new_page.length+2;
        tile.position = new_pos;
        tile.page = fields['edit-page'].value;
      } else {
        console.log('Invalid field', field);
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
