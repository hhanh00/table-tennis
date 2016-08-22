/*jshint esversion: 6, asi: true, strict: true, browser: true */
(function() {
"use strict"
// contains an array of tables.
const tableArray = []
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
  helpItemsUsed.empty = true
  helpItemsUsed.active = true
  helpItemsUsed.activeArrow = true
  helpItemsUsed.closeTable = true
}
if (!SHOW_HELP) {
  turnOffHelp()
}
// returns distance of point p to line segment x, y,xx,yy
const distFromLine = function(px, py, x, y, xx, yy) {
  const vx = xx - x
  const vy = yy - y
  const pvx = px - x
  const pvy = py - y
  const u = (pvx * vx + pvy * vy) / (vy * vy + vx * vx)
  if (u >= 0 && u <= 1) {
    const lx = vx * u
    const ly = vy * u
    return Math.sqrt(Math.pow(ly - pvy, 2) + Math.pow(lx - pvx, 2))
  }
  // closest point past ends of line so get dist to closest end
  return Math.min(Math.sqrt(Math.pow(xx - px, 2) + Math.pow(yy - py, 2)), Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2)))
}
// set up functions create images and do other general setup
function setupContext(ctx, descript) { // sets common context settings
  ctx.shadowBlur = descript.shadowBlur
  ctx.shadowColor = descript.shadow
  ctx.strokeStyle = descript.lines
  ctx.fillStyle = descript.fill
  ctx.lineWidth = descript.lineWidth
  ctx.lineCap = "round"
  if (descript.font) {
    ctx.font = descript.font.size + descript.font.face
  }
}

class Editor {
	static createTableImage() { // create image of table but why write a comment when the function tells it all???
	  const table = document.createElement("canvas"),
	    ctx = table.getContext("2d"),
	    scaleX = TABLE.width / 223, // get the scale compared to original layout
	    scaleY = TABLE.height / 314 // get the scale compared to original layout

	  table.height = TABLE.height
	  setupContext(ctx, TABLE.image)

	  ctx.fillStyle = TABLE.image.fill
	  ctx.fillRect(35.25 * scaleX, 20 * scaleY, 152.5 * scaleX, 274 * scaleY)
	  ctx.fillStyle = TABLE.image.lines // lines
	  ctx.fillRect(111.35 * scaleX, 20 * scaleY, 0.3, 274 * scaleY) // middle line
	  ctx.fillRect(35.25 * scaleX, 20 * scaleY, 2, 274 * scaleY) // left side
	  ctx.fillRect(185.75 * scaleX, 20 * scaleY, 2, 274 * scaleY) // right side
	  ctx.fillRect(35.25 * scaleX, 20 * scaleY, 152.5 * scaleX, 2) // top base line
	  ctx.fillRect(35.25 * scaleX, 292 * scaleY, 152.5 * scaleX, 2) // bottom base line
	  ctx.fillRect(20 * scaleX, 156 * scaleY, 183 * scaleX, 2) // net
	  return table
	}

	static createEmptyImage() { // empty table image
	  const i = TABLE.empty.inset,
	    image = document.createElement("canvas"),
	    w = image.width = TABLE.width,
	    h = image.height = TABLE.height,
	    ctx = image.getContext("2d")
	  setupContext(ctx, TABLE.empty)
	  ctx.strokeRect(i, i, w - i * 2, h - i * 2)
	  ctx.beginPath()
	  ctx.moveTo(i * 2, i * 2)
	  ctx.lineTo(w - i * 2, h - i * 2)
	  ctx.moveTo(i * 2, h - i * 2)
	  ctx.lineTo(w - i * 2, i * 2)
	  ctx.stroke()
	  return image
	}

	static createCloseImage() { // create close icon
	  const S = TABLE.closeIcon.size,
	    s = S * 0.5,
	    c = s * 0.4, // cross dist from center
	    sb = TABLE.closeIcon.shadowBlur,
	    l = TABLE.closeIcon.lineWidth,
	    image = document.createElement("canvas"),
	    cx = s + sb / 2, // add half blur to get center
	    cy = s + sb / 2,
	    ctx = image.getContext("2d")
	  // Image must include shadowblur
	  image.width = S + sb // add blur to size
	  image.height = S + sb
	  setupContext(ctx, TABLE.closeIcon)
	  ctx.beginPath()
	  ctx.arc(cx, cy, s - l, 0, Math.PI * 2)
	  ctx.fill()
	  ctx.stroke()
	  ctx.beginPath()
	  ctx.moveTo(cx - c, cy - c)
	  ctx.lineTo(cx + c, cy + c)
	  ctx.moveTo(cx - c, cy + c)
	  ctx.lineTo(cx + c, cy - c)
	  ctx.stroke()
	  return image
	}

