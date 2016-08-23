/*jshint esversion: 6, asi: true, strict: true, browser: true */

// App constants all up top
const GLOBAL_SCALE = 1
const SHOW_HELP = true // set to false to have the help turned off
const SHADOW = 'rgba(0,0,0,0.8)'
const WHITE = "white"
const TABLE_REFRESH_DELAY = 50 // Time in millisecond befor updating DOM for table add and remove
const FONT = {
  face: "px Arial",
  size: Math.max(10, 18 * GLOBAL_SCALE),
  fill: WHITE
}

const TABLE = {
  width: 223 * GLOBAL_SCALE, // size of table
  height: 314 * GLOBAL_SCALE,
  tables: document.getElementById("tables"),
  image: { // table image styles
    shadow: SHADOW,
    shadowBlur: 20 * GLOBAL_SCALE,
    fill: "#2e3f73",
    lines: WHITE,
    font: FONT,
    cursor: "default"
  },
  empty: { // empty table styles
    inset: 30 * GLOBAL_SCALE, // amount box is inset
    lines: 'rgba(255,255,255,0.5)',
    lineWidth: 8 * GLOBAL_SCALE,
    shadow: SHADOW,
    shadowBlur: 20 * GLOBAL_SCALE,
    font: FONT,
    cursor: "pointer",
    highlightAmount: 0.3 // amount to highlight empty table when mouse over 0 none 1 full
  },
  arrow: { // arrow styles
    width: 15 * GLOBAL_SCALE, // arrow width
    shadow: SHADOW,
    shadowBlur: 10 * GLOBAL_SCALE,
    // custom cursor
    cursor: "url('data:image/pngbase64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAVCAYAAADiv3Z7AAACtUlEQVRYha2Ye1NTMRDFf/KqLY/SlvIolAJFqSKOoqI4o+P3/1LXP3oi23XvTUrpzJm52Zxs9mRzczeFl/u9KkDp2FV5xb/IURT42hIoGbcsp1hMGrxegw1hU9gCWsDrDFriWrTc2FYDL/K1qZiS2KywdRO0DcAiTdIBtoEdYFfYC7Arzo7426a96+B53n/idBTDlha7VmAStiGyD9wjiegCPWAAHABDg0NhqL6B0BcGZpyF5fQM98D52lcc7SaBXlhbArrGeRTQEDgCKoNzwdsq4Aw4BUZqn8qWeGOhMryRGWt9jrRwfSMwbdF/72F6SFuxLXLPORppwspMPgYq+0v93mb63rh2OFbPU9sO5hlrcXtKRstnz2atxXwb9oCqEhYmWrRdR4F6mxdQIzqyfWjwOQOutMgHzF+RlL0FcTZrXaV77MU4YZ+EXIC/InuTuIL+B809Ay6UvX3mZ4TdmgviOiIdARPgxooywr4BX4TGbRkFvoo40/4MvHPi/HtXK+5CKxOJ+y6BXwsC/ePav18gcz+AeyeuS2ZbenFN2zJlLxuUa4fbtIkTtFfOnBfzENjum8TZbWQ4j5nt9jPgPEY+KXzn1ng6UPaYnz7p+1JphW7R6WVsM6FS/x1Ph41d5dT+KB+3at/JVrn+9/Jf6fnWjEm4ofC0jD4Fhxo4kZOpwxVwaTBl/g17q4lnDjfqnxp/17IlXMt+qYxc6NnyLafoO1f3ER8Cxyx+xG3lcKL+E9N/pknPtTATPY/VNwr8nbFYvRw7nDj+qWzZCsVnr6T8snVfj//rv1SaRbVlPxhj0Wf+/lhE3MTL1paRwFzh7Kv2qMqPbgUR3/vsOET+l7oVWIElV56Su9ky9znvczPjf+n7nBUZ3YKjW/FzbuO5MXV/U6x8E68TmrP5vuf+h1IaT5b7F+ZaSjBzrT+rAAAAAElFTkSuQmCC') 10 11, pointer",
    fill: "#ffb900",
    highlight: "#ffdc44",
    lineWidth: 1,
    line: "#ffdc44",
    lineHigh: "#ffed55",
    head: 30 * GLOBAL_SCALE, // arrow head width
    minSize: 5 // min size arrow can be if smaller then arrow is not created
  },
  DOM: { // constiouse dom setting for table canvas and div tags
    display: "inline-block",
    canvasClass: "table",
    zIndex: 1
  },
  closeIcon: { // styles for reandering and display close icon
    size: 32 * GLOBAL_SCALE,
    fill: "red",
    lines: WHITE,
    lineWidth: Math.max(1, 2 * GLOBAL_SCALE),
    shadow: SHADOW,
    shadowBlur: 20 * GLOBAL_SCALE,
    cursor: "pointer",
    pos: {
      x: 1, // as fractions
      y: 0
    }
  },
  help: { // text help
    empty: ["Click here to", "add a new table"],
    active: ["Click to drag arrows"],
    activeArrow: ["Right click on arrow", "to remove it"],
    closeTable: ["close table", "move to top right", "click Close Icon"]
  }
}

const MOUSE = { // event contains a list of mouse event to listen to 
  buttonMasks: [1, 2, 4, 6, 5, 3],
  events: ["mousemove", "mousedown", "mouseup", "mouseout", "mouseover", "contextmenu"]
} // contextmenu is included as that needs to be blocked for right button events

const helpItemsUsed = {
  empty: false,
  active: false,
  activeArrow: false,
  closeTable: false
}

function turnOffHelp() {
	"use strict"
  helpItemsUsed.empty = true
  helpItemsUsed.active = true
  helpItemsUsed.activeArrow = true
  helpItemsUsed.closeTable = true
}
if (!SHOW_HELP) {
  turnOffHelp()
}

export { TABLE, MOUSE, TABLE_REFRESH_DELAY, helpItemsUsed }
