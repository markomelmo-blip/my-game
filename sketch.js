
let mainChar;
let chars = [];
let items = [];
let gameStarted = false;
let spawnedItems = 0;
const MAX_ITEMS = 30;
let clickedChars = new Set();
function setup() {
  createCanvas(800, 600);
  mainChar = new Character(width / 2, height / 2, true);
  for (let i = 0; i < 5; i++) {
    let angle = TWO_PI * i / 5;
    chars.push(new Character(width/2 + cos(angle)*200, height/2 + sin(angle)*200));
  }
}
function draw() {
  background(20);
  if(mainChar.hp <= 0){ drawCenterText("GAME OVER"); return; }
  if(spawnedItems >= MAX_ITEMS && chars.every(c=>c.hp>0)){ drawCenterText("YOU WIN 🎉"); return; }
  drawProgressText();
  mainChar.update(); mainChar.draw();
  chars = chars.filter(c=>c.hp>0); chars.forEach(c=>c.draw());
  if(gameStarted && spawnedItems < MAX_ITEMS && frameCount % int(random(20,60)) === 0 && chars.length){
    let target = random(chars); items.push(new Item(mainChar.pos.x, mainChar.pos.y, target)); spawnedItems++;
  }
  items.forEach(item=>{ item.update(); item.draw(); chars.forEach(c=>{ if(!item.dead && item.hits(c)){ c.hp = max(0, c.hp + (item.isFood?10:-10)); item.dead = true; } }); });
  items = items.filter(i=>!i.dead);
}
function mousePressed(){
  if(!gameStarted && dist(mouseX, mouseY, mainChar.pos.x, mainChar.pos.y)<30){ gameStarted=true; mainChar.jumpHint=false; return; }
  items.forEach(item=>{ if(item.isHovered()) item.isFood=true; });
  chars.forEach(c=>{ if(!clickedChars.has(c) && dist(mouseX, mouseY, c.pos.x, c.pos.y)<30){ let target=random(chars.filter(ch=>ch!==c)); if(target) items.push(new Item(c.pos.x,c.pos.y,target)); clickedChars.add(c); } });
}
function drawProgressText(){ let remaining = MAX_ITEMS - spawnedItems; textSize(20); textAlign(RIGHT,TOP); stroke(0); strokeWeight(2); fill(255); text(`${remaining}/${MAX_ITEMS}`, width-10,10); }
function drawCenterText(txt){ fill(255); textAlign(CENTER,CENTER); textSize(32); text(txt,width/2,height/2); }
class Character{ constructor(x,y,isMain=false){ this.basePos=createVector(x,y); this.pos=this.basePos.copy(); this.hp=100; this.isMain=isMain; this.jumpHint=isMain; this.jumpOffset=0; } update(){ if(this.jumpHint){ this.jumpOffset=sin(frameCount*0.15)*10; this.pos.y=this.basePos.y+this.jumpOffset; } } draw(){ fill(this.isMain?'cyan':'white'); ellipse(this.pos.x,this.pos.y,60); fill(0,255,0); rect(this.pos.x-30,this.pos.y-45,map(this.hp,0,100,0,60),5); } }
class Item{ constructor(x,y,target){ this.pos=createVector(x,y); this.vel=p5.Vector.sub(target.pos,this.pos).rotate(random(-0.1,0.1)).setMag(random(2,4)); this.isFood=false; this.dead=false; this.col=color(255,0,0); } update(){ this.pos.add(this.vel); this.checkBounds(); } draw(){ fill(this.isFood?'orange':this.col); ellipse(this.pos.x,this.pos.y,22); } hits(char){ return dist(this.pos.x,this.pos.y,char.pos.x,char.pos.y)<25; } isHovered(){ return dist(mouseX,mouseY,this.pos.x,this.pos.y)<12; } checkBounds(){ let hitWall=false; if(this.pos.x<0||this.pos.x>width){ this.vel.x*=-1; hitWall=true; } if(this.pos.y<0||this.pos.y>height){ this.vel.y*=-1; hitWall=true; } if(hitWall){ this.col=color(random(255),random(255),random(255)); mainChar.hp=max(0,mainChar.hp-5); } } }
