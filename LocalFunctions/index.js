const nodemailer = require("nodemailer")
const admin = require("firebase-admin");

var serviceAccount = require("./creds.json");

const FULL_MONTHS = [
	"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]
const WEEK_DAY = [
	"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
]
const NUM_SUFFIXES = [
	"th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st"
]

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount.firebase),
	databaseURL: "https://dsuview.firebaseio.com"
});

let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: serviceAccount.nodemailer
})

var db = admin.firestore();

var now = new Date()
var week = now
week.setDate(week.getDate() + 7)

db.collection("users").get().then((querySnapshot) => {
	var emails = ''
	querySnapshot.forEach((doc) => {
		emails += doc.data().email + ', '
	})
	db.collection("events").get().then((querySnapshot) => {
		var events = []
		querySnapshot.forEach((doc) => {
			var start = new Date(1000 * doc.data().start._seconds)
			var end = new Date(1000 * doc.data().end._seconds)
			if ((start >= now && start < week) || (end > now && end <= week) || (start <= now && end >= week)) {
				events.push(doc.data())
			}
		})
		var html = formatEvents(events)
		sendEmail(emails, html)
	})
})

function datesToString(start, end, startTime, endTime) {
	return `${WEEK_DAY[start.getDay()]}, ${FULL_MONTHS[start.getMonth()]} ${start.getDate()}${NUM_SUFFIXES[start.getDate()]} at ${startTime} to ${WEEK_DAY[end.getDay()]}, ${FULL_MONTHS[end.getMonth()]} ${end.getDate()}${NUM_SUFFIXES[end.getDate()]} at ${endTime}`
}

function formatEvents(events) {
	var titles = '<html><head><style>.titles{padding-top:0;margin-top:0;}.element>p{padding-top:0;margin-top:0;}.element>h2,h4{padding-bottom:0;margin-bottom:0;}</style></head><body><h1 style="padding-bottom:0;margin-bottom:0;">Events</h1><ul class="titles">'
	var e = '<div class="events">'
	for (var i = 0; i < events.length; i++) {
		var start = new Date(1000 * events[i].start._seconds)
		var end = new Date(1000 * events[i].end._seconds)
		titles += `<li>${events[i].title}</li>`
		e += `<div class="element"><h2>${events[i].title}</h2><p>${events[i].extendedProps.desc}</p><h4>Category</h4><p>${events[i].extendedProps.category}</p><h4>When</h4><p>${datesToString(start, end, events[i].extendedProps.startTime, events[i].extendedProps.endTime)}</p><h4>Where</h4><p>${events[i].extendedProps.location}</p></div>`
	}
	titles += '</ul>'
	e += '</div></body></html>'
	return titles + e
}

function sendEmail(emails, html) {
	const mailOptions = {
		from: 'DSUView <dsuview@gmail.com>',
		to: emails,
		subject: 'Activites Post',
		html: html
	}

	transporter.sendMail(mailOptions, () => { })
}