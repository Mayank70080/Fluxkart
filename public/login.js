window.onload = () => {
    if(sessionStorage.name){
        location.href = '/';
    }
}

let email = document.querySelector("#email") || null;
let phone = document.querySelector("#phone");
let password = document.querySelector("#pass");
let emailorphone = document.querySelector("#emailorphone");
let submit = document.querySelector("#submit");

if(email == null) {
    submit.addEventListener('click', () => {
        fetch('/login-user',{
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                emailorphone: emailorphone.value,
                password: password.value
            })
        })
        .then(res => res.json())
        .then(data => {
            redirect(data);
        })
    })
}
else {
    submit.addEventListener("click", () => {
        fetch('/register-user', {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                email: email.value,
                phone: phone.value,
                password: password.value
            })
        })
        .then(res => res.json())
        .then(data => {
            redirect(data);
        })
    })
}

const redirect = (data) => {
    if(!data.email){
        alert(data);
    } else{
        sessionStorage.email = data.email;
        sessionStorage.phone = data.phone;
        location.href = '/';
    }
}