	// draws a arrow a is the arrow object
	static drawArrow(ctx, a) {
	  const s = TABLE.arrow, // get arrow style
	    x = a.x,
	    y = a.y,
	    vx = a.xx - x,
	    vy = a.yy - y,
	    dir = Math.atan2(vy, vx),
	    len = Math.sqrt(vx * vx + vy * vy),
	    w = s.width / 2,
	    h = Math.min(len, s.head)/2 // ensure arrow head no bigger than arrow length	
	  // ctx.save()
	  ctx.setTransform(1, 0, 0, 1, x, y)
	  ctx.rotate(dir)
	  if (a.highlight) {
	    ctx.fillStyle = s.highlight
	    ctx.strokeStyle = s.lineHigh
	  } else {
	    ctx.fillStyle = s.fill
	    ctx.strokeStyle = s.line
	  }
	  ctx.lineWidth = s.lineWidth
	  ctx.save()
	  ctx.shadowBlur = s.shadowBlur
	  ctx.shadowColor = s.shadow
	  ctx.beginPath()
	  ctx.moveTo(0, -w / 2)
	  ctx.lineTo(len - h - h, -w)
	  ctx.lineTo(len - h - h, -h)
	  ctx.lineTo(len, 0)
	  ctx.lineTo(len - h - h, h)
	  ctx.lineTo(len - h - h, w)
	  ctx.lineTo(0, w / 2)
	  ctx.closePath()
	  ctx.fill()
	  ctx.stroke()
	  ctx.restore()
	}

	// display help text for table
	static drawHelpText(ctx, text, style) {
	  const len = text.length
	  var y = ctx.canvas.height / 2 - len * style.font.size * 1.2,
	    yy = y + 1
	  ctx.font = style.font.size + style.font.face
	  ctx.textAlign = "center"
	  ctx.textBaseline = "middle"
	  ctx.strokeStyle = "#000"
	  ctx.lineWidth = 2
	  for (var i = 0; i < len; i += 1) {
	    ctx.strokeText(text[i], ctx.canvas.width / 2 + 1, yy)
	    yy += TABLE.empty.font.size * 1.2
	  }
	  ctx.fillStyle = style.font.fill
	  for (i = 0; i < len; i += 1) {
	    ctx.fillText(text[i], ctx.canvas.width / 2, y)
	    y += TABLE.empty.font.size * 1.2
	  }
	}
	//------------------------------------------------------------
	// functions for table
	static drawClose() { // draws close icon. Fades in the close mouse is
	  const ctx = this.ctx,
	    w = Editor.closeIcon.width,
	    grow = w * 0.1,
	    x = (this.width - w) * TABLE.closeIcon.pos.x,
	    y = (this.height - w) * TABLE.closeIcon.pos.y,
	    ic_x = x + w / 2, // icon x and y
	    ic_y = y + w / 2,
	    dist = Math.sqrt(Math.pow(this.mouse.x - ic_x, 2) + Math.pow(this.mouse.y - ic_y, 2))

	  if (dist < TABLE.closeIcon.size / 2) {
	    this.mouseOverClose = true
	  } else {
	    this.mouseOverClose = false
	  }
	  ctx.globalAlpha = 1 - (Math.min(100, (dist - w * 2)) / 100)
	  if (this.mouseOverClose) {
	    ctx.drawImage(Editor.closeIcon, x - grow, y - grow, w + grow * 2, w + grow * 2)
	  } else {
	    ctx.drawImage(Editor.closeIcon, x, y)
	  }
	  ctx.globalAlpha = 1
	}

	static mouseEvent(e) {
	  const m = this, // lazy programer short cut
	    t = e.type,
	    bounds = m.element.getBoundingClientRect()
	  m.x = e.clientX - bounds.left
	  m.y = e.clientY - bounds.top
	  if (t === "mousedown") {
	    m.button |= MOUSE.buttonMasks[e.which - 1]
	  } else if (t === "mouseup") {
	    m.button &= MOUSE.buttonMasks[e.which + 2]
	  } else if (t === "mouseout") {
	    m.button = 0
	    m.over = false
	    m.table.mouseOver()
	  } else if (t === "mouseover") {
	    m.over = true
	    m.table.mouseOver()
	  }
	  e.preventDefault()
	}

