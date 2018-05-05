//CHANGE IT LATER

// Main game engine file, will control game state, keys, enemy and player
// Ideia for later: Many loops do the same thing, could just use them at the same time
// Actually use unit testing

/*
	Little reminder:
	'=' is for receiving
	'==' kinda like
	'===' the exact same thing
*/

/*
	Making the screen onResize should help a little, look that up later
*/

var Testy = function() // Yes I made it really ugly to adjust difficulty.
{
    var problemGenerator = {};

    /*
     * Constructor function
     */
    problemGenerator.ProblemGeneratorView = function(difficulty)
    {
        var self = this;

        self.operators = ['+','-','*','/'];
        self.difficulty = difficulty;

        /*
         * Get a random digit 1-10
         */
        self.getDigit = function(min,max)
        {
            return (Math.floor((Math.random() * max) + min));
        };

        /*
         * get random operation +, -, *, /
         */
        self.getOperator = function(numberOfOperations)
        {
            return self.operators[Math.floor((Math.random() * numberOfOperations) + 0)];
        };

        /*
         * get the solution from the problem parameters
         */
        self.evaluateSolution = function(a, b, operator)
        {
            var solution = null;

            if (operator === "+") {
                solution = a + b;
            }
            if (operator === '-') {
                solution = a - b;
            }
            if (operator === '*') {
                solution = a * b;
            }
            if (operator === '/') {
                solution = a / b;
            }
            return solution;
        };

        /*
         * Validate the User's attempt
         */
        self.isAttemptCorrect = function(attempt, solution)
        {
            if (attempt === solution) {
                return true;
            } else {
                return false;
            }
        };

        /*
         * get problem array firstDigit, Operator, secondDigit, solution
         */
        self.setRandomProblem = function(difficulty)
        {
            var a = null;
            var b = null;
            var operator = null;
            var solution = null;

            if (difficulty == 1)
            {
                a = self.getDigit(1,20);
                b = self.getDigit(1,20);
                operator = self.getOperator(0); //sum
            }

            if (difficulty == 2)  //sum and negative
            {
                a = self.getDigit(1,40);
                b = self.getDigit(1,20);
                operator = self.getOperator(2);

                if (operator === "-")
                {
                    while (a < b)
                    {
                        a = self.getDigit(1,40);
                        b = self.getDigit(1,20);
                    }
                }
            }
            if (difficulty == 3)  //EVERYTHING
            {
                a = self.getDigit(1,100);
                b = self.getDigit(1,33);
                operator = self.getOperator(4);


                if (operator === "-")
                {
                    a = self.getDigit(1,100);
                    b = self.getDigit(1,33);
                    while (a < b)
                    {
                        a = self.getDigit(1,100);
                        b = self.getDigit(1,33);
                    }
                }

                if (operator === "*")
                {
                    while (a%b!=0)
                    {
                        a = self.getDigit(1,100);
                        b = self.getDigit(1,10);
                    }
                }

                if (operator === "/")
                {
                    while (a%b!=0)
                    {
                        a = self.getDigit(1,100);
                        b = self.getDigit(1,33);
                    }
                }
            }

            solution = self.evaluateSolution(a, b, operator);

            return [a, operator, b, solution];
        };

        return self;
    };

    return problemGenerator;
}

function SaveScore(gameMode, score)
{
    var URL = gameMode + "_mode";

    // game_mode and score are hardcoded for the sake of example
    var gameData =
    {
        "mode" : gameMode,
        "score" : score
    };

    $.post(URL, gameData, function(data,status)
    {
        // if (status==="success") { alert("your score of " + score + " was saved." } );
        // else { alert("Sorry but your score was not saved.\nStatus: " + status }
    });
};

