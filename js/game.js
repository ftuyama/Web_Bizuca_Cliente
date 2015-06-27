/************************************************************************/
/*                           Web Bizuca                                 */
/************************************************************************/
/*               Javascript para o Display do Jogo                      */
/************************************************************************/
var chat = document.getElementById("chatBox");
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var bot1 = new Image();   bot1.src = "img//bot1.png";
var bot2 = new Image();   bot2.src = "img//bot2.png";
var bala = new Image(); bala.src = "img//bala.png";
var tiro = new Image();  tiro.src = "img//tiro.png";
var fundo = new Image();  fundo.src = "img//fundo.png";
var placar = new Image();  placar.src = "img//placar.png";
var player = new Image(); player.src = "img/player.png";
var fase = new Image();  fase.src = "img//fasedesign.png";
var vision = new Image();   vision.src = "img//vision.png";
var vitoria = new Image();   vitoria.src = "img//vitoria.png";
var littlebox = new Image();  littlebox.src = "img//status.png";
var gameover = new Image();   gameover.src = "img//gameover.png";
var explosion = new Image(); explosion.src = "img//explosion.png";
var bolafogo= new Image(); bolafogo.src = "img//bolafogo.png";

var mouse = {
    x: 0, y: 0, c: 0
};
var alive = true, found = false;
var N, Nplayers, Nbots, Ntiros;
var Players = [], Bots = [], Last = [], Tiros = [];
var id = 0, x = 0, y = 0, hp = 0, ang = 0;
var Mid = 0, Mx = 0, My = 0, Mhp = 0, Mang = 0, Mbalas = 0;
var i, keyboard, bot = 0;

window.startGame = function(port, content) 
{
    Mid = ""+port;
    resize();
    document.body.style.backgroundImage = "url('img//fundo.png')";
    interpret(content);
    isAlive();
    window.requestAnimationFrame(draw);
};

window.interpretMsg = function(content)
{
    destroy();
    interpret(content);
    isAlive();
    processInput();
    window.requestAnimationFrame(draw);
    sendInfo();
};

window.gameOver = function()
{
    document.body.style.backgroundImage = "url('img//menu.png')";
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0,0,screen.width,screen.height); 
    ctx.drawImage(gameover, 0, 0);
    window.playSong("gameover");
};

window.victory = function()
{
    document.body.style.backgroundImage = "url('img//menu.png')";
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0,0,screen.width,screen.height);
    ctx.drawImage(vitoria, 0, 0);
    window.playSong("vitoria");
};

function isAlive(){
    var index;
    alive = false;
    for (var i = 0; i < Players.length; i++)
        if (Players[i]['id'] - Mid === 0)
        {
            index = i;
            alive = true;
        }
    if (alive)
    {
        Mx = Players[index]['x'];
        My = Players[index]['y'];
        Mhp = Players[index]['hp'];
        Mang = Players[index]['ang'];
    }
}

function resize()
{
    var oldCanvas = c.toDataURL("image/png");
    var img = new Image(); img.src = oldCanvas;
    img.onload = function (){
        c.height = screen.height;
        c.width = screen.width;
        ctx.drawImage(img, 0, 0);
    };
}

function destroy ()
{
    Players = [];
    Bots = [];
    Last = Tiros.slice();
    Tiros = [];
}

