/*jshint esversion: 6, asi: true, strict: true, browser: true */

import Table from './table'
import { TABLE, MOUSE, TABLE_REFRESH_DELAY, helpItemsUsed } from './consts'

(function() {
"use strict"
// contains an array of tables.
const tableArray = []

class Editor {
	updateTables() { // Updates tables. Removes any dead tables from table array
	  var closeTables = tableArray.filter(t => !t.active)
	  while (closeTables.length > 1) {
	    this.removeTable(closeTables.shift())
	  }
	  for (var i = 0; i < tableArray.length; i++) {
	    if (tableArray[i].dead) {
	      tableArray.splice(i, 1)
	      i -= 1
	    }
	  }
	}

	createAddTable() { // Creates a table. Tables default in inactive
	  return new Table(this)
	}

	addTable() { // Adds a table to table array and DOM
	  const table = this.createAddTable() // create new table
	  TABLE.tables.appendChild(table.div) // add to the dom
	  table.mouse.start() // start the mouse
	  tableArray.push(table) // add to table array
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