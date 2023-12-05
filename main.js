
const btnGet = document.querySelector('.get-token')

const btnDelete = document.querySelector('.delete')

const urlInfor = "https://api.github.com/user";

const urlRepos = "https://api.github.com/user/repos";

var repos = []

let reposDel = [];

document.querySelector(".token-input").value = localStorage.getItem('token') ?  localStorage.getItem('token') : '';

btnGet.addEventListener('click', GetUserAndRepos)

async function GetUserAndRepos () {

    const token = document.querySelector(".token-input").value;

    localStorage.setItem('token', token);

    await SetUserInfor(urlInfor, token);

    /* Get repos */

    await SetRepos(urlRepos, token);

}

async function SetUserInfor (url, token) {
    const response = await fetch(url, {
        headers: {
            Authorization: "Bearer " + token,
        },
    });

    const userData = await response.json();

    const avtImage = document.querySelector('.avatar')

    const name = document.querySelector('.user-name')

    avtImage.src = userData.avatar_url;

    name.textContent = userData.name;
}

async function SetRepos (url, token) {

    const repoResponse = await fetch(url, {
        headers: {
            Authorization: "Bearer " + token,
        },
    });

    const repoData = await repoResponse.json();

    repos = repoData.map((repo) => repo.full_name);

    PrintRepos(repos)

    const btnsGet = await document.querySelectorAll('.btn-add');

    const names = await document.querySelectorAll('.name');

    SetBtnDel(btnsGet, names);
}

function SetBtnDel (btnsGet, names) {
    for(let i = 0; i < btnsGet.length; i++) {
        btnsGet[i].addEventListener('click', () => {
            if(btnsGet[i].innerHTML === "ADDED") {
                alert("This repo was added!")
            }
            else {
                reposDel.push(names[i].innerHTML)
                btnsGet[i].innerHTML = "ADDED"

                let pElement = document.createElement('p');
                let iElement = document.createElement('i');

                pElement.textContent = names[i].innerHTML;

                pElement.classList.add('repo-del');
                iElement.classList.add('ti-close');

                pElement.appendChild(iElement);

                document.querySelector('.list-del-repos').appendChild(pElement);
            }
        })
    }
}

function PrintRepos (repos) {
    const reposList = document.querySelector('.repos')

    reposList.innerHTML = repos
        .map((repo) => `<div class="repo">
                            <a href="https://github.com/${repo}" class="name">${repo}</a>
                            <button class="btn-add">ADD</button>
                        </div>`
        )
}

btnDelete.addEventListener("click", async () => {
    alert("Are you sure?")
    const token = document.querySelector(".token-input").value;
    reposDel.forEach(async (repo) => {
        await fetch("https://api.github.com/repos/" + repo, {
            method: "DELETE",
            headers: {
                // xxx is your token
                // Get token: https://github.com/settings/tokens/new
                Authorization: "Bearer " + token,
            },
        })
        .then(res => {
            if(res.ok == true) {
                alert("Delete successfully!")
            }
            console.log(res);
        });
        
    });
});

let searchBtn = document.querySelector('.search-btn')

searchBtn.addEventListener('click', () => {

    let searchValue = document.querySelector('.search-input').value

    const searchResult = [];

    repos.forEach((e) => {
        if(e.includes(searchValue)) {
            searchResult.push(e);
        }
    })

    if(searchResult.length === 0) {
        alert("Repo not found!");
    }

    PrintRepos(searchResult);

})

let searchValue = document.querySelector('.search-input')

searchValue.addEventListener('input', async () => {

    let token = localStorage.getItem('token');

    await SetRepos(urlRepos, token);
})



