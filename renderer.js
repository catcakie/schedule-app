//import { w2layout, w2sidebar, w2grid, query } from 'https://rawgit.com/vitmalina/w2ui/master/dist/w2ui.es6.min.js'
//const { w2layout, w2sidebar, w2grid, query } = require('https://rawgit.com/vitmalina/w2ui/master/dist/w2ui.es6.min.js')

let config = {
layout: {
    name: 'layout',
    padding: 0,
    panels: [
        { type: 'left', size: 100, resizable: false, minSize: 35 },
        { type: 'main', size: 950, minSize: 550 }
    ]
},
sidebar: {
    name: 'sidebar',
    nodes: [
        { id: 'views', text: 'Views', group: true, expanded: true, groupShowHide: false,
            nodes: [
                { id: 'developmentCycle', text: 'Develop', selected: true },
                { id: 'tracker', text: 'Tracker' },
                { id: 'weeklySchedule', text: 'Week' },
            ],
            onCollapse(event) {
                event.preventDefault()
            }
        }
    ],
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
    columns: [
        { field: 'completion', text: '<div style="text-align: center;">✅</div>', size: '33px' },
        { field: 'category', text: '<div style="text-align: center;">Category</div>', size: '120px' },
        { field: 'requirements', text: '<div style="text-align: center;">Requirements</div>', size: '120px' },
        { field: 'design', text: '<div style="text-align: center;">Design</div>', size: '120px' },
        { field: 'development', text: '<div style="text-align: center;">Development</div>', size: '120px' },
        { field: 'testing', text: '<div style="text-align: center;">Testing</div>', size: '120px' },
        { field: 'results', text: '<div style="text-align: center;">Results</div>', size: '100%' }
    ],
    records: [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {}
    ],
    onClick(event) {
        console.log(event);
    }
},
tracker: {
    name: 'tracker',
    columns: [
        { field: 'items', text: '<div style="text-align: center;">Items</div>', size: '100px' },
        { field: 'sunday', text: '<div style="text-align: center;">Sunday</div>', size: '100px' },
        { field: 'monday', text: '<div style="text-align: center;">Monday</div>', size: '100px' },
        { field: 'tuesday', text: '<div style="text-align: center;">Tuesday</div>', size: '100px' },
        { field: 'wednesday', text: '<div style="text-align: center;">Wednesday</div>', size: '100px' },
        { field: 'thursday', text: '<div style="text-align: center;">Thursday</div>', size: '100px' },
        { field: 'friday', text: '<div style="text-align: center;">Friday</div>', size: '100px' },
        { field: 'saturday', text: '<div style="text-align: center;">Saturday</div>', size: '100%' }
    ],
    records: [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {}
    ],
    onClick(event) {
        console.log(event);
    }
},
weeklySchedule: {
    name: 'weeklySchedule',
    columns: [
        { field: 'hour', text: '<div style="text-align: center;">Hour</div>', size: '100px' },
        { field: 'sunday', text: '<div style="text-align: center;">Sunday</div>', size: '100px' },
        { field: 'monday', text: '<div style="text-align: center;">Monday</div>', size: '100px' },
        { field: 'tuesday', text: '<div style="text-align: center;">Tuesday</div>', size: '100px' },
        { field: 'wednesday', text: '<div style="text-align: center;">Wednesday</div>', size: '100px' },
        { field: 'thursday', text: '<div style="text-align: center;">Thursday</div>', size: '100px' },
        { field: 'friday', text: '<div style="text-align: center;">Friday</div>', size: '100px' },
        { field: 'saturday', text: '<div style="text-align: center;">Saturday</div>', size: '100%' }
    ],
    records: [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {}
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
