
const btnGet = document.querySelector('.get-token')

const btnDelete = document.querySelector('.delete')

const urlInfor = "https://api.github.com/user";

const urlRepos = "https://api.github.com/user/repos";

let reposDel = [];

document.querySelector(".token-input").value = localStorage.getItem('token') ?  localStorage.getItem('token') : '';

btnGet.addEventListener('click', GetUserAndRepos)

async function GetUserAndRepos () {

    const token = document.querySelector(".token-input").value;

    localStorage.setItem('token', token);

    const response = await fetch(urlInfor, {
        headers: {
            Authorization: "Bearer " + token,
        },
    });

    const data = await response.json();

    const avtImage = document.querySelector('.avatar')

    const name = document.querySelector('.user-name')

    avtImage.src = data.avatar_url;

    name.textContent = data.name;

    /* Get repos */

    const repoResponse = await fetch(urlRepos, {
        headers: {
            Authorization: "Bearer " + token,
        },
    });

    const repos = await repoResponse.json();

    console.log(repos)

    const reposList = document.querySelector('.repos')

    reposList.innerHTML = repos
        .map((repo) => `<div class="repo">
                            <a href="https://github.com/${repo.full_name}" class="name">${repo.full_name}</a>
                            <button class="btn-add">ADD</button>
                        </div>`
    )

    const btnsGet = await document.querySelectorAll('.btn-add');

    const names = await document.querySelectorAll('.name');

    SetBtnDel(btnsGet, names);

}

function SetBtnDel (btnsGet, names) {
    for(let i = 0; i < btnsGet.length; i++) {
        btnsGet[i].addEventListener('click', () => {
            reposDel.push(names[i].innerHTML)
            btnsGet[i].innerHTML = "ADDED"

            let pElement = document.createElement('p');
            let iElement = document.createElement('i');

            pElement.textContent = names[i].innerHTML;

            pElement.classList.add('repo-del');
            iElement.classList.add('ti-close');

            pElement.appendChild(iElement);

            document.querySelector('.list-del-repos').appendChild(pElement);
        })
    }
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

