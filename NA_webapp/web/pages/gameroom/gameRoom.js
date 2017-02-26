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


var showScoreBoard;
var myTurnSaver = false;
var isFirstStatus = true;
var isReplayOn = false;

window.onload = function()
{
    checkLoginStatus();
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
    //$('.registeredPlayers').text(json.length);

    var playersNamesDiv = $('.playersNamesBody');
    var playersTypeDiv = $('.playersTypesBody');
    var playersColorDiv = $('.playersColorBody');
    var playersScoreDiv = $('.playersScoreBody');

    playersNamesDiv.empty();
    playersTypeDiv.empty();
    playersColorDiv.empty();
    playersScoreDiv.empty();
    for (i=0; i<json.length; i++)
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

    for (i=0; i<json.length; i++)
    {
        playerDivs[i].innerHTML = json[i].name// + ' #' + json[i].id;
        typeDivs[i].innerHTML = (json[i].isHuman?"Human":"Computer");
        // if(json[i].type)
        //     typeDivs[i].innerHTML = "Computer";
        // else
        //     typeDivs[i].innerHTML = "Human";

        var colorsList = getColorsList();
        colorDivs[i].innerHTML = colorsList[json[i].color];
        scoreDivs[i].innerHTML = json[i].score;
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
            if((!isMyTurn && newCurrentPlayerName === userName) || newCurrentPlayerName !== userName) {
                updateBoard();
            }

            $('.currentPlayerName')[0].innerHTML = newCurrentPlayerName;

            if (!isMyTurn && newCurrentPlayerName === userName) //if its my turn
            {
                var possibleCellFlag = hasPossibleCells();
                if(possibleCellFlag) {
                    isMyTurn = true;
                    if (!isComputer) {
                        alert('Hey Buddy! it is now your turn !');
                    }

                    if (isComputer)
                    {
                        playComputerMove();
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
                //handleEndGame();
                alert("Game Over");
                gamePositions = getGamePositions();
                gamePositionIndex = gamePositions.length - 1;
                var nextPrevElements = $(".prevNexDiv") //TODO: only prev?
                nextPrevElements.attr('style', "visibility: visible;");
            }



            // if (showScoreBoard) {
            //     showEndGameDiaglog();
            //     showScoreBoard = false;
            // }
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

function updateBoard() {
    user = getUser();
    $.ajax
    (
        {
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
    //remove previus selected
    var selectedCell = $('.selectedSquare')[0];
    if(selectedCell != null) {
        selectedCell.classList.remove('selectedSquare');
    }

    //set new selected
    selectedCell = event.target
    event.target.classList.add('selectedSquare');
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
    var cursorCell;
    var selectedCell = $('.selectedSquare')[0];

    if(selectedCell != null){
        cursorCell = $('.cursor')

        var selectedRow = selectedCell.getAttribute('row');
        var selectedCol = selectedCell.getAttribute('col');
        playMove(selectedRow, selectedCol);

        selectedCell.classList.remove("selectedSquare")
        selectedCell.classList.add('cursor'); //TODO: add img to class cursor on css

        $(cursorCell).attr('src','');
        $(cursorCell).removeClass("cursor");

    }else{
        alert("Please choose a cell first");
    }
}

function playMove(selectedRow, selectedCol){
    $.ajax(
        {
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
    window.location = "../lobby/lobby.html"
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



// function showEndGameDiaglog() {
//     $('.winnerDialog')[0].style.display = "inline-block";
//     $.ajax
//     (
//         {
//             url: 'games',
//             data:
//             {
//                 action: 'gameEnd'
//             },
//             type: 'GET',
//             success: showEndGameDiaglogCallback
//         }
//     )
// }
// function showEndGameDiaglogCallback(json) {
//     setReason(json.reason);
//     var board = json.board;
//     $('.highestScore')[0].innerHTML = json.winnersScore;
//     var winnerDiv = $('.winnerDiv')[0];
//
//     for (i = 0; i < json.winners.length; i++)
//     {
//         var winnerSpan = document.createElement('span');
//         winnerSpan.classList.add('winnerName');
//         winnerDiv.appendChild(winnerSpan);
//         winnerSpan.innerHTML = winnerSpan.innerHTML + json.winners[i].m_Name + " ";
//     }
//     winnerSpan.innerHTML = winnerSpan.innerHTML + '.';
//
//    // createBoardForEndDialog(board);
// }


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

function onNextClick() {
    if(gamePositionIndex < gamePositions.size() - 1) {
        gamePositionIndex++;

        // if(gamePositionIndex == gamePositions.size() - 1 || gamePositionIndex == 0) {
        //     isNextDisabled.setValue(true);
        //     isPrevDisabled.setValue(false);
        // } else {
        //     isPrevDisabled.setValue(false);
        //     isNextDisabled.setValue(false);
        // }
        //showGamePosition();

        var position = gamePositions.get(gamePositionIndex - 1);

        if(gamePositions.get(gamePositionIndex).getResinedPoints() != null) {

            for(var point in gamePositions.get(gamePositionIndex).getResinedPoints()) {
                gameEngine.setCellValue(point, new Cell(-999, 0, true, false));
                gameBoardUI.getCell((point.getX(), point.getY()).updateValues());
            }


        } else {

            gameEngine.setCellValue(position.getSelectedPoint(), new Cell(-999, 0, true, false));
            gameBoardUI.getCell(position.getSelectedPoint().getX(), position.getSelectedPoint().getY()).updateValues();

            gameEngine.setCellValue(gamePositions.get(gamePositionIndex).getSelectedPoint(),
                new Cell(999, 0, false, true));
            gameBoardUI.getCell(gamePositions.get(gamePositionIndex).getSelectedPoint().getX(),
                 gamePositions.get(gamePositionIndex).getSelectedPoint().getY()).updateValues();
        }
        showGamePosition(gamePositions.get(gamePositionIndex));
    }
}

function onPrevClick() {
    if(gamePositionIndex != 0) {
        gamePositionIndex--;

        // if(gamePositionIndex == gamePositions.size() - 1 || gamePositionIndex == 0) {
        //     isPrevDisabled.setValue(true);
        //     isNextDisabled.setValue(false);
        //
        // } else {
        //     isPrevDisabled.setValue(false);
        //     isNextDisabled.setValue(false);
        // }



        var position = gamePositions.get(gamePositionIndex + 1);

        if(position.getResinedPoints() != null) {

            var resinedIndex = 0;
            for(var point in position.getResinedPoints()) {

                gameEngine.setCellValue(point, new Cell
                (position.getResinedCells().get(resinedIndex).getValue(),
                    position.getResinedCells().get(resinedIndex).getColor(), true, false));
                gameBoardUI.getCell(point.getX(), point.getY()).updateValues();
                resinedIndex++;
            }


        } else {

            gameEngine.setCellValue(position.getSelectedPoint(), position.getSelectedCell());
            gameBoardUI.getCell( position.getSelectedPoint().getX(), position.getSelectedPoint().getY()).updateValues();

            gameEngine.setCellValue(gamePositions.get(gamePositionIndex).getSelectedPoint(),
                new Cell(999, 0, false, true));
            gameBoardUI.getCell(gamePositions.get(gamePositionIndex).getSelectedPoint().getX(),
                gamePositions.get(gamePositionIndex).getSelectedPoint().getY()).updateValues();
        }
        showGamePosition(gamePositions.get(gamePositionIndex));
    }
}

function showGamePosition(gamePosition) {
    $('.currentPlayerName').text(gamePosition.getCurrPlayer().getName());
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


