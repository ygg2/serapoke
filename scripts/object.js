// OBJECTS

var player;

// containers
var npc = {};
var door = {};
var label = {};
var inventory = {};
var quests = {};
var finished_quests = {};
var transitions;
var landscape = {
  bridge: true,
  telescope: true,
};
var progress = 0;
if (localStorage.getItem('save')) {
  var main_menu_item = [
		["CONTINUE", "xno_load"],
  	["SKIP INTRO", "xno_init"],
  ]
} else {
  var main_menu_item = [
	  ["PLAY", "xno_intro"],
  	["SKIP INTRO", "xno_init"],
  ]
}

function create_objects() {
items = {
  journal: {
    name: "Journal",
    description: "I'll use this to record what happens."
  },
  mask: {
    name: "Mask",
    description: "The mask Lora made for me. Don't forget her."
  }
}

// player
player = new Player(17, 14, spr.jin_nomask);

// INTRO
label.main_menu = [
()=>{
  player.visible = false;
  bt.adv.box.visible = false;
},
{change:background, image:spr.main_menu},
{menu:text,
	choices: main_menu_item
},
]
label.xno_intro = [
{change:background},
{change:text, x:80, y:150},
"After Lora passed away, Jin was a sad and bitter man.",
"There were many paths Jin could choose to take,@but he decided to continue to live as he believed@Lora would have - to dedicate his life to helping@others.",
"So, after renovating his house on the island that@had broken off Torna, he set out...",
"...",
{transition:"fade"},
{pause:50},
{jump:"xno_init"}
]
label.xno_init = [
{change:text, x:80, y:400},
()=>{
  player.visible = true;
  bt.adv.box.visible = true;
  inventory.mask = items.mask;
  bt.OnEnd = () => { create_level("Jin_Island"); }
}
]

label.xno_load = [
() => {
  var _save = JSON.parse(localStorage.getItem('save'));
  create_level(_save.map);
  player.x = _save.player.x;
  player.y = _save.player.y;
  progess = _save.progress;
  player.visible = true;
}
]


// Npc(dialogue, options)
// options: name, second_dialogue, image, spawn_condition
// Door(room, position)

/* Menu code */

main_menu = new Menu({
  buttons: [
    { text:"Inventory", hover:{text:">Inventory"},
      action: function() {
        let x = 20;
        let y = 50;
        for (let item_name in inventory) {
          let item = inventory[item_name];
          if (item != no_item) {
            overlay.push(new Text(x, y, item.name));
            y += 25;
            overlay.push(new Text(x, y, item.description));
          }
          y += 40;
        }
        inventory_menu.open();
      }
    },
    {text:"Close [x]", hover:{text:">Close [x]"}}
  ],
})

inventory_menu = new Menu({
  close_on_choice: true,
  on_close: function() {
    overlay = [];
  },
  buttons: [
    { text:"Close [x]" }
  ],
  prevent_default: ["confirm_key"]
})

/*main_menu = new Menu({
  type: "horizontal",
  // x
  // y
  background: new Img(0, 377, spr.menu),
  buttons: [
    //{}, // check inventory
    { image: spr.call,
      hover: {image: spr.call_hover}
    },
    { image: spr.save,
      hover: {image: spr.save_hover}
    }
  ],
  step: function() { if (keyboard_check_pressed(vk_shift)) { console.log("shift!"); } }
});*/

transitions = {
  fade: new Transition({
    duration: 100,
    start: function() {
      this.opacity = 0;
    },
    step: function() {
      this.fade(3);
      room.ctx.save();
      room.ctx.globalAlpha = this.opacity;
      room.ctx.fillStyle = "black";
      room.ctx.fillRect(0, 0, XSIZE, YSIZE);
      room.ctx.restore();
    }
  }),
  timewarp: new Transition({
    start: function() {
      this.opacity = 0;
      this.counter = 0;
      this.dir = 1;
    },
    step: function() {
      this.counter += this.dir;
      if (this.counter == 100 || this.counter == 0) {
        this.dir *= -1;
      }
      this.fade(5);
      room.ctx.save();
      // set blend mode
      room.ctx.globalCompositeOperation = "screen";
      // red light
      room.ctx.globalAlpha = this.opacity/2;
      room.ctx.fillStyle = "red";
      room.ctx.fillRect(0, 0, XSIZE, YSIZE);
      // do the wave
      room.ctx.globalAlpha = this.opacity;
      this.wave(YSIZE-50, YSIZE, 200, this.counter, "blue");
      // do the upside down wave
      room.ctx.save();
      room.ctx.scale(1, -1);
      room.ctx.translate(0, -YSIZE);
      this.wave(YSIZE-50, YSIZE, 200, this.counter, "blue");
      room.ctx.restore();
      // circle gradient
      room.ctx.globalAlpha = this.opacity;
      let _color = `hsla(${this.timer*1.5}, 100%, 50%, 1)`;
      let _gradient = room.ctx.createRadialGradient(XSIZE/2, YSIZE/2, 0, XSIZE/2, YSIZE/2, YSIZE);
      _gradient.addColorStop(.4, "rgba(0,0,0,0)");
      _gradient.addColorStop(.7, _color);
      room.ctx.fillStyle = _gradient;
      room.ctx.fillRect(0, 0, XSIZE, YSIZE);
      room.ctx.restore();
    }
  })
};

}