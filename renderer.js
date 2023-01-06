// main.js  handlers & requests

let date, time
let selectedRow

// Ctrl + D
window.api.duplicateRow((event, value) => {
	selectedRow = getSelectedRow(developmentCycle)

	if (selectedRow) {
		duplicateRow(developmentCycle, selectedRow, '')
	}
})

// Ctrl + E
const designs = ['1. Gather, organize/clean, store info', '2. Generate ideas to test', '3. Build/execute the idea', '4. Test the developed creation']

window.api.duplicateRowFourTimes((event, value) => {
	selectedRow = getSelectedRow(developmentCycle)

	if (selectedRow) {
		for (let i = 0; i < 4; ++i) {
			duplicateRow(developmentCycle, selectedRow, designs[i])
		}
	}
})

// Ctrl + Enter
window.api.addRow((event, value) => {
	updateDateAndTime()

	let nextLineNum = developmentCycle.records.length + 1
	let nextRecid = developmentCycle.getLineHTML(nextLineNum)
	developmentCycle.add({
		recid: nextRecid,
		frequency: 'Once',
		start: time,
		startDate: date,
		end: time,
		endDate: date
	})
	sortRecid(developmentCycle)
})

// Ctrl + S
window.api.save((event, value) => {
	updateDateAndTime()

	duplicateDailyRows()

	// w2ui marks changed fields, which we can't sort unless they're saved to the grid
	developmentCycle.save()
	// w2ui saves the changes into a separate property, use .mergeChanges() to merge them into their respective properties
	developmentCycle.mergeChanges()

	
	// save the records to a local JSON file
	window.api.saveToFile(developmentCycle.records)

	// get the selected row
	selectedRow = getSelectedRow(developmentCycle)

	// send the selected row's content to my discord server channel
	if (selectedRow && selectedRow.development != '') {
		window.api.sendSelectedRow(selectedRow)
	} else {
		window.api.sendSelectedRow("probably reddit/yt")
	}
	
	// sort the rows again (by resetting to default sorting)
	developmentCycle.stateReset()
})

// helper functions
function getSelectedRow(grid) {
	sortRecid(grid)
	const selectedRowRecid = grid.getSelection()-1
	const selectedRow = grid.records[selectedRowRecid]
	return selectedRow
}
function updateDateAndTime() {
	date = w2utils.formatDate((new Date()), 'mm-dd-yyyy')
	time = w2utils.formatTime((new Date()), 'hh:mi am')
}
function duplicateRow(grid, row, design) {
	updateDateAndTime()
	let nextLineNum = grid.records.length + 1
	const clone = structuredClone(row)
	clone.recid = nextLineNum
	clone.completion = false
	clone.frequency = 'Once'
	clone.immerse = ''
	clone.development = ''
	clone.design = design
	clone.testing = ''
	clone.results = ''
	clone.start = ''
	clone.end = ''
	clone.startDate = ''
	clone.endDate = date
	clone.images = ''
	clone.w2ui.style = 'background-color: #FFE7FF'

	grid.add(clone)
	sortRecid(developmentCycle)
}
function sortRecid(grid) {
	let records = grid.records
	for (let i = 0; i < records.length; ++i) {
		records[i].recid = i + 1
	}
	grid.refresh()
}
function duplicateDailyRows() {
	let records = developmentCycle.records
	
	developmentCycle.mergeChanges()
	developmentCycle.save()

	// records created today (array)
	let todayRecords = []
	// records with daily frequency (array)
	let dailyRecords = []

	records.forEach(record => {
		// push records created today
		if (record.endDate == date) {
			todayRecords.push(record)
		}
		// push records with daily frequency
		if (record.frequency === "Daily") {
			dailyRecords.push(record)
		}
		// row styles
		if (record.category == "Mindset" && record.completion === false) {
			record.start = time
			record.end = time
			record.startDate = date
			record.endDate = date
			record.w2ui = { "style": "background-color: #C6FFD5" }
		}
		else if (record.category == "Deadline" && record.completion === false) {
			record.start = time
			record.end = time
			record.startDate = date
			record.endDate = date

			record.w2ui = { "style": "background-color: #E6F4F1" }
		} else if (record.completion === false && record.category === 'Hobby') {
			record.w2ui = { "style": "background-color: #DDD5B6" }
		} else if (record.completion === false && record.category === 'Work') {
			record.w2ui = { "style": "background-color: #99E1E6" }
		} else if (record.completion === false && record.category === 'Care-taking') {
			record.w2ui = { "style": "background-color: #CCC1E7" }
		} else if (record.completion === false && record.category === 'School') {
			record.w2ui = { "style": "background-color: #EEC4A7" }
		} else if (record.frequency === 'Daily') {
			record.w2ui = { "style": "background-color: #BFD6D9" }
		} else if (record.completion === true && record.endDate == date) {
			record.w2ui = { "style": "background-color: #8897AF" }
		} else if (record.completion === true) {
			record.w2ui = { "style": "background-color: #DADADA" }
		} else {
			record.w2ui = { "style": "" }
		}
		// execute any logic needed over all rows
	})

	// records created today based on their design property (arary)
	todayRecords = new Set(todayRecords.map(({requirement}) => requirement))

	// unique daily records based on their design property (array)
	let uniqueRecords = [...new Map(dailyRecords.map((item) => [item['requirement'], item])).values()]

	// filter the unique records array so they aren't infinitely duplicated
	// (remove the records created today that already have the design)
	uniqueRecords = uniqueRecords.filter(({requirement}) => !todayRecords.has(requirement))

	if (uniqueRecords.length !== 0) {
		uniqueRecords.forEach(record => {
			duplicateRow(developmentCycle, record, '')
		})
	}
}

