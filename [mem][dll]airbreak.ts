/// <reference path=".config/sa.d.ts" />
const VK_RSHIFT = 0xA1;
const VK_W = 0x57;
const VK_A = 0x41;
const VK_S = 0x53;
const VK_D = 0x44;
const VK_UP = 0xA0;
const VK_DN = 0xA2;
var toggle = 0;
var library;

var TOGGLE_INTERVAL_MIN = 100;
var TOGGLE_LAST_TIMESTAMP = 0;

var PRESSED_FORWARD = 0;
var PRESSED_BACKWARD = 0;
var PRESSED_LEFT = 0;
var PRESSED_RIGHT = 0;

var SPEED = 10;

var CYCLE_LENGTH = 1; //ms
var CYCLES_SINCE_LAST_TOGGLE = 0;


const PLAYER = new Player(0);
var PLAYER_CHAR = PLAYER.getChar();

PLAYER_CHAR.setDrownsInWater(false);

if (!(library = DynamicLibrary.Load("samp.dll")))
    exit("samp.dll load failed");

var pos, next_x, next_y, next_z;
var cam_pos, cam_point_pos, cam_vector;
var delta_x, delta_y, delta_z;
while (true) {
    if (Pad.IsKeyPressed(VK_RSHIFT) && CYCLES_SINCE_LAST_TOGGLE >= 10) {
        CYCLES_SINCE_LAST_TOGGLE = 0;
        toggle = toggle ^ 1;
        if (toggle == 1) {
            //PLAYER.getChar().freezePosition(true);
            PLAYER_CHAR.freezePositionAndDontLoadCollision(true);
            PLAYER_CHAR.setCollision(false);
            Text.PrintStringNow("Airbreak ~g~ENABLED", 1000);
        } else {
            //PLAYER.getChar().freezePosition(false);
            PLAYER_CHAR.freezePositionAndDontLoadCollision(false);
            PLAYER_CHAR.setCollision(true);
            Text.PrintStringNow("Airbreak ~r~DISABLED", 1000);
        }
    }
    if (toggle == 1) {
        pos = PLAYER_CHAR.getCoordinates();
        cam_pos = Camera.GetActiveCoordinates();
        cam_point_pos = Camera.GetActivePointAt();
        cam_vector = cam_point_pos; cam_vector.x -= cam_pos.x; cam_vector.y -= cam_pos.y; cam_vector.z -= cam_pos.z;
        //let project_east = cam_vector.x; // cosine with east vector
        //let project_north = cam_vector.y;
        //let project_up = cam_vector.z;
        // how much velocity in the x direction?
        // how much velocity east?
        // this is determined by the x vector and by A, D
        // how much velocity in the y direction?
        // how much velocity north?
        // this is determined by the y vector and by W, S
        // if we are looking north, then y=1
        // east, y = 0
        // etc
        delta_x = 0; delta_y = 0; delta_z = 0;
        if (Pad.IsKeyPressed(VK_UP))
            delta_z += SPEED;
        if (Pad.IsKeyPressed(VK_DN))
            delta_z -= SPEED;
        if (Pad.IsKeyPressed(VK_W)) {
            delta_x += SPEED*cam_vector.x;
            delta_y += SPEED*cam_vector.y;
        }
        if (Pad.IsKeyPressed(VK_S)) {
            delta_x -= SPEED*cam_vector.x;
            delta_y -= SPEED*cam_vector.y;
        }
        if (Pad.IsKeyPressed(VK_D)) {// (0,1) -> (1,0), (1,0)->(0,-1),(0,-1)->(-1,0)
            delta_x += SPEED*cam_vector.y;
            delta_y -= SPEED*cam_vector.x;
        }
        if (Pad.IsKeyPressed(VK_A)) {// (0,1) -> (-1,0), (-1,0)->(0,-1)
            delta_x -= SPEED*cam_vector.y;
            delta_y += SPEED*cam_vector.x;
        }
        PLAYER_CHAR.freezePositionAndDontLoadCollision(false);
        PLAYER_CHAR.setCollision(true);
        PLAYER_CHAR.setRotation(1,0,0);
        PLAYER_CHAR.setVelocity(delta_x,delta_y,delta_z);
        Text.PrintStringNow(`Going towards ${cam_vector.x}, ${cam_vector.y}, ${cam_vector.z}`,10);
    }
    wait(10);
    if (CYCLES_SINCE_LAST_TOGGLE < 100000) CYCLES_SINCE_LAST_TOGGLE++;
}

