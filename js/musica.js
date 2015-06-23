/************************************************************************/
/*                           Web Bizuca                                 */
/************************************************************************/
/*               Javascript para a Música do Jogo                       */
/************************************************************************/
var diretorio = "music//";
var musicPlayer = document.getElementById("musicPlayer");
var playerSource = document.getElementById("player-source");

window.playSong = function(music) 
{
    playerSource.setAttribute("src", diretorio + music + ".mp3");
    musicPlayer.load();
};