const activitiesUrl = './activities.json'
let config = {
	layout: {
		name: 'layout',
		padding: 0,
		panels: [{
				type: 'left',
				size: 100,
				resizable: false,
				minSize: 35
			},
			{
				type: 'main',
				size: 950,
				minSize: 550
			}
		]
	},
	sidebar: {
		name: 'sidebar',
		nodes: [{
			id: 'views',
			text: 'Views',
			group: true,
			expanded: true,
			groupShowHide: false,
			nodes: [{
					id: 'developmentCycle',
					text: 'Develop',
					selected: true
				},
				{
					id: 'tracker',
					text: 'Tracker'
				},
				{
					id: 'weeklySchedule',
					text: 'Week'
				},
			],
			onCollapse(event) {
				event.preventDefault()
			}
		}],
		onClick(event) {
			switch (event.target) {
				case 'developmentCycle':
					layout.html('main', developmentCycle)
					break
				case 'tracker':
					layout.html('main', tracker)
					break

				case 'weeklySchedule':
					layout.html('main', weeklySchedule)
					break
			}
		}
	},
	developmentCycle: {
		name: 'developmentCycle',
		columns: [{
				field: 'recid',
				text: '<div style="text-align: center;">ID</div>',
				size: '30px',
				sortable: true,
				resizable: false
			},
			{
				field: 'completion',
				text: '<div style="text-align: center;">&#10003;</div>',
				size: '10px',
				sortable: true,
				resizable: false,
				style: 'text-align: center',
				editable: {
					type: 'checkbox',
					style: 'text-align: center'
				}
			},
			{
				field: 'frequency',
				text: '<div style="text-align: center;">Freq.</div>',
				size: '50%',
				sortable: true,
				resizable: false,
				editable: {
					type: 'combo',
					items: ['Once', 'Daily', 'Weekly', 'Monthly']
				}
			},
			{
				field: 'category',
				text: '<div style="text-align: center;">Category</div>',
				size: '50%',
				sortable: true,
				resizable: false,
				editable: {
					type: 'text'
				}
			},
			{
				field: 'requirement',
				text: '<div style="text-align: center;">Requirement</div>',
				size: '100',
				sortable: true,
				resizable: false,
				editable: {
					type: 'text'
				}
			},
			{
				field: 'design',
				text: '<div style="text-align: center;">Design</div>',
				size: '50%',
				sortable: true,
				resizable: false,
				editable: {
					type: 'text'
				}
			},
			{
				field: 'development',
				text: '<div style="text-align: center;">Development</div>',
				size: '100',
				sortable: true,
				resizable: false,
				editable: {
					type: 'text'
				}
			},
			{
				field: 'testing',
				text: '<div style="text-align: center;">Testing</div>',
				size: '100%',
				sortable: true,
				resizable: false,
				editable: {
					type: 'text'
				}
			},
			{
				field: 'results',
				text: '<div style="text-align: center;">Results</div>',
				size: '100%',
				sortable: true,
				resizable: false,
				editable: {
					type: 'text'
				}
			},
			{
				field: 'start',
				text: '<div style="text-align: center;">Start</div>',
				size: '50%',
				sortable: true,
				sortMode: 'natural',
				resizable: false
			},
			{
				field: 'end',
				text: '<div style="text-align: center;">End</div>',
				size: '50%',
				sortable: true,
				sortMode: 'natural',
				resizable: false
			},
			{
				field: 'startDate',
				text: '<div style="text-align: center;">Start</div>',
				size: '50%',
				sortable: true,
				sortMode: 'natural',
				resizable: false
			},
			{
				field: 'endDate',
				text: '<div style="text-align: center;">End</div>',
				size: '50%',
				sortable: true,
				sortMode: 'natural',
				resizable: false
			}
		],
		records: [],
		onClick(event) {

		},
		onChange: function(event) {

		}
	},
	tracker: {
		name: 'tracker',
		columns: [{
				field: 'recid',
				text: '<div style="text-align: center;">ID</div>',
				size: '30px',
				sortable: true,
				resizable: false
			},
			{
				field: 'item',
				text: '<div style="text-align: center;">Item</div>',
				size: '100px'
			},
			{
				field: 'sunday',
				text: '<div style="text-align: center;">Sunday</div>',
				size: '100%',
				sortable: true,
				resizable: false,
				style: 'text-align: center',
				editable: {
					type: 'checkbox',
					style: 'text-align: center'
				}
			},
			{
				field: 'monday',
				text: '<div style="text-align: center;">Monday</div>',
				size: '100%',
				sortable: true,
				resizable: false,
				style: 'text-align: center',
				editable: {
					type: 'checkbox',
					style: 'text-align: center'
				}
			},
			{
				field: 'tuesday',
				text: '<div style="text-align: center;">Tuesday</div>',
				size: '100%',
				sortable: true,
				resizable: false,
				style: 'text-align: center',
				editable: {
					type: 'checkbox',
					style: 'text-align: center'
				}
			},
			{
				field: 'wednesday',
				text: '<div style="text-align: center;">Wednesday</div>',
				size: '100%',
				sortable: true,
				resizable: false,
				style: 'text-align: center',
				editable: {
					type: 'checkbox',
					style: 'text-align: center'
				}
			},
			{
				field: 'thursday',
				text: '<div style="text-align: center;">Thursday</div>',
				size: '100%',
				sortable: true,
				resizable: false,
				style: 'text-align: center',
				editable: {
					type: 'checkbox',
					style: 'text-align: center'
				}
			},
			{
				field: 'friday',
				text: '<div style="text-align: center;">Friday</div>',
				size: '100%',
				sortable: true,
				resizable: false,
				style: 'text-align: center',
				editable: {
					type: 'checkbox',
					style: 'text-align: center'
				}
			},
			{
				field: 'saturday',
				text: '<div style="text-align: center;">Saturday</div>',
				size: '100%',
				sortable: true,
				resizable: false,
				style: 'text-align: center',
				editable: {
					type: 'checkbox',
					style: 'text-align: center'
				}
			}
		],
		records: [],
		onClick(event) {
			//console.log(event);
		},
		onChange: function(event) {
			event.preventDefault()
			tracker.refresh()
		}
	},
	weeklySchedule: {
		name: 'weeklySchedule',
		columns: [{
				field: 'recid',
				text: '<div style="text-align: center;">ID</div>',
				size: '30px',
				sortable: true,
				resizable: false
			},
			{
				field: 'hour',
				text: '<div style="text-align: center;">Hour</div>',
				size: '50px',
				type: 'time'
			},
			{
				field: 'sunday',
				text: '<div style="text-align: center;">Sunday</div>',
				size: '100%',
				editable: {
					type: 'text'
				}
			},
			{
				field: 'monday',
				text: '<div style="text-align: center;">Monday</div>',
				size: '100%',
				editable: {
					type: 'text'
				}
			},
			{
				field: 'tuesday',
				text: '<div style="text-align: center;">Tuesday</div>',
				size: '100%',
				editable: {
					type: 'text'
				}
			},
			{
				field: 'wednesday',
				text: '<div style="text-align: center;">Wednesday</div>',
				size: '100%',
				editable: {
					type: 'text'
				}
			},
			{
				field: 'thursday',
				text: '<div style="text-align: center;">Thursday</div>',
				size: '100%',
				editable: {
					type: 'text'
				}
			},
			{
				field: 'friday',
				text: '<div style="text-align: center;">Friday</div>',
				size: '100%',
				editable: {
					type: 'text'
				}
			},
			{
				field: 'saturday',
				text: '<div style="text-align: center;">Saturday</div>',
				size: '100%',
				editable: {
					type: 'text'
				}
			}
		],
		records: [{
				recid: 5,
				hour: '5am'
			},
			{
				recid: 6,
				hour: '6am'
			},
			{
				recid: 7,
				hour: '7am'
			},
			{
				recid: 8,
				hour: '8am'
			},
			{
				recid: 9,
				hour: '9am'
			},
			{
				recid: 10,
				hour: '10am'
			},
			{
				recid: 11,
				hour: '11am'
			},
			{
				recid: 24,
				hour: '12pm'
			},
			{
				recid: 13,
				hour: '1pm'
			},
			{
				recid: 14,
				hour: '2pm'
			},
			{
				recid: 15,
				hour: '3pm'
			},
			{
				recid: 16,
				hour: '4pm'
			},
			{
				recid: 17,
				hour: '5pm'
			},
			{
				recid: 18,
				hour: '6pm'
			},
			{
				recid: 19,
				hour: '7pm'
			},
			{
				recid: 20,
				hour: '8pm'
			},
			{
				recid: 21,
				hour: '9pm'
			},
			{
				recid: 22,
				hour: '10pm'
			},
			{
				recid: 23,
				hour: '11pm'
			},
			{
				recid: 12,
				hour: '12am'
			},
			{
				recid: 1,
				hour: '1am'
			},
			{
				recid: 2,
				hour: '2am'
			},
			{
				recid: 3,
				hour: '3am'
			},
			{
				recid: 4,
				hour: '4am'
			}
		],
		onClick(event) {
			console.log(event);
		}
	}
}

