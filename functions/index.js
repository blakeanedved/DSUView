const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore()

// I dont feel bad about leaking faculty emails, since they are already publicly available through the DSU Directory anyway
const privilegedUserEmails = {
}

exports.makeUser = functions.auth.user().onCreate((user) => {
	if (user.email in privilegedUserEmails) {
		db.collection('users').doc(user.uid).set({
			email: user.email,
			admin: privilegedUserEmails[user.email].admin,
			groups: privilegedUserEmails[user.email].groups
		}).then(function () { })
		if (privilegedUserEmails[user.email].admin) {
			db.collection('privileged-users').doc('Admins').get().then(doc => {
				var superusers = doc.data().superusers
				superusers.push(user.uid)
				db.collection('privileged-users').doc('Admins').set({ superusers: superusers }).then(function () { })
			})
		}
		for (var i = 0; i < privilegedUserEmails[user.email].groups.length; i++) {
			var docId = privilegedUserEmails[user.email].groups[i]
			db.collection('privileged-users').doc(docId).get().then(doc => {
				var superusers = doc.data().superusers
				superusers.push(user.uid)
				db.collection('privileged-users').doc(docId).set({ superusers: superusers }).then(function () { })
			})
		}
	} else {
		db.collection('users').doc(user.uid).set({ email: user.email, admin: false, groups: [] }).then(function () { })
	}
})