// GAME LOOP

var drawx;
var drawy;

// ALL NON DRAW EVENTS
// mod does nothing
var update = function() {
  // menu section
  if (in_menu) {
    current_menu.step();
    current_menu.update_choice();
    player.step();
  }
  // talking section
  else if (in_talk) {
    player.step();
    for (let npc of npcs) npc.step();
    if (keyboard_check_pressed(keymap.confirm) || script_pause > 0) {
      bt.Next();
    }
  }
  // movement and inspection section
  else {
    // menu overrides everything
    if (keyboard_check_pressed(keymap.menu)) {
      main_menu.open();
    }
    // move the player
    player.step();
    for (let npc of npcs) npc.step();
    // talk to npcs
    if (keyboard_check_pressed(keymap.confirm)) {
      var close_npc = place_meeting(player, player.x + player.dirx, player.y + player.diry, npcs);
      if (close_npc) {
        close_npc.say();
      }
    }
  }
  //drawx = clamp(player.x+player.mask.width/2-XSIZE/4, 0, map_w-XSIZE/2);
  //drawy = clamp(player.y+player.mask.height/2-YSIZE/4, 0, map_h-YSIZE/2);
  drawx = clamp(player.x+player.mask.width/2-XSIZE/2, 0, map_w-XSIZE);
  drawy = clamp(player.y+player.mask.height/2-YSIZE/2, 0, map_h-YSIZE);
}

// MAIN DRAW EVENT
var render = function() {
  room.clear();
  room.ctx.save();
  //room.ctx.translate(-drawx*2,-drawy*2);
  room.ctx.translate(-drawx, -drawy)
  //room.ctx.scale(2,2)
  room_background.draw();
  //for (let block of blocks) block.draw();
  for (let entity of entities) {
    entity.draw();
    //room.ctx.globalAlpha = .5;
    //room.ctx.fillRect(entity.x, entity.y, GRIDSIZE, GRIDSIZE);
    //room.ctx.globalAlpha = 1;
  }
  room.ctx.restore();
  for (let img of screen_images) {
    img.draw();
  }
  if (in_talk) {
    bt.adv.draw();
  }
  for (i=0;i<overlay.length;i++) {
    overlay[i].draw();
  }
  for (i=0;i<buttons.length;i++) {
    buttons[i].draw();
  }
  for (var i = 0; i < room.transitions.length; i++) {
    room.transitions[i].timer++;
    room.transitions[i].step();
    if (room.transitions[i].timer == room.transitions[i].duration) {
      room.transitions.splice(i, 1);
    }
  }
}

// START LOOP
function Main() {
  update();
  render();
  rAF(Main);
}
var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;

Preload();