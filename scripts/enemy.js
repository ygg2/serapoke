var enemies = {"mika_normal":{"name":"Mika","image":"mika","moves":[{"name":"Sword Swing","power":"20","effects":[{"template":"Mika attacks ${_enemy}!"},{"damage":20}],"description":"Slash at the enemy."},{"name":"Kick","power":"40","effects":[{"template":"Mika kicks ${_enemy}!"},{"damage":40,"pause":0},"Mika is damaged by recoil!",{"damage":10,"target":true}],"description":"Kick the opponent."},{"name":"Inner Calm","power":0,"effects":["Mika focuses and becomes calm.",{"statboost":"def_mul","relative":true,"value":2}],"description":"The eye of the hurricane."}],"hp":50,"speed":50,"atk":70,"def":60},"crowley":{"name":"Crowley","image":"crowley","moves":[{"name":"Regen","power":"[Healing]","effects":["Crowley uses vampire regeneration powers.",{"transition":"timewarp","duration":0},{"pause":50},{"damage":-20,"target":true,"pause":0},{"pause":50},"Crowley has recovered HP!"],"description":"Heals self."},{"name":"Sword Slash","power":"40","effects":[{"template":"Crowley slashes at ${_enemy}."},{"damage":40,"pause":0,"target":false}],"description":"Slice enemies with a sword."},{"name":"Bloodthirsty Sword","power":"-","effects":["Crowley commands his sword to drink his blood.",{"statboost":"atk_mul","relative":true,"value":1},{"damage":10,"target":true},"Crowley's attack stat increased!"],"description":"Consume HP to boost Attack."}],"speed":90,"hp":70,"atk":60,"def":40},"ferid":{"name":"Ferid","image":"ferid","moves":[{"name":"Regen","power":"[Healing]","effects":["Ferid heals himself with vampiric regeneration.",{"pause":40},{"transition":"timewarp","duration":80},{"pause":40},{"damage":-20,"pause":0,"target":true}],"description":"Recovery."},{"name":"Bloodsucking Sword","power":"-","effects":["Ferid's sword consumes some of his blood.",{"statboost":"atk_mul","relative":true,"value":1},{"damage":-10,"pause":0,"target":true}],"description":"His weapon gains power from drinking blood."},{"name":"Ribbon Throw","power":"-","effects":[{"template":"${_leader} uses ribbons to constrict ${_enemy}'s movement!"},{"statboost":"def_mul","relative":true,"value":-1}],"description":"Ferid throws a constricting ribbon."},{"name":"Slash","power":"40","effects":["Ferid attacks!",{"damage":40,"pause":0}],"description":"Ferid attacks"}],"hp":50,"speed":90,"def":50,"atk":70},"owlbear":{"name":"Owlbear","image":"owlbear","moves":[{"name":"Beak","power":"50","effects":[{"template":"${_leader} pierces ${_enemy} with its beak!"},{"damage":30,"pause":0}],"description":"this doesn't appear in game rip"},{"name":"Claws","power":"50","effects":[{"template":"${_leader} slashes with its claws."},{"damage":50,"pause":0}],"description":"Slash"}],"hp":30,"speed":50,"atk":60,"def":60}}