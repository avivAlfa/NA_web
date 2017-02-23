var chatVersion = 0;
var refreshRate = 2000; //mili seconds
var USER_LIST_URL = buildUrlWithContextPath("userslist");
var CHAT_LIST_URL = buildUrlWithContextPath("game_backend");

window.onload = function ()
{
    refreshLoginStatus();
    refreshUserList();
    setInterval(refreshUserList, 2000);
    //setInterval(refreshGamesList, 2000);
    setInterval(refreshLoginStatus, 2000);
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
    $.ajax
    ({
        url: "/userslist",
        data: {
            action: "currentUser"
        },
        type: 'GET',
        success: statusCallback
    });
}

function statusCallback(json) {
    $('.userNameSpan').text("Hello " + json);

}

function getUserName() {
    var result;
    $.ajax
    ({
        url: "/userslist",
        data: {
            action: "currentUser"
        },
        type: 'GET',
        success: function (json) {
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
    };

    $.ajax // Getting creator's name.
    ({
        url: '/userslist',
        data: {
            action: "currentUser"
        },
        type: 'GET',
        success: function (json) {
            creatorName = json;
            reader.readAsText(file);
        }
    });
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


function createGameDialog(event) {
    var td = event.currentTarget.children[0];
    var number = td.innerText;
    $.ajax
    (
        {
            url: 'games',
            data: {
                action: 'gameDetails',
                key: number
            },
            type: 'GET',
            success: createGameDialogCallback
        }
    )
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


function createGameDialogCallback(json) {
    var div = $('.dialogDiv')[0];
    div.style.display = "block";
    var playersNamesDiv = $('.playersNames');

    var key = json.key;
    var creatorName = json.creatorName;
    var gameName = json.gameTitle;
    var boardSize = json.rows + " X " + json.cols;
    var moves = json.moves;
    var playerNumber = json.registeredPlayers + " / " + json.requiredPlayers

    $('.key').text("Game id: " + key + ".");
    $('.creatorName').text("Game Creator: " + creatorName + ".");
    $('.gameName').text("Game Title: " + gameName);
    $('.boardSize').text("Board size: " + boardSize);
    $('.moves').text("Moves number: " + moves);
    $('.playerNumber').text("Players : " + playerNumber);
    for (i = 0; i < json.registeredPlayers; i++) {
        var playerDiv = $(document.createElement('div'));
        playerDiv.addClass('playerDiv');
        playerDiv.appendTo(playersNamesDiv);
    }

    var playerDivs = $('.playerDiv');
    for (i = 0; i < json.registeredPlayers; i++) {
        playerDivs[i].innerHTML = (+i + 1) + '. ' + json.players[i].m_Name + '.';
    }

    createBoard(json.rows, json.cols, json.rowBlocks, json.colBlocks);
}

function removeGameDialog() {
    $('.dialogDiv')[0].style.display = "none";
}

function createBoard(rows, cols, rowBlocks, colBlocks) {
    var board = $('.board');
    board.contents().remove();
    colBlocksDiv = $(document.createElement('div'));
    colBlocksDiv.addClass('colBlocks');
    colBlocksDiv.appendTo(board);


    for (i = 0; i < rows; i++) { // creates squares + row blocks.
        rowDiv = $(document.createElement('div'));
        rowDiv.addClass('rowDiv');
        rowSquares = $(document.createElement('div'));
        rowSquares.addClass('rowSquares');
        rowBlocksDiv = $(document.createElement('div'));
        rowBlocksDiv.addClass('rowBlocks');
        rowSquares.appendTo(rowDiv);
        rowBlocksDiv.appendTo(rowDiv);

        /*for (hint = 0; hint < rowBlocks[i].length; hint++) {
            rowHint = $(document.createElement('div'));
            rowHint.addClass('rowHint');
            rowHint.appendTo(rowBlocksDiv);
        }*/

        for (j = 0; j < cols; j++) { // add the squares.
            squareDiv = $(document.createElement('div'));
            squareDiv.addClass('square');
            squareDiv.appendTo(rowSquares);
        }
        rowDiv.appendTo(board);
    }

    for (col = 0; col < cols; col++) { // creates column blocks.
        colBlockDiv = $(document.createElement('div'));
        colBlockDiv.addClass('colBlock');
        //for (hint = 0; hint < colBlocks[col].length; hint++) {
          //  hintDiv = $(document.createElement('div'));
            //hintDiv.addClass('colHint');
            //hintDiv.appendTo(colBlockDiv);
            //hintDiv.innerHTML = colBlocks[col][hint];
        //}
        colBlockDiv.appendTo(colBlocksDiv);
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

function joinGameClicked() {
    var name = getUserName();
    var isComputer = isUserComputer();
    var gameId = getGameId();
    $.ajax
    (
        {
            url: 'games',
            data: {
                action: 'joinGame',
                user: name,
                isComputer: isComputer,
                gameId: gameId
            },
            type: 'GET',
            success: joinGameClickedCallback
        }
    );
}

function joinGameClickedCallback(json) {

    if (json.isLoaded)
    {
        didUserCloseWindow = false;
        window.location = "GameRoom.html";
    }
    else {
        alert(json.errorMessage);
    }
}

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


function refreshGamesListCallback(json) {
    console.log("here try to add gameslist");
    var gamesTable = $('.gamesTable tbody');
    gamesTable.empty();
    var gamesList = json;

    gamesList.forEach(function (game) {
        var tr = $(document.createElement('tr'));
        var tdGameNumber = $(document.createElement('td')).text(game.key);
        var tdGameName = $(document.createElement('td')).text(game.title);
        var tdCreatorName = $(document.createElement('td')).text(game.creatorName);
        var tdBoardSize = $(document.createElement('td')).text(game.gameEngine.gameBoard.size);
        var tdPlayerNumber = $(document.createElement('td')).text(game.registredNumOfPlayers + " / " + game.requiredNumOfPlayers);

        tdGameNumber.appendTo(tr);
        tdGameName.appendTo(tr);
        tdCreatorName.appendTo(tr);
        tdBoardSize.appendTo(tr);
        tdPlayerNumber.appendTo(tr);

        tr.appendTo(gamesTable);
    });

    var tr = $('.tableBody tr');
    for (var i = 0; i < tr.length; i++) {
        tr[i].onclick = createGameDialog;
    }
}

function clearFileInput() {
    document.getElementById("fileInput").value = "";
}