	static updateTables() { // Updates tables. Removes any dead tables from table array
	  const closeTables = tableArray.filter(t => !t.active)
	  while (closeTables.length > 1) {
	    this.removeTable(this.closeTables.shift())
	  }
	  for (var i = 0; i < tableArray.length; i++) {
	    if (tableArray[i].dead) {
	      tableArray.splice(i, 1)
	      i -= 1
	    }
	  }
	}

	static drawTable() { // darw the table all states
	  const ctx = this.ctx
	  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
	  if (this.active) {
	    ctx.drawImage(Editor.tableImage, 0, 0)
	    if (this.mouse.over) {
	      if (!this.dragging) { // Dont draw close icon while draggin
	        this.drawCloseIcon()
	      }
	      if (this.mouseOverClose && !this.dragging) { // if not dragging and mouse over close
	        this.cursor = TABLE.closeIcon.cursor // set cursor
	        if (this.mouse.button === 1) { // bit field  is mouse left down
	          this.buttonDown = true
	        } else if (this.buttonDown) { // only close if mouse moves up while over close.
	          this.active = false
	          helpItemsUsed.closeTable = true
	          this.buttonDown = false
	          setTimeout(Editor.updateTables, TABLE_REFRESH_DELAY)
	        }
	      } else { // not over close
	        // if near a arrow and mouse button right is down delete the arrow
	        if (this.closestArrowIndex > -1 && this.mouse.button === 4) { // but field Only button right down
	          this.arrows.splice(this.closestArrowIndex, 1)
	          this.closestArrowIndex = -1
	          this.mouse.button = 0 // turn mouse click off
	          helpItemsUsed.activeArrow = true // flag arrow delete help as used
	        } else // if not near line or close then check for mouse left 
	        if (this.mouse.button === 1) { // bit field  if down start dragging new arroe
	          if (!this.dragging) { // Start of drag create arrow
	            this.arrows.push({
	              x: this.mouse.x,
	              y: this.mouse.y,
	              xx: this.mouse.x,
	              yy: this.mouse.y
	            })
	            this.currentArrow = this.arrows[this.arrows.length - 1]
	            this.dragging = true
	          } else { // during drag move arrow endpoint
	            helpItemsUsed.active = true // flag arrow help as used
	            this.currentArrow.xx = this.mouse.x
	            this.currentArrow.yy = this.mouse.y
	          }
	        } else { // mouse up
	          if (this.dragging) { // is dragging then must be a arrow
	            // if arrow added is smaller than 2 pixels then remove it
	            if (Math.abs(this.currentArrow.xx - this.currentArrow.x) < TABLE.arrow.minSize && Math.abs(this.currentArrow.y - this.currentArrow.yy) < TABLE.arrow.minSize) {
	              this.arrows.length -= 1
	            }
	            this.currentArrow = null
	            this.dragging = false
	          }
	        }
	        this.cursor = TABLE.image.cursor // set cursor tp table standard
	      }
	    }
	    if (this.closestArrowIndex > -1 && !this.dragging) { // is mouse near arrow 
	      this.cursor = TABLE.arrow.cursor // yes set cursor for arrow
	    }
	    // find arrow closest to mouse
	    var minDist = TABLE.arrow.width // this sets the max distance mouse can be for it to highlight an arrow
	    var dist = 0
	    this.closestArrowIndex = -1
	    for (var i = 0; i < this.arrows.length; i++) { // test all arrow
	      const a = this.arrows[i]
	      Editor.drawArrow(ctx, a) // draw the arrow
	      a.highlight = false // turn off highlight
	      dist = distFromLine(this.mouse.x, this.mouse.y, a.x, a.y, a.xx, a.yy) // get distance from mouse
	      if (dist < minDist) { // is closer than any other arrow
	        this.closestArrowIndex = i // yes remember the index
	        minDist = dist
	      }
	    }
	    if (this.closestArrowIndex > -1 && this.mouse.over) { // is a arror close to mouse
	      this.arrows[this.closestArrowIndex].highlight = true // highlight it
	    }
	    ctx.setTransform(1, 0, 0, 1, 0, 0) // reset transform after arrows drawn
	    // show help
	    if (this.mouse.over) {
	      if (this.arrows.length === 0 && !helpItemsUsed.active) {
	        Editor.drawHelpText(ctx, TABLE.help.active, TABLE.image)
	      } else
	      if (this.closestArrowIndex > -1 && !helpItemsUsed.activeArrow) {
	        Editor.drawHelpText(ctx, TABLE.help.activeArrow, TABLE.image)
	      } else
	      if (this.closestArrowIndex === -1 && !helpItemsUsed.closeTable) {
	        Editor.drawHelpText(ctx, TABLE.help.closeTable, TABLE.image)
	      }
	    }
	  } else {
	    this.drawEmpty()
	  }
	}

