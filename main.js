
const submitButton = document.querySelector('.search__button');
const submitInput = document.querySelector('.search__input');
const usersContainer = document.querySelector('.users__container');


submitButton.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const username = submitInput.value;

    if (username === '') {
        dialog('O nome do usuário deve ser preenchido');
        return;
    }

    submitInput.value = '';
    getUserInfo(username);

});

function getUserInfo(username) {

    fetch(`https://api.github.com/users/${username}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Não foi possível localizar o usuário');
            }

            return response;
        })
        .then(response => response.json())
        .then(async data => {

            const user = {
                name: data.name ?? data.login,
                username: data.login,
                followers: data.followers,
                repositoriesCount: data.public_repos,
                avatarURL: data.avatar_url,
                repositories: []
            };


            const response = await fetch(`${data.repos_url}?sort=created&direction=desc&per_page=4`);
            const repositories = await response.json();

            user.repositories = repositories.map(function (repo) {
                return {
                    name: repo.name,
                    url: repo.html_url
                };
            });

            createCard(user);

        }).catch(error => {
            dialog(error.message);
        });
}


function createCard(user) {

    const card = document.createElement('div');
    card.classList.add('card');

    const img = document.createElement('img');
    img.setAttribute('title', 'User image profile');
    img.src = user.avatarURL;

    card.appendChild(img);

    const userInfo = document.createElement('div');
    userInfo.classList.add('card__user__info');

    userInfo.innerHTML = `
            <p>Name: ${user.name}</p>
            <p>Username: ${user.username}</p>
            <p>Followers: ${user.followers}</p>
            <p>Repositories count: ${user.repositoriesCount}</p>
        `;

    card.appendChild(userInfo);

    usersContainer.appendChild(card);

    if (user.repositories.length > 0) {

        const userRepositorie = document.createElement('div');
        userRepositorie.className = 'card__user__repositories';

        const h2 = document.createElement('h2');
        h2.textContent = 'Repositories';

        userRepositorie.appendChild(h2);

        user.repositories.forEach(function (repo) {
            const p = document.createElement('p');
            const a = document.createElement('a');
            a.href = repo.url;
            a.textContent = repo.name;
            a.target = '_blank';

            p.appendChild(a);
            userRepositorie.appendChild(p);
        });

        card.appendChild(userRepositorie);
    }
}

function dialog(message) {

    const dialog = document.createElement('dialog');
    dialog.className = 'modal';

    const p = document.createElement('p');
    p.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.className = 'close__button';
    closeButton.appendChild(document.createTextNode('OK'));
    closeButton.setAttribute('autofocus',true);
    closeButton.addEventListener('click', () => {
        dialog.close();
    });


    dialog.appendChild(p);
    dialog.appendChild(closeButton);
    document.body.appendChild(dialog);

    dialog.showModal();
}
