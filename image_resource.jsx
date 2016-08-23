/*jshint esversion: 6, asi: true, strict: true, browser: true */

import { TABLE } from './consts'
import { Drawing } from './drawing'

class ImageResource {
	static createTableImage() { // create image of table but why write a comment when the function tells it all???
	  const table = document.createElement("canvas"),
	    ctx = table.getContext("2d"),
	    scaleX = TABLE.width / 223, // get the scale compared to original layout
	    scaleY = TABLE.height / 314 // get the scale compared to original layout

	  table.height = TABLE.height
	  Drawing.setupContext(ctx, TABLE.image)

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
	  Drawing.setupContext(ctx, TABLE.empty)
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
	  Drawing.setupContext(ctx, TABLE.closeIcon)
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
}

ImageResource.tableImage = ImageResource.createTableImage()
ImageResource.closeIcon = ImageResource.createCloseImage()
ImageResource.emptyTableImage = ImageResource.createEmptyImage()

export { ImageResource }