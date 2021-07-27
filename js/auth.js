
// login por email e senha -----------------------------------------------
var btnLogin = null;
var inputEmail = null;
var inputPassword = null;

// criar login por email e senha -----------------------------------------------
var btnRegister = null;
var regEmail = null;
var regPassword = null;

// login pelo Gmail ------------------------------------------------------
var btnLoginGoogle = null;
var userData = null;        // recebe data do user

// login por email e senha ------------------------------------------------------------------

// renderiza formulario de login e senha
function renderLogin() {

    let loginForm = document.querySelector('#loginForm');

    loginForm.innerHTML = '';   // limpa div

    loginForm.innerHTML = `

            <form>
                <!-- <h1 class="h3 mb-3 fw-normal">Login por Email</h1> -->  
                <div class="form-floating">
                <input type="email" class="form-control" id="inputEmail" placeholder="name@example.com">
                <label for="floatingInput">Email</label>
                </div>
                <div class="form-floating">
                <input type="password" class="form-control" id="inputPassword" placeholder="Password">
                <label for="floatingPassword">Senha</label>
                </div>
            </form>

            <button class="w-100 btn btn-lg btn-primary" style="margin-bottom: 10px;" id="btnLogin">Log In</button>
            <button class="w-100 btn btn-lg btn-primary" style="margin-bottom: 10px;" onclick="renderRegister()">Register</button>
            
            <div id="btnLoginGoogle" class="google-btn">
                <div class="google-icon-wrapper">
                <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                </div>
                <p class="btn-text"><b>Sign in with google</b></p>
            </div>

        `;

        getBtnLogin();         // recupera referencias para o botao e form
        getBtnGoogle();     // recupera ouvinte do botao de login do google
    
}

// ouvinte para botão de login com email e senha
function getBtnLogin(){

    btnLogin = document.getElementById('btnLogin');
    inputEmail = document.getElementById('inputEmail');
    inputPassword = document.getElementById('inputPassword');

    btnLogin.addEventListener('click', function(){

        firebase.auth().signInWithEmailAndPassword(inputEmail.value, inputPassword.value)
        .then((userData) => {
            login(userData.user);   // verifica se existe o doc uid do user e vai para movies.html
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(error.message);
        });
    
    });
}

// criar login por email e senha ------------------------------------------------------------------

// renderiza formulario de registro
function renderRegister() {

    let loginForm = document.querySelector('#loginForm');

    loginForm.innerHTML = '';   // limpa div

    loginForm.innerHTML = `

            <form> 
                <div class="form-floating">
                    <input type="email" id="regEmail" class="form-control"  placeholder="name@example.com">
                    <label for="floatingInput">Insira Email</label>
                </div>
                <div class="form-floating">
                    <input type="password" id="regPassword" class="form-control"  placeholder="Password">
                    <label for="floatingPassword">Insira Senha</label>
                </div>
            </form>

            <button id="btnRegister" class="w-100 btn btn-lg btn-primary" style="margin-bottom: 10px;">Send</button>
            <button id="btnBack" class="w-100 btn btn-lg btn-primary" style="margin-bottom: 10px;" onclick="renderLogin()">Back</button>

        `;
        
        getInserts();   // procura a caixa de email e senha e o botao de SEND
}

// procura a caixa de email e senha e o botao de SEND
function getInserts(){
    btnRegister = document.querySelector('#btnRegister');
    regEmail = document.querySelector('#regEmail');
    regPassword = document.querySelector('#regPassword');

    register(); // ouvinte para o botão de SEND
}

// cria novo user no firebase database
// aponta um ouvinte para o botão de SEND para fazer registro de novo user quando clicar
function register(){

    btnRegister.addEventListener('click', function(){

        firebase.auth().createUserWithEmailAndPassword(regEmail.value, regPassword.value)
        .then((userCredential) => {
            // Signed in
            //userData = userCredential.user;
            regEmail.value = "";
            regPassword.value = "";

            newUser(userCredential.user, false);    // cria user com email e senha
            renderLogin();                          // chama formulario de login

            alert("Registro feito com sucesso!");

        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
        });
    
    });
    
}

// login pelo gmail ------------------------------------------------------------------

var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
firebase.auth().languageCode = 'pt';

// ouvinte do botão de login do Google
function getBtnGoogle(){

    btnLoginGoogle = document.getElementById('btnLoginGoogle');

    btnLoginGoogle.addEventListener("click", function(){
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            newUser(user, true);    // cria user com o google
            
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
}

// cria um novo usuario no firebase database
function newUser(user, boolean){
    // procura o UID do user na lista
    userData = firebase.firestore().collection("Users").doc(user.uid);

    userData.get().then(function(doc){
        if(doc.exists && boolean == true){
            login(user);        // verifica se existe o doc uid do user e vai para movies.html
        } else {
            setNewUser(user, boolean);
        }
    });
}
// true == Google | false == Email e Senha
// cria novo user no firebase
function setNewUser(user, boolean){
    if(boolean == true){
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
    } else {
        userData.set({
            bio: "insira uma biografia de cinefilo",
            countMovies: 0,
            country: "worldwide",
            email: user.email,
            movies: 0,
            name: "New User",
            photo: "https://st3.depositphotos.com/19428878/37724/v/450/depositphotos_377242666-stock-illustration-default-avatar-profile-flat-icon.jpg",
            seenMovies: 0,
        }, { merge: true }).then(function(){ // se user nao existir é criado na coleção User
            logout();       // se fazer um novo user com email e senha desloga em seguida
        });
    }
}

// Permite o não ir para proxima página se obj tem UID
function login(user){

    // user = firebase.auth().currentUser;

    if(user.uid != null){
        window.location.replace('movies.html');    
    } else {
        window.location.replace('index.html');
    }
}

// se tiver logado nao deixa ficar no index
function verifyLogin(){
    // verifica o status do login do user
    firebase.auth().onAuthStateChanged((user) => {
        if(user != null) {
            userData = firebase.firestore().collection("Users").doc(user.uid);
            userData.get().then(function(doc){
                if(doc.exists){
                    window.location.replace('movies.html'); // se tiver logado redireciona para o movies.html
                }
            });
        }
    });
}

// desloga da conta
function logout(){

    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });

}

getBtnGoogle();     // ouvinte para botão do google
getBtnLogin();      // ouvinte para botão com login e senha
verifyLogin();      // verifica se está logado