
var firestore = firebase.firestore();

var dbMovies = null;    // recebe lista de filmes do user
var userData = null;    // user

// botoes
var btnLogout = document.getElementById('bt-exit');

// autenticação no firebase --------------------------------------------------------

firebase.auth().onAuthStateChanged((user) => {
    if(user) {
        
        userData = firestore.collection("Users").doc(user.uid);

        dbMovies = userData.collection("Movies");             //pega a coleção no firestore do user

        userData.get().then((doc)=>{
            if(doc.exists){
                //renderAvatar(doc.data().photo);               // adiciona a foto do user  *** pega photo do doc
                renderAvatar(doc.get("Profile").photo);         // adiciona a foto do user  *** pega photo do map
                newMovie();     // carrega formulario de add filme
            } else {
                window.location.replace('index.html');
            }
        });    

    } else {
        window.location.replace('index.html');  // se nao tiver user logado vou para index.html
    }

});


// função em comum com lista de filmes não-vistos
function renderAvatar(img){
    let oImg = document.createElement('img');
    oImg.setAttribute('src', img);
    oImg.setAttribute('alt', 'avatar');
    oImg.className = "profile-pic";
    document.querySelector('#avatar').append(oImg);
}

btnLogout.addEventListener('click', ()=>{
    logout();
});
