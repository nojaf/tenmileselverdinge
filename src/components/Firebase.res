module App = {
  type app

  type appConfig = {
    apiKey: string,
    authDomain: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string,
  }

  @module("firebase/app")
  external initializeApp: appConfig => app = "initializeApp"
}

module Firestore = {
  type firestore

  @module("firebase/firestore")
  external getFirestore: App.app => firestore = "getFirestore"

  type collectionReference<'documentdata, 'metadata>

  @module("firebase/firestore") @variadic
  external collection: (
    firestore,
    string,
    array<string>,
  ) => collectionReference<'documentdata, 'metadata> = "collection"

  type query<'documentdata, 'metadata>

  type querySnapshot<'documentdata, 'metadata>

  @module("firebase/firestore")
  external getDocs: query<'documentdata, 'metadata> => Js.Promise.t<
    querySnapshot<'documentdata, 'metadata>,
  > = "getDocs"

  external collectionReferenceToQuery: collectionReference<'documentdata, 'metadata> => query<
    'documentdata,
    'metadata,
  > = "%identity"

  type queryDocumentSnapshot<'documentdata, 'metadata>

  @get
  external docs: querySnapshot<'documentdata, 'metadata> => array<
    queryDocumentSnapshot<'documentdata, 'metadata>,
  > = "docs"

  @send
  external _data: (queryDocumentSnapshot<'documentdata, 'metadata>, unit) => 'documentdata = "data"

  let data = qds => _data(qds, ())

  type documentReference<'documentdata, 'metadata>

  /**
    Adds a new document to a collection.
    https://firebase.google.com/docs/reference/js/firestore_#adddoc_6e783ff 
 */
  @module("firebase/firestore")
  external addDoc: (
    collectionReference<'documentdata, 'metadata>,
    'documentdata,
  ) => Js.Promise.t<documentReference<'documentdata, 'metadata>> = "addDoc"
}

module Functions = {
  /// https://firebase.google.com/docs/reference/js/functions.functions
  type functions

  /// https://firebase.google.com/docs/reference/js/functions.md#getfunctions_60f2095
  @module("firebase/functions")
  external getFunctions: (App.app, ~regionOrCustomDomain: string) => functions = "getFunctions"

  /// https://firebase.google.com/docs/reference/js/functions.md#connectfunctionsemulator_505c08d
  @module("firebase/functions")
  external connectFunctionsEmulator: (functions, string, int) => unit = "connectFunctionsEmulator"

  type httpsCallableResult<'t> = {data: 't}

  type httpsCallable<'requestData, 'responseData> = (
    ~data: 'requestData,
  ) => Promise.t<httpsCallableResult<'responseData>>

  @module("firebase/functions")
  external httpsCallable: (functions, ~name: string) => httpsCallable<'requestData, 'responseData> =
    "httpsCallable"
}
