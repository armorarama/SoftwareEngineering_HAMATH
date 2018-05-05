/**
* Author - Dave Kerr
* https://github.com/dwmkerr/spaceinvaders
*/


//  Define the starfield "class" (There are no classes in JS, this is a function that gets to act like an object.



/* Does:
Store the div
Store useful properties, the width and height
Listen for the window resize, when it does, update the width and height and redraw
Create a canvas to draw on, and make it a child of the container div.
*/

function Starfield() //You can add properties here in the constructor or as you go in JS
{
    this.fps = 30; //Used for the setInterval /* We consoles now */
    this.canvas = null; //Starts a canvas
    this.width = 0; //Initial positioning
    this.height = 0; //Initial positioning
    this.minVelocity = 15; //Stars Velocity
    this.maxVelocity = 30; //Stars Velocity
    this.stars = 100; //Stars in the screen
    this.intervalId = 0; //id returned by 'setInterval' - we can use this to stop it later
} 

//  The initialise function initialises a starfield object so that
//  it's ready to be started. We must provide a container div, that's
//  where the starfield will live in.
Starfield.prototype.initialise = function(div) //Adding a function to the starfield prototype, this means each starfield will be able to use it
{
	var self = this; //Stores a copy of the 'this' variable in a local variable.

	//  Store the div.
	/* In JS we can create properties as we need them */
	this.containerDiv = div; //Stores a reference to the div we've been provided
	//Stores the client area of the browser window. 
	/* The 'window' object is provided by the browser, it lets you do lots of things with the browser. */
	self.width = window.innerWidth;
	self.height = window.innerHeight; 

	/* Could use onresize too, but it replaces anything that was there before, while addEventListener doesn't */
	window.addEventListener('resize', function resize(event) //Update our width and height, update the canvas width and height and call the 'draw' function
	{
	// Use self here, because when running the 'this' will be the window not the function
	/* So to edit the starfield instance, we use the 'self' variable declared earlier, which is a reference to the starfield. */
	/* This allow us to access state from another context (things created outside the function)*/
    self.width = window.innerWidth;
    self.height = window.innerHeight;
    self.canvas.width = self.width;
    self.canvas.height = self.height;
    self.draw(); 
	} );  

	// Creates the canvas. We use the 'document' (DOM) object to create a new HTML element. 
	/*  'DOM' (the document object model) is the actually tree structure of the HTML page - the nodes, elements, attributes and so on. */
    var canvas = document.createElement('canvas');
    div.appendChild(canvas);
    this.canvas = canvas;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    
	//	Start the timer.
	this.intervalId = setInterval(function()  // This function sets a callback that will be called every time an interval elapses
	{
		self.update(); 		// To update the screen
	    self.draw();		// To redraw the canvas
	}, 1000 / this.fps); 	// Speed of the interval to hit the function, set by the constructor
	// use the 'self' closure to make sure we're calling them on the starfield object! 

}; 

Starfield.prototype.start = function() 
{
    // Create the stars.
    var stars = []; // Creates an array for storing stars /*The only good thing in this language, NO NEED TO SET VECTOR SIZE, YOU HEAR THAT JAVA*/
    for(var i=0; i<this.stars; i++) // Loops over the number of stars (which we set in the constructor) and create a Star in the array each time
    {
    	//Creates the stars in different positions in the screen and different velocities (thank you Math.random)
        stars[i] = new Star(Math.random()*this.width, Math.random()*this.height, Math.random()*3+1, (Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
	}
    this.stars = stars; // This instance of stars receives number of stars from the constructor
}

Starfield.prototype.stop = function() //Stop function
{
	clearInterval(this.intervalId);
};

Starfield.prototype.update = function() //Updates the state of the Starfield
{
    var /*delta t*/dt= 1 / this.fps; //how much time has passed
    for(var i=0; i<this.stars.length; i++) //go through each star, and update its position based on its velocity and the time that has passed
    {
        var star = this.stars[i];
        star.y += dt * star.velocity;
        if(star.y > this.height) //  If the star has reached from the bottom of the screen, re-spawn it at the top.
        {
            this.stars[i] = new Star(Math.random()*this.width, 0, Math.random()*3+1, (Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity); //Same thing as before
        }
    }
};

Starfield.prototype.draw = function() 
{
    /* Canvas is an object that you can use to do bitmap-based drawing in JavaScript -- http://www.w3schools.com/tags/ref_canvas.asp for references */
    
    //  Get the drawing context.
    var ctx = this.canvas.getContext("2d");
 
    // Draw the background.
    ctx.fillStyle = '#000000'; //fill the background with black
    ctx.fillStyle = 'ffffff'//'#000000'; //fill the background with black
    
    ctx.fillRect(0, 0, this.width, this.height); //set the fill color to white
 
    //  Draw stars.
    ctx.fillStyle = '#ffffff';
    for(var i=0; i<this.stars.length;i++) //draw a rectangle for each star
    {
        var star = this.stars[i];
        ctx.fillRect(star.x, star.y, star.size, star.size);
    }
};  
    
function Star(x, y, size, velocity) // Isn't it weird that functions are used like classes?
{
	//All these atributes will be randomized in the start function
    this.x = x; // x position for this instance of a star
    this.y = y; // y position for this instance of a star
    this.size = size; // Size for this instance of a star
    this.velocity = velocity; // Velocity for this instance of a star
} 