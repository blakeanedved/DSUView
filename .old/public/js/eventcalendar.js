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
	"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]
const FULL_MONTHS = [
	"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]
const WEEK_DAY = [
	"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
]
const NUM_SUFFIXES = [
	"th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st"
]

// const COLORS = [
// 	['#f44336', '#FFFFFF'],
// 	['#e91e63', '#FFFFFF'],
// 	['#9c27b0', '#FFFFFF'],
// 	['#673ab7', '#FFFFFF'],
// 	['#3f51b5', '#FFFFFF'],
// 	['#2196f3', '#FFFFFF'],
// 	['#03a9f4', '#FFFFFF'],
// 	['#00bcd4', '#FFFFFF'],
// 	['#009688', '#FFFFFF'],
// 	['#4caf50', '#FFFFFF'],
// 	['#8bc34a', '#FFFFFF'],
// 	['#ff9800', '#FFFFFF'],
// 	['#ff5722', '#FFFFFF'],
// 	['#607d8b', '#FFFFFF']
// ]
const COLORS = [
	['#A79E70', '#FFFFFF'],
	['#50C9B5', '#FFFFFF'],
	['#9E3039', '#FFFFFF'],
	['#E37222', '#FFFFFF'],
	['#93509E', '#FFFFFF'],
	['#004165', '#FFFFFF'],
	['#00A9E0', '#FFFFFF'],
	['#4D4F53', '#FFFFFF']
]


function randomMaterialColor() {
	return COLORS[Math.floor(Math.random() * COLORS.length)]
}

var db, calendar;

$(document).ready(function () {

	$('select').formSelect()
	$('.sidenav').sidenav()

	var currentRoles = []
	var admin = false

	var currentFilter = ''

	// Initialize Firebase
	firebase.initializeApp(firebaseConfig)

	db = firebase.firestore()

	var provider = new firebase.auth.OAuthProvider('microsoft.com')
	provider.setCustomParameters({
		tenant: 'cbb5b525-3b95-4d93-9417-4dbb3c89512e'
	})

	firebase.auth().getRedirectResult()
		.then(function (result) {
			if (result.user) {
				M.toast({ html: 'You have been successfully logged in.' })
			}
		})
		.catch(function (error) {
			M.toast({ html: `Error logging in, ${error}` })
		})

	function getRoleStatus(user) {
		db.collection("users").doc(user.uid).get().then(doc => {
			admin = doc.data().admin
			currentRoles = doc.data().groups
			if (admin || currentRoles.length > 0) {
				calendar.setOption('editable', true)
				calendar.setOption('selectable', true)
				$('.fc-newEvent-button').prop('disabled', false).removeClass('fc-state-disabled')
			}
			calendar.render()
		}).catch(error => {
			console.log('error getting doc: ' + error)
		})
	}

	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			$('.login').hide()
			$('.logout').show()

			getRoleStatus(user)
			setTimeout(function () {
				getRoleStatus(user)
			}, 5000)
		} else {
			$('.logout').hide()
			$('.login').show()
			admin = false
			currentRoles = []
			calendar.setOption('editable', false)
			calendar.setOption('selectable', false)
			calendar.render()
			$('.fc-newEvent-button').prop('disabled', true).addClass('fc-state-disabled')
		}
	})

	$('#editEventSubmit').hide()
	var calendarEl = document.getElementById("calendar")
	var newEventModalElem = document.getElementById('newEventModal')
	var filterModalElem = document.getElementById('filterModal')
	var eventInfoModalElem = document.getElementById('eventInfoModal')

	var currentInfo;
	var currentEditingDocId;

	var modalInstances = M.Modal.init(newEventModalElem, {
		onCloseStart: function () {
			if (currentInfo != null) {
				calendar.addEvent(currentInfo.event)
			}
			currentInfo = null
		}
	})
	M.Modal.init(filterModalElem, {
		onCloseStart: function () {
			calendar.rerenderEvents()
		},
		onOpenEnd: function () {
			$('#filterEvents').focus()
		}
	})
	M.Modal.init(eventInfoModalElem, {
		onCloseEnd: function () {
			$('#eventInfoTitle').text('Title')
			$('#eventInfoDesc').html('Description')
			$('#eventInfoCategory').text('Category')
			$('#eventInfoLocation').text('Location')
			$('#eventInfoWhen').text('Timeframe')
		}
	})
	var newEventModal = M.Modal.getInstance(newEventModalElem)
	var filterModal = M.Modal.getInstance(filterModalElem)
	var eventInfoModal = M.Modal.getInstance(eventInfoModalElem)

	$('.datepicker').datepicker()
	M.Timepicker.init($('.timepicker'), { defaultTime: '6:00 AM' })
	var newEventStartTime = M.Timepicker.getInstance($('#newEventStartTime'))
	var newEventEndTime = M.Timepicker.getInstance($('#newEventEndTime'))

	calendar = new FullCalendar.Calendar(calendarEl, {
		plugins: ['interaction', 'dayGrid'],
		defaultView: 'dayGridMonth',
		navLinks: true,
		editable: false,
		selectable: false,
		header: {
			left: 'prev,next today,copyICSLink',
			center: 'title',
			right: 'clearFilter filter newEvent'
		},
		eventRender: function (info) {
			if (isEventFiltered(info.event)) {
				if (admin || currentRoles.indexOf(info.event.extendedProps.category) != -1) {
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
						openNewEventModal(
							info.event.start,
							info.event.end,
							info.event.extendedProps.startTime,
							info.event.extendedProps.endTime,
							true,
							{
								title: info.event.title,
								location: info.event.extendedProps.location,
								desc: info.event.extendedProps.desc,
								category: info.event.extendedProps.category
							})
					})
				} else {
					$(info.el).click(function () {
						openEventInfoModal(info.event)
					}).css('cursor', 'pointer')
				}
			} else {
				return false
			}
		},
		customButtons: {
			newEvent: {
				text: 'Add Event',
				click: function () {
					var today = new Date()
					openNewEventModal(today, today, '6:00 AM', '6:00 PM', false, {})

					newEventModal.open()
				}
			},
			filter: {
				text: 'Filter',
				click: function () {
					filterModal.open()
				}
			},
			clearFilter: {
				text: 'Clear Filter',
				click: function () {
					$('#filterEvents').val('')
					currentFilter = ''
					calendar.rerenderEvents()
				}
			},
			copyICSLink: {
				text: 'Copy ICS Link',
				click: function () {
					copyTextToClipboard('https://firebasestorage.googleapis.com/v0/b/dsuview.appspot.com/o/EventsCalendar.ics?alt=media&token=1ca03e2b-93ad-4d69-a889-7461a639bb28')
					M.toast({ html: 'ICS link copied to clipboard.' })
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
			dayGridMonth: { buttonText: 'Month' }
		},
		selectMirror: true,
		select: function (arg) {

			arg.end.setDate(arg.end.getDate() - 1)
			openNewEventModal(arg.start, arg.end, '6:00 AM', '6:00 PM', false, {})

			calendar.unselect()
		}
	})

	db.collection("events").get().then((querySnapshot) => {
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
					category: doc.data().extendedProps.category,
					docId: doc.id
				}
			})
		})
	})

	$("#editEventSubmit").click(function () { submitNewEvent(true) })
	$("#newEventSubmit").click(function () { submitNewEvent(false) })

	calendar.render()
	$('.fc-newEvent-button').prop('disabled', true).addClass('fc-state-disabled')
	calendar.setOption('editable', false)

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
		} else if (['No Location', 'TC (Trojan Center)', 'EH100 (East Hall Room 100)', 'BIT135 (Beacom Institute of Technology Room 135)'].indexOf($('#newEventLocation').val()) == -1) {
			M.toast({ html: 'You must pick one of the available locations.' })
			return
		} else if (['Admissions', 'Defensive Security', 'Offensive Security'].indexOf($('#newEventCategory').val()) == -1) {
			M.toast({ html: 'You must pick one of the available categories.' })
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
				category: $("#newEventCategory").val(),
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
			$('#newEventLocation option[val="' + options.location + '"]').prop('selected', true)
			$('#newEventLocation').formSelect()
		} else {
			$('#newEventLocation').val('')
		}

		if (options.desc) {
			$('#newEventDesc').val(options.desc)
			$('#newEventDescLabel').addClass('active')
		} else {
			$('#newEventDesc').val('')
		}
		M.textareaAutoResize($('#newEventDesc'));

		if (options.category) {
			$('#newEventCategory').val(options.category)
			$('#newEventCategory option[val="' + options.category + '"]').prop('selected', true)
			$('#newEventCategory').formSelect()
		} else {
			$('#newEventCategory').val('')
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

	function openEventInfoModal(calEvent) {
		$('#eventInfoTitle').text(calEvent.title)
		$('#eventInfoDesc').html(calEvent.extendedProps.desc)
		$('#eventInfoCategory').text(calEvent.extendedProps.category)
		$('#eventInfoLocation').text(calEvent.extendedProps.location)
		$('#eventInfoWhen').text(datesToString(calEvent))
		eventInfoModal.open()
	}

	function datesToString(calEvent) {
		return `${WEEK_DAY[calEvent.start.getDay()]}, ${FULL_MONTHS[calEvent.start.getMonth()]} ${calEvent.start.getDate()}${NUM_SUFFIXES[calEvent.start.getDate()]} at ${calEvent.extendedProps.startTime} to ${WEEK_DAY[calEvent.end.getDay()]}, ${FULL_MONTHS[calEvent.end.getMonth()]} ${calEvent.end.getDate()}${NUM_SUFFIXES[calEvent.end.getDate()]} at ${calEvent.extendedProps.endTime}`
	}

	$('.login').click(function () {
		firebase.auth().signInWithRedirect(provider)
	})

	$('.logout').click(function () {
		if (confirm("Are you sure that you want to log out?")) {
			firebase.auth().signOut()
			M.toast({ html: 'You have been logged out.' })
		}
	})

	$('#filterEventsSubmit').click(function () {
		currentFilter = $('#filterEvents').val()
		filterModal.close()
		calendar.rerenderEvents()
	})

	$('#filterEvents').on('change blur keyup keydown keypress', e => {
		currentFilter = $('#filterEvents').val()
		calendar.rerenderEvents()
	})

	var ctrlDown = false

	document.addEventListener("keydown", e => {
		if (e.keyCode == 27) {
			filterModal.close()
			newEventModal.close()
		} else if (e.keyCode == 13) {
			if (filterModal.isOpen) {
				filterModal.close()
			}
			// TODO: close newEventModal on enter too and submit event
		} else if (e.keyCode == 17) {
			ctrlDown = true
		} else if (ctrlDown && e.keyCode == 70) {
			e.preventDefault()
			if (filterModal.isOpen) {
				filterModal.close()
			} else {
				filterModal.open()
			}
		} else if (ctrlDown && e.keyCode == 83) {
			e.preventDefault()
			currentFilter = ''
			$('#filterEvents').val('')
		} else if (ctrlDown && e.keyCode == 78) {
			e.preventDefault()
			if (newEventModal.isOpen) {
				newEventModal.close()
			} else {
				newEventModal.open()
			}
		}
	})

	document.addEventListener("keyup", e => {
		if (e.keyCode == 17) {
			ctrlDown = false
		}
	})

	function isEventFiltered(calEvent) {
		if (currentFilter == '') {
			return true
		}

		var filterRegex = '[^\\s]*'
		for (var i = 0; i < currentFilter.length; i++) {
			filterRegex += `[${currentFilter[i].toUpperCase()}${currentFilter[i].toLowerCase()}][^\\s]*`
		}

		var re = new RegExp(filterRegex)

		if (re.test(calEvent.title)
			|| re.test(calEvent.extendedProps.category)
			|| re.test(calEvent.extendedProps.desc)
			|| re.test(calEvent.extendedProps.location)
			|| re.test(calEvent.extendedProps.startTime)
			|| re.test(calEvent.extendedProps.endTime)
			|| re.test(fullDateString(calEvent.start, calEvent.end))
		) {
			return true
		} else {
			return false
		}
	}

	function fullDateString(start, end) {
		datestring = ''

		for (var d = start; d <= end; d.setDate(d.getDate() + 1)) {
			var date = d.getDate()
			var month = FULL_MONTHS[d.getMonth()]
			var year = d.getFullYear()
			var day = WEEK_DAY[d.getDay()]

			datestring += `${date}, ${month}, ${year}, ${month}, ${day}, ${year}, ${day}, ${date}, ${month}, ${date}`
		}

		return datestring
	}

	function removeCalendarEvent(calEvent) {
		db.collection('events').doc(calEvent.extendedProps.docId).delete().then(function () {
			M.toast({ html: 'Event removed.' })
			currentInfo.event.remove()
		}).catch(function (error) {
			M.toast({ html: `Error removing event, ${error}` })
		})
	}

	function addCalendarEvent(calEvent) {
		delete calEvent.extendedProps.docId
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

	function fallbackCopyTextToClipboard(text) {
		var textArea = document.createElement("textarea");
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			console.log('Fallback: Copying text command was ' + msg);
		} catch (err) {
			console.error('Fallback: Oops, unable to copy', err);
		}

		document.body.removeChild(textArea);
	}

	function copyTextToClipboard(text) {
		if (!navigator.clipboard) {
			fallbackCopyTextToClipboard(text);
			return;
		}
		navigator.clipboard.writeText(text).then(function () {
			console.log('Async: Copying to clipboard was successful!');
		}, function (err) {
			console.error('Async: Could not copy text: ', err);
		});
	}
})