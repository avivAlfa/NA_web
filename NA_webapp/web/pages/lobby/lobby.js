var chatVersion = 0;
var refreshRate = 2000; //mili seconds
var USER_LIST_URL = buildUrlWithContextPath("userslist");
var CHAT_LIST_URL = buildUrlWithContextPath("game_backend");

window.onload = function ()
{
    refreshLoginStatus();
    refreshUserList();
    setInterval(refreshLoginStatus, 2000);
    setInterval(refreshUserList, 2000);
    setInterval(refreshGamesList, 2000);
};

function refreshUserList() {
    $.ajax(
        {
            url: "/userslist",
            data: {
                action: "userslist"
            },
            type: 'GET',
            success: refreshUserListCallback
        }
    );
}
function refreshUserListCallback(json) {
    var usersTable = $('.usersTable tbody');
    usersTable.empty();

    $.each(json || [], function(index, username) {
        var tr = $(document.createElement('tr'));
        var td = $(document.createElement('td')).text(username.userName);
        td.appendTo(tr);
        tr.appendTo(usersTable);
    });
}

function refreshLoginStatus() {
    var userName = getUserName();
    if(userName != null){
        $('.userNameSpan').text("Hello " + userName);
    }
    else {
        window.location = "../signup/signup.html";
    }
}

function getUserName() {
        var result;
        $.ajax
        ({
            async: false,
            url: '/userslist',
            data: {
                action: "currentUserName"
            },
            type: 'GET',
            success: function(json) {
                result = json;
            }
        });
        return result;
}

function loadGameClicked(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    var creatorName = getUserName();

    reader.onload = function () {

        var content = reader.result;
        $.ajax(
            {
                url: '/games',
                data: {
                    action: "loadGame",
                    file: content,
                    creator: creatorName
                },
                type: 'POST',
                success: loadGameCallback
            }
        );
    }
    reader.readAsText(file);
}
function loadGameCallback(json) {
    if (json.isLoaded) {
        alert("Load game Success !!");
        refreshGamesList();
        clearFileInput();
    }
    else {
        clearFileInput();
        alert(json.errorMessage);
    }
}

function refreshGamesList() {
    $.ajax
    (
        {
            url: '/games',
            data: {
                action: 'gamesList'
            },
            type: 'GET',
            success: refreshGamesListCallback
        }
    )
}
function refreshGamesListCallback(json) {
        var gamesTable = $('.gamesTable tbody');
    gamesTable.empty();
    var gamesList = json;

    gamesList.forEach(function (game) {
        var tr = $(document.createElement('tr'));
        var tdGameNumber = $(document.createElement('td')).text(game.key);
        var tdGameName = $(document.createElement('td')).text(game.title);
        var tdCreatorName = $(document.createElement('td')).text(game.creatorName);
        var tdBoardSize = $(document.createElement('td')).text(game.gameEngine.gameBoard.size + "x" + game.gameEngine.gameBoard.size);
        var tdPlayerNumber = $(document.createElement('td')).text(Object.keys(game.gameEngine.players).length + " / " + game.requiredNumOfPlayers);

        var divShowGameDialog = $(document.createElement('div')).text("Show preview");
        divShowGameDialog.addClass('showGameDialogDiv');
        var tdShowGameDialog = $(document.createElement('td'));
        divShowGameDialog.appendTo(tdShowGameDialog);

        var divJoinGame = $(document.createElement('div')).text("Join game");
        divJoinGame.addClass('joinGameDiv');
        var tdJoinGame = $(document.createElement('td'));
        divJoinGame.appendTo(tdJoinGame);

        tdGameNumber.appendTo(tr);
        tdGameName.appendTo(tr);
        tdCreatorName.appendTo(tr);
        tdBoardSize.appendTo(tr);
        tdPlayerNumber.appendTo(tr);
        tdShowGameDialog.appendTo(tr);
        tdJoinGame.appendTo(tr);

        tr.appendTo(gamesTable);
    });

    var tr1 = $('.showGameDialogDiv');
    var tr2 = $('.joinGameDiv');
    for (var i = 0; i < tr1.length; i++) {

        tr1[i].onclick = createGameDialog;
        tr2[i].onclick = joinFromTable;
    }
}