/*function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}


function playSong(){
    var mySound;

    mySound = new sound("http://www.nonstick.com/wsounds/sndfx2.mp3");
    mySound.play();
}
*/
function Game()
{
    var problemGen = new Testy();

 	// Set the initial config.
	this.config = //controls the game settings
	{ //do not, and I really mean it, DO NOT FORGET A ENTER OR A COMMA HERE
        invaderInitialVelocity: 25,
        invaderAcceleration: 0,
        invaderDropDistance: 10,
        gameWidth: 400,
        gameHeight: 600,
        fps: 60,
        invaderRanks: 1, //rows
        invaderFiles: 1, //collumns
        endLineSpeed: 0,
        levelDifficultyMultiplier: 0.1,
        pauseToken: 1,
        aux: 1
	};

	var resultbox = document.getElementById("solutionInput");
    var temp_mode = document.getElementById("mode").outerText;
    this.mode = temp_mode.substr(0, temp_mode.indexOf(" ")).toLowerCase();

	// All state is in the variables below.
	this.lives = 1; //Amount of times player can be hit OR NOT CAUSE I KILL THE GAME WHEN SOMETHING HITS BOTTOM
	this.width = 0; //
	this.height = 0; //
	this.gameBound = {left: 0, top: 0, right: 0, bottom: 0};
	this.intervalId = 0;
    this.score = 0; //it will be 1 point per problem
    this.level = 1;


    if(this.mode === "rookie")
    {
        this.difficulty = 1;
    }
    else if(this.mode === "intermediate")
    {
        this.difficulty = 2;
    }
    else if(this.mode === "master")
    {
        this.difficulty = 3;
    }




    var prob = problemGen.ProblemGeneratorView().setRandomProblem(this.difficulty);

    this.firstNumber = prob[0];
    this.symbol = prob[1];
    this.secondNumber = prob[2];
    this.solution = prob[3];

    // Problem variables (test only as it stands)


    //problembox.value = "1 + 1"; //firstNumber + " " + symbol + " " + secondNumber;

	//  The state stack.
	this.stateStack = []; // Gamestates will go into this stack

	//  Input/output
	this.pressedKeys = {}; // Stack for the keys being pressed
	this.gameCanvas =  null; // Canvas to render the game
}

//  Initialises the Game with a canvas.
Game.prototype.initialise = function(gameCanvas)
{

    //  Set the game canvas.
    this.gameCanvas = gameCanvas; //stores the game in the canvas

    //  Set the game width and height.
    this.width = gameCanvas.width; // Set the game width
    this.height = gameCanvas.height; // Set the game height

    //  Set the state game bounds. As in the screen the game will actually happen.
    this.gameBounds = //Bounds are set using the gameCanvas width and height
    {
        left: gameCanvas.width / 2 - this.config.gameWidth / 2,
        right: gameCanvas.width / 2 + this.config.gameWidth / 2,
        top: gameCanvas.height / 2 - this.config.gameHeight / 2,
        bottom: gameCanvas.height / 2 + this.config.gameHeight / 2,
    };
};

//  Returns the current state.
Game.prototype.currentState = function()
{
	//Returns whatever is in the top of the stateStack, if there's nothing, returns a null
    return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null;
} //--------------------------------->SE ISSO AQUI FODER O ROLE JA SABE ONDE TA<-----------------------------------------------------------------------------------------

Game.prototype.moveToState = function(state) //Move function for anything that wants to move in-game
{ 	/* moveToState replaces the top of the state stack with a new state -
		and states can know when they're entering or leaving */

    //  Are we already in a state?
    if(this.currentState()) //Checks if game already has a state
    {

        //  Before we pop the current state, see if the
        //  state has a leave function. If it does we can call it.
        if(this.currentState().leave)  //check if the state object has a function called 'leave'
        {
           this.currentState().leave(game); // If it does, call it.
        }									// That is, state objects can choose to be notified if they're about to exit
        this.stateStack.pop(); //If in a state, pop it from the state stack.
    }

    //  If there's an enter function for the new state, call it.
    if(state.enter)
    {
        state.enter(game); //states can choose to be notified if they're about to be entered ~~OH MY~~
    }

    //  Set the current state.
    this.stateStack.push(state); //push new state onto the stack
};

Game.prototype.pushState = function(state)
{	/* same principals as the moveToState function*/

    //  If there's an enter function for the new state, call it.
    if(state.enter) //Uses the enter function if the state has it
    {
        state.enter(game); //Uses the enter function
    }
    //  Set the current state.
    this.stateStack.push(state); //pushes the state to the top of the stack
};