	static createAddTable() { // Creates a table. Tables default in inactive
	  const table = {},
	    div = document.createElement("div"),
	    canvas = document.createElement("canvas"),
	    ctx = canvas.getContext("2d")
	  div.style.width = TABLE.width + "px"
	  div.style.height = TABLE.height + "px"
	  div.style.display = TABLE.DOM.display
	  canvas.width = TABLE.width
	  canvas.height = TABLE.height
	  canvas.className = TABLE.DOM.tableClass
	  canvas.style.zIndex = TABLE.DOM.zIndex
	  table.div = div
	  table.canvas = canvas
	  table.ctx = ctx
	  table.arrows = []
	  table.width = TABLE.width
	  table.height = TABLE.height
	  table.mouseOverClose = false
	  table.drawCloseIcon = Editor.drawClose
	  table.draw = Editor.drawTable
	  table.dragging = false
	  table.active = false
	  table.update = Editor.tableUpdate.bind(table)
	  table.mouseOver = Editor.mouseInOutCallback // called by mouseEvent when mouse over out
	  table.drawEmpty = Editor.drawEmpty.bind(table)
	  table.dead = false // when removed and not needed it is dead and can then be removed from table array
	  table.updating = false // true is animation requests are happening
	  div.appendChild(canvas) // add canvas
	  table.mouse = Editor.createMouse(table)
	  table.draw()
	  return table
	}

	static addTable() { // Adds a table to table array and DOM
	  const table = Editor.createAddTable() // create new table
	  TABLE.tables.appendChild(table.div) // add to the dom
	  table.mouse.start() // start the mouse
	  tableArray.push(table) // add to table array
	  return table
	}

	static drawEmpty() { // draw empty table and handle click on empty table
	  const ctx = this.ctx
	  ctx.drawImage(Editor.emptyTableImage, 0, 0)
	  if (this.mouse.over) {
	    ctx.globalCompositeOperation = "lighter"
	    ctx.globalAlpha = TABLE.empty.highlightAmount
	    ctx.drawImage(Editor.emptyTableImage, 0, 0)
	    ctx.globalAlpha = 1
	    ctx.globalCompositeOperation = "source-over"
	    if (!helpItemsUsed.empty) { // show help is the help action has not yet been done
	      Editor.drawHelpText(ctx, TABLE.help.empty, TABLE.empty)
	    }
	    this.cursor = TABLE.empty.cursor
	    if (this.mouse.button === 1) { // bit field
	      this.buttonDown = true
	    } else if (this.buttonDown) {
	      this.active = true
	      setTimeout(Editor.addTable, TABLE_REFRESH_DELAY)
	      this.buttonDown = false
	      helpItemsUsed.empty = true // flag this help as not needed as user has complete that task
	    }
	  } else {
	    this.cursor = "default"
	  }
	}

	// renders a table. Stops rendering if the mouse is not over
	static tableUpdate() {
	  if (this.mouse.over) {
	    this.updating = true
	    requestAnimationFrame(this.update)
	  } else {
	    this.buttonDown = false // turn of button if dragged off
	    this.div.style.cursor = "default"
	    this.updating = false
	    this.draw() // draw another time. This alows for the visual state to be correct
	  }
	  this.draw()
	  this.div.style.cursor = this.cursor
	}
	// Mousecallback starts a table rendering if not allready doing so.
	static mouseInOutCallback() {
	  if (this.mouse.over) {
	    if (!this.updating) {
	      this.update()
	    }
	  } else {
	    this.div.style.cursor = "default"
	  }
	}
	// function to handle mouse events

	// create the mouse inteface for a table
	static createMouse(table) {
	  const mouse = {
	    x: 0,
	    y: 0,
	    over: false,
	    table: table,
	    element: table.div,
	    button: 0,
	  }
	  mouse.event = this.mouseEvent.bind(mouse)
	  mouse.start = function() {
	    MOUSE.events.forEach(n => {
	      this.element.addEventListener(n, this.event)
	    })
	  }
	  mouse.remove = function() {
	    MOUSE.events.forEach(n => {
	      this.element.removeEventListener(n, this.event)
	    })
	  }
	  return mouse
	}

	static removeTable(table) { // remove table from dom
	  table.mouse.remove() // deactivate moue events
	  TABLE.tables.removeChild(table.div) // remove from DOM
	  table.dead = true // flag as dead to be removed from table array
	}
}

Editor.tableImage = Editor.createTableImage()
Editor.closeIcon = Editor.createCloseImage()
Editor.emptyTableImage = Editor.createEmptyImage()
	
Editor.addTable()
})()