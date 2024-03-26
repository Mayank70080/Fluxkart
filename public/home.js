let user = document.querySelector('#user');
let userinfo = document.querySelector('.userinfo');
let detailedinfo = document.querySelector(".detailedinfo");
let viewinfo = document.querySelector("#viewinfo");

window.onload = () => {
    if(!sessionStorage.email){
        location.href = '/login';
    } else{
        user.innerText = `hello ${sessionStorage.email}`;
    }
    getuserdata();
}

const logOut = document.querySelector('.logout');

logOut.onclick = () => {
    sessionStorage.clear();
    location.reload();
}

let userdata;
const userfullinfo = {
    email: [],
    phone: []
};

const getuserdata = () => {
    fetch('/user-data', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({
            email: sessionStorage.email || null,
            phone: sessionStorage.phone || null
        })
    })
    .then(res => res.json())
    .then(data => {
        userdata = {
            id: data.id,
            email: data.email,
            phone: data.phone,
            linkedid: data.linkedid,
            linkedprecedence: data.linkedprecedence,
            created_at: data.created_at,
            updated_at: data.updated_at
        }
        updateuserdata(userdata);
    })
}

const updateuserdata = (userdata) => {
    fetch('/update-data1', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({
            email: userdata.email
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data != 'NA') {
            updateuser(userdata, data);
        }
    })

    fetch('/update-data2', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({
            phone: userdata.phone
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data != 'NA') {
            updateuser(userdata, data);
        }
    })

}

const updatedb = (data) => {
    fetch('/update-db', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({
            id: data.id,
            linkedid: data.linkedid,
            linkedprecedence: data.linkedprecedence,
            updated_at: data.updated_at
        })
    }).then(data => {
        console.log(data);
    })
}

const updateuser = (userdata, data) => {
    if(userdata.created_at > data.created_at) {
        if(!userdata.linkedid.includes(data.id)) {
            userdata.linkedid.push(data.id);
            userdata.linkedprecedence = "Secondary";
            userdata.updated_at = currentdate();
            updatedb(userdata);
        }
    }
    else if(userdata.created_at < data.created_at) {
        if(!data.linkedid.includes(userdata.id)) {
            data.linkedid.push(userdata.id);
            data.linkedprecedence = "Secondary"
            data.updated_at = currentdate();
            updatedb(data);
        }
    }
    printuserdata(userdata);
}

const printuserdata = (userdata) => {
    console.log(userdata);
    userinfo.innerText = JSON.stringify(userdata, null, 2);
}

const currentdate = () => {
    const now = new Date();
    const time = now.toISOString();
    return time
}

const displaydetailedinfo = () => {
    userinfo.classList.add("hide");
    detailedinfo.classList.remove("hide");
    detailedinfo.innerText = JSON.stringify(userfullinfo, null, 2);
    console.log(userfullinfo);
}

viewinfo.addEventListener("click", () => {
    if(!userfullinfo.email.includes(userdata.email)) {
        userfullinfo.email.push(userdata.email);
    }
    if(!userfullinfo.phone.includes(userdata.phone)) {
        userfullinfo.phone.push(userdata.phone);
    }
    userdata.linkedid.forEach(element => {
        fetch('/view-data', {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                id: element
            })
        })
        .then(res => res.json())
        .then(data => {
            if(!userfullinfo.email.includes(data.email)) {
                userfullinfo.email.push(data.email);
            }
            if(!userfullinfo.phone.includes(data.phone)) {
                userfullinfo.phone.push(data.phone);
            }
            displaydetailedinfo();
        })
    })
    displaydetailedinfo();
})
