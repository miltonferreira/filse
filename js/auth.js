// config firebase ------------------------------------------------------------------
connectFirebase();

var firestore = firebase.firestore();

// login por email e senha -----------------------------------------------
var btnLogin = document.getElementById('btnLogin');
var inputEmail = document.getElementById('inputEmail');
var inputPassword = document.getElementById('inputPassword');

// login pelo Gmail ------------------------------------------------------
var btnLoginGoogle = document.getElementById('btnLoginGoogle');
var userData = null;    // recebe data do user

// login por email e senha ------------------------------------------------------------------

btnLogin.addEventListener('click', function(){

    firebase.auth().signInWithEmailAndPassword(inputEmail.value, inputPassword.value)
    .then((userData) => {

        login(userData.user);   // verifica se existe o doc uid do user e vai para movies.html
        
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(error.message);
        // console.log(error.message);
    });

});

// login pelo gmail ------------------------------------------------------------------

var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
firebase.auth().languageCode = 'pt';

btnLoginGoogle.addEventListener("click", function(){
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // procura o UID do user na lista
        userData = firestore.collection("Users").doc(user.uid);

        userData.get().then(function(doc){
            if(doc.exists){
                login(user);        // verifica se existe o doc uid do user e vai para movies.html
            } else {
                userData.set({
                    bio: "insira uma biografia de cinefilo",
                    countMovies: 0,
                    country: "worldwide",
                    email: user.email,
                    movies: 0,
                    name: user.displayName,
                    photo: user.photoURL,
                    seenMovies: 0,
                }, { merge: true }).then(function(){ // se user nao existir é criado na coleção User
                    login(user);    // verifica se existe o doc uid do user e vai para movies.html
                });
            }
        });
        
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
});

// Permite o não ir para proxima página se obj tem UID
function login(user){

    // user = firebase.auth().currentUser;
    // var email, uid;

    let userID = user.uid;  // pega o UID do user

    if(userID != null){
        window.location.replace('movies.html');    
    } else {
        window.location.replace('index.html');
    }
}

// se tiver logado nao deixa entrar nessa página
function verifyLogin(){
    // verifica o status do login do user
    firebase.auth().onAuthStateChanged((user) => {
        if(user != null) {
            window.location.replace('movies.html'); // se tiver logado redireciona para o movies.html
        }
    });
}

verifyLogin();