Game.prototype.popState = function()
{ /* same principals as the moveToState function*/

    //  Leave and pop the state.
    if(this.currentState())  // Chacks if the game already has a state
    {
        if(this.currentState().leave) //checks if the state object has a leave function
        {
            this.currentState().leave(game); // If it does, calls it
        }

        //  Set the current state.
        this.stateStack.pop(); //if the game ahs a state, popsit from the stack
    }
};

// THE MAIN GAME LOOP
function gameLoop(game)
{
    var currentState = game.currentState(); //First, get the current game state.
    if(currentState) //If it has a currentState
    {

        //  Delta t is the time to update/draw.
        var dt = 1 / game.config.fps; /*Now work out how much time is in one 'tick' of the loop.
        								ex. This is one over the FPS - if we loop ten times per second,
        								  each tick is 100 milliseconds.*/

        //  Get the drawing context.
        var ctx = game.gameCanvas.getContext("2d"); //http://www.w3schools.com/tags/ref_canvas.asp

        //  Update (as in call the function) if we have an update function.
        // Also draw if we have a draw function.
        if(currentState.update) //If there is a function called 'update' in the state
        {
            currentState.update(game, dt); //call it, passing the game object and the amount of time
            							//  that's passed.
        }
        if(currentState.draw) //If there's a function called 'draw' in the state,
        {
            currentState.draw(game, dt, ctx); //all it, passing the game object,
            							//the amount of time that's passed and the drawing context.
        }
    }
}

//  Start the Game.
Game.prototype.start = function()
{

    //  start the game by moving into a new instance of the 'WelcomeState' class
    this.moveToState(new WelcomeState()); // Move into the 'welcome' state.

    //  Set the game variables for a game start. No it's not redundant with the first time you set it on config
    this.lives = 5;
    //this.config.debugMode = /debug=true/.test(window.location.href); // Avoiding getting fucky

    //  Start the game loop.
    var game = this; //Gives the game this function to start the loop

    // Set a timer to call the gameLoop based on the FPS config setting
    this.intervalId = setInterval(function () { gameLoop(game);}, 1000 / this.config.fps);
 	/*'Slightly' harder than the background one*/
};

/* -----------------------------------------Welcome State------------------------------------------------ */

function WelcomeState()  // Creates a class for the state
{
 	//Won't have anything here, PROTOTYPE TIME~~
}


WelcomeState.prototype.draw = function(game, dt, ctx)  //receives the game state, the elapsed time and the drawing context
{

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

 	// Writes out "Hamath the Game"
 	// I have no ideia how to style/CSS, like, for reals
    ctx.font="30px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="center";
    ctx.textAlign="center";
    ctx.fillText("The Hamath Game ", game.width / 2, game.height/2 - 40);
    ctx.font="16px Arial";

    ctx.fillText("Press 'Enter' to start.", game.width / 2, game.height/2);
};

WelcomeState.prototype.keyDown = function(game, keyCode)
{
    if(keyCode == 13) //ENTER KEY CODE IS 13, SPACE IS 32
    {
        // Enter starts the game.
        game.moveToState(new LevelIntroState(game.level)); // if the keycode is ENTER, we move to the LevelIntroState.
    }
};

// Keep track of each key that is pressed in an object, so that if the user pressed multiple keys,
// states can look at the game.pressedKeys object and see what is pressed

//  Inform the game a key is pressed.
/* THIS IS MORE COMPLICATED THAN EVENT HANDLING IN JAVA*/
Game.prototype.keyDown = function(keyCode)
{
    this.pressedKeys[keyCode] = true;
    //  Delegate to the current state too.
    if(this.currentState() && this.currentState().keyDown)
    {
        this.currentState().keyDown(this, keyCode);
    }
};

//  Inform the game a key is released.
Game.prototype.keyUp = function(keyCode)
{
    delete this.pressedKeys[keyCode]; //The 'delete' keyword can be used to remove a property from an object
    //  Delegate to the current state too.
    if(this.currentState() && this.currentState().keyUp)
    {
        this.currentState().keyUp(this, keyCode);
    }
};

//-----------------------------------------------------------------------------------------------------------
/* The Game Over State - or the Willy state as I call it.*/

function GameOverState()
{

}

GameOverState.prototype.update = function(game, dt)
{

};