window.loadData = function(url) {
	developmentCycle.load(url)
}

// initialization
let layout = new w2layout(config.layout)
let sidebar = new w2sidebar(config.sidebar)
let developmentCycle = new w2grid(config.developmentCycle)
let tracker = new w2grid(config.tracker)
let weeklySchedule = new w2grid(config.weeklySchedule)

layout.render('#main')
layout.html('left', sidebar)
layout.html('main', developmentCycle)

// after object creation functions
loadData(activitiesUrl)
developmentCycle.advanceOnEdit = false

w2ui.developmentCycle.on('change', function(event) {
	event.onComplete = function(event2) {
		let record = this.get(event2.detail.recid)
		// define date/time
		let date = w2utils.formatDate((new Date()), 'mm-dd-yyyy')
		let time = w2utils.formatTime((new Date()), 'hh:mi am')
		const dayOfWeekName = new Date().toLocaleString('default', {
			weekday: 'long'
		}).toLowerCase()

		// set time started & time ended
		if (record.start == '' || !record.start) {
			record.start = time
			record.startDate = date
		}
		record.end = time
		record.endDate = date

		// place last edited row's development into weekly schedule into corresponding day
		if (time.slice(-2) == 'AM') {
			const recid = parseInt(time.slice(0, 2))

			// if it doesn't already contain the development (prevent duplication)
			let hourDayText = weeklySchedule.get(recid)[dayOfWeekName]
			if (hourDayText != undefined || hourDayText) {
				if (!hourDayText.includes(record.development))
					hourDayText += ", " + record.development
			} else {
				hourDayText = record.development
			}
			weeklySchedule.set(recid, {
				[dayOfWeekName]: hourDayText
			})
		} else {
			const recid = parseInt(time.slice(0, 2)) + 12

			let hourDayText = weeklySchedule.get(recid)[dayOfWeekName]
			if (hourDayText != undefined || hourDayText) {
				if (!hourDayText.includes(record.development))
					hourDayText += ", " + record.development
			} else {
				hourDayText = record.development
			}
			weeklySchedule.set(recid, {
				[dayOfWeekName]: hourDayText
			})
		}

		this.refresh()
		weeklySchedule.refresh()
	};
});

