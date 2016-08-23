/*jshint esversion: 6, asi: true, strict: true, browser: true */

import { TABLE } from './consts'

class Drawing {
	// returns distance of point p to line segment x, y,xx,yy
	static distFromLine(px, py, x, y, xx, yy) {
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
	static setupContext(ctx, descript) { // sets common context settings
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
}

export { Drawing }