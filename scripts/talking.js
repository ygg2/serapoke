// TALKING

// useful globals
var box = "box";
var text = "text";
var fade = "fade";
var yesno = "yesno";
var custom = "custom";
var background = "background";
var right = "right";
var left = "left";
var center = "center";
var story = [];
var chars_displayed = 0;
var script_pause = 0;
const no_item = -1;
var calling_npc = null

// make the box and stuff
var bt = {};
bt.line = 0;
bt.adv = {};
bt.adv.box = new Img(BOX_X, BOX_Y, BOX_IMAGE);
bt.adv.text = new Text(ADV_X, ADV_Y, "");
bt.adv.name = new Text(NAME_X, NAME_Y, "");
bt.adv.visible = true;
bt.adv.draw = function() {
  if (bt.adv.visible) {
  // draw the box
  bt.adv.box.draw();
  // draw the name
  bt.text_draw(NAME_X, NAME_Y, bt.adv.name.text); // PLACEHOLDER later, class
  // draw the text
  bt.typewriter(bt.adv.text.x, bt.adv.text.y, bt.adv.text.text); // PLACEHOLDER later, class
  }
}

var char_height = CHAR_HEIGHT;
var char_width = CHAR_WIDTH;
// newline character
var char_return = 64;
// where the sets end
var char_sym = 65;
var char_upper = 97;
var char_lower = 127;
// offset and horizontal offset
var char_offset = CHAR_OFFSET_V;
var char_offset_h = CHAR_OFFSET_H;
bt.text_draw = function(x, y, text, length) {
  // set the length
  if (!length) {
    length = text.length;
  }
  if (IMAGE_TEXT) {
  for (var i=0;i<length;i++) {
    // newline
    if (text.charCodeAt(i) == char_return) {
      x = (-i-1)*char_width+bt.adv.text.x;
      y += ADV_SPACING;
    }
    // symbols
    else if (text.charCodeAt(i) < char_sym) {
      char_offset = 0;
      char_offset_h = 33;
    }
    // uppercase
    else if (text.charCodeAt(i) < char_upper) {
      char_offset = char_height;
      char_offset_h = char_sym;
    }
    // lowercase
    else if (text.charCodeAt(i) < char_lower) {
      char_offset = char_height * 2;
      char_offset_h = char_upper;
    }
    // draw the character
    if (text.charCodeAt(i) != char_return) {
      room.ctx.drawImage(spr.font, char_width * (text.charCodeAt(i) - char_offset_h), char_offset, char_width, char_height, x + char_width * i, y, char_width, char_height); 
    }
  }
  } else {
    room.ctx.fillStyle = TEXT_COLOR;
    room.ctx.fillText(text.slice(0, length), x, y);
  }
}

bt.typewriter = function(x, y, text) {
  if (chars_displayed < text.length) {
    chars_displayed+=TEXT_SPEED;
  }
  bt.text_draw(x, y, text, chars_displayed);
}

// bt function
bt.Jump = function(newLabel) {
  if (calling_npc !== null) {
    story = [...calling_npc.labels[newLabel]]
  } else {
  	story = [...label[newLabel]]
  }
  bt.line = 0;
  bt.Next();
}
bt.Insert = function() {
  for (var i=0;i<arguments.length;++i) {
    story.splice(bt.line+i,0,arguments[i]);
  }
}
bt.Menu = function() {
  menu_div.innerHTML = "";
  for (i=0;i<arguments.length;++i) {
    create_button({
      x: "none",
      y: 240+(i-arguments.length)*BUTTON_HEIGHT,
      id: i,
      text: arguments[i][0],
      html_class: "menu_button",
    }, arguments[i][1]);
  }
  in_menu = true;
}

bt.Cutscene = function(arr) {
  in_talk = true;
  bt.line = 0;
  story = [...arr];
  bt.Next();
}

bt.OnEnd = null;

