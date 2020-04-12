

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

exports.createProduct = functions.firestore
    .document('products/{itemId}')
    .onCreate((snap, context) => {
        const newValue = snap.data();
        let itemid = context.params.itemId;

        var name = newValue.name;
        var patt = /ugly|messy|trash|body/;

        if(patt.test(name)){
            console.log("Sanitizing bad product name...");
            name = "Generic New Product Name";
        }

        return snap.ref.set({
            name: name
        }, {merge: true});
    });

exports.updateProduct = functions.firestore
    .document('products/{itemId}')
    .onUpdate((change, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const newValue = change.after.data();

        // ...or the previous value before this update
        const previousValue = change.before.data();

        // access a particular field as you would any JS property
        var price = newValue.price;

        if(price < previousValue.price/2){
            console.log("New price less than 50% of original: ", newValue.price, previousValue.price);
            price = previousValue.price/2;
        }

        return change.after.ref.set({
            price: price
          }, {merge: true});
    });
