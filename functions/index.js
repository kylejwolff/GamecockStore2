

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

exports.addMessage = functions.https.onRequest(async (req, res) => {
    const original = req.query.text;
    const snapshot = await admin.database().ref('/messages').push({original: original});
    res.redirect(303, snapshot.ref.toString());
});

exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onCreate((snapshot, context) => {
        const original = snapshot.val();
        console.log('Uppercasing', context.params.pushId, original);
        const uppercase = original.toUpperCase();
        return snapshot.ref.parent.child('uppercase').set(uppercase);
    });

exports.createProduct = functions.firestore
    .document('products/{itemId}')
    .onCreate((snap, context) => {
        const newValue = snap.data();
        let itemid = context.params.itemId;

        const name = newValue.name;
        console.log(name + ": new product created");
    });

exports.updateProduct = functions.firestore
    .document('products/{itemId}')
    .onUpdate((change, context) => {
        console.log("updateItem backend ran");
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const newValue = change.after.data();

        // ...or the previous value before this update
        const previousValue = change.before.data();

        // access a particular field as you would any JS property
        const product = admin.database().ref('/products/{itemId}');

        if(newValue.name === 'ugly' || newValue.name === 'messy' || newValue.name === 'trash' || newValue.name === 'body'){
            console.log("name filter", newValue.name, previousValue.name);
            newValue.name = previousValue.name;
        }

        return change.after.ref.set({
            name: newValue.name
          }, {merge: true});
    });