/// <reference path=".config/sa.d.ts" />
const VK_INSERT = 0x2D;
var toggle = 0;
var library;

const PLAYER = new Player(0);
var PLAYER_CHAR = PLAYER.getChar();

if (!(library = DynamicLibrary.Load("samp.dll")))
    exit("samp.dll load failed");

var CYCLES_SINCE_LAST_TOGGLE = 0;
while (true) {
    if (Pad.IsKeyPressed(VK_INSERT) && CYCLES_SINCE_LAST_TOGGLE >= 10) {
        CYCLES_SINCE_LAST_TOGGLE = 0;
        toggle = toggle ^ 1;
        if (toggle == 1) {
            Text.PrintStringNow("Invulnerability ~g~ENABLED", 1000);
        } else {
            Text.PrintStringNow("Invulnerability ~r~DISABLED", 1000);
        }
    }

    if (toggle == 1) {
        // Invulnerability ENABLED
        PLAYER_CHAR.setDrownsInWater(true);
        PLAYER_CHAR.setProofs(true,true,true,true,true);//Char.SetProofs(self: Char, bulletProof: bool, fireProof: bool, explosionProof: bool, collisionProof: bool, meleeProof: bool)
    } else {
        // Invulnerability DISABLED
        PLAYER_CHAR.setProofs(false,false,false,false,false);
        PLAYER_CHAR.setDrownsInWater(false);
    }

    wait(10);
    CYCLES_SINCE_LAST_TOGGLE++;
}

