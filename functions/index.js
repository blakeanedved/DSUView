const functions = require('firebase-functions');
const ics = require('ics')

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore()
const bucket = admin.storage().bucket()

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

exports.regenerateICSFile = functions.firestore.document('events/{eventDoc}').onCreate((snap, context) => {
	db.collection("events").get().then((querySnapshot) => {
		var icsEvents = []
		querySnapshot.forEach((doc) => {
			icsEvents.push(eventToICSEvent(doc.data()))
		})
		const { error, value } = ics.createEvents(icsEvents)
		if (error) {
			console.log('Error')
		} else {
			bucket.file('EventsCalendar.ics').createWriteStream().end(value)
		}
	})
})

function eventToICSEvent(calEvent) {
	var start = new Date(1000 * calEvent.start._seconds)
	var end = new Date(1000 * calEvent.end._seconds)
	return {
		start: [start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes()],
		end: [end.getFullYear(), end.getMonth() + 1, end.getDate(), end.getHours(), end.getMinutes()],
		title: calEvent.title,
		description: calEvent.extendedProps.desc,
		location: calEvent.extendedProps.location,
		categories: [calEvent.extendedProps.category],
	}
}