/************************************************************************/
/*                           Web Bizuca                                 */
/************************************************************************/
/*               Javascript para os Inputs do Jogador                   */
/************************************************************************/
var KEY = {
    D: 68,
    W: 87,
    A: 65,
    S: 83,
    RIGHT: 39,
    UP: 38,
    LEFT: 37,
    DOWN: 40,
    Q: 81
};

var keyboard = '_';
var click = 0;
var mouse = {
    x: 0, y: 0, c: 0
};

window.inKeyboard = function(){
    return keyboard;
};
window.inMouse = function(){
    mouse.c = click;
    click = 0;  
    return mouse;
};

function mousec(e)
{
    click = 1;
}
function fixPageXY(e) 
{
    if (event.pageX === null && event.clientX !== null) {
        var html = document.documentElement;
        var body = document.body;

        event.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
        event.pageX -= html.clientLeft || 0;

        event.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0);
        event.pageY -= html.clientTop || 0;
    }
}
function move()
{
    fixPageXY(event);
    mouse.x = event.pageX;
    mouse.y = event.pageY;
}

function press() 
{
    var code = event.keyCode;
    switch (code) {
        case KEY.RIGHT:
        case KEY.D:
            keyboard = 'D';
            break;

        case KEY.UP:
        case KEY.W:
            keyboard = 'W';
            break;

        case KEY.LEFT:
        case KEY.A:
            keyboard = 'A';
            break;

        case KEY.DOWN:
        case KEY.S:
            keyboard = 'S';
            break;
    }
}

function release() 
{
    var code = event.keyCode;
    switch (code) {
        case KEY.RIGHT:
        case KEY.D:
            keyboard = '_';
            break;

        case KEY.UP:
        case KEY.W:
            keyboard = '_';
            break;

        case KEY.LEFT:
        case KEY.A:
            keyboard = '_';
            break;

        case KEY.DOWN:
        case KEY.S:
            keyboard = '_';
            break;
            
        default:
            break;
    }
}