var chatVersion = 0;
var refreshRate = 2000;
var status;
var user;
var userName;
var isComputer;
//var turn = 0;
var isMyTurn = false;
var isButtonsEnabled = true;
var isEnabledSaver = true;
var gamePositionIndex;
var gamePositions;
// var selectedCell = null;
//var CHAT_LIST_URL = buildUrlWithContextPath("game_backend");

var showScoreBoard;
var myTurnSaver = false;
var isFirstStatus = true;
var isReplayOn = false;

window.onload = function()
{
    checkLoginStatus();
    chatOnload();
};

function checkLoginStatus() {
    $.ajax
    ({
        url: '/userslist',
        data: {
            action: "currentUserName"
        },
        type: 'GET',
        success: statusCallback
    });
}

function statusCallback(json) {
    // if (!json.isConnected)
    // {
    //     window.location = "index.html";
    // }
    // else if (json.gameNumber === -1)
    // {
    //     window.location = "LobbyPage.html";
    // }
    // else
    if (isFirstStatus)
    {
        isFirstStatus = false;
        initializePage();
    }
}

function initializePage() {
    user = getUser();
    userName = user.userName;
    isComputer = user.isComputer;
    isButtonsEnabled = true;
    // showScoreBoard = true;
    isMyTurn = false;
    status = 'WaitingForPlayers';
    loadWindowDetails();
    loadGameDetails();
    gameStatus();

    // setInterval(checkLoginStatus, refreshRate);
    setInterval(updatePlayersDetails, refreshRate);
    setInterval(gameStatus, refreshRate);

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

function loadWindowDetails() {
    $('.userNameSpan').text('Hello, '+ userName + " playing as "+ (isComputer ? "computer" : "human"));
}

function loadGameDetails() {
    $.ajax
    (
        {
            async: false,
            url: '/games',
            data:
            {
              //  action: 'gameDetails',
                action: 'boardDetails',
                key: -1
            },
            type: 'GET',
           // success: loadGameDetailsCallback
            success: createBoard
        }
    )
}
function loadGameDetailsCallback(json) {

    createBoard(json.gameEngine.gameBoard.size, json.gameEngine.gameBoard.size, json.gameEngine.gameBoard.board);

}

//Refresh methods
function updatePlayersDetails() {
    $.ajax
    (
        {
            url: '/games',
            data:
            {
                action: 'gamePlayers'
            },
            type: 'GET',
            success: updatePlayersDetailsCallback
        }
    )
}
function updatePlayersDetailsCallback(json) {
    var activePlayers = json[0];
    var resignedPlayers = json[1];

    var playersNamesDiv = $('.playersNamesBody');
    var playersTypeDiv = $('.playersTypesBody');
    var playersColorDiv = $('.playersColorBody');
    var playersScoreDiv = $('.playersScoreBody');

    playersNamesDiv.empty();
    playersTypeDiv.empty();
    playersColorDiv.empty();
    playersScoreDiv.empty();
    for (i=0; i<activePlayers.length; i++)
    {
        var playerContainerDiv = $(document.createElement('div'));
        playerContainerDiv.addClass('playerContainerDiv');
        playerContainerDiv.appendTo(playersNamesDiv);

        var playerDiv = $(document.createElement('div'));
        playerDiv.addClass('playerDiv');
        playerDiv.appendTo(playerContainerDiv);

        var typeDiv = $(document.createElement('div'));
        typeDiv.addClass('typeDiv');
        typeDiv.appendTo(playersTypeDiv);

        var colorDiv = $(document.createElement('div'));
        colorDiv.addClass('colorDiv');
        colorDiv.appendTo(playersColorDiv);

        var scoreDiv = $(document.createElement('div'));
        scoreDiv.addClass('scoreDiv');
        scoreDiv.appendTo(playersScoreDiv);
    }

    var playerDivs = $('.playerDiv');
    var typeDivs = $('.typeDiv');
    var colorDivs = $('.colorDiv');
    var scoreDivs = $('.scoreDiv');

    for (i=0; i<activePlayers.length; i++)
    {
        playerDivs[i].innerHTML = activePlayers[i].name// + ' #' + json[i].id;
        typeDivs[i].innerHTML = (activePlayers[i].isHuman?"Human":"Computer");
        // if(json[i].type)
        //     typeDivs[i].innerHTML = "Computer";
        // else
        //     typeDivs[i].innerHTML = "Human";

        var colorsList = getColorsList();
        colorDivs[i].innerHTML = colorsList[activePlayers[i].color];
        scoreDivs[i].innerHTML = activePlayers[i].score;
    }

    updateResignedPlayersDetails(resignedPlayers);


    // //$('.registeredPlayers').text(json.length);
    //
    // var playersNamesDiv = $('.playersNamesBody');
    // var playersTypeDiv = $('.playersTypesBody');
    // var playersColorDiv = $('.playersColorBody');
    // var playersScoreDiv = $('.playersScoreBody');
    //
    // playersNamesDiv.empty();
    // playersTypeDiv.empty();
    // playersColorDiv.empty();
    // playersScoreDiv.empty();
    // for (i=0; i<json.length; i++)
    // {
    //     var playerContainerDiv = $(document.createElement('div'));
    //     playerContainerDiv.addClass('playerContainerDiv');
    //     playerContainerDiv.appendTo(playersNamesDiv);
    //
    //     var playerDiv = $(document.createElement('div'));
    //     playerDiv.addClass('playerDiv');
    //     playerDiv.appendTo(playerContainerDiv);
    //
    //     var typeDiv = $(document.createElement('div'));
    //     typeDiv.addClass('typeDiv');
    //     typeDiv.appendTo(playersTypeDiv);
    //
    //     var colorDiv = $(document.createElement('div'));
    //     colorDiv.addClass('colorDiv');
    //     colorDiv.appendTo(playersColorDiv);
    //
    //     var scoreDiv = $(document.createElement('div'));
    //     scoreDiv.addClass('scoreDiv');
    //     scoreDiv.appendTo(playersScoreDiv);
    // }
    //
    // var playerDivs = $('.playerDiv');
    // var typeDivs = $('.typeDiv');
    // var colorDivs = $('.colorDiv');
    // var scoreDivs = $('.scoreDiv');
    //
    // for (i=0; i<json.length; i++)
    // {
    //     playerDivs[i].innerHTML = json[i].name// + ' #' + json[i].id;
    //     typeDivs[i].innerHTML = (json[i].isHuman?"Human":"Computer");
    //     // if(json[i].type)
    //     //     typeDivs[i].innerHTML = "Computer";
    //     // else
    //     //     typeDivs[i].innerHTML = "Human";
    //
    //     var colorsList = getColorsList();
    //     colorDivs[i].innerHTML = colorsList[json[i].color];
    //     scoreDivs[i].innerHTML = json[i].score;
    // }


}

function updateResignedPlayersDetails(resignedPlayers) {
    if(resignedPlayers != null){
        var resignedPlayersNamesDiv = $('.resignedPlayersNamesBody');
        var resignedPlayersTypeDiv = $('.resignedPlayersTypesBody');
        var resignedPlayersColorDiv = $('.resignedPlayersColorBody');
        var resignedPlayersScoreDiv = $('.resignedPlayersScoreBody');

        resignedPlayersNamesDiv.empty();
        resignedPlayersTypeDiv.empty();
        resignedPlayersColorDiv.empty();
        resignedPlayersScoreDiv.empty();

        for (i=0; i<resignedPlayers.length; i++)
        {
            var resignedPlayerContainerDiv = $(document.createElement('div'));
            resignedPlayerContainerDiv.addClass('resignedPlayerContainerDiv');
            resignedPlayerContainerDiv.appendTo(resignedPlayersNamesDiv);

            var resignedPlayerDiv = $(document.createElement('div'));
            resignedPlayerDiv.addClass('resignedPlayerDiv');
            resignedPlayerDiv.appendTo(resignedPlayerContainerDiv);

            var resignedPlayerTypeDiv = $(document.createElement('div'));
            resignedPlayerTypeDiv.addClass('resignedPlayerTypeDiv');
            resignedPlayerTypeDiv.appendTo(resignedPlayersTypeDiv);

            var resignedPlayerColorDiv = $(document.createElement('div'));
            resignedPlayerColorDiv.addClass('resignedPlayerColorDiv');
            resignedPlayerColorDiv.appendTo(resignedPlayersColorDiv);

            var resignedPlayerScoreDiv = $(document.createElement('div'));
            resignedPlayerScoreDiv.addClass('resignedPlayerScoreDiv');
            resignedPlayerScoreDiv.appendTo(resignedPlayersScoreDiv);
        }

        var resignedPlayerDivs = $('.resignedPlayerDiv');
        var resignedPlayerTypeDivs = $('.resignedPlayerTypeDiv');
        var resignedPlayerColorDivs = $('.resignedPlayerColorDiv');
        var resignedPlayerScoreDivs = $('.resignedPlayerScoreDiv');

        for (i=0; i<resignedPlayers.length; i++)
        {
            resignedPlayerDivs[i].innerHTML = resignedPlayers[i].name// + ' #' + json[i].id;
            resignedPlayerTypeDivs[i].innerHTML = (resignedPlayers[i].isHuman?"Human":"Computer");
            // if(json[i].type)
            //     typeDivs[i].innerHTML = "Computer";
            // else
            //     typeDivs[i].innerHTML = "Human";

            var resignedPlayersColorsList = getColorsList();
            resignedPlayerColorDivs[i].innerHTML = resignedPlayersColorsList[resignedPlayers[i].color];
            resignedPlayerScoreDivs[i].innerHTML = resignedPlayers[i].score;
        }
    }

}

function gameStatus() { //this function refresh all game details(except players details), kind of game loop
    $.ajax
    (
        {
            async: false,
            url: '/games',
            data:
            {
                action: 'gameStatusMessage'
            },
            type: 'GET',
            success: gameStatusCallBack
        }
    )
}
function gameStatusCallBack(json) {
    newStatus = json.status;
    newCurrentPlayerName = json.currentPlayerName;

    switch(newStatus)
    {
        case 'WaitingForPlayers':
            break;
        case 'Running':
            if (status === 'WaitingForPlayers') {
                alert('Game is on!');
            }

            //if now changed to my turn, or not my turn then update board
   //         if(((!isMyTurn && newCurrentPlayerName === userName) || newCurrentPlayerName !== userName)|| isComputer){
     //           updateBoard();
      //      }
            if(newCurrentPlayerName !== userName || isComputer)
                updateBoard();

            $('.currentPlayerName')[0].innerHTML = newCurrentPlayerName;

            if (!isMyTurn && newCurrentPlayerName === userName) //if its my turn
            {
                var possibleCellFlag = hasPossibleCells();
                if(possibleCellFlag) {
                    isMyTurn = true;
                    if (!isComputer) {
                        updateBoard();
                        alert('Hey Buddy! it is now your turn !');
                    }

                    if (isComputer)
                    {
                        isMyTurn = false;
                         setTimeout(playComputerMove, 1200);
                    }
                }
                else{
                    alert(userName + ", Unavailable numbers for you\nSkipping to the next player");
                    skipTurn();
                }
            }

            if (isMyTurn && newCurrentPlayerName != userName) {
           //     alert('It is your turn, but server says its someone else turn ...');
                isMyTurn = false;
            }

            break;
        case "Finished":
            isMyTurn = false;

            if(status !== "Finished") {
                handleEndGame();
                // alert("Game Over");
                // gamePositions = getGamePositions();
                // gamePositionIndex = gamePositions.length - 1;
                // var nextPrevElements = $(".prevNexDiv") //TODO: only prev?
                // nextPrevElements.attr('style', "visibility: visible;");
            }
            break;
    }
    status = newStatus;
    $('.gameStatus').text('Game status: ' + status);
}
//-------------------


function getGamePositions() {
    var result;
    var user = getUser();
    $.ajax
    ({
        async: false,
        url: '/games',
        data: {
            action: "positions",
            username: user.userName
        },
        type: 'GET',
        success: function(json) {
            result = json;
        }
    })
    return result;
}

function startChat() {
    $(".chatRows").attr("style", "visibility:visible");
    $("#chatButton").attr("style", "visibility:hidden");
}

function updateBoard() {
    user = getUser();
    $.ajax
    (
        {
            async: false,//TODO
            url: '/games',
            data:
            {
                action: 'boardDetails',
                username: user.userName
            },
            type: 'GET',
            success: createBoard
        }
    )
}

function createBoard(json) {
    var board = $('.boardBody');
    var colors = getColorsList();
    board.contents().remove();
    rows = json[0].size;
    cols = json[0].size;
    boardArr = json[0].board;
    possibleCells = json[1]

    for (i = 0; i < rows; i++) {
        rowDiv = $(document.createElement('div'));
        rowDiv.addClass('rowDiv');

        for (j = 0; j < cols; j++) { // add the squares.
            squareDiv = $(document.createElement('div'));
            squareDiv.addClass('square');
            // if(i===selectedRow && j===selectedCol)
            //     squareDiv.addClass(("selectedSquare"));
            if(!boardArr[i][j].isEmpty && !boardArr[i][j].isCursor) {
                squareDiv.append(boardArr[i][j].value);
                squareDiv.prop('style', "color: "+ colors[boardArr[i][j].color]);

                squareDiv.attr('hasValue', 'true');

                squareDiv.attr('row',i);
                squareDiv.attr('col',j);

            }
            if(boardArr[i][j].isCursor) {
                imgElem = $(document.createElement('img'));
                imgElem.prop('src', "../../common/images/marker.png");
                squareDiv.append(imgElem)
                squareDiv.addClass('cursor');
            }
            squareDiv.appendTo(rowDiv);
        }
        rowDiv.appendTo(board);
    }


    /*var fullSquares = $(".square[hasValue=true]");
     for(var i = 0; i< fullSquares.length; i++) {
     fullSquares[i].onclick = clickOnCell;
     }*/
    for(var i = 0; i< possibleCells.length; i++) {
        var cell = $(".square[row="+ possibleCells[i].x + "][col=" + possibleCells[i].y +"]");
        $(cell).click(clickOnCell);
        // possibleCells[i].onclick = clickOnCell;
    }

}

function hasPossibleCells(){
    var result;
    $.ajax
    (
        {
            async: false,
            url: '/games',
            data:
            {
                action: 'possibleCellsFlag',
            },
            type: 'GET',
            success: function (json) {
                console.log(json);
                result = json;
            }
        }
    )
    return result;
}

function skipTurn(){
    $.ajax(
        {
            async: false,
            url: '/games',
            data: {
                action: "changeTurn",
            },
            type: 'POST',
            success: function() {}
        }
    );
}

function clickOnCell(event) {
    if(isMyTurn){
        //remove previus selected
        var selectedCell = $('.selectedSquare')[0];
        if(selectedCell != null) {
            selectedCell.classList.remove('selectedSquare');
        }

        //set new selected
        selectedCell = event.target
        event.target.classList.add('selectedSquare');
    }

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

function onLeaveGameClick() {
    $.ajax(
        {
            url: '/games',
            data: {
                action: "leaveGame",
            },
            type: 'POST',
            success: function() {window.location = "../lobby/lobby.html"}
        }
    );
}

function onPlayMoveClick() {
    if(status == "Running") {
        var cursorCell;
        var selectedCell = $('.selectedSquare')[0];

        if (selectedCell != null) {
            cursorCell = $('.cursor')

            var selectedRow = selectedCell.getAttribute('row');
            var selectedCol = selectedCell.getAttribute('col');
            playMove(selectedRow, selectedCol);

            selectedCell.classList.remove("selectedSquare")
            selectedCell.classList.add('cursor'); //TODO: add img to class cursor on css

            $(cursorCell).attr('src', '');
            $(cursorCell).removeClass("cursor");
            updateBoard();

        } else {
            if (isMyTurn) {
                alert("Please choose a cell first");
            }
            else {
                alert("Yo! Not your turn");
            }
        }
    }
}

function playMove(selectedRow, selectedCol){
    $.ajax(
        {
            async: false,
            url: '/games',
            data: {
                action: "playMove",
                row: selectedRow,
                col: selectedCol
            },
            type: 'POST',
            success: function() {}
        }
    );

}

function playComputerMove() {
    var chosenCellByComputer = getComputerChoice();
    playMove(chosenCellByComputer.x, chosenCellByComputer.y);
    updateBoard();
}

function getComputerChoice() {
    var result;
    $.ajax
    (
        {
            async: false,
            url: '/games',
            data:
            {
                action: 'computerChoice'
            },
            type: 'GET',
            success: function (json) {
                result = json;
            }
        }
    )
    return result;
}

function handleEndGame(){
    updateBoard();
    var result;
    $.ajax
    (
        {
            async: false,
            url: '/games',
            data:
            {
                action: 'endGameMessage'
            },
            type: 'GET',
            success: showEndGameDialog
        }
    )
    return result;
}

function showEndGameDialog(json) {
    var div = $('.dialogDiv')[0];
    div.style.display = "block";
    // var playersNamesDiv = $('.playersNames');

    $('.endGameMessage').text(json);
}

function removeGameDialog() {
    $('.dialogDiv')[0].style.display = "none";
}

function redirectToLobby(){
    onLeaveGameClick(); //its like leave from pending game
}

function clickHandler(e) {
    if (!isButtonAvailable(e))
    {
        e.stopPropagation();
        e.preventDefault();
    }
}

function isButtonAvailable(e) {
    if (!e.target.classList.contains('leaveGame') && !e.target.classList.contains('close') && status === 'WaitingForPlayers' && !e.target.classList.contains('closeEnd'))
    {
        return false;
    }

    if (e.target.classList.contains('leaveGame') || e.target.classList.contains('close') || e.target.classList.contains('closeEnd') || e.target.classList.contains('replayButton'))
    {
        return true;
    }

    if (isMyTurn)
    {
        if (isButtonsEnabled)
        {
            return true;
        }
        else // buttons are Disabled.
        {
            return false;
        }
    }
    else //not my turn.
    {
        if (isButtonsEnabled)
        {
            if (e.target.classList.contains('moveList') || e.target.classList.contains('specialButton'))
            {
                return true;
            }
        }
        else // buttons are Disabled.
        {
            return false;
        }
    }
}

function appendToChatArea(entries) {
//    $("#chatarea").children(".success").removeClass("success");

    // add the relevant entries
    $.each(entries || [], appendChatEntry);

    // handle the scroller to auto scroll to the end of the game_backend area
    var scroller = $("#chatarea");
    var height = scroller[0].scrollHeight - $(scroller).height();
    $(scroller).stop().animate({ scrollTop: height }, "slow");
}

function appendChatEntry(index, entry){
    var entryElement = createChatEntry(entry);
    $("#chatarea").append(entryElement).append("<br>");
}

function createChatEntry (entry){
    entry.chatString = entry.chatString.replace (":)", "<span class='smiley'></span>");
    return $("<span class=\"success\">").append(entry.username + "> " + entry.chatString);
}

//call the server and get the game_backend version
//we also send it the current game_backend version so in case there was a change
//in the game_backend content, we will get the new string as well
function ajaxChatContent() {
    $.ajax({
        url: "/game_backend",
        data: "chatversion=" + chatVersion,
        dataType: 'json',
        success: function(data) {

            console.log("Server game_backend version: " + data.version + ", Current game_backend version: " + chatVersion);
            if (data.version !== chatVersion) {
                chatVersion = data.version;
                appendToChatArea(data.entries);
            }
            triggerAjaxChatContent();
        },
        error: function(error) {
            triggerAjaxChatContent();
        }
    });
}

//add a method to the button in order to make that form use AJAX
//and not actually submit the form
function chatOnload() { // onload...do
    //add a function to the submit event
    $("#chatform").submit(function() {
        $.ajax({
            data: $(this).serialize(),
            url: this.action,
            timeout: 2000,
            error: function() {
                //console.error("Failed to submit");
            },
            success: function(r) {
                //do not add the user string to the game_backend area
                //since it's going to be retrieved from the server
                //$("#result h1").text(r);
            }
        });

        $("#userstring").val("");
        // by default - we'll always return false so it doesn't redirect the user.
        return false;
    });
}

function triggerAjaxChatContent() {
    setTimeout(ajaxChatContent, refreshRate);
}

//activate the timer calls after the page is loaded
$(function() {

    //prevent IE from caching ajax calls
    $.ajaxSetup({cache: false});

    //The users list is refreshed automatically every second
   // setInterval(ajaxUsersList, refreshRate);

    //The game_backend content is refreshed only once (using a timeout) but
    //on each call it triggers another execution of itself later (1 second later)
    triggerAjaxChatContent();
});




function setReason(reason) {
    switch(reason)
    {
        case 'alone':
            $('.finishStatus')[0].innerHTML = 'You are the last player..';
            break;
        case 'moves':
            $('.finishStatus')[0].innerHTML = 'Moves Expired !!';
            break;
        case 'completed':
            $('.finishStatus')[0].innerHTML = 'Board was completed !';
            break;
        default:
            $('.finishStatus')[0].innerHTML = 'Unknown ..';
            break;
    }
}



var actions;
var maxIndex;
var index;

function resetBoard() {
    var squares = $('.square');
    for (i=0; i<squares.length; i++)
    {
        sqr = squares[i];
        if (sqr.classList.contains('black')) {
            sqr.classList.remove('black');
        }

        if (sqr.classList.contains('empty')) {
            sqr.classList.remove('empty');
        }

        if (sqr.classList.contains('selected')) {
            sqr.classList.remove('selected');
        }
    }

    var perfects = $('.perfect');
    for (i=0; i<perfects.length; i++)
    {
        perfects[i].classList.remove('perfect');
    }
}

/*function onNextClick() {
    if (index < maxIndex)
    {
        color = actions[index].m_State.toLowerCase();
        cells = actions[index].changedIndexes;
        for (i = 0; i < cells.length; i++) {
            row = cells[i].key;
            col = cells[i].value;
            square = $('.square[row="' + row + '"][col="' + col + '"]')[0];
            removeClass(square);
            if (color === 'empty' || color === 'black')
            {
                square.classList.add(color);
            }
        }
        index++;
        $('.currentTurnReplay')[0].innerHTML = index;

    }
}

function onPrevClick() {
    if (index > 0)
    {
        index--;
        $('.currentTurnReplay')[0].innerHTML = index;
        cells = actions[index].changedIndexes;
        for (i = 0; i < cells.length; i++)
        {
            color = actions[index].oldStates[i].toLowerCase();
            row = cells[i].key;
            col = cells[i].value;
            square = $('.square[row="' + row + '"][col="' + col + '"]')[0];
            removeClass(square);
            if (color === 'empty' || color === 'black')
            {
                square.classList.add(color);
            }
        }

    }
}*/


