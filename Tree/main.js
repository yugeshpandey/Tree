
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

var backgroundColor

function preload() 
{
	bgmSound = loadSound('assets/sounds/bgm.mp3');
	json = loadJSON('assets/poem_inputs.json');
	
}

function setup()
{	
	createCanvas(window.innerWidth, window.innerHeight);
		
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
	
	var n = noise(startTime/10000) - 0.5;
	
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
	
	stroke('rgb(153, 102, 51)');

	darkMode();

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

function darkMode() {
	background('rgb(0, 0, 0)');
}

function lightMode() {
	background('rgb(242, 249, 252)');
}

function writePoem(line, pine, nine, dine, sine) {
	
	line1 = createP(line);
	line1.style('font-size', '20px');
	line1.position(width/3, 10);
	line2 = createP(pine);
	line2.style('font-size', '20px');
	line2.position(width/3, 30);
	line3 = createP(nine);
	line3.style('font-size', '20px');
	line3.position(width/3 , 50);
	line4 = createP(dine);
	line4.style('font-size', '20px');
	line4.position(width/3 , 70);
	line5 = createP(sine);
	line5.style('font-size', '20px');
	line5.position(width/3 , 90);
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
		
		var flowerSize = (size / 100) * p * (1 / 6) * (len / level);

		strokeWeight(3);
		stroke('rgb(204, 204, 0)');
		rotate(-PI);
		for ( var i=0 ; i<=8 ; i++ )
		{
			line(0, 0, 0, flowerSize * (1 + 0.5 * rand2()));
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