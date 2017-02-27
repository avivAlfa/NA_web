

window.onload = function ()
{
    $.ajax(
        {
            url: "/pages/signup/login",
            data: {
                action: "checkUser"
            },
            type: 'GET',
            success: redirectToLobby
        }
    );
};


function redirectToLobby(json){
    if(json){
        var signupDiv = $('.signupDiv');
        signupDiv.attr('style', 'visibility:hidden');

        $('.loginMessage h4').html("Welcome again, redirecting to lobby...");

        setTimeout(function () {
            window.location = "/pages/lobby/lobby.html";
        },2500);

    }
}

// function loginClicked(){
//     $.ajax(
//         {
//             async: false,
//             url: "/pages/signup/login",
//             data: {
//                 action: "login"
//             },
//             type: 'POST',
//             success: function () {}
//         }
//     );
// }