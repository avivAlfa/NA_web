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

// function loadGameClicked(event) {
//     var file = event.target.files[0];
//     var reader = new FileReader();
//     var creatorName = getUserName();
//
//     reader.onload = function () {
//         var content = reader.result;
//         $.ajax(
//             {
//                 url: 'games',
//                 data: {
//                     action: "loadGame",
//                     file: content,
//                     creator: creatorName
//                 },
//                 type: 'POST',
//                 success: loadGameCallback
//             }
//         );
//     };
//
//     $.ajax // Getting creator's name.
//     ({
//         url: 'login',
//         data: {
//             action: "status"
//         },
//         type: 'GET',
//         success: function (json) {
//             creatorName = json.userName;
//             reader.readAsText(file);
//         }
//     });
// }
//
// function loadGameCallback(json) {
//     if (json.isLoaded) {
//         alert("Load game Success !!");
//         refreshGamesList();
//         clearFileInput();
//     }
//     else {
//         clearFileInput();
//         alert(json.errorMessage);
//     }
// }