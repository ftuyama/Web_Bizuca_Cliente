/************************************************************************/
/*                           Web Bizuca                                 */
/************************************************************************/
/*               Javascript para o Menu de Conexão                      */
/************************************************************************/
var mySocket = new jSocket(ready, connect, data, close);
mySocket.setup("my_socket", "flash//jsocket.swf");

var connected = "<font color=\"#00FF00\"> Connected! </font>";

var ip, port, nick, pass, message, defPort = 4000, Estado = 0;
var chatin = document.getElementById("chatin");
var chatBox = document.getElementById("chatBox");
var netPanel = document.getElementById("netPanel");
var musicPlayer = document.getElementById("musicPlayer");
var game = document.getElementById("game");
var menu = document.getElementById("menu");
var chat = document.getElementById("chat");
var log = document.getElementById("log");

chatBox.style.visibility = 'hidden';
game.style.visibility = 'hidden';

function ready()
{
    log.innerHTML = "socket ready";
}
function connect(success, data)
{
    log.innerHTML = "socket connected";
    if (!success)
    {
        log.innerHTML = "error:" + data;
        return;
    }
}
function data(content)
{
    // Modo de Conexão
    if (Estado === 0)
    {
        Estado++;
        port = content;
        Reconectar();
        netPanel.Tipconf.value = ip.concat(" : ",port);
        log.innerHTML = connected;
    }
    // Modo de Login
    else if (Estado === 1) {
        writeResponse(content);
    }
    // Modo de Chat
    else if (Estado === 2) {
        if (content.indexOf("@Start")!== -1){
            chat.value += "[Admin] > Starting the Game!";
            Estado++;
        }
        else if (content !== "") {
            chat.value += content; 
        }
    }
    // Inicialização do Jogo
    else if (Estado === 3)
    {
        if (content.indexOf("@")!== -1)
        {
            menu.style.visibility = 'hidden';
            game.style.visibility = 'visible';
            chatBox.style.visibility = 'hidden';
            musicPlayer.style.visibility = 'hidden';
            window.startGame(port, content);
            window.playSong("musica");
            Estado++;
        }
    }
    // Jogo
    else if (Estado === 4)
    {
        if (content.indexOf("@ShutDown1")!== -1) {
            window.victory();
        }
        else if (content.indexOf("@ShutDown0") !== -1) {
            window.gameOver();
        }
        else if (content.indexOf("@")!== -1) {
            window.interpretMsg(content);
        }
    }
}
function close()
{
    log.innerHTML = "socket close";
}


function Conectar()
{
    mySocket.connect(ip, port);
}
function Desconectar()
{
    mySocket.close();
}
function Reconectar()
{
    mySocket.close();
    mySocket.connect(ip, port);
}
function Commit(message)
{
    mySocket.write(message+"\n");
}
function writeResponse(text)
{
    document.getElementById("messages").innerHTML = "<br/>" + text;
}   
function SetConectar()
{
    if (Estado === 0)
    {
        ip = document.getElementById("Tip").value.toString();
        port = document.getElementById("Tport").value.toString();
        if (ip === "" && port === "")
        {
            ip = '192.168.0.240';
            port = defPort;
        }
        Conectar();
    }
    else {
        log.innerHTML = "Already connected!";
    }
}
function selectNick() 
{
    if (Estado === 1)
    {
        nick = document.getElementById("user").value;
        pass = document.getElementById("password").value;
        message = nick.concat("@", pass);
        Commit(message);
        ligarChat();
        Estado++;
    }
}
function ligarChat(){
    message = "Seja bem vindo ";
    chatBox.style.visibility = 'visible';
    chat.value = message.concat(nick,"\n");
}
function enviarChat(){
    message = chatin.value;
    message = nick.concat(" > ", message);
    Commit(message);
    chatin.value = "";
}

window.sendMap = function(msg) {
    Commit(msg);
};