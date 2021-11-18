$(document).ready( () => {
    console.log('in');
    addEventListeners();
});

function addEventListeners() {
    let loginButton = $("#login");
    let registerButton = $("#register");
    loginButton.on('click', () => {
        login();
    });
    registerButton.on('click', () => {
        console.log('in');
        register();
    });
}

function login() {
    let email = $("#emailLogin").val();
    let password = $("#pswLogin").val();
    $.post('/login', {
        email: email,
        psw: password
    }, (res) => {
        console.log(res);
        if( res !== "success") {
            $("#errMessage").text(res);
        }else {
            console.log(res);
            $("#errMessage").text("");
            window.location.href = "/type";
        }
    })
}

function register() {
    let firstName = $("#firstName").val();
    let surname = $("#surname").val();
    let email = $("#emailRegister").val();
    let phoneNumber = $("#phoneNumber").val();
    let password = $("#pswRegister").val();
    let confirmPassword = $("#confirmPsw").val();
    $.post('/register', {
        name: firstName + " " + surname,
        email: email,
        password: password,
        repeatPassword: confirmPassword,
        phoneNumber: phoneNumber
    }, (res) => {
        console.log(res);
        if( res !== "success") {
            $("#errMessage").text(res);
        }else {
            console.log(res);
            $("#errMessage").text("");
            window.location.href = "/";
        }
        
    });
}