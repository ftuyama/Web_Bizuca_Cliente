/************************************************************************/
/*                           Web Bizuca                                 */
/************************************************************************/
/*               Javascript para o Menu de Conexão                      */
/************************************************************************/
var mySocket = new jSocket(ready, connect, data, close);
mySocket.setup("my_socket", "flash//jsocket.swf");

var connected = "<font color=\"#00FF00\"> Connected! </font>";

var ip, port, nick, pass, message, defPort = 80, Estado = 0;
var chatin = document.getElementById("chatin");
var field = document.getElementById("field");
var chat = document.getElementById("chat");
var log = document.getElementById("log");

field.style.visibility = 'hidden';

function ready()
{
    console.log("socket ready");
}
function connect(success, data)
{
    console.log("socket connected");
    if (!success)
    {
        console.log("error:" + data)
        return;
    }
}
function data(content)
{
    console.log("socket data");
    console.log(content+" "+Estado);
    if (Estado === 0)
    {
        Estado++;
        port = content;
        Reconectar();
        conec.Tipconf.value = ip.concat(" : ",port);
        log.innerHTML = connected;
    }
    else if (Estado === 1) {
        writeResponse(content);
    }
    else if (Estado === 2) {
        if (content !== "") {
            chat.value += content; 
        }
    }
}
function close()
{
    console.log("socket close");
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
    console.log("Reconnecting");
    mySocket.close();
    mySocket.connect(ip, port);
}
function Commit(message)
{
    mySocket.write(message);
    Reconectar();
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
            ip = '192.168.197.1';
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
    field.style.visibility = 'visible';
    chat.value = message.concat(nick,"\n");
}
function enviarChat(){
    message = chatin.value;
    message = nick.concat(" > ", message);
    console.log("Message sent"+message);
    Commit(message);
    chatin.value = "";
}

