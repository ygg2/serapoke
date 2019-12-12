// VARIABLES
// date
var date = new Date();
//title
document.getElementById("gameTitle").innerHTML = TITLE;
// if you're talking
var in_talk = false;
// menu trackers
var prev_menus = [];
var overlay = [];
var in_menu = false;
var no_choice_selected = true;
var choice = 0;
var current_menu = false;
// which keys are pressed
var key_pressed = {};
// blank image
var BLANK_IMAGE = new Image();
BLANK_IMAGE.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
// keep track of key presses to avoid repeat fires
key_down = false;

// CANVAS
var room = {
  canvas: document.createElement("canvas"),
  // mouse coordinates
  x: false,
  y: false,
  // mouse clicks
  xx: false,
  yy: false,
  transitions: [],
  // room and input creation
  start: function() {
    this.canvas.width = XSIZE;
    this.canvas.height = YSIZE;
    this.ctx = this.canvas.getContext("2d", {alpha: false});
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    // insert the canvas in gameDiv
    document.getElementById("gameDiv").appendChild(room.canvas);
    // add key pressed event
    window.addEventListener("keydown", function(e) {
      // if it's already pressed, and it's not the modifier, do nothing
      if (key_down && !(keymap.shift in key_pressed) && e.code != keymap.shift) {
        return
      }
      // otherwise the button is held down
      key_pressed[e.code] = true;
    });
    // add key up event
    window.addEventListener("keyup", function(e) {
      delete key_pressed[e.code];
      key_down = false
    });
    room.ctx.font = TEXT_FONT;
  },
  clear: function() {
    this.ctx.clearRect(0,0,XSIZE,YSIZE);
  }
}

// SCRIPTS
// fake game maker
vk_right = keymap.right;
vk_left = keymap.left;
vk_up = keymap.up;
vk_down = keymap.down;
vk_space = keymap.space;
vk_shift = keymap.shift;
// keyboard check: true if key is held down
function keyboard_check(key) {
  return (key in key_pressed);
}
// keyboard check pressed: true if key is pressed
function keyboard_check_pressed(key) {
  if (key in key_pressed) {
    delete key_pressed[key];
    key_down = true;
    return true
  }
  return false
}
// keyboard key press: void
function keyboard_key_press(key) {
  if (key_down && !(keymap.shift in key_pressed) && key != keymap.shift) {
    return
  }
  key_pressed[key] = true;
}
// keyboard key release: void
function keyboard_key_release(key) {
  delete key_pressed[key];
  key_down = false
}
// place meeting: true if there's a collision
function place_meeting(self, x, y, obj_list) {
  for (let obj of obj_list) {
    if (!(
      ((x+self.mask.width)<=obj.x) ||
      ((y+self.mask.height)<=obj.y) ||
      (x>=obj.x+obj.mask.width) ||
      (y>=obj.y+obj.mask.height)
    )) return obj;
  }
  return false;
}
// on grid: true if on grid
function on_grid(player) {
  return (player.x % GRIDSIZE == 0 && player.y % GRIDSIZE == 0);
}
// sign: 1 if greater than 0, -1 if less than 0
function sign(number) {
  if (number>0) return 1;
  else if (number<0) return -1;
  return 0;
}
// clamp: keeps value in range from min to max
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// SPRITES
// sprite holder
var spr = {};
// preload images
function Preload() {
  var sprite_list = Object.keys(SPRITES);
  var remaining = sprite_list.length;
  for (sprite of sprite_list) {
    // make image objects for each string
    spr[sprite] = new Image;
    spr[sprite].onload = function() {
      --remaining;
      // when done create objects, rooms, and start the game
      if (remaining<=0) {
        create_objects();
        create_rooms();
        room.start();
        bt.adv.box.image = spr.box;
        Main();
      }
    }
    spr[sprite].onerror = function() {
      console.log("error loading " + this.src)
    }
    spr[sprite].src = SPRITES[sprite];
  }
}

// OBJECTS
// base objects
function Text(x, y, text, color) {
  this.x = x;
  this.y = y;
  this.text = text;
  this.color = color || TEXT_COLOR;
  this.visible = true;
  this.draw = function() {
    if (IMAGE_TEXT) {
      bt.text_draw(this.x, this.y, this.text);
    } else {
      room.ctx.fillStyle = this.color;
      room.ctx.fillText(this.text, this.x, this.y);
    }
  }
}