GameOverState.prototype.draw = function(game, dt, ctx)
{

    // Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);
    // Writes the stuff in the screen
    ctx.font="30px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="center";
    ctx.textAlign="center";
    ctx.fillText("Game Over!", game.width / 2, game.height/2 - 40);
    ctx.font="16px Arial";
    ctx.fillText("You got " + game.score + " correct answers and got to level " + game.level, game.width / 2, game.height/2);
    ctx.font="16px Arial";
    ctx.fillText("Press 'Enter' to save your score and restart.", game.width / 2, game.height/2 + 40);
};

GameOverState.prototype.keyDown = function(game, keyCode)
{
    if(keyCode == 13) /*space*/
    {
        // post score to server.
        SaveScore(game.mode, game.score);

        //  Enter restarts the game.
        game.lives = 1;
        game.score = 0;
        game.level = 1;
        game.config.invaderRanks = 1;
        game.moveToState(new LevelIntroState(1));
    }
};

/*  ---------------------------------------------------------------------------------------------------------
    Level Intro State

    The Level Intro state shows a 'Level X' message and a countdown for the level.
*/

function LevelIntroState(level)
{
    this.level = level; //Has a state of it's own. Gets the current level.
    this.countdownMessage = "3"; // IT'S THE FINAL COUNTDOOOOOOOWWWWWWNNNNNN
}

LevelIntroState.prototype.draw = function(game, dt, ctx) //needs game, time elapsed (delta), and context
{

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);
 	// Thank you based internet gods for provinding me with CSS, cause I know nothing of it.
    ctx.font="36px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="middle";
    ctx.textAlign="center";
    ctx.fillText("Level " + this.level, game.width / 2, game.height/2);
    ctx.font="24px Arial";
    ctx.fillText("Ready in " + this.countdownMessage, game.width / 2, game.height/2 + 36);
    // Shows a message saying 'Ready in X' with X being the countdown message

};

/*
Update is called in the loop like Draw, but it doesn't draw anything - it updates the state of the game.
We could do this in draw, but draw should just faithfully render the current state untouched.
Why? Well we could actually call draw and update at different frequencies
- for example if drawing is expensive we can call it ten times less often than update -
but still have the state of the system be updated at more regular intervals.
*/

LevelIntroState.prototype.update = function(game, dt)  //Updates the game state NOT the canvas drawing
{

    //  Update the countdown.
    if(this.countdown === undefined) //Why is this 3 equals? Dunno, gets all fucky with only two
    {								//If we don't have a countdown number, set it to three (seconds)
        this.countdown = 3; // countdown from 3 secs
    }
    this.countdown -= dt; //Now remove the time that's passed (dt is in seconds).

    if(this.countdown < 2) //Every time the countdown number gets below 2
    {
        this.countdownMessage = "2"; // update the countdown message
    }
    if(this.countdown < 1) //Every time the countdown number gets below 1
    {
        this.countdownMessage = "1"; // update the countdown message

    }
    if(this.countdown <= 0) //When it gets to zero (or less, but if it's less, we done fucked up somewhere)
    {
        //  Move to the next level, popping this state.
        //(Play State - the actual game, passing the level we've been told we're counting down for)
        game.moveToState(new PlayState(game.config, this.level));
    }

};

/* ---------------------------------------------------------------------------------*/
/* SHIT IS ABOUT TO GET REAL, HERE IS THE ~MAIN~ PART OF THE GAME - The Play State */

//  Create a PlayState with the game config and the level you are on.
function PlayState(config, level)
{
    this.config = config;
    this.level = level;

    //  Game state.
    this.invaderCurrentVelocity =  10; //enemy speed, will grow with level
    this.invaderCurrentDropDistance =  0; // how far they've moved downwards when they hit the edge of the screen
    this.enemyAreDropping =  false; //a flag for whether they're dropping

    //  Game entities.
    this.endLine = null; //create a LIMIT LINE
    this.enemy = []; //create a set of the enemy
}

/*
  The endLine has a position and that's about it. Used for colision detecting. Will trade for the planet later.
*/
function endLine(x, y) //x and y are the position it's going to
{
    this.x = x; //gives the endLine the x position that came in the parameters
    this.y = y; //gives the endLine the y position that came in the parameters
    this.width = 500; //width of the endLine (should find a way to scale it with the canvas size)
    this.height = 10; //height of the endLine (should find a way to scale it with the canvas size)
}


