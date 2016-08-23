/*jshint esversion: 6, asi: true, strict: true, browser: true */

import _ from 'lodash'
import Table from './table'
import { TABLE, MOUSE, TABLE_REFRESH_DELAY, helpItemsUsed } from './consts'

(function() {
"use strict"
// contains an array of tables.
class Editor {
	constructor() {
		this.tableArray = []	
	}

	updateTables() { // Updates tables. Removes any dead tables from table array
		_(this.tableArray).initial().filter(t => !t.active).forEach(t => this.removeTable(t)).value()
		this.tableArray = _(this.tableArray).filter(t => !t.dead).value()
	}

	createAddTable() { // Creates a table. Tables default in inactive
	  return new Table(this)
	}

	addTable() { // Adds a table to table array and DOM
	  const table = this.createAddTable() // create new table
	  TABLE.tables.appendChild(table.div) // add to the dom
	  table.mouse.start() // start the mouse
	  this.tableArray.push(table) // add to table array
	  return table
	}

	// function to handle mouse events

	removeTable(table) { // remove table from dom
	  table.mouse.remove() // deactivate moue events
	  TABLE.tables.removeChild(table.div) // remove from DOM
	  table.dead = true // flag as dead to be removed from table array
	}
}

const editor = new Editor()
editor.addTable()
})()