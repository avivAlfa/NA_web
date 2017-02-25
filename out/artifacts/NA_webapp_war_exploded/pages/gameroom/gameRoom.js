var status;
var user;
var userName;
var isComputer;
var turn = 0;
var refreshRate = 2000;
var isMyTurn = false;
var isButtonsEnabled = true;
var isEnabledSaver = true;
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
/*
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
function isUserComputer() {
    var result;
    $.ajax
    ({
        async: false,
        url: '/usersList',
        data: {
            action: "currentUser"
        },
        type: 'GET',
        success: function(json) {
            result = json.isComputer;
        }
    });
    return result;
}
*/

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
                action: 'gameDetails',
                key: -1
            },
            type: 'GET',
            success: loadGameDetailsCallback
        }
    )
}
function loadGameDetailsCallback(json) {
    // var key = json.key;
    // var creatorName = json.creatorName;
    // var gameName = json.gameTitle;
    // var moves = json.moves;
    // var boardSize = json.rows + " X " + json.cols;

    // $('.key').text("Game id: " + key + ".");
    // $('.creatorName').text("Game Creator: " + creatorName + ".");
    // $('.gameName').text("Game Title: " + gameName);
    // $('.boardSize').text("Board size: " + boardSize);
    // $('.moves').text("Moves number: " + moves);
    // $('.registeredPlayers').text(json.registeredPlayers);
    // $('.requiredPlayers').text(json.requiredPlayers);
    // $('.totalMoves').text(moves);

    //createBoard(json.rows, json.cols, json.rowBlocks, json.colBlocks);
    createBoard(json.gameEngine.gameBoard.size, json.gameEngine.gameBoard.size, json.gameEngine.gameBoard.board);

}
/*
function createBoard(rows,cols, rowBlocks, colBlocks) {
    var board = $('.boardBody');
    board.contents().remove();
    colBlocksDiv = $(document.createElement('div'));
    colBlocksDiv.addClass('colBlocks');
    colBlocksDiv.appendTo(board);


    for (i=0; i<rows; i++)
    { // creates squares + row blocks.
        rowDiv = $(document.createElement('div'));
        rowDiv.addClass('rowDiv');
        rowSquares = $(document.createElement('div'));
        rowSquares.addClass('rowSquares');
        rowBlocksDiv = $(document.createElement('div'));
        rowBlocksDiv.addClass('rowBlocks');
        rowSquares.appendTo(rowDiv);
        rowBlocksDiv.appendTo(rowDiv);

        for (hint=0; hint<rowBlocks[i].length;hint++)
        {
            rowHint = $(document.createElement('div'));
            rowHint.addClass('rowHint');
            rowHint.attr('row', i);
            rowHint.attr('col', hint);
            rowHint.appendTo(rowBlocksDiv);
        }

        for (j=0; j<cols;j++)
        { // add the squares.
            squareDiv = $(document.createElement('div'));
            squareDiv.addClass('square');
            squareDiv.attr('row', i);
            squareDiv.attr('col', j);
            squareDiv.appendTo(rowSquares);
        }

        rowDiv.appendTo(board);
    }

    $('.square').each(function(i,sqr) { sqr.onclick = onSquareClick;});

    for (col=0; col<cols; col++)
    { // creates column blocks.
        colBlockDiv = $(document.createElement('div'));
        colBlockDiv.addClass('colBlock');
        for (hint=0; hint<colBlocks[col].length; hint++)
        {
            hintDiv = $(document.createElement('div'));
            hintDiv.addClass('colHint');
            hintDiv.appendTo(colBlockDiv);
            hintDiv.attr('row', hint);
            hintDiv.attr('col', col);
            //hintDiv.innerHTML = colBlocks[col][hint];
        }
        colBlockDiv.appendTo(colBlocksDiv);
    }

    var hints = $('.colHint');
    var i=0;
    for (col=0; col<cols; col++)
    { //add columns block numbers (the text inside the divs)
        for (hint=0; hint<colBlocks[col].length; hint++)
        {
            hints[i].innerHTML = colBlocks[col][hint];
            i++;
        }
    }

    var hints = $('.rowHint');
    var i=0;
    for (row=0; row<rows; row++)
    { //add row block numbers (the text inside the divs)
        for (hint=0; hint<rowBlocks[row].length; hint++)
        {
            hints[i].innerHTML = rowBlocks[row][hint];
            i++;
        }
    }
}
*/
function createBoard(rows, cols, boardArr) {
    var board = $('.boardBody');
    board.contents().remove();

    for (i = 0; i < rows; i++) { // creates squares + row blocks.
        rowDiv = $(document.createElement('div'));
        rowDiv.addClass('rowDiv');

        for (j = 0; j < cols; j++) { // add the squares.
            squareDiv = $(document.createElement('div'));
            squareDiv.addClass('square');
            if(!boardArr[i][j].isEmpty && !boardArr[i][j].isCursor)
                squareDiv.append(boardArr[i][j].value);
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

//Refresh methods
//-------------------
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
        if(json[i].type)
            typeDivs[i].innerHTML = "Computer";
        else
            typeDivs[i].innerHTML = "Human";

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
    newCurrentPlayerName = json.currentPlayerTurnName;

    switch(newStatus)
    {
        case 'WaitingForPlayers':
            status = newStatus;
            break;
        case 'Running':
            //if (!isReplayOn)
            //{
                updateGamePage();
           // }

            $('.currentPlayerName')[0].innerHTML = newCurrentPlayerName;
            if (status === 'WaitingForPlayers')
            {
                alert('Game is on!');
            }

            if (!isMyTurn && newCurrentPlayerName === userName)
            {
                if (!isComputer)
                {
                    alert('Hey Buddy! it is now your turn !');
                }

                isMyTurn = true;
                // if (isComputer && isReplayOn)
                // {
                //     isMyTurn = false;
                // }
                //else
                if (isComputer)
                {
                    playComputerTurn();
                }
            }

            if (isMyTurn && playerTurn != userName)
            {
                alert('It is your turn, but server says its someone else turn ...');
                isMyTurn = false;
            }
            status = newStatus;
            break;
        case "Finished":
            isMyTurn = false;
            if (showScoreBoard) {
                showEndGameDiaglog();
                showScoreBoard = false;
            }
            status = newStatus;
            break;
    }
    $('.gameStatus').text('Game status: ' + status);
}
//-------------------

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

function updateGamePage() {
    $.ajax
    (
        {
            url: '/games',
            data:
            {
                action: 'pageDetails'
            },
            type: 'GET',
            success: turnPlayCallback
        }
    )
}

function turnPlayCallback(json) {
    var currentMove = json.move;
    // var totalMoves = $('.totalMoves')[0].innerHTML;
    // if (totalMoves != undefined && totalMoves < currentMove)
    // {
    //     currentMove--;
    // }

    // $('.scoreSpan')[0].innerHTML = json.score;
    // $('.currentMove')[0].innerHTML = currentMove;
    // $('.undoSpan')[0].innerHTML = json.undo;
    // $('.turnSpan')[0].innerHTML = json.turn;

    // if (isMyTurn)
    // {
    //     $('.turnSpan')[0].innerHTML = json.turn;
    // }
    // else
    // {
    //     $('.turnSpan')[0].innerHTML = '0';
    // }

    var color;
    var board = json.board.m_Board;
    var square;
    turn = json.turn;
    for (i=0; i<board.length; i++)
    {
        for (j=0; j<board[0].length; j++)
        {
            square = $('.square[row="' + i + '"][col="' + j + '"]')[0];
            removeClass(square);
            color = board[i][j].m_CellState;
            if (color === 'BLACK')
            {
                square.classList.add('black');
            }
            else if (color ==='EMPTY')
            {
                square.classList.add('empty');
            }
            else
            {
                //nothing..
            }
        }
    }
    if (isMyTurn)
    {
        setPerfectRows(json.perfectRows);
        setPerfectCols(json.perfectCols);
    }
}

document.addEventListener("click",clickHandler,true);

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



function showEndGameDiaglog() {
    $('.winnerDialog')[0].style.display = "inline-block";
    $.ajax
    (
        {
            url: 'games',
            data:
            {
                action: 'gameEnd'
            },
            type: 'GET',
            success: showEndGameDiaglogCallback
        }
    )
}
function showEndGameDiaglogCallback(json) {
    setReason(json.reason);
    var board = json.board;
    $('.highestScore')[0].innerHTML = json.winnersScore;
    var winnerDiv = $('.winnerDiv')[0];

    for (i = 0; i < json.winners.length; i++)
    {
        var winnerSpan = document.createElement('span');
        winnerSpan.classList.add('winnerName');
        winnerDiv.appendChild(winnerSpan);
        winnerSpan.innerHTML = winnerSpan.innerHTML + json.winners[i].m_Name + " ";
    }
    winnerSpan.innerHTML = winnerSpan.innerHTML + '.';

    createBoardForEndDialog(board);
}

function createBoardForEndDialog(board) {
    var rows = board.m_Rows;
    var cols = board.m_Cols;
    var boardBody = $('.completedBoardBody');

    for (i=0; i<rows; i++)
    { // creates squares.
        rowDiv = $(document.createElement('div'));
        rowDiv.addClass('rowDiv');
        rowSquares = $(document.createElement('div'));
        rowSquares.addClass('rowSquares');
        rowSquares.appendTo(rowDiv);

        for (j=0; j<cols;j++)
        { // add the squares.
            squareDiv = $(document.createElement('div'));
            squareDiv.addClass('square');
            squareDiv.appendTo(rowSquares);

            color = board.m_Board[i][j].m_CellState;
            if (color === 'BLACK')
            {
                squareDiv.addClass('black');
            }
            else if (color ==='EMPTY')
            {
                squareDiv.addClass('empty');
            }
        }

        rowDiv.appendTo(boardBody);
    }
}

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


function onSquareClick(event) {
    if (event.target.classList.contains('selected'))
    {
        event.target.classList.remove('selected')
    }
    else
    {
        event.target.classList.add('selected');
    }
}

function onColorChooserClick(event) {
    if (event.target.classList.contains('colorSelected'))
    {
        event.target.classList.remove('colorSelected');
    }
    else
    {
        var colorChoosers = $('.colorChooserDiv').children();
        for (i=0; i<colorChoosers.length; i++)
        {
            if (colorChoosers[i].classList.contains('colorSelected'))
            {
                colorChoosers[i].classList.remove('colorSelected');
            }
        }
        event.target.classList.add('colorSelected');
    }
}

function onPlayMoveClick() {
    var selectedSquares = $('.selected');
    var row;
    var col;
    var color = getChooserColor();
    var decription = $('.textInput')[0].value;

    if (selectedSquares.length != 0 && color != undefined && turn < 2)
    {
        $('.colorSelected')[0].classList.remove('colorSelected');
        $('.textInput')[0].value = "";
        var pairList = [];
        for (i=0; i<selectedSquares.length; i++)
        {
            row = selectedSquares[i].getAttribute('row');
            col = selectedSquares[i].getAttribute('col');
          //  pairList.push({row,col});
            selectedSquares[i].classList.remove('selected');
        }

        var list = {cells: pairList};
        var toSend = JSON.stringify(list);
        $.ajax
        (
            {
                url: 'games',
                data:
                {
                    action: 'turnPlay',
                    cells: toSend,
                    color: color,
                    description: decription
                },
                type: 'POST',
                success: turnPlayCallback
            }
        )
    }
}

function setPerfectRows(perfectRows) {
    if (perfectRows === undefined)
    {
        return;
    }

    for (i=0; i<perfectRows.length; i++)
    {
        for (j=0; j<perfectRows[0].length; j++)
        {
            var hint = $('.rowHint[row="' + i + '"][col="' + j + '"]')[0];
            if (hint != undefined && hint.classList.contains('perfect'))
            {
                hint.classList.remove('perfect');
            }

            if (perfectRows[i][j])
            {
                hint.classList.add('perfect');
            }
        }
    }
}

function setPerfectCols(perfectCols) {
    if (perfectCols === undefined)
    {
        return;
    }

    for (i=0; i<perfectCols.length; i++)
    {
        for (j=0; j<perfectCols[0].length; j++)
        {
            var hint = $('.colHint[row="' + j + '"][col="' + i + '"]')[0];
            if (hint != undefined && hint.classList.contains('perfect'))
            {
                hint.classList.remove('perfect');
            }

            if (perfectCols[i][j])
            {
                hint.classList.add('perfect');
            }
        }
    }
}

function removeClass(square) {
    if (square.classList.contains('black'))
    {
        square.classList.remove('black');
    }
    else if (square.classList.contains('empty'))
    {
        square.classList.remove('empty');
    }
}

function getChooserColor() {
    var color = $('.colorSelected')[0];
    if (color == undefined)
    {
        return undefined;
    }

    if (color.classList.contains('blackChooser'))
    {
        return 'black';
    }
    else if (color.classList.contains('whiteChooser'))
    {
        return 'empty';
    }
    else if (color.classList.contains('undefinedChooser'))
    {
        return 'undefined';
    }
    else
    {
        return undefined;
    }
}

function onEndMoveClick() {
    isMyTurn = false;
    turn = 0;
    $.ajax
    (
        {
            url: 'games',
            data:
            {
                action: 'endMove'
            },
            type: 'POST',
            success: updateGamePage
        }
    )
}

function onUndoClick() {
    $.ajax
    (
        {
            async: false,
            url: 'games',
            data:
            {
                action: 'undoMove'
            },
            type: 'POST',
            success: updateGamePage
        }
    )
}

function onMoveListClick() {
    $.ajax
    (
        {
            url: 'games',
            data:
            {
                action: 'moveList'
            },
            type: 'GET',
            success: onMoveListClickCallback
        }
    )
}

function onMoveListClickCallback(json) {
    isButtonsEnabled = false;
    $('.moveListDialog')[0].style.display = "inline-block";

    var body = $('.moveListBody');
    var text;
    var div;
    body.contents().remove();

    if (json.moves.length === 0)
    {
        text = 'There are no moves to show ..';
        div = $(document.createElement('div')).text(text);
        div.appendTo(body);
    }

    for (i=0; i<json.moves.length; i++)
    {
        text = json.moves[i];
        div = $(document.createElement('div')).text(text);
        div.appendTo(body);
    }
}

function removeDialog(event) {
    event.target.parentElement.parentElement.style.display = "none";
    //$('.moveListDialog')[0].style.display = "none";
    if (event.target.parentElement.parentElement != undefined && event.target.parentElement.parentElement.classList.contains('moveListDialog'))
    {
        isButtonsEnabled = true;
    }
}

function playComputerTurn() {
    $.ajax
    (
        {
            async: false,
            url: 'games',
            data:
            {
                action: 'computerTurn'
            },
            type: 'POST',
            success: updateGamePage
        }
    );
    onEndMoveClick();
}

function onReplayClick() {
    isReplayOn = true;
    isEnabledSaver = isButtonsEnabled;
    isButtonsEnabled = false;

    $.ajax
    (
        {
            async: false,
            url: 'games',
            data:
            {
                action: 'replay'
            },
            type: 'GET',
            success: replayCallback
        }
    );
}

function onReplayClose() {
    $('.replayDialog')[0].style.display = "none";
    isButtonsEnabled = isEnabledSaver;
    boardBody = $('.boardBody')[0];
    board = $('.board')[0];
    board.appendChild(boardBody);
    isReplayOn = false;
    updateGamePage();
}

var actions;
var maxIndex;
var index;

function replayCallback(json) {
    $('.replayDialog')[0].style.display = "inline-block";
    boardBody = boardBody = $('.boardBody')[0];;
    replayBoard = $('.replayBoardBody')[0];
    replayBoard.appendChild(boardBody);
    resetBoard();
    actions = json.actions;
    index = 0;
    maxIndex = actions.length;
    $('.currentTurnReplay')[0].innerHTML = '0';
    $('.totalTurnReplay')[0].innerHTML = actions.length;
}

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
}


