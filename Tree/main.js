
var input_seed,
	size,
	maxLevel,
	rot,
	lenRan,
	branchProb,
	rotRand,
	leafProb;

var hide = false,
	prog = 1,
	growing = false,
	mutating = false,
	randSeed = 80,
	paramSeed = Math.floor(Math.random()*1000),
	randBias = 0;

var bgmSound

var grammar,
	lines, 
	json

var line1,
	line2, 
	line3
	
let buttonSeed
var darkModeButton
var isDarkMode = false
var isLightMode 
var darkModeActivated = false

var backgroundColor

let flies = [];
let numFireflies = 10;

let amt, startColor, newColor;
let grass;


function preload() 
{
	bgmSound = loadSound('assets/sounds/bgm.mp3');
	json = loadJSON('assets/poem_inputs.json');
	
}

function setup()
{	
	createCanvas(window.innerWidth, window.innerHeight);
	
	startColor = color(255, 255, 255);
	newColor = color(0, 0, 0);
	amt = 0;

	background(startColor);

	grass = new yard();

	setInputs();
	startGrow();
	mutateTime = millis();
	mutating = true;
	mutate();

	lines = ["click", "to", "generate", "a", "random poem"];

	if(!bgmSound.isLooping()){
		bgmSound.loop();
	}

	grammar = RiTa.grammar(json);
	
	div_inputs = createDiv('');
	div_inputs.style('visibility', 'initial');
	
	writePoem(lines[0], lines[1], lines[2], lines[3], lines[4]);
	
	isLightMode = true

	darkModeButton = createButton('Dark Mode');
	darkModeButton.position(10 ,10);
	darkModeButton.style('border', 'none');
	darkModeButton.mousePressed(function() {
		isDarkMode = true;
		darkModeActivated = true;
		isLightMode = false;
		darkModeButton.style('visibility', 'hidden');
		lightModeButton.style('visibility', 'initial');
	});

	lightModeButton = createButton('Light Mode');
	lightModeButton.position(10 ,10);
	lightModeButton.style('background-color', 'grey');
	lightModeButton.style('color', 'rgb(195, 240, 163)');
	lightModeButton.style('visibility', 'hidden');
	lightModeButton.mousePressed(function() {
		isDarkMode = false;
		isLightMode = true;
		darkModeButton.style('visibility', 'initial');
		lightModeButton.style('visibility', 'hidden');
	})

	for (let i = 0; i < numFireflies; i++){
		flies.push(new firefly());
	}

}

function setInputs()
{
	size = 150;
	maxLevel = 11;
	rot = (PI/2) / 4;
	lenRand = 1;
	branchProb = 0.9;
	rotRand = 0.1;
	leafProb = 0.5;
	
	if (!growing )
	{
		prog = maxLevel + 1;
		loop();
	}
}

function mutate()
{
	if ( !mutating )
		return;
	
	var startTime = millis();
	randomSeed(paramSeed);
	
	var n = noise(startTime/10000);
	
	randBias = 4 * Math.abs(n) * n;
	
	paramSeed = 1000 * random();
	randomSeed(randSeed);
	setInputs(true);
	
	var diff = millis() - startTime;
	
	if ( diff < 20 )
		setTimeout(mutate, 20 - diff);
	else
		setTimeout(mutate, 1);
}

function windowResized()
{
	resizeCanvas(windowWidth, windowHeight);
}

function draw()
{

	if(isLightMode == true && darkModeActivated == true) {
		background(fadeToWhite());
	} else if(isLightMode == true) {
		background('rgb(241, 249, 252)');
	}

	if(isDarkMode == true ) {
		background(fadeToBlack()); 
		
		for(let i =0; i < flies.length; i++){
			flies[i].update();
		}
	}
	
	//grass.update();

	stroke('rgb(153, 102, 51)');
	translate(width / 2, height);
	scale(1, -1);
			
	translate(0, 20);
	branch(1, randSeed);
	noLoop();

}

function mouseReleased() {
	let result = grammar.expand();
  	let haiku = result.split("%");
	hidePoem();

	writePoem(haiku[0], haiku[1], haiku[2], haiku[3], haiku[4]);
	
}

function fadeToBlack() {
	amt+= 0.2;
		if(amt >= 1) {
			amt = 0.0;
			startColor = newColor;
			newColor = color(0, 0, 0);
		} 

	return lerpColor(startColor, newColor, amt);	
}

function fadeToWhite() {
	amt+= 0.009;
		if(amt >= 1) {
			amt = 0.0;
			startColor = newColor;
			newColor = color(241, 249, 252);
		} 

	return lerpColor(startColor, newColor, amt);			
	//this.background('rgb(241, 249, 252)');
	
}

function writePoem(line, pine, nine, dine, sine) {

	line1 = createP(line);
	
	line1.position(width/2.5, 10);
	line1.style('font-size', '20px');
	line2 = createP(pine);
	line2.style('font-size', '20px');
	line2.position(width/2.5, 30);
	line3 = createP(nine);
	line3.style('font-size', '20px');
	line3.position(width/2.5, 50);
	line4 = createP(dine);
	line4.style('font-size', '20px');
	line4.position(width/2.5, 70);
	line5 = createP(sine);
	line5.style('font-size', '20px');
	line5.position(width/2.5, 90);

	if(isDarkMode == true) {
		line1.style('color', 'rgb(238, 240, 163)');
		line2.style('color', 'rgb(195, 240, 163)');
		line3.style('color', 'rgb(242, 215, 165)');
		line4.style('color', 'rgb(250, 207, 229)');
		line5.style('color', 'rgb(207, 250, 233)');
	}
	
}

