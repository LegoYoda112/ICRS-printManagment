let el = (id) => {document.getElementById(id)};
let print = (text) => {console.log(text)};

const octoprintIP = '';
const apiKey = "";

async function GETOctoprintData(ip = '', url = ''){
    const response = await fetch('http://' + ip + url, {
        method: 'GET',
        headers: {
            'X-Api-Key': apiKey
        }
    });
    if(response.status !== 200){
        console.error(response);
        return;
    }
    return response.json();
}

async function POSTOctoprintData(ip, url, data){
    const response = await fetch('http://' + ip + url, {
        method: 'POST',
        headers: {
            'X-Api-Key': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if(response.status !== 200){
        console.error(response);
        return;
    }
    return response.json();
}

async function DELETEOctoprintData(ip, url){
    const response = await fetch('http://' + ip + url, {
        method: 'DELETE',
        headers: {
            'X-Api-Key': apiKey,
        }
    });
    if(response.status !== 200){
        console.error(response);
        return;
    }
    return response.json();
}

// API commands
const getVersion = () => GETOctoprintData(octoprintIP, '/api/version');

// File system commands
const getFiles = () => GETOctoprintData(octoprintIP, '/api/files');
const getFileFromPath = (filePath) => {return GETOctoprintData(octoprintIP, '/api/files/local/' + filePath)};

// Printer state commands
const getCurrentJob = () => GETOctoprintData(octoprintIP, '/api/job');
const getPrinterState = () => GETOctoprintData(octoprintIP, '/api/printer');

// User commands
const getGroupList = () => GETOctoprintData(octoprintIP, '/api/access/groups');
const getUserList = () => GETOctoprintData(octoprintIP, '/api/access/users');
const getUser = (username) => {return GETOctoprintData(octoprintIP, '/api/access/users/' + username)};
const addActiveUser = (username, password) => {
    return POSTOctoprintData(octoprintIP, '/api/access/users', 
    {
        "name": username,
        "groups": ["user"],
        "active": true,
        "password": password,
        "permissions": []
    });
};
const removeUser = (username) => DELETEOctoprintData(octoprintIP, '/api/users/' + username);

async function apiCallTest(){
    //console.log(await getVersion());
    //console.log(await getFiles());
    //console.log(await getFileFromPath('Steering_link_V2_-_Part_1_0.3mm_PETG_MK3_3h12m.gcode'));
    //console.log(await getCurrentJob());
    //console.log(await getPrinterState());
    //console.log(await getGroupList());
    //console.log(await getUserList());
    //console.log(await getUser("ThomasG"));
    //console.log(await removeUser("tg830"));
    console.log(await addActiveUser("tg830", "tg830"));

    const users = (await getUserList()).users;
    print(users);
    users.forEach(function (user){
        if(user.admin == false){
            console.log("test");
            let div = document.createElement("div");
            let p_name = document.createElement("p");
            p_name.innerHTML = user.name;

            let delete_button = document.createElement("Button");
            delete_button.onclick = async function() { 
                console.log(await removeUser(user.name)) 
            };
            delete_button.innerHTML = "Delete";

            div.appendChild(p_name);
            div.appendChild(delete_button);
            document.body.append(div);
        }
    });

    const username_input = document.getElementById("username");
    print(username_input);
    const create_user_button = document.createElement("button");
    create_user_button.onclick = async function() { 
        console.log(await addActiveUser(username_input.value, username_input.value))
    };
    create_user_button.innerHTML = "Create user";
    document.body.append(create_user_button);
}

apiCallTest();