/*
    enemy have position, type, rank/file and that's about it.
*/

function Invader(x, y, rank, file, type)
{
    //this.x = x; // The x position
    this.x = Math.floor((Math.random() * 400) + 200); // The x position (remember the size of the bounds was not it fully)
    this.y = y; // The y position
    this.rank = rank; // Row position on the grid
    this.file = file; // Collum position on the grid
    this.type = type; //Enemy type (MIGHT USE IT LATER)
    this.width = 18; //Enemy width size (should find a way to scale it with the canvas size)
    this.height = 14; //Enemy height size (should find a way to scale it with the canvas size)
}

PlayState.prototype.enter = function(game) // Enter State, this is called when we start each level
{

    // Create the endLine at the bottom middle of the game bounds
    this.endLine = new endLine(game.width / 2, game.gameBounds.bottom);

    // Set the endLine speed for this level, as well as invader params.
    // Makes sure things like the enemy speed gets a bit faster each level.
	var levelMultiplier = this.level * this.config.levelDifficultyMultiplier;
	this.invaderInitialVelocity = this.config.invaderInitialVelocity + (levelMultiplier * this.config.invaderInitialVelocity); //Enemy speed grows every level

	//  Create the enemy.
    var ranks = this.config.invaderRanks; //Rank of the invader (row)
    var files = this.config.invaderFiles; //File of the invader (column)
    var enemy = []; // Stack of the enemy
    for(var rank = 0; rank < ranks; rank++) //This controls the distance between enemies. Might be the final part becomes useless since now they don't come in bacthes.
    {
        for(var file = 0; file < files; file++)
        {
            enemy.push(new Invader(
                (game.width / 2) + ((files/2 - file) * 200 / files),
                (game.gameBounds.top + rank * 20),
                rank, file, 'Invader'));
        }
    }
    this.enemy = enemy;
    // Speed controllers for the enemy
    this.invaderCurrentVelocity = this.invaderInitialVelocity;
    this.invaderVelocity = {x: -this.invaderInitialVelocity, y:0};
    // NextVelocity - we use that when we move them downwards
    //and need to decide where to move them afterwards
    this.invaderNextVelocity = null; //
};

 PlayState.prototype.update = function(game, dt)
 {

    /*  Will 'fire' the attack on the enemy when enter is hit */
    if(game.pressedKeys[13])
    {
    	//This kind of got changed by the 'bang' interaction
    }

    /*  Keep the endLine in bounds. ANTI-FUCKY CODE RIGHT HERE BRUH*/
    if(this.endLine.x < game.gameBounds.left)
    {
        this.endLine.x = game.gameBounds.left;
    }
    if(this.endLine.x > game.gameBounds.right)
    {
        this.endLine.x = game.gameBounds.right;
    }


    //  Move the enemy
    var hitLeft = false, hitRight = false, hitBottom = false; // Used for checking bounds collision
    for(i=0; i<this.enemy.length; i++) // Let's go trough all the enemy alive here
    {
        var invader = this.enemy[i]; // Selects a particular enemy

        var newx = (invader.x + this.invaderVelocity.x * dt); //Get's the future x position by the current x position + x velocity * delta (time)

        var newy = invader.y + 1//+ this.invaderVelocity.y * dt; //Get's the future y position by the current y position + y velocity * delta (time)
        //var newx = Math.floor((Math.random() * 800) + 1); //TELEPORT THEM



        if(hitLeft === false && newx < game.gameBounds.left) //checking to see if we've hit the left bound
        {
            hitLeft = true; // It did
        }
        else if(hitRight === false && newx > game.gameBounds.right) //checking to see if we've hit the right bound
        {
            hitRight = true; // It did
        }
        else if(hitBottom === false && newy > game.gameBounds.bottom) //checking to see if we've hit the bottom bound
        {
            hitBottom = true; // It did
        }

        if(!hitLeft && !hitRight && !hitBottom) // If the enemy didn't hit any bounds
        {
            invader.x = newx; // Now actually moves the enemy to the calculated x position
            invader.y = newy; // Now actually moves the enemy to the calculated y position
        }
    }

    //  Update invader velocities.
    if(this.enemyAreDropping) // If the enemy are actually moving (Uses the Flag setup in PlayState config)
    {
        this.invaderCurrentDropDistance += this.invaderVelocity.y * dt;

        if(this.invaderCurrentDropDistance >= this.config.invaderDropDistance)
        {
            // Speed goes up as the distance grows closer, increasing panic levels for dem kidz
            this.enemyAreDropping = false;
            this.invaderVelocity = this.invaderNextVelocity;
            this.invaderCurrentDropDistance = 0;
        }
    }
    //  If we've hit the left, move down then right.
    if(hitLeft)
    {
        this.invaderCurrentVelocity += this.config.invaderAcceleration; // Gets the current velocity for the enemy
        this.invaderVelocity = {x: 0, y:this.invaderCurrentVelocity }; // Stops horizontal movement, starts vertical movement
        this.enemyAreDropping = true; // Sets the flag so we know the enemy are moving
        this.invaderNextVelocity = {x: this.invaderCurrentVelocity , y:0}; // Stops vertical movement, re-starts horizontal movement on the oposite direction
    }
    //  If we've hit the right, move down then left.
    if(hitRight)
    {
        this.invaderCurrentVelocity += this.config.invaderAcceleration; // Gets the current velocity for the enemy
        this.invaderVelocity = {x: 0, y:this.invaderCurrentVelocity }; // Stops horizontal movement, starts vertical movement
        this.enemyAreDropping = true; // Sets the flag so we know the enemy are moving
        this.invaderNextVelocity = {x: -this.invaderCurrentVelocity , y:0}; // Stops vertical movement, re-starts horizontal movement on the oposite direction
    }
    //  If we've hit the bottom, loses one life.
    if(hitBottom)
    {
        this.lives -= 1;
        //playSong();
    }



    //  Check for right answers. This really needs ajusting.
    // var resultbox = document.getElementById("solutionInput");

    for(i=0; i<this.enemy.length; i++) // Goes trough every enemy
			{
		        var invader = this.enemy[i]; // Uses the particular enemy for checking based on i
		        var bang = false; //BEST VARIABLE NAME EVER OR WHAT?
		        var redo = false; //for making another problem

		        if(game.pressedKeys[13]) //THIS WILL BE THE TEST FOR RESULTS AND STUFF.I THINK. NEVERMIND, IT IS ACTUALLY USEFUL.
		        {

                    //game.solution = game.result;
		        	response =  document.getElementById("solutionInput").value;  //by id

		        	if( response == game.solution)
		        	{

		        	bang = true; //bang is when the answer is correct
		            game.score += 1; //adds points when enemy is unalived

                    problemGen = new Testy();

                    var proby = problemGen.ProblemGeneratorView().setRandomProblem(game.difficulty);

                    game.firstNumber = proby[0];
                    game.symbol = proby[1];
                    game.secondNumber = proby[2];
                    game.solution = proby[3];

		            //break;
		        	}
		        	document.getElementById("solutionInput").value = "";
		        }

		        if(bang)
		        {
		            this.enemy.splice(i--, 1); //removes the enemy from the stack
                    if(this.config.invaderRanks < this.level + 1)
                    {
                        this.config.invaderRanks++;
                    }
		            //break;
		        }
		        //break;
		    }

  //-----------------------------------------Effects only-----------------------------------------------
    //  Find all of the front rank enemy.
    var frontRankenemy = {};
    for(var i=0; i<this.enemy.length; i++)
    {
        var invader = this.enemy[i];
        //  If we have no invader for game file, or the invader
        //  for game file is futher behind, set the front
        //  rank invader to game one.
        if(!frontRankenemy[invader.file] || frontRankenemy[invader.file].rank < invader.rank)
        {
            frontRankenemy[invader.file] = invader;
        }
    }

  //------------------------------------------------END------------------------------------------------

 //  Check for invader/endLine collisions.
    for(var i=0; i<this.enemy.length; i++)
    {
        var invader = this.enemy[i]; //Test per enemy

        // Since we are drawing on canvas with simple shapes, we are only using their bounds to see hit
        // Might be changeable to just reaching bottom and does damage, test later
        // This is a big but simple if clause.

        if((invader.x + invader.width/2) > (this.endLine.x - this.endLine.width/2) &&
            (invader.x - invader.width/2) < (this.endLine.x + this.endLine.width/2) &&
            (invader.y + invader.height/2) > (this.endLine.y - this.endLine.height/2) &&
            (invader.y - invader.height/2) < (this.endLine.y + this.endLine.height/2))
        {
            // Loses a life per colision (as in, enemy endLine reached bottom)
            game.lives = 0;
            //game.sound.playSong('sounds.mp3'); //sounds make it fucky
        }
    }

    //  Check for failure
    if(game.lives <= 0) //If you have no lifes left, you ded
    {
        game.moveToState(new GameOverState());
    }

    //  Check for victory
    if(this.enemy.length === 0)  //Is our game infinite? Maybe, if I feel like it.
    {
        game.level += 1; // Moves to next level
        game.moveToState(new LevelIntroState(game.level)); //TO THE NEXT ONE, TILL THE END OF TIME...or lifes...
    }
};

 PlayState.prototype.fireAttack = function()
 {
    /* MIGHT BE USABLE IF I CAN MAKE A HOMING ANIMATION IN CASE OF RIGHT ANSWER

    */
};