function Img(x, y, image) {
  this.x = x;
  this.y = y;
  this.image = image || BLANK_IMAGE;
  this.visible = true;
  this.mask = {
    x: 0,
    y: 0,
    width: GRIDSIZE,
    height: GRIDSIZE
  }
  this.draw = function() {
    if (this.image) {
      if (this.visible) {
        room.ctx.drawImage(this.image, this.x, this.y);
      }
    }
  }
}

function Transition(transition) {
  this.default_duration = transition.duration || 60;
  this.start = transition.start || function() {};
  this.step = transition.step || function() {};
}
Transition.prototype.fade = function(threshold) {
  if (this.timer == this.duration) {
    this.opacity = 0;
  } else if (this.timer < this.duration / threshold) {
    this.opacity += 1 / this.duration * threshold;
  } else if (this.timer == Math.ceil(this.duration / threshold) + 1) {
    this.opacity = 1;
  } else if (this.timer > this.duration - this.duration / threshold) {
    this.opacity -= 1 / this.duration * threshold;
  }
}
Transition.prototype.wave = function(ystart, yend, spacing, amplitude, color, shadowcolor) {
      let ctx = room.ctx;
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, ystart);
      for (var i = 0; i < XSIZE/spacing; i++) {
        let _x = (i + 1) * spacing;
        let _y = ystart;
        let _pt1 = {x: i * spacing + spacing/2, y: ystart-amplitude};
        let _pt2 = {x: i * spacing + spacing/2, y: ystart+amplitude};
        ctx.bezierCurveTo(_pt1.x, _pt1.y, _pt2.x, _pt2.y, _x, _y);
      }
      ctx.lineTo(i * spacing, yend);
      ctx.lineTo(0, yend);
      ctx.closePath();
      ctx.shadowColor = shadowcolor || color;
      ctx.shadowBlur = 50;
      ctx.fill();
      ctx.restore();
}

function Character(x, y, image) {
  this.x = x * GRIDSIZE;
  this.y = y * GRIDSIZE;
  this.image = image;
  this.visible = true;
  this.mask = { x: 8, y: 16, width: GRIDSIZE, height: GRIDSIZE };
  this.hsp = 0;
  this.vsp = 0;
  this.dirx = 0;
  this.diry = 0;
  this.img_speed = 0;
  this.max_speed = 1;
  this.max_run_speed = 2;
  this.input = {r: 0, l: 0, u: 0, d: 0, run: 0};
}
Character.prototype = {
  stop: function() {
    this.input.r = 0;
    this.input.l = 0;
    this.input.u = 0;
    this.input.d = 0;
    this.input.run = 0;
  },
  move: function(dir, run) {
    this.stop();
    this.input[dir] = 1;
    if (run) {
      this.input.run = 1;
    }
  },
  step: function() {
    // get input
    var input;
    if (in_talk || in_menu) {
      input = this.input
    } else {
      input = this.get_input()
    }
    // speed changes
    if (on_grid(this)) {
      var hori = input.r - input.l;
      var vert = input.d - input.u;
      if (hori != 0) {
        if (input.run) {
          this.hsp = hori * this.max_run_speed;
        } else {
          this.hsp = hori * this.max_speed;
        }
        this.vsp = 0;
        this.dirx = hori;
        this.diry = 0;
      } else if (vert != 0) {
        if (input.run) {
          this.vsp = vert * this.max_run_speed;
        } else {
          this.vsp = vert * this.max_speed;
        }
        this.hsp = 0;
        this.dirx = 0;
        this.diry = vert;
      } else {
        this.hsp = 0;
        this.vsp = 0;
      }
    }
    // collision
    if (this.hsp != 0) {
      for (var i = 0; i < Math.abs(this.hsp); i++) {
        if (!place_meeting(this, this.x + sign(this.hsp), this.y, blocks)) {
          this.x += sign(this.hsp);
        } else {
          this.hsp = 0;
          break;
        }
      }
    } else if (this.vsp != 0) {
      for (var i = 0; i < Math.abs(this.vsp); i++) {
        if (!place_meeting(this, this.x, this.y + sign(this.vsp), blocks)) {
          this.y += sign(this.vsp);
        } else {
          this.vsp = 0;
          break;
        }
      }
    }
  },
  draw: function() {
    if (this.visible) {
      room.ctx.drawImage(this.image, this.x-this.mask.x, this.y-this.mask.y);
    }
  },
  get_input: function() {
    return {
      r: keyboard_check(vk_right),
      l: keyboard_check(vk_left),
      u: keyboard_check(vk_up),
      d: keyboard_check(vk_down),
      run: keyboard_check(vk_shift)
    }
  }
}

