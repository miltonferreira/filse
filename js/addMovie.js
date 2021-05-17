// config firebase ------------------------------------------------------------------
connectFirebase();

var firestore = firebase.firestore();

var db = null;          // recebe lista de filmes do user
var userData = null;    // user

var movies = 0;         // pega quantidade de filmes do user
var countMovies = 0;    // pega quantidade de filmes nao-vistos

// botoes
var btnLogout = document.getElementById('bt-exit');

// autenticação no firebase --------------------------------------------------------

firebase.auth().onAuthStateChanged((user) => {
    if(user != null) {
        
        userLogin = user;

        userData = firestore.collection("Users").doc(userLogin.uid);

        db = userData.collection("Movies");             //pega a coleção no firestore do user

        userData.get().then(function(doc){
            if(doc.exists){
                movies = doc.data().movies;             // pega quantidade de filmes do user
                countMovies = doc.data().countMovies;   // pega quantidade de filmes nao-vistos
                renderAvatar(doc.data().photo);         // adiciona a foto do user
            } else {
                window.location.replace('index.html');
            }
        });    

    } else {
        window.location.replace('index.html');  // se nao tiver user logado vou para index.html
    }

    // var user = firebase.auth().currentUser;

    // if (user != null) {
    //     user.providerData.forEach(function (profile) {
    //         console.log("Sign-in provider: " + profile.providerId);
    //         console.log("  Provider-specific UID: " + profile.uid);
    //         console.log("  Name: " + profile.displayName);
    //         console.log("  Email: " + profile.email);
    //         console.log("  Photo URL: " + profile.photoURL);
    //     });
    // }

});

btnLogout.addEventListener('click', function(){
    logout();
});

function logout(){

    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });

}

function renderAvatar(img){
    let oImg = document.createElement('img');
    oImg.setAttribute('src', img);
    oImg.setAttribute('alt', 'avatar');
    oImg.className = "profile-pic";
    document.querySelector('#avatar').append(oImg);
}

// formulario ------------------------------------------------------------------------

// Pega os ID's do formulario
let title = document.querySelector('#title');
let urlPhoto = document.querySelector('#urlPhoto');
let description = document.querySelector('#description');
let age = document.querySelector('#age');
let director = document.querySelector('#director');

// Start grabbing our DOM Element
const submitBtn = document.querySelector('#submit');

// pega todos os alerts
let alerts = document.querySelectorAll('.alert');

var alertReturn = false;            // indica falta de preenchimento de campo

alerts.forEach( aler => {
    aler.style = "display: none";   // esconde os alerts dos campos
});

submitBtn.addEventListener('click', function() {

    alertReturn = checkForm(title, urlPhoto, description, age, director);

    if(alertReturn){
    
    } else {

        let titleInput = title.value;
        let urlPhotoInput = urlPhoto.value;
        let descriptionInput = description.value;
        let ageInput = age.value;
        let directorInput = director.value;

        userData.set({
            countMovies: (countMovies+1),       // +1 filme para ver
            movies: (movies+1),                 // +1 filme no total de filmes
        }, { merge: true }).then(function(){    // se user nao existir é criado na coleção User
            
            // Access the Database Collection
            db.doc().set({
                added: updateTime(),
                title: titleInput,
                photo: urlPhotoInput,
                description: descriptionInput,
                age: ageInput,
                director: directorInput,
                comment: null, 
                rating: 0,
                watched: false,
                    
            }).then(function(){

                clearForm(title, urlPhoto, description, age, director);     // limpa formulario
                $('#saveModalCenter').modal('show');                        // chama modal quando salva o filme 

            }).catch(function(error){

                console.log(error);
                    
            });

        });
    }    
    
});

function checkForm(title, urlPhoto, description, age, director){

    if(title.value == ""){
        alerts[0].style = "display: block";
        alertReturn = true;
    } else {
        alerts[0].style = "display: none";
    }

    if(urlPhoto.value == ""){
        alerts[1].style = "display: block";
        alertReturn = true;
    } else {
        alerts[1].style = "display: none";
    }

    if(description.value == ""){
        alerts[2].style = "display: block";
        alertReturn = true;
    } else {
        alerts[2].style = "display: none";
    }

    if(age.value == ""){
        alerts[3].style = "display: block";
        alertReturn = true;
    } else {
        alerts[3].style = "display: none";
    }

    if(director.value == ""){
        alerts[4].style = "display: block";
        alertReturn = true;
    } else {
        alerts[4].style = "display: none";
    }

    if(title.value != "" && urlPhoto.value != "" && description.value != "" && age.value != "" && director.value != ""){
        alertReturn = false;
    }

    return alertReturn;

}

// limpa os campos do formulario
function clearForm(title, urlPhoto, description, age, director){
    title.value = "";
    urlPhoto.value = "";
    description.value = "";
    age.value = "";
    director.value = "";
}

function updateTime(){
    return Math.floor(new Date().getTime()/1000.0); // retorna o tempo
}