// w2ui code below
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
		sortData: [ { field: 'completion', direction: 'asc' },
		{ field: 'startDate', direction: 'desc' },
		{ field: 'start', direction: 'desc' },
		{ field: 'category', direction: 'desc' },
		{ field: 'requirement', direction: 'asc' },
		{ field: 'design', direction: 'asc' } ],
		liveSearch: true,
		show: {
			toolbar: true,
			footer: true
		},
		toolbar: {
			items: [
				{ type: 'html',  id: 'item2',
					html() {
						let html =
							'<div style="padding: 3px 10px;">'+
							''+ new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"long", day:"numeric"}) +
							'</div>'
						return html
					}
				}
			]
		},
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
			size: '40%',
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
			searchable: { operator: 'begins with' },
			resizable: false,
			editable: {
				type: 'combo',
				items: ['Journal', 'Mindset', 'Info', 'Generosity', 'Care-taking', 'Hobby', 'Work', 'Deadline', 'School', 'Break']
			}
		},
		{
			field: 'requirement',
			text: '<div style="text-align: center;">Requirement</div>',
			size: '100%',
			sortable: true,
			sortMode: 'natural',
			searchable: { operator: 'contains' },
			resizable: false,
			editable: {
				type: 'text'
			},
			tooltip: 'Gather, organize/clean, store info (from sources, which can include results from our own decisions)',
			info: {
                fields: ['requirement'],
                showOn: 'mouseenter',
                options: { position: 'top' }
            }
		},
		{
			field: 'design',
			text: '<div style="text-align: center;">Design</div>',
			size: '100%',
			sortable: true,
			searchable: { operator: 'contains' },
			resizable: false,
			editable: {
				type: 'text'
			},
			tooltip: 'Generate ideas to test',
			info: {
                fields: ['design'],
                showOn: 'mouseenter',
                options: { position: 'top' }
            }
		},
		{
			field: 'development',
			text: '<div style="text-align: center;">Development</div>',
			size: '100%',
			sortable: true,
			searchable: { operator: 'contains' },
			resizable: false,
			editable: {
				type: 'text'
			},
			tooltip: 'Build/execute the idea (different executions have different variations)',
			info: {
                fields: ['development'],
                showOn: 'mouseenter',
                options: { position: 'top' }
            }
		},
		{
			field: 'testing',
			text: '<div style="text-align: center;">Testing</div>',
			size: '100%',
			sortable: true,
			searchable: { operator: 'contains' },
			resizable: false,
			editable: {
				type: 'text'
			},
			tooltip: 'Test the developed creation (in which we gain new info). Write every problem that comes up, feedback, thoughts, insights, etc',
			info: {
                fields: ['testing'],
                showOn: 'mouseenter',
                options: { position: 'top' }
            }
		},
		{
			field: 'images',
			text: '<div style="text-align: center;">Images</div>',
			size: '45%',
			resizable: false,
			info: {
                fields: ['images'],
                showOn: 'mouseenter',
                options: { position: 'left' }
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
			searchable: { operator: 'begins with' },
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
		onChange: function (event) {

		},
		onComplete: function(event) {
			
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
		onChange: function (event) {
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
const activitiesUrl = './activities.json'
developmentCycle.load(activitiesUrl)
developmentCycle.advanceOnEdit = false

w2ui.developmentCycle.on('change', function (event) {
	event.onComplete = function (event2) {
		let record = this.get(event2.detail.recid)
		// define date/time
		updateDateAndTime()

		// set time started & time ended
		if (!record.start && this.getChanges()[0].development || record.start == '' && this.getChanges()[0].development) {
			record.start = time
			record.startDate = date
		}
		record.end = time
		record.endDate = date

		this.refresh()
	};
});

// drag and drop listeners
document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
	const imageUrl = event.dataTransfer.getData('url')

	selectedRow = getSelectedRow(developmentCycle)

	if (selectedRow) {
		for (const f of event.dataTransfer.files) {
			if (!selectedRow.images) {
				selectedRow.images = ''
			}
			// Using the path attribute to get absolute file path
			let filePath = f.path

			let width = "33%"
			if (filePath) {
				selectedRow.images += "<img style='max-width: "+width+"; height: auto;' src='"+filePath+"'/>"+"<span>   </span>"
			}
			else {
				selectedRow.images += "<img style='max-width: "+width+"; height: auto;' src='"+imageUrl+"'/>"+"<span>   </span>"
			}
		}
		developmentCycle.refresh()
	}
});
 
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
/*
document.addEventListener('dragenter', (event) => {
    console.log('File is in the Drop Space');
});
 
document.addEventListener('dragleave', (event) => {
    console.log('File has left the Drop Space');
});
*/
