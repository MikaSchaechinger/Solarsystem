class Body{
  
  constructor(posX, posY, vXStart, vYStart, mass){
    this.pos = createVector(posX, posY);
    this.v = createVector(vXStart, vYStart);
    this.a = createVector(0, 0);
    this.m = mass;
    this.r = Math.pow(this.m*3/(4*PI), 1/3)/2;
  }

  draw(){
    stroke(255);
    noFill();
    ellipse(this.pos.x, this.pos.y, this.r*2);

    //  a
    stroke(0, 255, 0);
    //line(this.pos.x, this.pos.y, this.pos.x + this.a.x, this.pos.y + this.a.y);
    //  v
    stroke(255, 0, 0);
    //line(this.pos.x, this.pos.y, this.pos.x + this.v.x*2, this.pos.y + this.v.y*2);
  }

  calcNewPos(dt){
    this.v.x += dt * this.a.x
    this.v.y += dt * this.a.y
    this.pos.x += dt * this.v.x;
    this.pos.y += dt * this.v.y;
  }

  checkBorder(){
    if(this.pos.x < 0){
      this.pos.x = 0;
      this.v.x *= -1;
    }
    if(this.pos.y < 0){
      this.pos.y = 0;
      this.v.y *= -1;
    }
    if(this.pos.x > width){
      this.pos.x = width;
      this.v.x *= -1;
    }
    if(this.pos.y > height){
      this.pos.y = height;
      this.v.y *= -1;
    }
  }
  

}