
const submitButton = document.querySelector('.search__button');
const submitInput = document.querySelector('.search__input');
const usersContainer = document.querySelector('.users__container');

submitButton.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const username = submitInput.value;

    if (username === '') {
        alert('Informe um username válido');
    }

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
        .then(data => {

            const user = {
                name: data.name ?? data.login,
                username: data.login,
                followers: data.followers,
                repositoriesCount: data.public_repos,
                avatarURL: data.avatar_url
            };

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

}

function dialog(message) {
    alert(message);
}

//Renderizar informações do perfil

// Toggle themas
// Armazenar em cookies ou localStorage as preferências
