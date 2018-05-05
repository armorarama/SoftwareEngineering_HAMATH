/**
* Author - Dave Kerr
* https://github.com/dwmkerr/spaceinvaders
*/

/* And this is where we'll put our JS. */
//  Create the starfield.
var container = document.getElementById('BG');
var starfield = new Starfield();
starfield.initialise(container);
starfield.start(); 

//  Setup the canvas.
var canvas = document.getElementById("gameCanvas");
canvas.width = 800;
canvas.height = 600;
 
/*  create the Game object, initialise it with a canvas, 
start the game and tell it when keys are pressed. */

//  Create the game.
var game = new Game();
 
//  Initialise it with the game canvas.
game.initialise(canvas);
 
//  Start the game.
game.start();
 
//  Listen for keyboard events (key pressed and key released).
/* All honesty, I have almost no clue what's going on down here */
window.addEventListener("keydown", function keydown(e) 
{
    var keycode = e.which || window.event.keycode;
    //  Supress further processing of left/right/space/enter (37/39/32/13)
    if(keycode == 37 || keycode == 39 || keycode == 32 || keycode == 13) 
    {
        e.preventDefault(); //don't let the window process space, left or right otherwise it tries to move the viewport around
    }
    game.keyDown(keycode);
});
window.addEventListener("keyup", function keydown(e) 
{
    var keycode = e.which || window.event.keycode;
    game.keyUp(keycode);
}); 