bt.Next = function() {
  var go = true;
  if (script_pause > 0) {
    if (script_pause > 1) {
      go = false;
    }
    script_pause--;
  }
  // keep reading commands until reaching a stop
  while (go) {

    var command = story[bt.line];
    
    // if the last line isn't done displaying, display it and rewind
    if (chars_displayed < bt.adv.text.text.length) {
      chars_displayed = bt.adv.text.text.length;
      break;
    } else {
      bt.line++;
    }

    // if the current line is undefined, stop
    if (command===undefined) {
      go = false;
      in_talk = false;
      if (bt.OnEnd !== null) {
        bt.OnEnd();
        bt.OnEnd = null;
      }
      player.stop()
    }

    // if we encounter a string then stop
    else if (typeof command == "string") {
      chars_displayed = 0;
      bt.adv.text.text = command;
      go = false;
    }

    // if we see a function run it
    else if (typeof command == "function") {
      command();
    }

    // if we see an object check what it's supposed to do
    else if (typeof command == "object") {

      // name: sets the string as name
      if (command.name) {
        bt.adv.name.text = command.name;
      }
      
      // show: show box
      else if (command.show) {
        if (command.show == box) {
          bt.adv.visible = true;
        }
      }
      
      // hide; hide box
      else if (command.hide) {
        if (command.hide == box) {
          bt.adv.visible = false;
        }
      }
      
      // menu: creates a menu
      else if (command.menu) {
        go = false;
        in_menu = true;
        // if the last line isn't done displaying, display it and rewind
        if (chars_displayed < bt.adv.text.text.length) {
          chars_displayed = bt.adv.text.text.length;
        }
        // default text menu
        if (command.menu == text) {
          var temp_menu = new Menu({
            prevent_default: ["cancel_key"],
            close_on_choice: true,
          });
          for (var i=0; i<command.choices.length; i++) {
            let temp_button = {};
            temp_button.text = command.choices[i][0];
            if (MENU_INDICATOR) {
              temp_button.hover = { image: spr[MENU_INDICATOR], x:MENU_INDICATOR_OFFSET }
            } else {
              temp_button.hover = { text: "> " + command.choices[i][0] };
            }
            temp_button.label = command.choices[i][1];
            temp_menu.buttons.push(temp_button);
          }
          temp_menu.open();
        }
        // yes/no menu
        else if (command.menu == yesno) {
          var temp_menu = new Menu({
            prevent_default: ["cancel_key"],
            close_on_choice: true,
            buttons: [
              { text: "Yes", hover: { text: "> Yes"}, label: "_temp_yes"},
              { text: "No", hover: { text: "> No"}, label: "_temp_no"}
            ]
          });
          if (command.yes) {
            label["_temp_yes"] = command.yes;
          }
          if (command.no) {
            label["_temp_no"] = command.no;
          }
          temp_menu.open();
        }
        // custom menu - customize all your buttons
        else if (command.menu == custom) {
          create_menu(command.list);
        }
      }
      
      // sprite change
      else if (command.sprite) {
        command.change.image = command.sprite;
      }

      // change: changes an object
      else if (command.change) {
        // box commands
        if (command.change == box) {
          bt.adv.box.x = command.x || bt.adv.box.x;
          bt.adv.box.y = command.y || bt.adv.box.y;
          bt.adv.box.image = command.image || bt.adv.box.image;
        }
        else if (command.change == text) {
          bt.adv.text.x = command.x || bt.adv.text.x;
          bt.adv.text.y = command.y || bt.adv.text.y;
        }
        else if (command.change == background) {
          room_background.image = command.image || false;
        }
      }
      
      // pickup: add an item to inventory with a special dialogue
      else if (command.pickup) {
        // add the item to inventory
        if (!(command.pickup in inventory)) {
          inventory[command.pickup] = items[command.pickup];
          if (command.message) {
            bt.Insert(command.message);
          }
        }
        // if it's already there, show after dialogue
        else {
          if (command.after) {
            bt.Insert(command.after);
          }
        }
      }

			// give: remove an item from inventory with a special dialogue
			else if (command.drop) {
			  // if you already gave the item, display after dialogue
			  if (inventory[command.drop] == no_item) {
			    if (command.after) {
			      bt.Insert(command.after);
			    }
			  }
			  // remove the item from inventory
			  else if (command.drop in inventory) {
			    inventory[command.drop] = no_item;
			    if (command.message) {
			      bt.Insert(command.message);
			    }
			  }
			  // if you don't have the item, show backup dialogue
			  else {
			    if (command.backup) {
			      bt.Insert(command.backup);
			    }
			  }
			}

			// transition: display transition
			else if (command.transition) {
			  let transition = transitions[command.transition];
			  transition.timer = 0;
			  if (command.duration) {
			    transition.duration = command.duration;
			  } else {
			    transition.duration = transition.default_duration;
			  }
			  transition.start();
			  room.transitions.push(transition);
			}

      // script_pause: just script_pause the script
      else if (command.pause) {
        script_pause = command.pause;
        go = false;
      }

      else if (command.jump) {
        bt.Jump(command.jump);
      }
      
      else if (command.room) {
        create_level(command.room);
      }
      
      // cutscene stuff
      else if (command.move || command.move===0) {
        if (command.teleport) {
          if (command.move==="player") {
          	if (command.x || command.x===0) player.x = command.x * GRIDSIZE;
          	if (command.y || command.y===0) player.y = command.y * GRIDSIZE;
          } else {
            if (command.x || command.x===0)
              npcs[command.move].x = command.x * GRIDSIZE;
            if (command.y || command.y===0)
              npcs[command.move].y = command.y * GRIDSIZE;
          }
        }
        else if (command.move==="player") player.move(command.dir, command.run)
        else npcs[command.move].move(command.dir, command.run);
      }
      
      else if (command.stop) {
        command.stop.stop();
      }
      
      else if (command.save) {
        // simple save for now
        let _save = {
          map: room.map,
          player: {
            x: Math.round(player.x / GRIDSIZE) * GRIDSIZE,
            y: Math.round(player.y / GRIDSIZE) * GRIDSIZE
          },
          progress: progress
        }
        localStorage.setItem(command.save, JSON.stringify(_save));
      }

      else if (command.battle) {
        bt.adv.box.visible = true
        bt.adv.name.text = '';
        screen_images.push(new Img(0, 0, spr.battle_bg))
        // set battle variables
        user_vars._enemy = enemies[command.battle].name;
        // recreate player to not have boosts and what not. because rush
        party[0] = new Monster("mika_normal");
        user_vars._leader = party[0].name;
        user_vars._turn = "your turn";
        battle_data = new BattleUi(party[0], new Monster(command.battle));
        battle_data.saved_dialogue = story.splice(bt.line);
        battle_data.loss_label = command.loss || [{room:"JIDA"}]//battle_data.saved_dialogue;
        screen_images.push(battle_data);
        // menu
        let _current_index = bt.line + 2;
        let _choices = party[0].moves.map(move => {
          return [
            `${move.name} [${move.power}]`, [
              ...move.effects,
              () => {
                [user_vars._enemy, user_vars._leader] = [user_vars._leader, user_vars._enemy];
                user_vars._turn = "the opponent's turn";
                // enemy does random move
                let _random = battle_data.enemy.moves.length * Math.random() |0;
                if (battle_data.check_prev(battle_data.enemy.moves[_random])) {
                  _random++;
                }
                if (_random >= battle_data.enemy.moves.length) _random = 0;
                let _enemy_move = battle_data.enemy.moves[_random];
                battle_data.prev_moves.push(_enemy_move.name);
                bt.Insert(..._enemy_move.effects);
                console.log("Opponent Move: " + _enemy_move.name)
              },
              () => {
                [user_vars._enemy, user_vars._leader] = [user_vars._leader, user_vars._enemy];
                user_vars._turn = "your turn";
              },
              () => { bt.line = _current_index; }
            ]
          ];
        });
        bt.Insert(
          {template:"You are challeneged by ${_enemy}!"},
          {template:"What will ${_leader} do?"},
          {menu: text, choices: _choices}
        );
      }

      else if (command.statboost) {
        if (command.relative) {
          if (user_vars._turn == "your turn") {
            console.log(battle_data.leader);
            battle_data.leader[command.statboost] += command.value;
          } else {
          // fake fixes whee
            if (command.value > 0) {
              battle_data.enemy[command.statboost] += command.value;
            } else {
              battle_data.leader[command.statboost] += command.value;
            }
          }
        } else {
          if (user_vars._turn == "your turn") {
            battle_data.leader[command.statboost] = command.value;
          } else {
            battle_data.enemy[command.statboost] = command.value;
          }
        }
      }

      else if (command.damage) {
        let _leader_ko;
        let _enemy_ko;
        // hit self + your turn, or not hit self + opp turn
        if ((command.target && user_vars._turn == "your turn")
          || (!command.target && user_vars._turn != "your turn")) {
          let _damage = battle_data.calc_damage(battle_data.enemy, battle_data.leader, command.damage);
          _leader_ko = battle_data.leader.damage(_damage)
        } else {
          let _damage = battle_data.calc_damage(battle_data.leader, battle_data.enemy, command.damage);
          _enemy_ko = battle_data.enemy.damage(_damage)
        }
        if (_leader_ko) {
          console.log("loss")
          story = [
            "You lose.",
            {transition:"fade"},
            {pause:50},
            () => { screen_images = [] },
            "Mika scurried back to JIDA...",
            {transition:"fade"},
            {pause:50},
            ...battle_data.loss_label
          ];
          bt.line = 0;
        }
        if (_enemy_ko) {
          story = [
            "You win!",
            {transition:"fade"},
            {pause:30},
            () => { screen_images = [] },
            {pause:30},
            ...battle_data.saved_dialogue
          ];
          bt.line = 0;
        }
      }

      else if (command.setvar) {
        user_vars[command.setvar] = command.value
      }

      else if (command.template) {
        chars_displayed = 0;
        bt.adv.text.text = command.template.replace(/\$\{.*?\}/g, (match) => {
          return user_vars[match.slice(2, -1)]
        })
        go = false;
      }

      // otherwise, write a debug error
      else {
        console.log("Error with commands. Please check your script");
        console.log(command);
      }

    }

  } // end while go


}