function Player(x, y, image) {
  Character.call(this, x, y, image);
}
Player.prototype = new Character();
Player.prototype.get_input = function() {
    return {
      r: keyboard_check(vk_right),
      l: keyboard_check(vk_left),
      u: keyboard_check(vk_up),
      d: keyboard_check(vk_down),
      run: keyboard_check(vk_shift)
    }
  }

function Npc(dialogue, options) {
  if (!options) options = {};
  this.name = options.name || "";
  this.image = options.image;
  this.dialogue = dialogue;
  this.second_dialogue = options.second_dialogue || false;
  this.spawn_condition = options.spawn_condition || (() => true);
  this.x = 0;
  this.y = 0;
  this.mask = options.mask || {
    x: 0,
    y: 0,
    width: GRIDSIZE,
    height: GRIDSIZE
  };
  this.draw = function() {
    if (this.image) {
      room.ctx.drawImage(this.image, this.x-this.mask.x, this.y-this.mask.y);
    }
    else room.ctx.drawImage(spr.block, this.x, this.y);
  }
  this.talked_to = false;
  this.say = function() {
      in_talk = true;
      if (this.talked_to && this.second_dialogue) {
        story = [...this.second_dialogue];
      }
      else {
        story = [...this.dialogue];
        this.talked_to = true;
      }
      bt.adv.name.text = this.name;
      bt.line = 0;
      bt.Next();
  }
}

function Door(room, position) {
  this.room = room;
  // position the player will jump to in the new map, in an object
  this.position = position || false;
  this.x = 0;
  this.y = 0;
  this.mask = {
    x: 0,
    y: 0,
    width: GRIDSIZE,
    height: GRIDSIZE
  };
  this.draw = function() {};
  this.cutscene = false;
  this.say = function() {
    create_level(this.room);
    if (this.position) {
      player.x = this.position.x*GRIDSIZE;
      player.y = this.position.y*GRIDSIZE;
    }
    if (this.cutscene) {
      this.cutscene();
    }
  }
}

// Button maker!! all the defaults
buttons = [];
function Button(button) {
  this.x = button.x || 0; // FIX
  this.y = button.y || 0; // FIX
  this.width = button.width || 0; // FIX
  this.height = button.height || 0; // FIX
  this.text = new Text(this.x, this.y, button.text || "");
  this.image = button.image || false;
  this.label = button.label || false;
  this.hovered = false;
  this.action = button.action || function() {
    if (this.label) {
      bt.Jump(label[this.label]);
      in_menu = false;
    }
    else {
      current_menu.close();
      bt.Next();
    }
    prev_menus = [];
    buttons = [];
  };
  this.id = button.id // -1 is deactivated
  // Hover properties
  if (button.hover) {
    this.hover = {};
    this.hover.x = button.hover.x || 0; // they are offsets
    this.hover.y = button.hover.y || 0;
    this.hover.width = button.hover.width || this.width;
    this.hover.height = button.hover.height || this.height;
    if (button.hover.text) {
      this.hover.text = new Text(this.x, this.y, button.hover.text);
    }
    else {
      this.hover.text = this.text;
    }
    this.hover.image = button.hover.image || this.image;
  }
  // decide to put draw event either here or as class prototype function
  this.deactivate = function() {
    this.id = -1;
  }
}
Button.prototype.draw = function() {
  // when hovered display hover properties if they exist
  if (this.hovered && this.hover) {
    if (this.hover.image) {
      room.ctx.drawImage(this.hover.image, this.x + this.hover.x, this.y + this.hover.y);
    }
    this.hover.text.draw();
  }
  else {
    if (this.image) {
      room.ctx.drawImage(this.image, this.x, this.y);
    }
    this.text.draw();
  }
}

function add_buttons(menu) {
  // adds buttons to the buttons list
  for (var i=0; i<menu.buttons.length; i++) {
    if (menu.type == "vertical") {
      menu.buttons[i].x = menu.x;
      menu.buttons[i].y = menu.y - menu.spacing * (menu.buttons.length - i);
    }
    if (menu.type == "horizontal") {
      menu.buttons[i].x = menu.x + menu.spacing * i;
      menu.buttons[i].y = menu.y;
    }
    buttons.push(new Button(menu.buttons[i]));
  }
}

