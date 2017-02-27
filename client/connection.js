/**
 * Created by Diogo and Ana on 28/11/2016.
 *
 * see
 * http://www.dcc.fc.up.pt/~rprior/1617/TW/trabalho/Trabalho-2.html
 * for more info
 */

var name;
var pass;
var request = new XMLHttpRequest();
var url = 'http://twserver.alunos.dcc.fc.up.pt:8000/';
var json;
var response;
var group = 58;
var key;
var game;
var data = '';
var level;
var opponent = '';
var turn = '';
var col = 0;
var row = 0;
var gameinprogress = 0;
var ranking_data;


function register() {
    /**
     * Return true or false whether the user is successfully registered.
     * Register should also login the user to the server.
     */
    data = {'name': name, 'pass': pass};

    // construct an HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url + 'register', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    // send the collected data as JSON
    xhr.send(JSON.stringify(data));

    xhr.onloadend = function () {
        response = JSON.parse(xhr.responseText);

        if (response.error == undefined) {
            console.log("returning 1");
            register_sucess();
            return 1;
        }
        else {
            alert('Erro: ' + response.error);
            return 0;
        }
    };

}


function join() {
    data = {'name': name, 'pass': pass, 'level': level, 'group': group};

    // construct an HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url + 'join', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    // send the collected data as JSON
    xhr.send(JSON.stringify(data));

    xhr.onloadend = function () {
        response = JSON.parse(xhr.responseText);

        if (response.error == undefined) {
            key = response.key;
            game = response.game;
            wait_for_next_player();
        }
        else alert('Erro: ' + response.error);
    };
}

function update() {
    var source = new EventSource(url + 'update?name=' + name + '&game=' + game + '&key=' + key);

    source.onmessage = function response(event) {
        var json = JSON.parse(event.data);

        if (json.error != null) {
            event.target.close();
        }

        if (json.opponent) {
            gameinprogress = 1;
            set_tab('game');
            getvalue();
            opponent = json.opponent;
            turn = json.turn;

            alert('Opponent: ' + opponent + ' Turn: ' + turn);
            MultiGame(turn);

        }
        if (json.move != undefined) {


        }


        if (json.winner != undefined) {
            gameinprogress=0;
            alert("O jogador " + json.winner + " ganhou o jogo!! Parabens!")
            //actualiza
            gameover(json.winner);
        }


    };

}


function leave() {
    data = {'name': name, 'key': key, 'game': game};

    // construct an HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url + 'leave', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    // send the collected data as JSON
    xhr.send(JSON.stringify(data));

    xhr.onloadend = function () {
        response = JSON.parse(xhr.responseText);

        if (response.error == undefined) {
            gameinprogress = 0;
            gameover(response.winner);
        }
        else alert('Erro: ' + response.error);

    };
}

function notify() {
    data = {'name': name, 'game': game, 'key': key, 'row': row, 'col': col};

    // construct an HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url + 'notify', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    // send the collected data as JSON
    xhr.send(JSON.stringify(data));

    xhr.onloadend = function () {
        response = JSON.parse(xhr.responseText);

        if (response.error == undefined) {
        update_game();
        }
        else {
            alert('Erro: ' + response.error);
        }
    };
}


function ranking() {
    if (level == undefined)
        level = "beginner";

    data={'level':level};

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url + 'ranking', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    // send the collected data as JSON
    xhr.send(JSON.stringify(data));

    xhr.onloadend = function () {
        response = JSON.parse(xhr.responseText);

        if (response.error == undefined) {
            ranking_data = response.ranking;
        }
        else alert('Erro: ' + response.error);
    };
}
