open Firebase
open Firebase.App

@val external hostname: string = "window.location.hostname"
let isLocalHost = hostname == "localhost"

let appConfig = {
  apiKey: "AIzaSyCxdYK84mfCjViOLo0L7nLKzag6K5zEQFc",
  authDomain: "ten-miles-elverdinge-2024.firebaseapp.com",
  projectId: "ten-miles-elverdinge-2024",
  storageBucket: "ten-miles-elverdinge-2024.appspot.com",
  messagingSenderId: "889759666885",
  appId: "1:889759666885:web:c9da4a4cc880535b04d6ac",
}

let app = App.initializeApp(appConfig)
let functions = Functions.getFunctions(app, ~regionOrCustomDomain=Domain.firebaseRegion)
if isLocalHost {
  Functions.connectFunctionsEmulator(functions, "localhost", 6004)
}

let createOrder = Functions.httpsCallable(functions, ~name=Domain.FunctionNames.createOrder)