function hidePoem(){
	line1.style('visibility', 'hidden');
	line2.style('visibility', 'hidden');
	line3.style('visibility', 'hidden');
	line4.style('visibility', 'hidden');
	line5.style('visibility', 'hidden');
}

function branch(level, seed)
{
	if ( prog < level )
		return;
	
	randomSeed(seed);
	
	var seed1 = random(1000),
		seed2 = random(1000);
		
	var growthLevel = (prog - level > 1) || (prog >= maxLevel + 1) ? 1 : (prog - level);
	
	strokeWeight(12 * Math.pow((maxLevel - level + 1) / maxLevel, 2));

	var len = growthLevel * size* (1 + rand2() * lenRand);
	
	line(0, 0, 0, len / level);
	translate(0, len / level);
	
	
	var doBranch1 = rand() < branchProb;
	var doBranch2 = rand() < branchProb;
	
	var doLeaves = rand() < leafProb;
	
	if ( level < maxLevel )
	{
		
		var r1 = rot * (1 + rrand() * rotRand);
		var r2 = -rot * (1 - rrand() * rotRand);
		
		if ( doBranch1 )
		{
			push();
			rotate(r1);
			branch(level + 1, seed1);
			pop();
		}
		if ( doBranch2 )
		{
			push();
			rotate(r2);
			branch(level + 1, seed2);
			pop();
		}
	}
	
	if ( (level >= maxLevel || (!doBranch1 && !doBranch2)) && doLeaves )
	{
		var p = Math.min(1, Math.max(0, prog - level));
		
		var leafSize = (size / 100) * p * (1 / 6) * (len / level);

		strokeWeight(3);
		stroke('rgb(204, 204, 0)');
		rotate(-PI);
		for ( var i=0 ; i<=8 ; i++ )
		{
			line(0, 0, 0, leafSize * (1 + 0.5 * rand2()));
			rotate(2 * PI/12);
		}
	}	
}

function startGrow()
{
	growing = true;
	prog = 1;
	grow();
}

function grow()
{
	if ( prog > (maxLevel + 3) )
	{
		prog = maxLevel + 3;
		loop();
		growing = false;
		return;
	}
	
	var startTime = millis();
	loop();
	var diff = millis() - startTime;

	prog += maxLevel / 8 * Math.max(diff, 20) / 1000;
	setTimeout(grow, Math.max(1, 20 - diff));
}

function rand()
{
	return random(1000) / 1000;
}

function rand2()
{
	return random(2000) / 1000 - 1;
}

function rrand()
{
	return rand2() + randBias;
}

function firefly() {
	this.x = 0;
	this.y = 0;

	this.xoff = random(100);
	this.yoff = random(100);

	this.wave = random(5);
	this.rate = random(0.05, 0.01);
	
	this.roff = random(12);
	this.toff = random(25);

	this.rise = 0; 

	this.update = function() {
		this.xoff += 0.0025;
		this.yoff += 0.0025;

		let w = width * 0.25;
		let h = height * 0.25;

		this.rise += 0.001;
		
		this.x = map( noise(this.xoff), 0, 1, -w, width+w );
		this.y = map( noise(this.yoff), 0, 1, -h, height+h);

		this.wave += this.rate;

		let flash = abs(sin(this.wave) * 255);

		let falpha = map(flash, 0, 255, 50, 155);

		stroke(flash * 0.5, flash * 0.5 - 30, 0, falpha);

		push();
		translate(this.x, this.y);
		this.toff += 0.01;
		let twing = map( noise(this.toff), 0, 1, -PI*0.5, PI*0.5 );
		rotate(twing);

		this.roff += 1;
		let r = map(sin(this.roff), -1, 1, -PI*0.25, PI*0.25);
		strokeWeight(2);
		let winglen = 12;

		push();
		stroke(255, 200, 0, 125);
		rotate(r);
		line(0, 0 , -winglen, 0);
		pop();

		push();
		stroke(255, 200, 0, 125);
		rotate(-r);
		line(0, 0 , winglen, 0);
		pop();

		let size = map(flash, 0, 255, 10, 25);

		strokeWeight(size);
		point(0, 0);
		strokeWeight(size * 0.25);
		stroke(255, 255, 0, 255);
		point(0, 0);
		 
		pop();
	}

}

function yard() {
	
	this.grass = [];
	this.roff = [];
	this.rwave = [];
	this.size = [];
	this.seg = [];
	this.index = 0;
	this.population = 250;

	for (let x = 0; x < width; x += width / this.population) {
			this.index += 1;
			this.grass.push(x);
			this.roff.push((this.index * 0.065) + 0.015);
			this.rwave.push(0);
			this.size.push(random(15, 30));
			this.seg.push(0.4);
	}

	this.update = function () {
		for (let i = 0; i < this.index; i++) {
			let len = this.size[i];
			push();
			translate(this.grass[i], height );
			this.blade(len, i*3);
			pop();
			}
	};

	this.blade = function (len, ind) {
		if (ind / 2 === int(ind / 2)) {
			this.roff[ind] += 0.0025;
			stroke(0, 255 - (len * 1.5), len * 1.5, 255);
			rot = map(noise(this.roff[ind]), 0, 1, -QUARTER_PI * 0.75, QUARTER_PI * 0.75);
		}

		if (ind / 2 != int(ind / 2)) {
			this.roff[ind] += 0.0025;
			stroke(255 - (len * 2.5), len * 2.5, 10, 255);
			rot = map(-sin(this.roff[ind]), -1, 1, -QUARTER_PI * 0.25, QUARTER_PI * 0.25);
		}

		strokeWeight(len * 2 * random(0.07, 0.11));
		rotate(rot);
		line(0, 0, 0, -len);
		translate(0, -len);
		if (len > 20) {
			this.blade(len * this.seg[ind], ind);
		}
	}


}