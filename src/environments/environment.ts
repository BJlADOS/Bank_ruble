// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: { [key: string]: any } = {
    firebase: {
        projectId: 'bank-ruble',
        appId: '1:318340993949:web:a56acde7e753f68a9ad574',
        databaseURL: 'https://bank-ruble-default-rtdb.europe-west1.firebasedatabase.app',
        storageBucket: 'bank-ruble.appspot.com',
        locationId: 'europe-west',
        apiKey: 'AIzaSyBlOEzqTebAt4q8d7NABj_wc3W3O5lrLAU',
        authDomain: 'bank-ruble.firebaseapp.com',
        messagingSenderId: '318340993949',
        measurementId: 'G-08MWBSFP01',
    },
    production: false,
    firebaseConfig: {
        apiKey: 'AIzaSyBlOEzqTebAt4q8d7NABj_wc3W3O5lrLAU',
        authDomain: 'bank-ruble.firebaseapp.com',
        databaseURL: 'https://bank-ruble-default-rtdb.europe-west1.firebasedatabase.app',
        projectId: 'bank-ruble',
        storageBucket: 'bank-ruble.appspot.com',
        messagingSenderId: '318340993949',
        appId: '1:318340993949:web:a56acde7e753f68a9ad574',
        measurementId: 'G-08MWBSFP01'
    } 
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
