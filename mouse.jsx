/*jshint esversion: 6, asi: true, strict: true, browser: true */

import { MOUSE } from './consts'

class Mouse {
	// create the mouse inteface for a table
	constructor(table, div) {
	  this.x = 0
	  this.y = 0
	  this.over = false
	  this.table = table
	  this.element = div
	  this.button = 0
	  this.event = table.mouseEvent.bind(this)
	}

	start() {
    MOUSE.events.forEach(n => {
      this.element.addEventListener(n, this.event)
    })
	}

	remove() {
    MOUSE.events.forEach(n => {
      this.element.removeEventListener(n, this.event)
    })
  }
}

export { Mouse }