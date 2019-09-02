// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyB83iL8yDS8OkPnKv8t9z3dOWuo5XuCUS0",
	authDomain: "dsuview.firebaseapp.com",
	databaseURL: "https://dsuview.firebaseio.com",
	projectId: "dsuview",
	storageBucket: "",
	messagingSenderId: "947813853337",
	appId: "1:947813853337:web:e148d807a2bf092b"
};


const MONTHS = [
	"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Nov", "Dec"
]

const COLORS = [
	['#f44336', '#FFFFFF'],
	['#e91e63', '#FFFFFF'],
	['#9c27b0', '#FFFFFF'],
	['#673ab7', '#FFFFFF'],
	['#3f51b5', '#FFFFFF'],
	['#2196f3', '#FFFFFF'],
	['#03a9f4', '#FFFFFF'],
	['#00bcd4', '#FFFFFF'],
	['#009688', '#FFFFFF'],
	['#4caf50', '#FFFFFF'],
	['#8bc34a', '#FFFFFF'],
	['#ff9800', '#FFFFFF'],
	['#ff5722', '#FFFFFF'],
	['#607d8b', '#FFFFFF']
]

function randomMaterialColor() {
	return COLORS[Math.floor(Math.random() * COLORS.length)]
}

var db;

$(document).ready(function () {

	// Initialize Firebase
	firebase.initializeApp(firebaseConfig)

	db = firebase.firestore()

	var provider = new firebase.auth.OAuthProvider('microsoft.com');
	provider.setCustomParameters({
		tenant: 'cbb5b525-3b95-4d93-9417-4dbb3c89512e'
	})

	firebase.auth().getRedirectResult()
		.then(function (result) {
			if (result.user) {
				M.toast({ html: 'You have been successfully logged in.' })
				$('#login').hide()
				$('#logout').show()
			}
		})
		.catch(function (error) {
			M.toast({ html: `Error logging in, ${error}` })
		})




	$('#editEventSubmit').hide()
	var calendarEl = document.getElementById("calendar")
	var newEventModalElem = document.getElementById('newEventModal')

	var currentInfo;
	var currentEditingDocId;
	var triggerModalClose = false

	var modalInstances = M.Modal.init(newEventModalElem, {
		onCloseStart: function () {
			if (triggerModalClose) {
				calendar.addEvent(currentInfo.event)
			} else {
				triggerModalClose = true
			}
		}
	})
	var newEventModal = M.Modal.getInstance(newEventModalElem)

	$('.datepicker').datepicker()
	M.Timepicker.init($('.timepicker'), { defaultTime: '6:00 AM' })
	var newEventStartTime = M.Timepicker.getInstance($('#newEventStartTime'))
	var newEventEndTime = M.Timepicker.getInstance($('#newEventEndTime'))

	calendar = new FullCalendar.Calendar(calendarEl, {
		plugins: ['interaction', 'dayGrid', 'list', 'timeGrid'],
		defaultView: 'dayGridMonth',
		eventLimit: true,
		navLinks: true,
		editable: true,
		header: {
			left: 'newEvent prev,next today',
			center: 'title',
			right: 'listDay,listWeek,dayGridMonth'
		},
		eventRender: function (info) {
			$(info.el).addClass('tooltipped')
			$(info.el).attr('data-position', 'top')
			$(info.el).attr('data-tooltip', info.event.extendedProps.desc)
			$(info.el).tooltip()
			$(info.el).append('<i class="editbtn material-icons">edit</i><i class="removebtn material-icons">close</i>')
			$(info.el).find(".removebtn").click(function () {
				currentInfo = info
				removeCalendarEvent({
					title: info.event.title,
					start: info.event.start,
					end: info.event.end,
					color: info.event.backgroundColor,
					textColor: info.event.textColor,
					extendedProps: info.event.extendedProps
				})
			})
			$(info.el).find(".editbtn").click(function () {
				currentInfo = info
				currentEditingDocId = info.event.extendedProps.docId
				triggerModalClose = true
				openNewEventModal(
					info.event.start,
					info.event.end,
					info.event.extendedProps.startTime,
					info.event.extendedProps.endTime,
					true,
					{
						title: info.event.title,
						location: info.event.extendedProps.location,
						desc: info.event.extendedProps.desc
					})
			})
		},
		customButtons: {
			newEvent: {
				text: 'Add Event',
				click: function () {

					var today = new Date()
					openNewEventModal(today, today, '6:00 AM', '6:00 PM', false, {})

					newEventModal.open()
				}
			}
		},
		eventDrop: function (info) {
			if (confirm("Are you sure you want to move this event?")) {
				currentInfo = info
				editCalendarEvent({
					title: info.event.title,
					start: info.event.start,
					end: info.event.end,
					color: info.event.backgroundColor,
					textColor: info.event.textColor,
					extendedProps: info.event.extendedProps
				})
			}
		},
		views: {
			listDay: { buttonText: 'Day' },
			listWeek: { buttonText: 'Week' },
			dayGridMonth: { buttonText: 'Month' }
		},
		selectable: true,
		selectMirror: true,
		select: function (arg) {

			arg.end.setDate(arg.end.getDate() - 1)
			openNewEventModal(arg.start, arg.end, '6:00 AM', '6:00 PM', false, {})

			calendar.unselect()
		}
	})

	db.collection("events").get().then((querySnapshot) => {

		if (firebase.auth().currentUser) {
			$('#logout').show()
			$('#login').hide()
		} else {
			$('#login').show()
			$('#logout').hide()
		}

		querySnapshot.forEach((doc) => {
			calendar.addEvent({
				title: doc.data().title,
				start: doc.data().start.toDate(),
				end: doc.data().end.toDate(),
				color: doc.data().color,
				textColor: doc.data().textColor,
				extendedProps: {
					desc: doc.data().extendedProps.desc,
					location: doc.data().extendedProps.location,
					startTime: doc.data().extendedProps.startTime,
					endTime: doc.data().extendedProps.endTime,
					docId: doc.id
				}
			})
			// console.log(doc.data())
		})
	})

	$("#editEventSubmit").click(function () { submitNewEvent(true) })
	$("#newEventSubmit").click(function () { submitNewEvent(false) })

	calendar.render()

	function submitNewEvent(editing) {
		var startDate = new Date($("#newEventStartDate").val() + " " + $("#newEventStartTime").val())
		var endDate = new Date($("#newEventEndDate").val() + " " + $("#newEventEndTime").val())
		if ($("#newEventTitle").val() >= 8) {
			M.toast({ html: 'You must provide a more descriptive title for the event.' })
			return
		} else if ($("#newEventDesc").val() == "") {
			M.toast({ html: 'You must provide a description for the event.' })
			return
		} else if (startDate == undefined) {
			M.toast({ html: 'Invalid start date.' })
			return
		} else if (endDate == undefined) {
			M.toast({ html: 'Invalid end date.' })
			return
		} else if (endDate < new Date()) {
			M.toast({ html: 'End date must be after today.' })
			return
		}
		var c = randomMaterialColor()
		var calEvent = {
			start: startDate,
			end: endDate,
			title: $("#newEventTitle").val(),
			color: c[0],
			textColor: c[1],
			extendedProps: {
				location: $("#newEventLocation").val(),
				desc: $("#newEventDesc").val(),
				startTime: $("#newEventStartTime").val(),
				endTime: $("#newEventEndTime").val(),
				docId: ''
			}
		}
		if (editing) {
			calEvent.extendedProps.docId = currentEditingDocId
			calEvent.color = currentInfo.event.backgroundColor
			calEvent.textColor = currentInfo.event.textColor
			editCalendarEvent(calEvent)
		} else {
			addCalendarEvent(calEvent)
		}
		triggerModalClose = false
		newEventModal.close()
	}

	function openNewEventModal(startDate, endDate, startTime, endTime, editing, options) {
		$('.tooltip').tooltip('close');
		if (editing) {
			$("#newEventSubmit").hide()
			$("#editEventSubmit").show()
		} else {
			$("#editEventSubmit").hide()
			$("#newEventSubmit").show()
		}

		newEventStartTime.time = startTime;
		newEventEndTime.time = endTime;

		if (options.title) {
			$('#newEventTitle').val(options.title)
			$('#newEventTitleLabel').addClass('active')
		} else {
			$('#newEventTitle').val('')
		}
		if (options.location) {
			$('#newEventLocation').val(options.location)
			$('#newEventLocationLabel').addClass('active')
		} else {
			$('#newEventLocation').val('')
		}
		if (options.desc) {
			$('#newEventDesc').val(options.desc)
			$('#newEventDescLabel').addClass('active')
		} else {
			$('#newEventDesc').val('')
		}

		$('#newEventStartDate').datepicker('setDate', startDate)
		$('#newEventEndDate').datepicker('setDate', endDate)

		$('#newEventStartDate').val(MONTHS[startDate.getMonth()] + " " + startDate.getDate() + ", " + (1900 + startDate.getYear()))
		$('#newEventStartDateLabel').addClass('active')

		$('#newEventEndDate').val(MONTHS[endDate.getMonth()] + " " + endDate.getDate() + ", " + (1900 + endDate.getYear()))
		$('#newEventEndDateLabel').addClass('active')

		$('#newEventStartTime').val(startTime)
		$('#newEventStartTimeLabel').addClass('active')

		$('#newEventEndTime').val(endTime)
		$('#newEventEndTimeLabel').addClass('active')

		newEventModal.open()
	}

	$('#login').click(function () {
		firebase.auth().signInWithRedirect(provider)
	})

	$('#logout').click(function () {
		if (confirm("Are you sure that you want to log out?")) {
			firebase.auth().signOut()
			$('#logout').hide()
			$('#login').show()
			M.toast({ html: 'You have been logged out.' })
		}
	})

	function removeCalendarEvent(calEvent) {
		db.collection('events').doc(calEvent.extendedProps.docId).delete().then(function () {
			M.toast({ html: 'Event removed.' })
			currentInfo.event.remove()
		}).catch(function (error) {
			M.toast({ html: `Error removing event, ${error}` })
		})
	}

	function addCalendarEvent(calEvent) {
		db.collection('events').add(calEvent).then(function (docRef) {
			M.toast({ html: `Event added!` })
			calEvent.extendedProps.docId = docRef._key.path.segments[1]
			calendar.addEvent(calEvent)
		}).catch(function (error) {
			M.toast({ html: `Unable to add event, ${error}` })
		})
	}

	function editCalendarEvent(calEvent) {
		db.collection('events').doc(calEvent.extendedProps.docId).delete().then(function () {
			delete calEvent.extendedProps.docId
			db.collection('events').add(calEvent).then(function (docRef) {
				M.toast({ html: `Edit successful` })
				currentInfo.event.remove()
				calEvent.extendedProps.docId = docRef._key.path.segments[1]
				calendar.addEvent(calEvent)
			}).catch(function (error) {
				M.toast({ html: `Error editing event, ${error}` })
				currentInfo.revert()
			})
		}).catch(function (error) {
			M.toast({ html: `Error editing event, ${error}` })
			currentInfo.revert()
		})
	}
})