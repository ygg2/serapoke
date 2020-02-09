// OBJECTS

var player;

// containers
var label = {};
var inventory = {};
var quests = {};
var finished_quests = {};
var transitions;
var user_vars = {
  entered_territory: false,
  after_owlbear: false,
  looking_for_yuu: false,
  before_end: true
};
var party = [];
var battle_data = {};
var progress = 0;
if (localStorage.getItem('save')) {
  var main_menu_item = [
		["CONTINUE", "serapoke_load"]
  ]
} else {
  var main_menu_item = [
    ["PRESS Z TO PLAY", "serapoke_intro"],
  ]
}

function create_objects() {
//testing
/*for (let key of Object.keys(maps)) {
  if (key != "Title") {
    label[key] = [
      ()=>{
        player.visible = true;
        bt.adv.box.visible = true;
      },
      {room:key}
    ]
    main_menu_item.push(
      [key, key]
    )
  }
}*/

// player
player = new Player(0, 0, "mika");

// adding functionality that isn't in the builder
maps.JIDA.npcs[0].spawn_condition = () => !user_vars.after_owlbear;
maps.JIDA.npcs[2].labels.Main = [
  () => {
    if (inventory.device) bt.Insert({room:"Path"});
    else bt.Insert({name:"Mika"},"I should go get my device first.");
  }
]
maps.Territory.npcs[2].spawn_condition = () => !user_vars.after_owlbear;
maps.Territory.npcs[2].labels.Main.push(
  () => {
    user_vars.after_owlbear = true;
  }
);
maps.JIDA.npcs[3].labels.Main.push(() => {
  user_vars.looking_for_yuu = true;
})
maps.cave.npcs[1].labels.Main.push(() => {
  location.reload();
})

// INTRO
label.main_menu = [
()=>{
  player.visible = false;
  bt.adv.box.visible = false;
  party.push(new Monster("mika_normal"));
},
{menu:text,
	choices: main_menu_item
}
]

label.serapoke_intro = [
{change:background},
{change:text, x:80, y:150},
"In this world, where there are many dangers...@          @...JIDA keeps the world at peace.",
{transition:"fade"},
{pause:50},
{jump:"serapoke_init"}
]

label.serapoke_init = [
{change:text, x:80, y:400},
()=>{
  player.visible = true;
  bt.adv.box.visible = true;
  inventory.boots = items.boots;
},
{room:"JIDA"},
{name:"???"},
"There you are, Mika!",
{hide:"box"},
{move:0, dir:"r", run:true},
{pause:40},
{move:0, dir:"s"},
{show:"box"},
{name:"Sayuri"},
"I see you're dressed for your mission already.",
{name:"Mika"},
"Yes. Even if it's just the edge of vampire territory,@I'd rather not draw suspicion.",
{name:"Sayuri"},
"Yoichi will be your contact today. Make sure to@pick up your magic device from the desk.",
{name:"Mika"},
"I will, thank you.",
{move:0, dir:"l"},
{pause:10},
{move:0, dir:"d"},
{pause:20}
]

label.serapoke_path = [
"*ping*",
{name:"Yoichi"},
"Hi! This is Yoichi.",
{name:"Mika"},
"Hello!",
"Where was it that the monsters were spotted?",
"Yuu-chan and I were supposed to meet up at the border@by the forest soon.",
"I was going to check it out anyway, but I'm@concerned if he was out there alone and didn't know@what to expect.",
{name:"Yoichi"},
"Hmm...yeah, the sighting was in sight of the main@path, so if that's where you're planning to meet him...",
"I'm sure he's alright though!",
"Yuu-kun's tougher than you give him credit for!",
{menu:text, choices:[
["He got hurt with a spoon", [
  {name:"Mika"},
	"Tell that to the spoon he accidentally managed to@hurt himself with last week.",
	{name:"Yoichi"},
	"Haha yeah, I guess he is a bit clumsy sometimes..."
]],
["That's natural selection", [
  {name:"Mika"},
  "Well, if he is dead that's natural selection.",
  "Since I'm in the market for a new best friend...",
  {name:"Yoichi"},
  "Mika-kun, you know you can't just leave Yuu-kun@behind like that.",
  "You'd never get over it if something happened to him.",
  {name:"Mika"},
  "Yeah...I guess you're right."
]],
["If anyone hurt him...", [
  {name:"Mika"},
  "Still, if anyone did anything to hurt him, they'll@rue the day they were born.",
  "I'll tear them limb from limb until the only thing@they know is pain, until their screams drown out@all sound-",
  {name:"Yoichi"},
  "OKAYYYY How about you wait to do that until you know@if anything's actually happened to him."
]],
["You're right", [
  {name:"Mika"},
  "You're right, no one's tougher than my Yuu-chan.",
  "With as skilled as he is, he could easily take down@any measly monster he encountered."
]]
]},
{name:"Mika"},
"Anyway, I'll check it out and let you know...",
"I'm sure he can handle himself if something did show@up, but I can't help but be worried.",
"Talk to you later, Yoichi.",
{name:"Yoichi"},
"Good luck, Mika-kun!"
]

label.serapoke_territory = [
"This is the border with the vampire territory...",
{move:0, dir:"l", run:true},
{pause:60},
{move:0, dir:"s"},
{move:0, teleport:true, x:-1, y:-1},
"!!!",
"...",
"Whew, I don't think he saw me..."
]

label.serapoke_battle_crowley = [
{name:"Crowley"},
"placeholder dialogue",
{move:1, dir:"r"},
{pause:30},
{move:1, dir:"s"},
"more placeholder",
"yeh",
{battle:"crowley", lose:"serapoke_battle_loss"},
{name:"Crowley"},
"No!",
{move:1, dir:"l", run:true},
{pause:30},
{move:1, dir:"s"},
"I've been defeated...",
"Who cares what Ferid is up to anyway.",
"If you want to find him, try somewhere purple.",
{setvar:"looking_for_yuu", value:false},
{setvar:"before_end", value:false}
]

maps.Territory.creation_code = () => {
  if (!user_vars.entered_territory) {
    user_vars.entered_territory = true;
    calling_npc = null;
    bt.adv.name.text = "Mika";
    in_talk = true;
    bt.Jump("serapoke_territory");
  } else {
    npcs[0].x = -1 * GRIDSIZE;
    if (user_vars.looking_for_yuu) {
      calling_npc = null;
      bt.adv.name.text = "Mika";
      in_talk = true;
      if (user_vars.has_fought_crowley) {
        bt.Jump("serapoke_rematch_crowley");
      } else {
        user_vars.has_fought_crowley = true;
        bt.Jump("serapoke_battle_crowley");
      }
    }
  }
}
maps.Path.creation_code = () => {
  if (!user_vars.entered_path) {
    user_vars.entered_path = true;
    calling_npc = null;
    bt.adv.name.text = "";
    in_talk = true;
    bt.Jump("serapoke_path");
  }
}

label.serapoke_battle_loss = [
{room:"JIDA"}
]

label.serapoke_load = [
() => {
  var _save = JSON.parse(localStorage.getItem('save'));
  create_level(_save.map);
  player.x = _save.player.x;
  player.y = _save.player.y;
  progess = _save.progress;
  player.visible = true;
}
]

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