PlayState.prototype.draw = function(game, dt, ctx)
{
	// Just looping through the game entities and drawing primitives
	// Still looking for a way to chage them to either images or just numbers in the equasion
	// Or going with the ideia of having the problem on the left and the answer box on the right

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    var img = new Image();
    var imlocation = "https://github.com/TheBigTeam/hamath-workspace/blob/master/hamath-src/static/static/images/enemies/";
 var currentdate = 0;
 var image_number = 0;
 function ImageArray (n) {
   this.length = n;
   for (var i =1; i <= n; i++) {
     this[i] = ' '
   }
 }
 image = new ImageArray(12)
 image[1]="1b.png?raw=true"
 image[2]="1p.png?raw=true"
 image[3]="1r.png?raw=true"
 image[4]="1y.png?raw=true"
 image[5]="2b.png?raw=true"
 image[6]="2p.png?raw=true"
 image[7]="2r.png?raw=true"
 image[8]="2y.png?raw=true"
 image[9]="3b.png?raw=true"
 image[10]="3p.png?raw=true"
 image[11]="3r.png?raw=true"
 image[12]="3y.png?raw=true"
 var rand = 60/image.length
 function randomimage() {
 	currentdate = new Date()
 	image_number = currentdate.getSeconds()
 	image_number = Math.floor(image_number/rand)
 	return(image[image_number])
 }


 //get the image from this URL

  img.src = imlocation + randomimage();

    //  Draw endLine.
    // Let's change it to an actual image later ok?
    ctx.fillStyle = '#999999';
    ctx.fillRect(this.endLine.x - (this.endLine.width / 2), this.endLine.y - (this.endLine.height / 2), this.endLine.width, 0);

    //  Draw our pesky little enmies.
    ctx.fillStyle = '#006600';
    for(var i=0; i<this.enemy.length; i++)
        {
        var enemy = this.enemy[i];
        img.onload = function ()
        {
            ctx.drawImage(img, enemy.x - enemy.width/2, enemy.y - enemy.height/2);
        }

    //Draw the problem.
    ctx.font="36px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="middle";
    ctx.textAlign="right";
    ctx.fillText("Opponent: " + game.firstNumber + game.symbol + game.secondNumber + " =", game.width / 2 + 20, 400);
    ctx.font="24px Arial";
};


PlayState.prototype.keyDown = function(game, keyCode) //Makes it that the playstate receives the key pressed and calls the pause state by pushing it to the game stack. MIGHT BE USABLE TO SEND RESULTS (with fiddling)
{

    if(keyCode == 80)
    {
        //  Push the pause state.
        game.pushState(new PauseState());
    }
};

// Game over state incoming.
// Need HTML textboxes cause I can't think of another solution...

function PauseState()
{
	// "It's not an online real time game, so it actually pauses, Mom"
}

PauseState.prototype.keyDown = function(game, keyCode)
{

    if(keyCode == 80) // Key code for p
    {
        //  Pop the pause state.
        game.popState();
    }
};

PauseState.prototype.draw = function(game, dt, ctx)
{

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font="14px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="middle";
    ctx.textAlign="center";
    ctx.fillText("Paused", game.width / 2, game.height/2);
    return;
};
};
