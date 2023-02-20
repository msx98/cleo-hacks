/// <reference path=".config/sa.d.ts" />
const VK_RSHIFT = 0xA1;
const VK_W = 0x57;
const VK_A = 0x41;
const VK_S = 0x53;
const VK_D = 0x44;
const VK_UP = 0xA0;
const VK_DN = 0xA2;
const VK_SPACE = 0x20;
var toggle = 0;
var library;


var SPEED_ARRAY = [0.5,5,50];
var SPEED_IDX = 0;
var SPEED = SPEED_ARRAY[SPEED_IDX];
function next_speed() {
    SPEED_IDX = (SPEED_IDX+1)%(SPEED_ARRAY.length);
    SPEED = SPEED_ARRAY[SPEED_IDX];
    Text.PrintStringNow(`Airbreak SPEED: ${SPEED}`, 500);
}


var TOGGLE_INTERVAL_MIN = 100;

var CYCLES_SINCE_LAST_TOGGLE = 0;
var CYCLES_SINCE_LAST_SPEED_CHANGE = 0;


const PLAYER = new Player(0);
var PLAYER_CHAR = PLAYER.getChar();

function freeze(value) {
    if (value == true) {
        PLAYER_CHAR.freezePositionAndDontLoadCollision(true);
        PLAYER_CHAR.freezePosition(true);
        PLAYER_CHAR.setCollision(false);
    } else {
        PLAYER_CHAR.freezePositionAndDontLoadCollision(false);
        PLAYER_CHAR.freezePosition(false);
        PLAYER_CHAR.setCollision(true);
    }

}

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
            freeze(true);
            Text.PrintStringNow("Airbreak ~g~ENABLED", 1000);
        } else {
            freeze(false);
            Text.PrintStringNow("Airbreak ~r~DISABLED", 1000);
        }
    }
    if (toggle == 1) {
        if (Pad.IsKeyPressed(VK_SPACE) && CYCLES_SINCE_LAST_SPEED_CHANGE >= 10) {
            CYCLES_SINCE_LAST_SPEED_CHANGE = 0;
            next_speed();
        }
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
        //PLAYER_CHAR.setRotation(cam_vector.x, cam_vector.y, cam_vector.z);
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
        if ((delta_x != 0) || (delta_y != 0) || (delta_z != 0)) {
            freeze(false);
            //Text.PrintStringNow(`Moving with delta_z=${delta_z}, pos.z=${pos.z}`,10);
            PLAYER_CHAR.setCoordinates(pos.x+delta_x, pos.y+delta_y, pos.z+delta_z-1);
            //PLAYER_CHAR.setCoordinates(pos.x, pos.y, pos.z);
            freeze(true);
        }
    }
    wait(10);
    if (CYCLES_SINCE_LAST_TOGGLE < 100000) CYCLES_SINCE_LAST_TOGGLE++;
    if (CYCLES_SINCE_LAST_SPEED_CHANGE < 100000) CYCLES_SINCE_LAST_SPEED_CHANGE++;
}