function interpret(content)
{
    var SuperInfo = 0, SInfo = 1, SubInfo = 1;
    var info, message = ""+content;
    for (i = 1; i<message.length; i++)
    {
        
        info = "";
        while (message.charAt(i)!=="," && message.charAt(i)!=="@")
            info += message.charAt(i++);
        if(message.charAt(i)==="@") break;
        
        //console.log(SuperInfo+" "+SInfo+" "+SubInfo+" "+info);
        // Número de Players, Bots e Tiros
        if (SuperInfo === 0)
        {
            if (SubInfo === 1)      Nplayers = info;
            else if (SubInfo === 2) Nbots = info;
            else if (SubInfo === 3) Ntiros = info;
            if (SubInfo++ === 3) 
            {
                SuperInfo++;
                SubInfo = 1;
            }
        }
        else if (SuperInfo === 4) Mbalas = info;
        else
        {
            // Lendo as informações
            if (SubInfo === 1) ID = info;
            else if (SubInfo === 2) x = info;
            else if (SubInfo === 3) y = info;
            else if (SubInfo === 4) hp = info;
            else if (SubInfo === 5) ang = info;
              
            // Após ler todas de um objeto, atribui
            if (SubInfo === 5) 
            {
                // Ver o tipo de objeto
                if (SuperInfo === 1) {
                    Players.push({id: ID, x: x, y: y, hp: hp, ang: ang });
                    N = Nplayers;
                }
                else if (SuperInfo === 2)  {
                    Bots.push({id: ID, x: x, y: y, hp: hp, ang: ang });
                    N = Nbots;
                }
                else if (SuperInfo === 3) {
                    Tiros.push({id: ID, x: x, y: y, hp: hp, ang: ang });
                    N = Ntiros;
                }
                // Iterar
                SubInfo = 1;
                SInfo++;
                while (SInfo > N) 
                {
                    SInfo = 1;
                    SuperInfo++;
                    if (SuperInfo === 1)      { N = Nplayers; }
                    else if (SuperInfo === 2) { N = Nbots;    }
                    else if (SuperInfo === 3) { N = Ntiros;   }
                    else break;
                }     
            }
            else SubInfo++;
        }
    }
}
function draw() 
{
    if (alive)
    {
        var nX, nY;
        var AbsX = screen.width/2 - Mx, AbsY = screen.height/2 - My;
        ctx.globalCompositeOperation = 'destination-over';
        ctx.clearRect(0,0,screen.width,screen.height); 
        
        // --------------------------------------
        //      Desenho do placar do Jogo
        // --------------------------------------
        ctx.save();
        ctx.translate(screen.width/2-100, 0);
        ctx.font = "24px Arial";
        ctx.fillStyle = "#0000FF";
        ctx.fillText("" + Players.length, 60, 110);
        ctx.fillStyle = "#B22222";
        ctx.fillText("" + Bots.length, 220, 110);
        ctx.drawImage(placar, 0, 0);
        ctx.restore();
        
        // --------------------------------------
        //      Desenho do Status do jogador
        // --------------------------------------
        
        for (var i = 0; i < Players.length; i++)
        {
            if (Players[i]['id'] - Mid === 0)
            {
                ctx.save();
                nX = parseInt(AbsX)+parseInt(Players[i]['x']);
                nY = parseInt(AbsY)+parseInt(Players[i]['y']);
                ctx.translate(nX - 30, nY - 80);

                ctx.font = "13px Arial";
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(22, 18, 1 + Players[i]['hp'] / 3, 6);
                ctx.fillStyle = "#000000";
                ctx.fillText("" + Mbalas, 70, 25);
                ctx.fillStyle = "#000000";
                ctx.fillText("Nº " + Players[i]['id'], 25, 15);
                ctx.drawImage(littlebox, 0, 0);
                ctx.restore();
            }
        }
        
        // --------------------------------------
        //      Desenho do Campo de visão
        // --------------------------------------
        
        nX = parseInt(AbsX)+parseInt(Mx);
        nY = parseInt(AbsY)+parseInt(My);
            
        ctx.save();
        ctx.translate(nX, nY);
        ctx.rotate((Math.PI/180.0)*Mang);
        ctx.drawImage(vision, -vision.width/2, -vision.height/2);
        ctx.restore();
        
        // --------------------------------------
        //       Desenho dos Jogadores 
        // --------------------------------------
        for (var i = 0; i < Players.length; i++)
        {
            
            nX = parseInt(AbsX)+parseInt(Players[i]['x']);
            nY = parseInt(AbsY)+parseInt(Players[i]['y']);
            
            ctx.save();
            ctx.translate(nX, nY);
            ctx.rotate((Math.PI/180.0)*Players[i]['ang']);
            ctx.drawImage(player, -player.width/2, -player.height/2);
            ctx.restore();
            
            if (Players[i]['id'] - Mid !== 0)
            {
                ctx.save();
                ctx.translate(nX - 30, nY - 80);
                ctx.font = "13px Arial";
                ctx.fillStyle = "#000000";
                ctx.fillText("Nº " + Players[i]['id'], 25, 15);

                ctx.drawImage(littlebox, 0, 0);
                ctx.restore();
            }
            
        }   
        // --------------------------------------
        //       Desenho das explosões
        // --------------------------------------
        for (var i = 0; i < Last.length; i++)
        {
            found = false;
            for (var k = 0; k < Tiros.length; k++) {
                if (parseInt(Tiros[k]['id']) - parseInt(Last[i]['id']) === 0) {
                    found = true;
                }
            }
            if (found === false)
            {
                ctx.save();
                nX = parseInt(AbsX) + parseInt(Last[i]['x']);
                nY = parseInt(AbsY) + parseInt(Last[i]['y']);
                ctx.translate(nX, nY);
                ctx.rotate((Math.PI/180.0)*Last[i]['ang']);
                ctx.drawImage(explosion, -explosion.width/2, -explosion.height/2);
                ctx.restore();
            }
        }
        // --------------------------------------
        //          Desenho dos Bots
        // --------------------------------------
        for (var i = 0; i < Bots.length; i++)
        {
            ctx.save();
            nX = parseInt(AbsX)+parseInt(Bots[i]['x']);
            nY = parseInt(AbsY)+parseInt(Bots[i]['y']);
            ctx.translate(nX, nY);
            ctx.rotate((Math.PI/180.0)*Bots[i]['ang']);
            if (bot++<7) {
                ctx.drawImage(bot1, -bot1.width/2, -bot1.height/2);
            }
            else if (bot <14) {
                ctx.drawImage(bot2, -bot2.width/2, -bot2.height/2);
            }
            else  {  
                bot = 0;
            }
            ctx.restore();
        }
        // --------------------------------------
        //         Desenho dos Tiros
        // --------------------------------------
        for (var i = 0; i < Tiros.length; i++)
        {
            ctx.save();
            nX = parseInt(AbsX)+parseInt(Tiros[i]['x']);
            nY = parseInt(AbsY)+parseInt(Tiros[i]['y']);
            ctx.translate(nX, nY);
            ctx.rotate((Math.PI/180.0)*Tiros[i]['ang']);
            if (Tiros[i]['id']%2 === 0){
                ctx.drawImage(tiro, -tiro.width/2, -tiro.height/2);
            }
            else {
                ctx.drawImage(bolafogo, -bolafogo.width/2, -bolafogo.height/2);
            }
            ctx.restore();
        }
        
        // --------------------------------------
        //        Desenho da fase
        // --------------------------------------
        ctx.drawImage(fase,AbsX,AbsY);
     
    }
}

function sendInfo()
{
    var Info = Mang + ",";
    var Request = keyboard + ",";
    Request+= mouse.c + ",";
    
    window.sendMap(Info+Request);
}

function processInput()
{
    keyboard = window.inKeyboard();
    mouse = window.inMouse();
    var dy = (mouse.y - screen.height/2);
    var dx = (mouse.x - screen.width/2);
    Mang = ang = parseInt((180.0/Math.PI)*Math.atan2(dy,dx));
}