// preload.js
window.api.save((event, value) => {
	let date = w2utils.formatDate((new Date()), 'mm-dd-yyyy')
	let time = w2utils.formatTime((new Date()), 'hh:mi am')

	let records = developmentCycle.records

	// duplicate the unique rows with frequency (daily, weekly, monthly)
	let todayRecords = []
	records.forEach(record => {
		if (record.startDate == date) {
			todayRecords.push(record)
		}
	})
	let todayDesigns = new Set(todayRecords.map(({
		design
	}) => design))
	let uniqueRecords = [...new Map(records.map((item) => [item['design'], item])).values()]
	uniqueRecords = uniqueRecords.filter(({
		design
	}) => !todayDesigns.has(design))

	uniqueRecords.forEach(record => {
		if (record.frequency === "Daily" && record.startDate != date ||
			record.frequency === "Weekly" && w2utils.formatDate(new Date(record.startDate) + 7) == date ||
			record.frequency === "Monthly" && record.startDate.slice(0, 2) != date.slice(0, 2)) {
			let nextLineNum = developmentCycle.records.length + 1
			const clone = structuredClone(record)
			clone.recid = nextLineNum
			clone.completion = false
			clone.development = ''
			clone.testing = ''
			clone.results = ''
			clone.start = time
			clone.end = time
			clone.startDate = date
			clone.endDate = date

			developmentCycle.add(clone)
		}
	})
	sortRecid()
	developmentCycle.mergeChanges()
	developmentCycle.save()
	window.api.saveToFile(records)
	
	let selectedRowRecid = developmentCycle.getSelection() - 1
	let selectedRow = developmentCycle.records[selectedRowRecid]

	window.api.sendSelectedRow(selectedRow)
})
window.api.addRow((event, value) => {
	let date = w2utils.formatDate((new Date()), 'mm-dd-yyyy')
	let time = w2utils.formatTime((new Date()), 'hh:mi am')

	let nextLineNum = developmentCycle.records.length + 1
	let nextRecid = developmentCycle.getLineHTML(nextLineNum)
	let previousRecordCategory = developmentCycle.getCellValue(developmentCycle.records.length - 1, 3)
	developmentCycle.add({
		recid: nextRecid,
		frequency: 'Once',
		category: previousRecordCategory,
		start: time,
		startDate: date,
		end: time,
		endDate: date
	})
	sortRecid()
})
window.api.duplicateRow((event, value) => {
	let date = w2utils.formatDate((new Date()), 'mm-dd-yyyy')
	let time = w2utils.formatTime((new Date()), 'hh:mi am')

	let nextLineNum = developmentCycle.records.length + 1
	let selectedRowRecid = developmentCycle.getSelection() - 1
	let selectedRow = developmentCycle.records[selectedRowRecid]
	const clone = structuredClone(selectedRow)
	clone.recid = nextLineNum
	clone.completion = false
	clone.development = ''
	clone.testing = ''
	clone.results = ''
	clone.start = time
	clone.end = time
	clone.startDate = date
	clone.endDate = date

	developmentCycle.add(clone)
	sortRecid()
})
// functions
function sortRecid() {
	let records = developmentCycle.records
	for (let i = 0; i < records.length; ++i) {
		records[i].recid = i + 1
	}
	developmentCycle.refresh()
}
