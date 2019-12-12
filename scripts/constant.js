// CONSTANTS
/* things that probably shouldn't change after game start*/

// title
var TITLE = "Jin Helps People";

// screen size
var XSIZE = 680;
var YSIZE = 520;

// block size
var GRIDSIZE = 16;

// box preferences
var BOX_X = 8;
var BOX_Y = 450;
var BOX_IMAGE ="";

// text preferences
var NAME_X = 80;
var NAME_Y = 370;
var ADV_X = 80;
var ADV_Y = 400;
var ADV_SPACING = 24;
var TEXT_FONT = "22px Verdana";
var TEXT_COLOR = "white"
// image text preferences
var IMAGE_TEXT = true;
//var CHAR_WIDTH = 25;
//var CHAR_HEIGHT = 50;
var CHAR_WIDTH = 10;
var CHAR_HEIGHT = 22;
var CHAR_OFFSET_V = 2;
var CHAR_OFFSET_H = 0;

// standard menu preferences
var MENU_X = 500;
var MENU_Y = 400;
var MENU_SPACING = 50;
var MENU_INDICATOR = "menu_indicator";
//var MENU_INDICATOR;
var MENU_INDICATOR_OFFSET = -16;

// extra preferences
var BUTTON_HEIGHT = 40;
var TEXT_SPEED = .6;

// default keymap
var keymap = {
  confirm: "KeyZ",
  cancel: "KeyX",
  menu: "KeyX",
  right: "ArrowRight",
  left: "ArrowLeft",
  up: "ArrowUp",
  down: "ArrowDown",
  shift: "ShiftLeft"
}