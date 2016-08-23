/*jshint esversion: 6, asi: true, strict: true, browser: true */

import { TABLE, MOUSE, TABLE_REFRESH_DELAY, helpItemsUsed } from './consts'
import { Mouse } from './mouse'
import { Drawing } from './drawing'
import { ImageResource } from './image_resource'

class Table {
	constructor(editor) {
		this.editor = editor
	  const
	    div = document.createElement("div"),
	    canvas = document.createElement("canvas"),
	    ctx = canvas.getContext("2d")
	  div.style.width = TABLE.width + "px"
	  div.style.height = TABLE.height + "px"
	  div.style.display = TABLE.DOM.display
	  canvas.width = TABLE.width
	  canvas.height = TABLE.height
	  canvas.className = TABLE.DOM.thisClass
	  canvas.style.zIndex = TABLE.DOM.zIndex
	  this.div = div
	  this.canvas = canvas
	  this.ctx = ctx
	  this.arrows = []
	  this.width = TABLE.width
	  this.height = TABLE.height
	  this.mouseOverClose = false
	  this.dragging = false
	  this.active = false
	  this.dead = false // when removed and not needed it is dead and can then be removed from this array
	  this.updating = false // true is animation requests are happening
	  this.mouse = new Mouse(this, div)
	  div.appendChild(canvas) // add canvas
	  this.draw()		
	}

	// renders a table. Stops rendering if the mouse is not over
	update() {
	  if (this.mouse.over) {
	    this.updating = true
	    requestAnimationFrame(this.update.bind(this))
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
	mouseOver() {
	  if (this.mouse.over) {
	    if (!this.updating) {
	      this.update()
	    }
	  } else {
	    this.div.style.cursor = "default"
	  }
	}

	drawEmpty() { // draw empty table and handle click on empty table
	  const ctx = this.ctx
	  ctx.drawImage(ImageResource.emptyTableImage, 0, 0)
	  if (this.mouse.over) {
	    ctx.globalCompositeOperation = "lighter"
	    ctx.globalAlpha = TABLE.empty.highlightAmount
	    ctx.drawImage(ImageResource.emptyTableImage, 0, 0)
	    ctx.globalAlpha = 1
	    ctx.globalCompositeOperation = "source-over"
	    if (!helpItemsUsed.empty) { // show help is the help action has not yet been done
	      Drawing.drawHelpText(ctx, TABLE.help.empty, TABLE.empty)
	    }
	    this.cursor = TABLE.empty.cursor
	    if (this.mouse.button === 1) { // bit field
	      this.buttonDown = true
	    } else if (this.buttonDown) {
	      this.active = true
	      setTimeout(this.editor.addTable.bind(this.editor), TABLE_REFRESH_DELAY)
	      this.buttonDown = false
	      helpItemsUsed.empty = true // flag this help as not needed as user has complete that task
	    }
	  } else {
	    this.cursor = "default"
	  }
	}

	mouseEvent(e) {
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

	//------------------------------------------------------------
	// functions for table
	drawCloseIcon() { // draws close icon. Fades in the close mouse is
	  const ctx = this.ctx,
	    w = ImageResource.closeIcon.width,
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
	    ctx.drawImage(ImageResource.closeIcon, x - grow, y - grow, w + grow * 2, w + grow * 2)
	  } else {
	    ctx.drawImage(ImageResource.closeIcon, x, y)
	  }
	  ctx.globalAlpha = 1
	}

	draw() { // darw the table all states
	  const ctx = this.ctx
	  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
	  if (this.active) {
	    ctx.drawImage(ImageResource.tableImage, 0, 0)
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
	          setTimeout(this.editor.updateTables.bind(this.editor), TABLE_REFRESH_DELAY)
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
	      Drawing.drawArrow(ctx, a) // draw the arrow
	      a.highlight = false // turn off highlight
	      dist = Drawing.distFromLine(this.mouse.x, this.mouse.y, a.x, a.y, a.xx, a.yy) // get distance from mouse
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
	        Drawing.drawHelpText(ctx, TABLE.help.active, TABLE.image)
	      } else
	      if (this.closestArrowIndex > -1 && !helpItemsUsed.activeArrow) {
	        Drawing.drawHelpText(ctx, TABLE.help.activeArrow, TABLE.image)
	      } else
	      if (this.closestArrowIndex === -1 && !helpItemsUsed.closeTable) {
	        Drawing.drawHelpText(ctx, TABLE.help.closeTable, TABLE.image)
	      }
	    }
	  } else {
	    this.drawEmpty()
	  }
	}
}

export default Table
