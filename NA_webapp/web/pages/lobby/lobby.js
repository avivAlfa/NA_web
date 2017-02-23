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
        var td = $(document.createElement('td')).text(username);
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

    // $.ajax // Getting creator's name.
    // ({
    //     url: 'login',
    //     data: {
    //         action: "status"
    //     },
    //     type: 'GET',
    //     success: function (json) {
    //         creatorName = json.userName;
    //         reader.readAsText(file);
    //     }
    // });
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
                action: 'gameList'
            },
            type: 'GET',
            success: refreshGamesListCallback
        }
    )
}

function refreshGamesListCallback(json) {
    var gamesTable = $('.gamesTable tbody');
    gamesTable.empty();
    var gamesList = json.games;

    gamesList.forEach(function (game) {
        var tr = $(document.createElement('tr'));
        var tdGameNumber = $(document.createElement('td')).text(game.key);
        var tdGameName = $(document.createElement('td')).text(game.gameTitle);
        var tdCreatorName = $(document.createElement('td')).text(game.creatorName);
        var tdBoardSize = $(document.createElement('td')).text(game.rows + " X " + game.cols);
        var tdPlayerNumber = $(document.createElement('td')).text(game.registeredPlayers + " / " + game.requiredPlayers);
        var tdMovesNumber = $(document.createElement('td')).text(game.moves);

        tdGameNumber.appendTo(tr);
        tdGameName.appendTo(tr);
        tdCreatorName.appendTo(tr);
        tdBoardSize.appendTo(tr);
        tdPlayerNumber.appendTo(tr);
        tdMovesNumber.appendTo(tr);

        tr.appendTo(gamesTable);
    });

    var tr = $('.tableBody tr');
    for (var i = 0; i < tr.length; i++) {
        tr[i].onclick = createGameDialog;
    }
}