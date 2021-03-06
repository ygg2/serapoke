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
    //this.ctx.imageSmoothingEnabled = false;
    //this.ctx.webkitImageSmoothingEnabled = false;
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
        // first room is a title screen
        create_level("Title");
        player.x = XSIZE / 2;
        player.y = YSIZE / 2;
        in_talk = true;
        story = label.main_menu;
        bt.Next();
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
  this.text = text || "";
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
  this.image = spr[image];
  this.visible = true;
  this.mask = {
    x: GRIDSIZE / 2,
    y: this.image ? this.image.height - GRIDSIZE + GRIDSIZE / 3 : 0,
    width: GRIDSIZE,
    height: GRIDSIZE
  };
  this.hsp = 0;
  this.vsp = 0;
  this.dirx = 0;
  this.diry = 0;
  this.img_speed = 0;
  this.max_speed = 4;
  this.max_run_speed = 8;
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
    this.collide_and_move();
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
  },
  collide_and_move: function() {
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
      entities.sort((a, b) => a.y - b.y); // depth sorting
      for (var i = 0; i < Math.abs(this.vsp); i++) {
        if (!place_meeting(this, this.x, this.y + sign(this.vsp), blocks)) {
          this.y += sign(this.vsp);
        } else {
          this.vsp = 0;
          break;
        }
      }
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

function Npc({labels, name, image, x, y, spawn_condition, mask}) {
  Character.call(this, 0, 0, image)
  this.name = name; // for debug text
  this.labels = labels
  this.dialogue = labels['Main'];
  this.secondary = labels['Secondary'] || labels['Main']
  this.spawn_condition = spawn_condition || false;
  this.x = x || 0;
  this.y = y || 0;
  if (mask) this.mask = mask
  this.draw = function() {
    if (this.image) {
      room.ctx.drawImage(this.image, this.x-this.mask.x, this.y-this.mask.y);
    }
    //else room.ctx.drawImage(spr.block, this.x, this.y);
  }
  this.talked_to = false;
  this.say = function() {
    calling_npc = this;
    bt.adv.name.text = "";
    in_talk = true;
    if (this.talked_to && this.secondary) {
      story = [...this.secondary];
    }
    else {
      story = [...this.dialogue];
      this.talked_to = true;
    }
    bt.line = 0;
    bt.Next();
  }
}
Npc.prototype = new Character();
Npc.prototype.collide_and_move = function() {
  if (this.hsp != 0) {
    for (var i = 0; i < Math.abs(this.hsp); i++) {
      if (!place_meeting(this, this.x + sign(this.hsp), this.y, nonnpcs)) {
        this.x += sign(this.hsp);
      } else {
        this.hsp = 0;
        break;
      }
    }
  } else if (this.vsp != 0) {
    for (var i = 0; i < Math.abs(this.vsp); i++) {
      if (!place_meeting(this, this.x, this.y + sign(this.vsp), nonnpcs)) {
        this.y += sign(this.vsp);
      } else {
        this.vsp = 0;
        break;
      }
    }
  }
}
Npc.prototype.get_input = function() {
	return this.input
}

function Door({x, y, toMap, toX, toY}) {
  this.x = x;
  this.y = y;
  this.toMap = toMap;
  this.toX = toX;
  this.toY = toY;
  this.mask = {
    x: 0,
    y: 0,
    width: GRIDSIZE,
    height: GRIDSIZE
  };
  this.step = function() {};
  this.draw = function() {};
  this.cutscene = false;
  this.say = function() {
    create_level(this.toMap);
    player.x = this.toX*GRIDSIZE;
    player.y = this.toY*GRIDSIZE;
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
  this.calling_npc = button.calling_npc || false;
  this.action = button.action || function() {
    if (this.label) {
      if (Array.isArray(this.label)) {
        bt.Insert(...this.label);
        bt.Next();
      } else {
        bt.Jump(this.label);
      }
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

function Monster(name, level) {
  this.name = enemies[name].name;
  this.level = level;
  this.max_hp = enemies[name].hp;
  this.hp = enemies[name].hp;
  this.speed = enemies[name].speed;
  this.atk = enemies[name].atk;
  this.def = enemies[name].def;
  this.atk_mul = 0;
  this.def_mul = 0;
  this.image = new Img(0, 0, spr[enemies[name].image]);
  this.damage = function (amount) {
    this.hp -= amount;
    if (this.hp > this.max_hp) this.hp = this.max_hp;
    if (this.hp > 0) return false;
    this.hp = 0;
    return true;
  }
  this.moves = enemies[name].moves;
  this.hp_text = new Text(0, 0, "");
  this.stat_text = new Text(0, 0, "");
}
Monster.prototype.draw = function(is_enemy) {
  this.image.draw();
  this.hp_text.text = `HP: ${this.hp}/${this.max_hp}`;
  this.hp_text.draw();
  // hp bar
  let _percent = this.hp / this.max_hp;
  room.ctx.fillStyle = `rgb(${(1 - _percent) * 255}, ${_percent * 255}, 0)`;
  if (is_enemy) room.ctx.fillRect(XSIZE - 220, 40, _percent * 200, 20);
  else room.ctx.fillRect(20, 190, _percent * 200, 20);
  // stat boosts
  this.stat_text.text = "";
  if (this.atk_mul) this.stat_text.text += `Atk + ${this.atk_mul}`;
  if (this.def_mul) this.stat_text.text += `Def + ${this.def_mul}`;
  this.stat_text.draw();
}

function BattleUi(leader, enemy) {
  this.leader = leader;
  this.enemy = enemy;
  // position sprites
  this.leader.image.x = 0;
  this.leader.image.y = 230;
  this.enemy.image.x = 500;
  this.enemy.image.y = 80;
  this.leader.hp_text.x = 40;
  this.leader.hp_text.y = 160;
  this.enemy.hp_text.x = 480;
  this.enemy.hp_text.y = 10;
  this.leader.stat_text.x = 150;
  this.leader.stat_text.y = 220;
  this.enemy.stat_text.x = 400;
  this.enemy.stat_text.y = 90;
  // establish previous moves, dialogue after win, dialogue after loss
  this.prev_moves = [];
  this.save_dialogue = [];
  this.loss_label = [];
}
BattleUi.prototype.draw = function() {
  this.leader.draw();
  this.enemy.draw(true);
}
BattleUi.prototype.check_prev = function(move) {
  let _len = this.prev_moves.length;
  if (_len > 1) {
    if (this.prev_moves[_len - 1] == this.prev_moves[_len - 2]) {
      if (this.prev_moves[_len - 1] == move.name) {
        return true
      }
    }
  }
  return false
}
BattleUi.prototype.calc_damage = function(att, opp, dmg) {
  if (dmg < 0) return Math.round(dmg / 100 * opp.hp);
  return Math.max(1, Math.round(
    dmg / 100 * (
      att.atk * (1 + att.atk_mul / 10) -
      opp.def * (1 + opp.def_mul / 10) / 2
    )
  ));
}

function spawn_npc(npc, solid = true) {
  if (!npc.spawn_condition || user_vars[npc.spawn_condition] ||
    (typeof npc.spawn_condition == "function" && npc.spawn_condition())) {
    npc.x *= GRIDSIZE;
    npc.y *= GRIDSIZE;
    npcs.push(npc);
    if (solid) {
      blocks.push(npc);
    }
  } else {
    npc.x = -GRIDSIZE;
    npc.y = -GRIDSIZE;
    npcs.push(npc);
  }
}

// background
var room_background = new Img(0, 0, BLANK_IMAGE);
var npcs = [];
var entities = [];
var screen_images = [];
// create level: make the correct blocks
function create_level(lvl) {
  room.map = maps[lvl].map;
  blocks = [];
  nonnpcs = [];
  npcs = [];
  map_w = GRIDSIZE * maps[lvl].map[0].length;
  map_h = GRIDSIZE * maps[lvl].map.length;
  if (map_w < XSIZE) map_w = XSIZE;
  if (map_h < YSIZE) map_h = YSIZE;
  room_background.image = spr[maps[lvl].background];
  for (let npc of maps[lvl].npcs) {
    spawn_npc(new Npc(npc));
  }
  for (let door of maps[lvl].doors) {
    spawn_npc(new Door(door));
  }
  for (var y = 0; y < maps[lvl].map.length; y++) {
    for (var x = 0; x < maps[lvl].map[y].length; x++ ) {
      if (maps[lvl].map[y][x]==1) {
        nonnpcs.push(new Img(x*GRIDSIZE,y*GRIDSIZE,spr.block));
      }
    }
  }
  blocks.push(...nonnpcs);
  player.x = GRIDSIZE * maps[lvl].spawnx || 0;
  player.y = GRIDSIZE * maps[lvl].spawny || 0;
  entities = [player, ...npcs];
  if (maps[lvl].creation_code) {
    maps[lvl].creation_code();
  }
}