function createGameDialog(event) {
    var row = $(event.target).parent().parent();
    var number = $($(row).find("td:eq(0)")).html();

    $.ajax
    (
        {
            url: '/games',
            data: {
                action: 'gameDetails',
                key: number
            },
            type: 'GET',
            success: createGameDialogCallback
        }
    )
}
function createGameDialogCallback(json) {
    var div = $('.dialogDiv')[0];
    div.style.display = "block";
   // var playersNamesDiv = $('.playersNames');

    var key = json.key;
    var creatorName = json.creatorName;
    var gameName = json.title;
    var boardSize = json.gameEngine.gameBoard.size + " X " + json.gameEngine.gameBoard.size;
    var playerNumber = Object.keys(json.gameEngine.players).length + " / " + json.requiredNumOfPlayers;

    console.log(json);
    $('.key').text("Game id: " + key + ".");
    $('.creatorName').text("Game Creator: " + creatorName + ".");
    $('.gameName').text("Game Title: " + gameName);
    $('.boardSize').text("Board size: " + boardSize);
    $('.playerNumber').text("Players : " + playerNumber);

    createBoard(json.gameEngine.gameBoard.size, json.gameEngine.gameBoard.size, json.gameEngine.gameBoard.board);
}

function removeGameDialog() {
    $('.dialogDiv')[0].style.display = "none";
}

function createBoard(rows, cols, boardArr) {
    var board = $('.board');
    var colors = getColorsList();
    board.contents().remove();

    for (i = 0; i < rows; i++) {
        rowDiv = $(document.createElement('div'));
        rowDiv.addClass('rowDiv');

        for (j = 0; j < cols; j++) { // add the squares.
            squareDiv = $(document.createElement('div'));
            squareDiv.addClass('square');
            if(!boardArr[i][j].isEmpty && !boardArr[i][j].isCursor) {
                squareDiv.append(boardArr[i][j].value);
                squareDiv.prop('style', "color: "+ colors[boardArr[i][j].color]);
            }
            if(boardArr[i][j].isCursor) {
                imgElem = $(document.createElement('img'));
                imgElem.prop('src', "../../common/images/marker.png");
                squareDiv.append(imgElem)
            }
            squareDiv.appendTo(rowDiv);
        }
        rowDiv.appendTo(board);
    }

}

function isUserComputer() {
    var result;
    $.ajax
    ({
        async: false,
        url: 'usersList',
        data: {
            action: "currentUser"
        },
        type: 'GET',
        success: function (json) {
            result = json.isComputer;
        }
    });
    return result;
}

function getUser() {
    var result;
    $.ajax
    ({
        async: false,
        url: '/userslist',
        data: {
            action: "currentUser"
        },
        type: 'GET',
        success: function(json) {
            result = json;
        }
    });
    return result;
}

function joinFromDialog() {
    var gameId = getGameId();
    joinGameClicked(gameId);
}

function joinFromTable(event) {

    var row = $(event.target).parent().parent();
    var number = $($(row).find("td:eq(0)")).html();

    joinGameClicked(number);
}

function joinGameClicked(gameId) {
    var user = getUser();
    //var isComputer = isUserComputer();
    //var gameId = getGameId();
    $.ajax
    (
        {
            url: '/games',
            data: {
                action: 'joinGame',
                user: user.userName,
                isComputer: user.isComputer,
                gameId: gameId
            },
            type: 'GET',
            success: function(json) {
                if(json){
                    window.location = "../gameroom/gameRoom.html";
                }
                else{
                    alert(user.userName + ", You have already signed to other game");
                }
            }
            //success: joinGameClickedCallback
        }
    );
}

//function joinGameClickedCallback(json) {

    // if (json.isLoaded)
    // {
    //     didUserCloseWindow = false;
    //     window.location = "/pages/gameroom/gameRoom.html";
    // }
    // else {
    //     alert(json.errorMessage);
    // }
//}

function getGameId() {
    var string = $('.key').text();
    var result = +0;
    var i = 9;
    var temp = +string[i];
    while (!isNaN(temp)) // while temp is a number..
    {
        result = result * 10 + temp;
        i++;
        temp = +string[i];
    }
    return result;
}

function clearFileInput() {
    document.getElementById("fileInput").value = "";
}

function getColorsList(){
    var result;
    $.ajax
    ({
        async: false,
        url: '/utils',
        data: {
            action: "colors"
        },
        type: 'GET',
        success: function(json) {
            result = json;
        }
    });
    return result;
}
