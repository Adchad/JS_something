
var great_div_DOM = document.querySelector('.greatdiv');

great_div_DOM.addEventListener('click',drawOnClick);


var xpadded,ypadded;
var map;
var paused = false;

const sizex = 35;
const sizey = 35;

const offsetx = 200;
const offsety = 200;

const speed = 500;

var drawing=false;
var current_shape;

var shapes ={
  "square":[
    [ 1 , 1 ],
    [ 1 , 1 ]
  ],

  "idk":[
    [ 0 , 1 , 1 , 0 ],
    [ 1 , 0 , 0 , 1 ],
    [ 1 , 0 , 0 , 1 ],
    [ 0 , 1 , 1 , 0 ]
  ],

  "stick":[
    [ 1 ],
    [ 1 ],
    [ 1 ] 
  ],

  "cross":[
    [ 0 , 1 , 0 ],
    [ 1 , 0 , 1 ],
    [ 0 , 1 , 0 ],
  ],

  "glider":[
    [ 0 , 1 , 0],
    [ 0 , 0 , 1],
    [ 1 , 1 , 1],
  ]

}


document.getElementById("btn-square").addEventListener('click', function() {
  drawing=true;
  current_shape="square";
});
document.getElementById("btn-cross").addEventListener('click', function() {
  drawing=true;
  current_shape="cross";
});

document.getElementById("btn-idk").addEventListener('click', function() {
  drawing=true;
  current_shape="idk";
});

document.getElementById("btn-glider").addEventListener('click', function() {
  drawing=true;
  current_shape="glider";
});

document.getElementById("btn-stick").addEventListener('click', function() {
  drawing=true;
  current_shape="stick";
});

document.getElementById("btn-pause").addEventListener('click', function() {
  paused=!paused;
  if(paused){
    document.getElementById("btn-pause").className = "btn-play";
  }else{
    document.getElementById("btn-pause").className = "btn-paused";
  }
});







class Point{

  constructor(x,y){
    this.x = x;
    this.y = y;
    this.state=false;
    this.color='black';
  }

  getCoordinates(){
    return [this.x,this.y];
  }

  setCoordinates(x,y){
    this.x = x;
    this.y = y;
  }

  getState(){
    return this.state;
  }
  draw(){

    if(this.state==true){
      xpadded = ("00" + this.x).slice (-3);
      ypadded = ("00" + this.y).slice (-3);
    
      document.querySelector("#indiv-"+ xpadded +"-"+ ypadded).style.backgroundColor = this.color;
    }
    else{
      xpadded = ("00" + this.x).slice (-3);
      ypadded = ("00" + this.y).slice (-3);
    
      document.querySelector("#indiv-"+ xpadded +"-"+ ypadded).style.backgroundColor = "white";
    }
  }

  setColor(color){
    this.color=color;
  }


  add(){
    this.state=true;
  }
  remove(){
    this.state=false;
  }




}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function init(){

  for (let x = 0; x < sizex; x++) {
      for (let y = 0; y < sizey; y++) {
          xpadded = ("00" + x).slice (-3);
          ypadded = ("00" + y).slice (-3);
          great_div_DOM.innerHTML += "<div class=\"insidediv\" id=\"indiv-"+ xpadded +"-"+ ypadded + "\"></div>\n";
          document.querySelector("#indiv-"+ xpadded +"-"+ ypadded).style.left = x*21 + offsetx + "px";
          document.querySelector("#indiv-"+ xpadded +"-"+ ypadded).style.top = y*21 + offsety + "px";

      }

    }
}


class Map {

  constructor(width,height){

    this.width=width;
    this.height=height;
    this.map=[];

    for(var i=0; i<this.height; ++i){
      this.map.push(new Array());
      for(var j=0; j<this.width; ++j){
        this.map[i].push(new Point(j,i));
      }

    }

  }

  draw(){
    for(var i=0; i<this.height; ++i){
      for(var j=0; j<this.width; ++j){

        this.map[i][j].draw();

      }
    }
  }

  getMap(){
    return this.map;
  }


  iteration(){
    var old_map=JSON.parse(JSON.stringify(this.map));

    for(var i=0; i<this.height; ++i){
      for(var j=0; j<this.width; ++j){

        var neighb = this.getNeighboursState(old_map,i,j);

        if(old_map[i][j].state){

          if(neighb==2 || neighb==3){this.map[i][j].add();}
          if(neighb<=1 || neighb==4){this.map[i][j].remove();}

        }else{

          if(neighb==3){this.map[i][j].add();}

        }
      }
    }
  }


  getNeighboursState(map,x,y){
    var counter=0;
    if(x>0){
      if(map[x-1][y].state) counter++;

      if(y>0){
        if(map[x-1][y-1].state) counter++;
      }

      if(y<sizey-1){
        if(map[x-1][y+1].state) counter++;
      }
    }
    if(x<sizex-1){
      if(map[x+1][y].state) counter++;
      
      if(y>0){
        if(map[x+1][y-1].state) counter++;
      }

      if(y<sizey-1){
        if(map[x+1][y+1].state) counter++;
      }

    }

    if(y>0){
      if(map[x][y-1].state) counter++;
    }

    if(y<sizey-1){
      if(map[x][y+1].state) counter++;
    }
    return counter;
  }


}




class Shape {
  constructor(map,shape, x, y){

    this.map=map;
    this.x=x;
    this.y=y;
    this.shape = shape; 
    this.shape_width = this.shape.length;
    this.shape_height = this.shape[0].length;

  }

  draw() {
    for(var i=0; i<this.shape_width; ++i){
      for(var j=0; j<this.shape_height; ++j){
        if(this.shape[i][j]===1){
          this.map[this.y+j][this.x+i].add();
        }
      }
    }
  }

}



function drawShape(shape_name,x,y) {
  var shape = new Shape(map.map, shapes[shape_name],x,y);
  shape.draw();
  
}


function drawOnClick(event){
  if(drawing){
    var targetId = event.target.id;
    var xa,ya;

    if(targetId.slice(0,5) === "indiv"){ 
      xa = targetId.slice(6,9) - 0;
      ya = targetId.slice(10,13) - 0;
      drawShape(current_shape, xa, ya);
    }
    drawing=false;
  }
}




map=new Map(sizex,sizey);



//MAIN

init();

//GAME LOOP
//


map.draw();

async function loop(timestamp) {
  await sleep(speed);

  if(paused==false){
    map.iteration();
    map.draw();
  }

  window.requestAnimationFrame(loop);
  
} 


window.requestAnimationFrame(loop)