// Menu maker
function Menu(menu) {
  this.type = menu.type || "vertical";
  this.x = menu.x || MENU_X;
  this.y = menu.y || MENU_Y;
  this.background = menu.background || false;
  this.spacing = menu.spacing || MENU_SPACING;
  this.preselect = menu.preselect || 0;
  this.close_on_choice = menu.close_on_choice;
  this.buttons = menu.buttons || [];
  this.step = menu.step || function() {};
  this.choice = this.preselect;
  if (this.type == "vertical") {
    this.forward_key = menu.forward || keymap.down;
    this.backward_key = menu.backward || keymap.up;
  }
  else if (this.type == "horizontal") {
    this.forward_key = menu.forward || keymap.right;
    this.backward_key = menu.backward || keymap.left;
  }
  this.confirm_key = menu.confirm || keymap.confirm;
  this.cancel_key = menu.confirm || keymap.cancel;
  this.prevent_default = {};
  if (menu.prevent_default) {
    for (key of menu.prevent_default) {
      this.prevent_default[this[key]] = true;
    }
  }
  this.on_close = menu.on_close || function() {}
}
Menu.prototype.open = function() {
  in_menu = true;
  // put the last menu on the menu stack
  if (current_menu) {
    prev_menus.push(current_menu);
  }
  // put the buttons into the button list
  buttons = [];
  add_buttons(this);
  // hover the last selected button
  buttons[this.choice].hovered = true;
  current_menu = this;
}
Menu.prototype.close = function() {
  this.on_close();
  // reset choice
  this.choice = this.preselect;
  current_menu = false;
  // if there are no previous menus
  if (!prev_menus.length) {
    buttons = [];
    in_menu = false;
  }
  // otherwise open the previous
  else {
    console.log("Menu Stack: " + prev_menus.length);
    let next_menu = prev_menus.pop();
    next_menu.open();
  }
}
Menu.prototype.update_choice = function() {
  // forward (right/down)
  if (keyboard_check_pressed(this.forward_key) &&
  !this.prevent_default[this.forward_key]) {
    if (this.choice < buttons.length - 1) {
      buttons[this.choice].hovered = false;
      this.choice++;
      buttons[this.choice].hovered = true;
    }
  }
  // backward (left/up)
  else if (keyboard_check_pressed(this.backward_key) &&
  !this.prevent_default[this.backward_key]) {
    if (this.choice > 0) {
      buttons[this.choice].hovered = false;
      this.choice--;
      buttons[this.choice].hovered = true;
    }
  }
  // confirm (z)
  else if (keyboard_check_pressed(this.confirm_key) &&
  !this.prevent_default[this.confirm_key]) {
    if (buttons[this.choice].id != -1) {
      console.log("Button: " + buttons[this.choice].text.text);
      buttons[this.choice].action();
    }
    // close the menu after a choice
    if (this.close_on_choice) {
      this.close();
    }
  }
  // cancel (x)
  else if (keyboard_check_pressed(this.cancel_key) &&
  !this.prevent_default[this.cancel_key]) {
    this.close();
  }
}

function spawn_npc(x, y, npc, solid = true) {
  if (npc.spawn_condition()) {
    npc.x = x*GRIDSIZE;
    npc.y = y*GRIDSIZE;
    npcs.push(npc);
    if (solid) {
      blocks.push(new Img(x*GRIDSIZE, y*GRIDSIZE, spr.block));
    }
  }
}

// background
var room_background = new Img(0, 0, BLANK_IMAGE);
var npcs = [];
// create level: make the correct blocks
function create_level(lvl) {
  room.map = lvl;
  blocks = [];
  var block_id=0;
  var npc_id = 0;
  map_w = GRIDSIZE*map_width[lvl];
  map_h = GRIDSIZE*map_height[lvl];
  room_background.image = map_background[lvl];
  for (var y=0;y<map_height[lvl];y++) {
    for (var x=0;x<map_width[lvl];x++) {
      if (map[lvl][block_id]==1) {
        blocks.push(new Img(x*GRIDSIZE,y*GRIDSIZE,spr.block));
      }
      else if (map[lvl][block_id]==5) {
        spawn_npc(x, y, map_npcs[lvl][npc_id]);
        npc_id++;
      }
    block_id++;
    }
  }
  if (creation_code[lvl]) {
    creation_code[lvl]();
  }
}