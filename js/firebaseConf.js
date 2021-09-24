function connectFirebase() {
    var firebaseConfig = {
        apiKey: "AIzaSyCdyMwPh9vAQ1Oj93OobcAAF9JYGJOkOW0",
        authDomain: "filse-533c0.firebaseapp.com",
        databaseURL: "https://filse-533c0.firebaseio.com",
        projectId: "filse-533c0",
        storageBucket: "filse-533c0.appspot.com",
        messagingSenderId: "217598975561",
        appId: "1:217598975561:web:ed9980eff403eb84f06998",
        measurementId: "G-V2QWDX81FG"
    };

    firebase.initializeApp(firebaseConfig);

}

connectFirebase();  // executa config do firebase

