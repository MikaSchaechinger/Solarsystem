let time = 0;
let dt = 0.01;
let G = 1;
let bodyCount = 10;
let bodys = new Array();
let dempf = 1;
let v = 100;

let spur = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(2);
  for(let i = 0; i < bodyCount-1; i++){
    bodys[i] = new Body(random(0, width), random(0, height), random(-v, v), random(-v, v), random(100, 100000));
  }
  bodys[bodyCount-1] = new Body(random(0, width), random(0, height), random(-v, v), random(-v, v), 5000000);
  //bodys[0] = new Body(width/2, height / 2, 3, 0, 5000000);
  //bodys[1] = new Body(width/2, height / 2 + 200, 100, 0, 100 );
}

function draw() {
  background(100);
  
  update();
  checkBorder();

  for(let i = 0; i < bodyCount; i++){
    bodys[i].draw();
  }

  beginShape();
  noFill();
  stroke(255, 0, 0);
  for(let i = 0; i < spur.length; i++){
    vertex(spur[i].x, spur[i].y);
  }
  endShape();

  time += dt;
}

function update(){
  //  calculate Force
  for(let i = 0; i < bodyCount; i++){
    bodys[i].a.x = 0;
    bodys[i].a.y = 0;
  }
  for(let i = 0; i < bodyCount - 1; i++){
    for(let j = i+1; j < bodyCount; j++){
      let f = getForce(bodys[i], bodys[j]);
      
      bodys[i].a.x += f.x / bodys[i].m;
      bodys[i].a.y += f.y / bodys[i].m;
      bodys[j].a.x -= f.x / bodys[j].m;
      bodys[j].a.y -= f.y / bodys[j].m;
      
    }
  }

  //  calculate 
  for(let i = 0; i < bodyCount; i++){
    bodys[i].calcNewPos(dt);
  }

  
  spur.push(bodys[1].pos.copy());
}

function getForce(body1, body2){

  let direction = createVector((body2.pos.x - body1.pos.x), (body2.pos.y - body1.pos.y));

  let distance = direction.copy().mag();

  let directionNormal = direction.copy().normalize();

  stroke(0, 0, 255);
  //line(body1.pos.x, body1.pos.y, body1.pos.x + distance * directionNormal.x, body1.pos.y + distance * directionNormal.y);

// 

  let fges = G * body1.m * body2.m / (distance * distance);
  
  let force = directionNormal.copy();
  force.x *= fges;
  force.y *= fges;

  //line(body1.pos.x, body1.pos.y, body1.pos.x + force.x, body1.pos.y + force.y);
  
  stroke(0,0,255);
  //line(body1.pos.x, body1.pos.y, body1.pos.x + direction.x, body1.pos.y + direction.y);

  let n = direction;
  let vnx1 = n.x * (n.x * body1.v.x + n.y * body1.v.y) / (n.x * n.x + n.y * n.y);
  let vny1 = vnx1 * n.y / n.x;

  let vex1 = body1.v.x - vnx1;
  let vey1 = body1.v.y - vny1;

  let vnx2 = n.x * (n.x * body2.v.x + n.y * body2.v.y) / (n.x * n.x + n.y * n.y);
  let vny2 = vnx2 * n.y / n.x;

  let vex2 = body2.v.x - vnx2;
  let vey2 = body2.v.y - vny2;

  //  Bis hier stimmt alles

  let mges = body1.m + body2.m;

  let unx1 = (body1.m * vnx1 + body2.m * (2 * vnx2 - vnx1)) / mges;
  let uny1 = (body1.m * vny1 + body2.m * (2 * vny2 - vny1)) / mges;
  
  let unx2 = (body2.m * vnx2 + body1.m * (2 * vnx1 - vnx2)) / mges;
  let uny2 = (body2.m * vny2 + body1.m * (2 * vny1 - vny2)) / mges;
  stroke(255,0,255);
  //line(body1.pos.x, body1.pos.y, body1.pos.x + unx1, body1.pos.y + uny1);
  stroke(0,255,255);
  //line(body1.pos.x, body1.pos.y, body1.pos.x + vex1*2, body1.pos.y + vey1*2);


  if(distance <= body1.r + body2.r){ //  Kollision

    let a = (body1.r + body2.r - distance); //  Um diese Distanz müssen beide Körper auseinander

    body1.pos.x -= a * directionNormal.x/2;
    body1.pos.y -= a * directionNormal.y/2;
    body2.pos.x += a * directionNormal.x/2;
    body2.pos.y += a * directionNormal.y/2;
    
    //  https://www.physikerboard.de/topic,44001,-formeln-zum-zweidimensionalen-elastischen-sto%C3%9F.html
    
    //let tangente = directionNormal.copy().rotate(HALF_PI);
    //let faktor = tangente.x / tangente.y;

    //let s1 = (body1.v.x - body1.v.y * faktor) / (direction.x - direction.y*faktor);
    //let s2 = (body2.v.x - body2.v.y * faktor) / (direction.y*faktor - direction.x); //  direction ist für body 2 negativ

    //  vn und ve bestimmen  vn||n  ve|-n
    

    body1.v.x = unx1 * dempf + vex1;
    body1.v.y = uny1 * dempf + vey1;

    body2.v.x = unx2 * dempf + vex2;
    body2.v.y = uny2 * dempf + vey2;

    /*
    //  Hab vielleicht gegessen den eigenen n vektor noch abzuziehen?

    let tangente = directionNormal.copy().rotate(HALF_PI);
    
    //  Impulsübertragung bei zwei Kreisen
    //      Vx - Vy * (tx/ty)       V: geschwindigkeits Vektor
    //  s = -----------------       t: Tangential Vektor zu Oberfläche am Kollisionspunkt (nur Richtung ist wichtig)
    //      dx - dy * (tx/ty)       d: Richtung Mittelpunkt -> Kollisionspunkt
    //                              s: Faktor um den d Multipliziert werden muss
    
    let faktor = tangente.x / tangente.y;

    let s1 = (body1.v.x - body1.v.y * faktor) / (direction.x - direction.y*faktor);
    let s2 = (body2.v.x - body2.v.y * faktor) / (direction.y*faktor - direction.x); //  direction ist für body 2 negativ


    let kollGeschw1 = createVector(s1 * direction.x, s1 * direction.y);
    let kollGeschw2 = createVector(-s2 * direction.x, -s2 * direction.y);

    body1.v.x -= kollGeschw1.x * body2.m / body1.m * dempf;
    body1.v.y -= kollGeschw1.y * body2.m / body1.m * dempf;

    body2.v.x -= kollGeschw2.x * body1.m / body2.m * dempf;
    body2.v.y -= kollGeschw2.y * body1.m / body2.m * dempf;
    */
  }
  //force = createVector(0,0);
  return force;
}


function checkBorder(){
  for(let i = 0; i < bodyCount; i++){
    bodys[i].checkBorder();
  }
}
