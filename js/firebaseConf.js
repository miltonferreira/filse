function connectFirebase() {
    var firebaseConfig = {
        apiKey: "AIzaSyBSqhJIjjV_f8vQja9O1GpzadXf_0qK3EQ",
        authDomain: "formulariohuntbr.firebaseapp.com",
        databaseURL: "https://formulariohuntbr.firebaseio.com",
        projectId: "formulariohuntbr",
        storageBucket: "formulariohuntbr.appspot.com",
        messagingSenderId: "62317074901",
        appId: "1:62317074901:web:f662dff48c8288f67d055c",
        measurementId: "G-1369GE6MTJ"
    };

    firebase.initializeApp(firebaseConfig);

}

connectFirebase();  // executa config do firebase

