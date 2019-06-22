let framerate = 100;

let radius = 30;
let gravity = 0.1;
let num_obs = 6;  
let min_space = 2*radius; 
let obs_width = 20;
let bird_bounce = -4;
let bird_x = 25;

var bird;
var obs = []; //list of obstacles
var gameplay; 

/*A note about some functions: 
  update: update an object's fields
  show: shows the graphics.
  update and show are called by draw, which is called on every frame
*/
function Gameplay() {
  this.points = 0;
  
  this.update = function() {
    if (bird.alive){
      this.points += 0.1;
    }
  }
  this.show = function() {   
    textSize(width/20); //set it relative to the screensize
    fill(255); //it sets the default value before the call to text
    
    if (Math.floor(frameCount/framerate*3) % 2 == 1) {
      text("Bouncy Ball", 5, 20); //Gamename
    }
    text(Math.floor(this.points), width-50, 50); //show the points
    if (!bird.alive) {
      text("Game over!", width-140, 100); //shown after death
    }
    
    
  } 
} 


function Bird() {
    this.y = height/2;
    this.x = bird_x;
    this.velocity = 0;
    this.acceleration = 0.2;  //gravity
    this.alive = true;
  
    this.show = function() {
        ellipse(this.x, this.y, radius, radius);
    }
     
    this.update= function() {
        this.velocity += this.acceleration;
        this.y += this.velocity;
      
        if (this.y > height) {
          this.y = height;
          this.velocity = 0;  
        } 
      
        if (this.y < 0) {
          this.y = 0;
        }
      
        if (this.collide()) {
          this.alive = false;
        }     
     }
  
    this.collide = function() {
      for (var i=0; i<num_obs; i++) {
        // console.log(i);
        if ((obs[i].x < this.x) && (this.x < obs[i].x + obs_width) &&
          ((this.y < obs[i].top) || (this.y > height-obs[i].bottom+1))) {
          console.log("collide");
          return true;
        }
      }   
      return false;
    } 
}


//an obstacle includes the top bar and the bottom bar
//each obstacle includes an id. (1 through n) 
function Obstacle(id) {
  this.x = width/num_obs*id + width/3; //leave it with some space at start
  this.top = random(height*2/3);
  this.bottom = random(height - this.top - min_space); //note: bottom refers to the length of the bottom part, not the y-coordinate of the tip of the bottom part.
}

Obstacle.prototype.show = function() {
    rect(this.x, -1, obs_width, this.top);
    rect(this.x, height-this.bottom+1, obs_width, this.bottom);
}

Obstacle.prototype.update = function() {
    this.x -= 1;
    if (this.x < -obs_width) {
      this.reset();
    }
}


//reset when it goes out of bound. reset its top and bottom
Obstacle.prototype.reset = function() {
    this.x = width;
    this.y = random(height*2/3);
    this.bottom = random(height - this.top - min_space);
}


console.log("You will get better at the game as you play more");

//called at start
function setup() {
    frameRate(framerate);
    createCanvas(500,400);
    gameplay = new Gameplay();
    bird = new Bird();
    
    for (var i=0; i<num_obs; i++) {
      obs.push(new Obstacle(i));
    }
}

//called repeatedly
function draw() {
    background(70,70,70);
    bird.show();
    bird.update();
    for (var i=0; i<num_obs; i++) {
      obs[i].show();
      obs[i].update();
    }
    gameplay.show();
    gameplay.update();
}

//fire away when keypressed
function keyPressed() {
  if (key == ' ') {
    if (bird.alive) {
      bird.velocity = bird_bounce;
    }
  }
}
