var canvas
var gl
var frameId
function InitializeGL(cnv){
    canvas = cnv
    prepareCanvas()
    gl = canvas.getContext("2d")

    if (!gl){
        alert("Failed initializing 2D")
    }

    startGame()

}

class Collision {
    radius
    gameObject
    constructor(radius, gameObject) {
        this.radius = radius
        this.gameObject = gameObject
    }

    collide(gameObject){
        return Math.sqrt((this.gameObject.position.x+gameObject.position.x)^2+(this.gameObject.position.y-gameObject.position.y)^2) > this.radius+gameObject.collision.radius;
    }
}

class Vector2 {
    x
    y

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Vector3 extends Vector2{
    z

    constructor(x, y, z) {
        super(x, y);
        this.z = z
    }
}

class GameObject{
    position
    collision
    constructor() {

    }

    setCollision(collision){
        this.collision = collision
    }

    render(){

    }
}

class Game {
    gl
    currentLevel

    constructor(gl) {
        this.gl = gl
    }

    navigate(level){
        this.currentLevel = level
        //level.render()
    }

    render (){
        this.currentLevel.render()
    }


}

class Bullet extends GameObject {

}

class Gun {

}

class Subject extends GameObject {
    defaultSpeed
    movementVector
    constructor(defaultSpeed) {
        super();
        this.defaultSpeed = defaultSpeed
    }

    render() {
        this.move()
        super.render();

    }

    setMovement(movementVector){
        this.movementVector = movementVector
    }

    move(){
        console.log(this.position)
        this.position.x += this.movementVector.x * this.movementVector.z * this.defaultSpeed;
        this.position.y += this.movementVector.y * this.movementVector.z * this.defaultSpeed;
    }
}

class Enemy extends Subject {
    constructor() {
        super();
    }
}

class Player extends Subject {


    constructor(defaultSpeed) {
        super(defaultSpeed);
    }

    render() {
        super.render()
        gl.fillStyle = "rgba( 0, 200, 100, 1 )";
        gl.beginPath()
        gl.moveTo(this.position.x-35, this.position.y + 33)
        gl.lineTo(this.position.x+35, this.position.y + 33)
        gl.lineTo(this.position.x, this.position.y - 33)
        gl.closePath()
        gl.fill()
        //console.log('render');
    }
}



class Level{
    player
    enemies
    constructor() {
        this.player = new Player();
        this.player.position = new Vector2(canvas.width / 2, canvas.height - 150)
    }

    render(){
        this.player.render()
    }
}

class Menu extends Level {
    constructor() {
        super();
    }

    render(){

    }
}

class MainMenu extends Menu {
    constructor() {
        super();
    }

    render() {
        //super.render();

    }


}

function prepareCanvas() {
    canvas.height = window.innerHeight
    canvas.width = canvas.height / 16 * 9
}

function startGame() {
   // console.log('starting game')
    let game = new Game()

//mainMenu = new MainMenu()

    let level = new Level()



    game.navigate(level);

//Main game shim

       /* let lastTime = 0
        let vendors = ['ms', 'moz', 'webkit', 'o']
        for (let x = 0; x < vendors.length && !window.requestAnimationFrame(); x++){
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame']
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame']
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
*/

//End Shim

    var movements = [
        {"x": -1, "y": 0, "keycode": 37},
        {"x": 1, "y": 0, "keycode": 39},
        {"x": 0, "y": -1, "keycode": 38},
        {"x": 0, "y": 1, "keycode": 40},
    ]

    var pressedKeys = []

    function animate(){
        //frameId = requestAnimationFrame(animate)
        if (!game.currentLevel.isPrototypeOf(MainMenu)){
            let playerMovementVector = new Vector3(0,0,1)

            pressedKeys.forEach(function (v) {
                movements.forEach(function (vv) {
                    if (vv.keycode === v){
                        playerMovementVector.x = playerMovementVector.x + vv.x;
                        playerMovementVector.y = playerMovementVector.y + vv.y;
                    }
                })
            })

            game.currentLevel.player.setMovement(playerMovementVector)
        }




        game.render()
        //console.log('render')
    }
    setInterval(animate, 10)

    /*function cancel(){
        cancelAnimationFrame(frameId)
    }*/

    window.addEventListener("keydown", function (e){
        if (!e.keyCode in pressedKeys){
            pressedKeys.push(e.keyCode)
        }
    })
    window.addEventListener("keyup", function (e){
        if (e.keyCode in pressedKeys){
            const index = pressedKeys.indexOf(e.keyCode)
            if (index > -1){
                pressedKeys.splice(index, 1)
            }
        }
    })

}

