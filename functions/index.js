const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore()

// I dont feel bad about leaking faculty emails, since they are already publicly available through the DSU Directory anyway
const privilegedUserEmails = []

exports.makePrivilegedUser = functions.auth.user().onCreate((user) => {
	if (privilegedUserEmails.indexOf(user.email) != -1) {
		db.collection('privileged-users').doc(user.uid).set({}).then(function () { })
	}
})