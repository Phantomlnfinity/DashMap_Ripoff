const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
const checkbox = document.getElementById("layer")

console.log(Math.max(255, 255).toString())

//ctx.scale((window.innerHeight) / 1500, (window.innerHeight) / 1500)
console.log(window.innerHeight)
let scale = 1
let json = {}
let layer = 0
let yvalues = []

checkbox.addEventListener('change', function() {
  draw()
})

addEventListener("keydown", changeLayer);

function changeLayer(key) {
  if (key.code == "Equal") {
    console.log(yvalues)
    if (layer < yvalues.length) {
      layer += 1
      draw()
    }
  }
  if (key.code == "Minus") {
    if (layer > 0) {
      layer -= 1
      draw()
    }
  }
}


function resize() {
  ctx.scale(1 / scale, 1 / scale)
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  scale = (window.innerHeight - 35) / 1500
  ctx.scale(scale, scale)
  if (json != {}) {
    draw()
  }
}

function sortData(a, b) {
  if (a.p[1] == b.p[1]) {
    if (a.id == b.id) {
      if (a.p[0] == b.p[0]) {
        if (a.p[2] == b.p[2]) {
          if (a.r == b.r) {
            return a.uid - b.uid
          } else {
            return a.r - b.r
          }
        } else {
          return a.p[2] - b.p[2]
        }
      } else {
        return a.p[0] - b.p[0]
      }
    } else {
      if (a.id == 12 || a.id == 21 || a.id == 71 || a.id == 72) {
        return 1
      }
      if (b.id == 12 || b.id == 21 || b.id == 71 || b.id == 72) {
        return -1
      }
      return a.id - b.id
    }
  } else {
    return a.p[1] - b.p[1]
  }
}

function fetchData() {
  layer = 0
  ctx.scale(1 / scale, 1 / scale)
  scale = (window.innerHeight - 35) / 1500
  ctx.scale(scale, scale)
  var link = document.getElementById("track").value
  var id = link.slice(link.length - 24, link.length)
  fetch("https://cdn.dashcraft.io/v2/prod/track/" + id + ".json?v=19")
    .then((response) => response.json())
    .then((fetch) => {
      json = fetch
      draw()
    })
}

const hexToRGBA = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = hex.slice(7, 10)

  return ([r, g, b, a])
}

function brightnessChange(color, brightness) {
  rgb = hexToRGBA(color)

  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.round(rgb[i] * brightness / 100)
    if (rgb[i] > 255) {
      rgb[i] = 255
    }
  }
  return "rgba(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ", " + rgb[3] + ")"
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (json.environmentId == 2) {
    ctx.fillStyle = "#61b3d8"
    ctx.fillRect(0, 0, 1500, 1500)
  } else {
    ctx.filter = "brightness(70%)"
    ctx.fillStyle = "#59cb63"
    ctx.fillRect(0, 0, 1500, 1500)
    ctx.fillStyle = "#57c661"
    for (let i = 0; i < 50; i++) {
      ctx.fillRect(0, i * 30, 1500, 15)
    }
    ctx.filter = "brightness(100%)"
  }

  json.trackPieces.sort(sortData)
  for (let i = 0; i < json.trackPieces.length; i++) {
    if (!yvalues.includes(json.trackPieces[i].p[1])) {
      yvalues.push(json.trackPieces[i].p[1])
    }
  }
  if (yvalues.length < 10) {
    var scale = 5
    var min = 100 - yvalues.length * 2.5
  } else {
    var scale = 50 / yvalues.length
    var min = 75
  }

  ctx.lineWidth = 4
  var ids = ""

  for (let i = 0; i < json.trackPieces.length; i++) {
    var alpha = 1
    if (checkbox.checked) {
      if (json.trackPieces[i].p[1] != yvalues[layer]) {
        if (json.trackPieces[i].p[1] == yvalues[layer] - 15 || json.trackPieces[i].p[1] == yvalues[layer] + 15) {
          alpha = 0.25
        } else {
          continue
        }
      }
    }

    ids += json.trackPieces[i].id + ", "
    if (i == 0 || json.trackPieces[i].p[1] != json.trackPieces[i - 1].p[1]) {
      brightness = (yvalues.indexOf(json.trackPieces[i].p[1]) + 0.5) * scale + min
      let trans = alpha
      console.log("#a5a5a5" + trans)
      
      road = brightnessChange("#a5a5a5" + trans, brightness)
      yellow = brightnessChange("#ffcf00" + trans, brightness)
      blue = brightnessChange("#5279ff" + trans, brightness)
      white = brightnessChange("#ffffff" + trans, brightness)
      border = brightnessChange("#363636" + trans, brightness)
      finish = brightnessChange("#ef3533" + trans, brightness)
      platformEdge = brightnessChange("#dbceda" + trans, brightness)
      roadPlatform = brightnessChange("#e2cfdd" + trans, brightness)
      tube = brightnessChange("#67ffff" + trans / 2, brightness)
      lightgrass = brightnessChange("#56d463" + trans, brightness)
      darkgrass = brightnessChange("#53cd5f" + trans, brightness)
      tree = brightnessChange("#1b6e32" + trans, brightness)
    }

    ctx.save();
    r = json.trackPieces[i].r
    id = json.trackPieces[i].id

    if (r == 0) {
      x = (json.trackPieces[i].p[0] + 750)
      y = (-json.trackPieces[i].p[2] + 750)
    } else if (r == 90) {
      y = (-json.trackPieces[i].p[0] + 750)
      x = (-json.trackPieces[i].p[2] + 750)
      ctx.translate(1500, 0);
    } else if (r == 180) {
      x = (-json.trackPieces[i].p[0] + 750)
      y = (json.trackPieces[i].p[2] + 750)
      ctx.translate(1500, 1500);
    } else if (r == 270) {
      y = (json.trackPieces[i].p[0] + 750)
      x = (json.trackPieces[i].p[2] + 750)
      ctx.translate(0, 1500);
    }

    ctx.rotate(r * Math.PI / 180)

    if (id == 1) {
      ctx.fillStyle = road
      ctx.fillRect(x - 15, y - 15, 30, 30)

      ctx.fillStyle = yellow
      ctx.fillRect(x - 11, y - 15, 4, 30)
      ctx.fillRect(x + 7, y - 15, 4, 30)

      ctx.fillStyle = blue
      ctx.fillRect(x - 11, y - 4, 22, 8)

      ctx.fillStyle = white
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x - 12 + i * 8, y - 4, 4, 4)
        ctx.fillRect(x - 8 + i * 8, y, 4, 4)
      }

      ctx.fillStyle = border
      ctx.fillRect(x - 15, y - 15, 4, 30)
      ctx.fillRect(x + 11, y - 15, 4, 30)
    }

    else if (id == 2) {
      ctx.fillStyle = road
      ctx.fillRect(x - 15, y - 15, 30, 30)

      ctx.fillStyle = border
      ctx.fillRect(x - 15, y - 15, 4, 30)
      ctx.fillRect(x + 11, y - 15, 4, 30)

      ctx.fillStyle = yellow
      ctx.fillRect(x - 11, y - 15, 4, 30)
      ctx.fillRect(x + 7, y - 15, 4, 30)

      ctx.fillStyle = finish
      ctx.fillRect(x - 11, y - 4, 22, 8)
    }

    else if (id == 3 || id == 24 || id == 49) {
      ctx.fillStyle = road
      ctx.fillRect(x - 15, y - 15, 30, 30)

      ctx.fillStyle = border
      ctx.fillRect(x - 15, y - 15, 4, 30)
      ctx.fillRect(x + 11, y - 15, 4, 30)

      ctx.fillStyle = yellow
      ctx.fillRect(x - 11, y - 15, 4, 30)
      ctx.fillRect(x + 7, y - 15, 4, 30)
    }

    else if (id == 4) {
      ctx.fillStyle = road
      ctx.beginPath();
      ctx.arc(x + 15, y + 15, 30, Math.PI, Math.PI / 2 * 3);
      ctx.lineTo(x + 15, y + 15);
      ctx.fill();

      ctx.fillStyle = border
      ctx.beginPath();
      ctx.arc(x + 15, y + 15, 4, Math.PI, Math.PI / 2 * 3);
      ctx.lineTo(x + 15, y + 15);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x + 15, y + 15, 28, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()

      ctx.strokeStyle = yellow
      ctx.beginPath();
      ctx.arc(x + 15, y + 15, 6, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()

      ctx.beginPath();
      ctx.arc(x + 15, y + 15, 24, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()
    }

    else if (id == 6 || id == 57 || id == 58) {
      ctx.fillStyle = road
      ctx.beginPath();
      ctx.arc(x + 30, y + 30, 60, Math.PI, Math.PI / 2 * 3);
      ctx.arc(x + 30, y + 30, 30, Math.PI / 2 * 3, Math.PI, true);
      ctx.fill();

      ctx.fillStyle = border
      ctx.beginPath()
      ctx.arc(x + 30, y + 30, 58, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(x + 30, y + 30, 32, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()

      ctx.strokeStyle = yellow
      ctx.beginPath()
      ctx.arc(x + 30, y + 30, 36, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(x + 30, y + 30, 54, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()
    }

    else if (id == 8 || id == 52 || id == 53 || id == 75 || id == 62 || id == 79 || id == 77) {
      ctx.fillStyle = road
      ctx.beginPath();
      ctx.arc(x + 45, y + 45, 90, Math.PI, Math.PI / 2 * 3);
      ctx.arc(x + 45, y + 45, 60, Math.PI / 2 * 3, Math.PI, true);
      ctx.fill();

      ctx.fillStyle = border
      ctx.beginPath()
      ctx.arc(x + 45, y + 45, 88, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(x + 45, y + 45, 62, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()

      ctx.strokeStyle = yellow
      ctx.beginPath()
      ctx.arc(x + 45, y + 45, 66, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(x + 45, y + 45, 84, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()
    }

    else if (id == 9) {
      ctx.fillStyle = road
      ctx.fillRect(x - 15, y - 15, 30, 30)

      ctx.fillStyle = platformEdge
      ctx.fillRect(x - 15, y - 15, 4, 30)
      ctx.fillRect(x + 11, y - 15, 4, 30)
      ctx.fillRect(x - 15, y + 11, 30, 4)

      ctx.fillStyle = yellow
      ctx.fillRect(x - 15, y - 15, 1, 30)
      ctx.fillRect(x + 14, y - 15, 1, 30)
      ctx.fillRect(x - 15, y - 15, 30, 1)
      ctx.fillRect(x - 15, y + 14, 30, 1)

      ctx.fillStyle = road
      ctx.fillRect(x - 15, y - 15, 30, 4)
    }

    else if (id == 10) {
      ctx.strokeStyle = road
      ctx.beginPath();
      ctx.arc(x + 15, y + 15, 30, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()
    }

    else if (id == 11) {
      ctx.fillStyle = road
      ctx.fillRect(x - 15, y - 15, 30, 30)

      ctx.fillStyle = platformEdge
      ctx.fillRect(x - 15, y - 15, 4, 30)
      ctx.fillRect(x + 11, y - 15, 4, 30)
      ctx.fillRect(x - 15, y + 11, 30, 4)

      ctx.fillStyle = yellow
      ctx.fillRect(x - 15, y - 15, 1, 30)
      ctx.fillRect(x + 14, y - 15, 1, 30)
      ctx.fillRect(x - 15, y + 14, 30, 1)
    }

    else if (id == 12 || id == 71) {
      ctx.fillStyle = road
      ctx.fillRect(x - 15, y - 2, 30, 4)
    }

    else if (id == 13 || id == 14) {
      ctx.fillStyle = road
      ctx.fillRect(x - 15, y - 15, 30, 30)

      ctx.fillStyle = platformEdge
      ctx.fillRect(x - 15, y - 15, 4, 30)
      ctx.fillRect(x + 11, y - 15, 4, 30)
      ctx.fillRect(x - 15, y - 15, 30, 4)
      ctx.fillRect(x - 15, y + 11, 30, 4)

      ctx.fillStyle = yellow
      ctx.fillRect(x - 15, y - 15, 1, 30)
      ctx.fillRect(x + 14, y - 15, 1, 30)
      ctx.fillRect(x - 15, y - 15, 30, 1)
      ctx.fillRect(x - 15, y + 14, 30, 1)
    }

    else if (id == 15 || id == 16) {
      ctx.fillStyle = road
      ctx.fillRect(x - 15, y - 30, 30, 45)

      ctx.fillStyle = platformEdge
      ctx.fillRect(x - 15, y - 30, 4, 45)
      ctx.fillRect(x + 11, y - 30, 4, 45)
      ctx.fillRect(x - 15, y - 30, 30, 4)
      ctx.fillRect(x - 15, y + 11, 30, 4)

      ctx.fillStyle = yellow
      ctx.fillRect(x - 15, y - 30, 1, 45)
      ctx.fillRect(x + 14, y - 30, 1, 45)
      ctx.fillRect(x - 15, y - 30, 30, 1)
      ctx.fillRect(x - 15, y + 14, 30, 1)
    }

    else if (id == 17 || id == 23 || id == 25) {
      ctx.fillStyle = road
      ctx.fillRect(x - 15, y - 30, 30, 45)

      ctx.fillStyle = border
      ctx.fillRect(x - 15, y - 30, 4, 45)
      ctx.fillRect(x + 11, y - 30, 4, 45)

      ctx.fillStyle = yellow
      ctx.fillRect(x - 11, y - 30, 4, 45)
      ctx.fillRect(x + 7, y - 30, 4, 45)
    }

    else if (id == 18 || id == 61 || id == 60) {
      ctx.fillStyle = road
      ctx.fillRect(x - 15, y - 45, 30, 90)

      ctx.fillStyle = border
      ctx.fillRect(x - 15, y - 45, 4, 90)
      ctx.fillRect(x + 11, y - 45, 4, 90)

      ctx.fillStyle = yellow
      ctx.fillRect(x - 11, y - 45, 4, 90)
      ctx.fillRect(x + 7, y - 45, 4, 90)
    }

    else if (id == 20 || id == 21 || id == 48 || id == 47) {
      ctx.fillStyle = white
      ctx.fillRect(x - 15, y - 2, 30, 4)
    }

    else if (id == 22) {
      ctx.fillStyle = road
      ctx.fillRect(x - 15, y - 75, 30, 135)

      ctx.fillStyle = border
      ctx.fillRect(x - 15, y - 75, 4, 135)
      ctx.fillRect(x + 11, y - 75, 4, 135)

      ctx.fillStyle = yellow
      ctx.fillRect(x - 11, y - 75, 4, 135)
      ctx.fillRect(x + 7, y - 75, 4, 135)
    }

    else if (id == 26) {
      ctx.fillStyle = road
      ctx.fillRect(x - 15, y - 15, 30, 30)

      ctx.fillStyle = border
      ctx.fillRect(x - 15, y - 15, 30, 4)

      ctx.beginPath();
      ctx.arc(x - 15, y + 15, 4, Math.PI / 2 * 3, 0);
      ctx.lineTo(x - 15, y + 15);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x + 15, y + 15, 4, Math.PI, Math.PI / 2 * 3);
      ctx.lineTo(x + 15, y + 15);
      ctx.fill();

      ctx.strokeStyle = yellow
      ctx.fillStyle = yellow
      ctx.fillRect(x - 15, y - 11, 30, 4)

      ctx.beginPath()
      ctx.arc(x + 15, y + 15, 6, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(x - 15, y + 15, 6, Math.PI / 2 * 3, 0);
      ctx.stroke()
    }

    else if (id == 27) {
      ctx.fillStyle = road
      ctx.fillRect(x - 15, y - 15, 30, 30)

      ctx.fillStyle = border
      ctx.beginPath();
      ctx.arc(x - 15, y + 15, 4, Math.PI / 2 * 3, 0);
      ctx.lineTo(x - 15, y + 15);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x + 15, y + 15, 4, Math.PI, Math.PI / 2 * 3);
      ctx.lineTo(x + 15, y + 15);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x - 15, y - 15, 4, 0, Math.PI / 2);
      ctx.lineTo(x - 15, y - 15);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x + 15, y - 15, 4, Math.PI / 2, Math.PI);
      ctx.lineTo(x + 15, y - 15);
      ctx.fill();

      ctx.strokeStyle = yellow
      ctx.beginPath();
      ctx.arc(x - 15, y + 15, 6, Math.PI / 2 * 3, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x + 15, y + 15, 6, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()

      ctx.beginPath();
      ctx.arc(x - 15, y - 15, 6, 0, Math.PI / 2);
      ctx.stroke()

      ctx.beginPath();
      ctx.arc(x + 15, y - 15, 6, Math.PI / 2, Math.PI);
      ctx.stroke()
    }

    else if (id == 28) {
      ctx.strokeStyle = border
      ctx.beginPath()
      ctx.arc(x + 45, y + 30, 58, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(x + 45, y + 30, 32, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(x - 45, y + 30, 58, Math.PI / 2 * 3, 0);
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(x - 45, y + 30, 32, Math.PI / 2 * 3, 0);
      ctx.stroke()

      ctx.strokeStyle = yellow
      ctx.beginPath()
      ctx.arc(x + 45, y + 30, 36, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(x + 45, y + 30, 54, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(x - 45, y + 30, 36, Math.PI / 2 * 3, 0);
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(x - 45, y + 30, 54, Math.PI / 2 * 3, 0);
      ctx.stroke()

      ctx.fillStyle = road
      ctx.beginPath();
      ctx.arc(x - 45, y + 30, 52, Math.PI / 2 * 3, 0);
      ctx.arc(x - 45, y + 30, 38, 0, Math.PI / 2 * 3, true);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x + 45, y + 30, 52, Math.PI, Math.PI / 2 * 3);
      ctx.arc(x + 45, y + 30, 38, Math.PI / 2 * 3, Math.PI, true);
      ctx.fill();
    }

    else if (id == 29 || id == 37) {
      ctx.fillStyle = roadPlatform
      ctx.fillRect(x - 15, y - 15, 30, 30)
    }

    else if (id == 30) {
      ctx.fillStyle = roadPlatform
      ctx.beginPath();
      ctx.arc(x + 15, y + 15, 30, Math.PI, Math.PI / 2 * 3);
      ctx.lineTo(x + 15, y + 15);
      ctx.fill();

      ctx.fillStyle = border
      ctx.beginPath();
      ctx.arc(x + 15, y + 15, 28, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()

      ctx.strokeStyle = blue
      ctx.beginPath();
      ctx.arc(x + 15, y + 15, 24, Math.PI, Math.PI / 2 * 3);
      ctx.stroke()
    }

    else if (id == 31) {
      ctx.fillStyle = roadPlatform
      ctx.beginPath();
      ctx.arc(x - 30, y - 30, 30, 0, Math.PI / 2);
      ctx.lineTo(x, y);
      ctx.fill();
      ctx.fillRect(x - 30, y, 30, 30)
      ctx.fillRect(x, y - 30, 30, 30)

      ctx.fillStyle = border
      ctx.beginPath();
      ctx.arc(x - 30, y - 30, 32, 0, Math.PI / 2);
      ctx.stroke()

      ctx.strokeStyle = blue
      ctx.beginPath();
      ctx.arc(x - 30, y - 30, 36, 0, Math.PI / 2);
      ctx.stroke()
    }

    else if (id == 32 || id == 34) {
      ctx.fillStyle = roadPlatform
      ctx.fillRect(x - 15, y - 15, 30, 30)

      ctx.fillStyle = border
      ctx.fillRect(x - 15, y - 15, 4, 30)

      ctx.fillStyle = blue
      ctx.fillRect(x - 11, y - 15, 4, 30)
    }

    else if (id == 33 || id == 35) {
      ctx.fillStyle = roadPlatform
      ctx.fillRect(x - 15, y - 30, 30, 45)

      ctx.fillStyle = border
      ctx.fillRect(x - 15, y - 30, 4, 45)

      ctx.fillStyle = blue
      ctx.fillRect(x - 11, y - 30, 4, 45)
    }

    else if (id == 36 || id == 38) {
      ctx.fillStyle = roadPlatform
      ctx.fillRect(x - 15, y - 30, 30, 45)
    }

    else if (id == 39 || id == 41) {
      ctx.fillStyle = roadPlatform
      ctx.fillRect(x - 15, y - 30, 30, 45)

      ctx.fillStyle = border
      ctx.fillRect(x + 11, y - 30, 4, 45)

      ctx.fillStyle = blue
      ctx.fillRect(x + 7, y - 30, 4, 45)
    }

    else if (id == 40) {
      ctx.fillStyle = roadPlatform
      ctx.fillRect(x - 15, y - 15, 30, 30)

      ctx.fillStyle = border
      ctx.fillRect(x + 11, y - 15, 4, 30)

      ctx.fillStyle = blue
      ctx.fillRect(x + 7, y - 15, 4, 30)
    }

    else if (id == 42) {
      ctx.fillStyle = road
      ctx.fillRect(x - 15, y - 15, 30, 15)

      ctx.fillStyle = border
      ctx.fillRect(x - 15, y - 15, 4, 15)
      ctx.fillRect(x + 11, y - 15, 4, 15)

      ctx.fillStyle = yellow
      ctx.fillRect(x - 11, y - 15, 4, 15)
      ctx.fillRect(x + 7, y - 15, 4, 15)
    }

    else if (id == 54 || id == 76 || id == 63 || id == 80 || id == 78) {
      ctx.fillStyle = road
      ctx.beginPath();
      ctx.arc(x - 45, y + 45, 90, Math.PI / 2 * 3, 0);
      ctx.arc(x - 45, y + 45, 60, 0, Math.PI / 2 * 3, true);
      ctx.fill();

      ctx.fillStyle = border
      ctx.beginPath()
      ctx.arc(x - 45, y + 45, 88, Math.PI / 2 * 3, 0);
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(x - 45, y + 45, 62, Math.PI / 2 * 3, 0);
      ctx.stroke()

      ctx.strokeStyle = yellow
      ctx.beginPath()
      ctx.arc(x - 45, y + 45, 66, Math.PI / 2 * 3, 0);
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(x - 45, y + 45, 84, Math.PI / 2 * 3, 0);
      ctx.stroke()
    }

    else if (id == 59) {
      ctx.fillStyle = road
      ctx.beginPath();
      ctx.arc(x - 30, y + 30, 60, Math.PI / 2 * 3, 0);
      ctx.arc(x - 30, y + 30, 30, 0, Math.PI / 2 * 3, true);
      ctx.fill();

      ctx.fillStyle = border
      ctx.beginPath()
      ctx.arc(x - 30, y + 30, 58, Math.PI / 2 * 3, 0);
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(x - 30, y + 30, 32, Math.PI / 2 * 3, 0);
      ctx.stroke()

      ctx.strokeStyle = yellow
      ctx.beginPath()
      ctx.arc(x - 30, y + 30, 36, Math.PI / 2 * 3, 0);
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(x - 30, y + 30, 54, Math.PI / 2 * 3, 0);
      ctx.stroke()
    }

    else if (id == 64) {
      ctx.fillStyle = road
      ctx.beginPath();
      sineWave(x - 15, y + 15, 15, 30, true)
      ctx.lineTo(x + 15, y + 15)
      sineWave(x + 15, y + 15, 15, 30, true)
      ctx.lineTo(x, y - 15)
      ctx.fill()

      ctx.strokeStyle = border
      ctx.beginPath();
      sineWave(x - 13, y + 15, 15, 30, true)
      ctx.stroke()

      ctx.beginPath();
      sineWave(x + 13, y + 15, 15, 30, true)
      ctx.stroke()

      ctx.strokeStyle = yellow
      ctx.beginPath();
      sineWave(x - 9, y + 15, 15, 30, true)
      ctx.stroke()

      ctx.beginPath();
      sineWave(x + 9, y + 15, 15, 30, true)
      ctx.stroke()
    }

    else if (id == 65) {
      ctx.fillStyle = road
      ctx.beginPath();
      sineWave(x - 30, y - 15, 15, 30, false)
      ctx.lineTo(x, y - 15)
      sineWave(x, y - 15, 15, 30, false)
      ctx.lineTo(x - 15, y + 15)
      ctx.fill()

      ctx.strokeStyle = border
      ctx.beginPath();
      sineWave(x - 28, y - 15, 15, 30, false)
      ctx.stroke()

      ctx.beginPath();
      sineWave(x - 2, y - 15, 15, 30, false)
      ctx.stroke()

      ctx.strokeStyle = yellow
      ctx.beginPath();
      sineWave(x - 24, y - 15, 15, 30, false)
      ctx.stroke()

      ctx.beginPath();
      sineWave(x - 6, y - 15, 15, 30, false)
      ctx.stroke()
    }

    else if (id == 66) {
      ctx.fillStyle = road
      ctx.beginPath()
      sineWave(x - 30, y + 30, 30, 60, true)
      ctx.lineTo(x + 30, y - 30)
      sineWave(x, y + 30, 30, 60, true)
      ctx.lineTo(x - 30, y + 30)
      ctx.fill()

      ctx.strokeStyle = border
      ctx.beginPath()
      sineWave(x - 28, y + 30, 30, 60, true)
      ctx.stroke()
      ctx.beginPath()
      sineWave(x - 2, y + 30, 30, 60, true)
      ctx.stroke()

      ctx.strokeStyle = yellow
      ctx.beginPath()
      sineWave(x - 24, y + 30, 30, 60, true)
      ctx.stroke()
      ctx.beginPath()
      sineWave(x - 6, y + 30, 30, 60, true)
      ctx.stroke()
    }

    else if (id == 67) {
      ctx.fillStyle = road
      ctx.beginPath()
      sineWave(x - 30, y - 30, 30, 60)
      ctx.lineTo(x + 30, y + 30)
      sineWave(x, y - 30, 30, 60)
      ctx.lineTo(x - 30, y - 30)
      ctx.fill()

      ctx.strokeStyle = border
      ctx.beginPath()
      sineWave(x - 28, y - 30, 30, 60)
      ctx.stroke()
      ctx.beginPath()
      sineWave(x - 2, y - 30, 30, 60)
      ctx.stroke()

      ctx.strokeStyle = yellow
      ctx.beginPath()
      sineWave(x - 24, y - 30, 30, 60)
      ctx.stroke()
      ctx.beginPath()
      sineWave(x - 6, y - 30, 30, 60)
      ctx.stroke()
    }

    else if (id == 68) {
      ctx.fillStyle = road
      ctx.beginPath()
      sineWave(x - 45, y + 45, 60, 90, true)
      ctx.lineTo(x + 45, y - 45)
      sineWave(x - 15, y + 45, 60, 90, true)
      ctx.lineTo(x - 45, y + 45)
      ctx.fill()

      ctx.strokeStyle = border
      ctx.beginPath()
      sineWave(x - 43, y + 45, 60, 90, true)
      ctx.stroke()
      ctx.beginPath()
      sineWave(x - 17, y + 45, 60, 90, true)
      ctx.stroke()

      ctx.strokeStyle = yellow
      ctx.beginPath()
      sineWave(x - 39, y + 45, 60, 90, true)
      ctx.stroke()
      ctx.beginPath()
      sineWave(x - 21, y + 45, 60, 90, true)
      ctx.stroke()
    }

    else if (id == 69) {
      ctx.fillStyle = road
      ctx.beginPath()
      sineWave(x - 45, y - 45, 60, 90)
      ctx.lineTo(x + 45, y + 45)
      sineWave(x - 15, y - 45, 60, 90)
      ctx.lineTo(x - 45, y - 45)
      ctx.fill()

      ctx.strokeStyle = border
      ctx.beginPath()
      sineWave(x - 43, y - 45, 60, 90)
      ctx.stroke()
      ctx.beginPath()
      sineWave(x - 17, y - 45, 60, 90)
      ctx.stroke()

      ctx.strokeStyle = yellow
      ctx.beginPath()
      sineWave(x - 39, y - 45, 60, 90)
      ctx.stroke()
      ctx.beginPath()
      sineWave(x - 21, y - 45, 60, 90)
      ctx.stroke()
    }

    else if (id == 70 || id == 43) {
      ctx.fillStyle = road
      ctx.fillRect(x - 15, y - 15, 30, 15)

      ctx.fillStyle = platformEdge
      ctx.fillRect(x - 15, y - 15, 4, 15)
      ctx.fillRect(x + 11, y - 15, 4, 15)
      ctx.fillRect(x - 15, y - 15, 30, 4)
      ctx.fillRect(x - 15, y - 4, 30, 4)

      ctx.fillStyle = yellow
      ctx.fillRect(x - 15, y - 15, 1, 15)
      ctx.fillRect(x + 14, y - 15, 1, 15)
      ctx.fillRect(x - 15, y - 15, 30, 1)
      ctx.fillRect(x - 15, y - 1, 30, 1)
    }

    else if (id == 72) {
      ctx.fillStyle = platformEdge
      ctx.fillRect(x, y - 2, 15, 4)
    }

    else if (id == 73) {
      ctx.fillStyle = roadPlatform
      ctx.fillRect(x - 15, y - 15, 30, 15)
    }

    else if (id == 74) {
      ctx.fillStyle = roadPlatform
      ctx.fillRect(x - 15, y - 15, 30, 15)

      ctx.fillStyle = border
      ctx.fillRect(x - 15, y - 15, 4, 15)

      ctx.fillStyle = blue
      ctx.fillRect(x - 11, y - 15, 4, 15)
    }

    else if (id == 81) {
      ctx.fillStyle = white
      ctx.fillRect(x - 3, y - 15, 6, 30)

      ctx.fillStyle = border
      ctx.fillRect(x - 3, y - 15, 6, 1)
      ctx.fillRect(x - 3, y + 14, 6, 1)
    }

    else if (id == 82 || id == 90) {
      ctx.fillStyle = white
      ctx.fillRect(x - 3, y - 15, 6, 15)

      ctx.fillStyle = border
      ctx.fillRect(x - 3, y - 15, 6, 1)
      ctx.fillRect(x - 3, y - 1, 6, 1)
    }

    else if (id == 83 || id == 84) {
      ctx.fillStyle = border
      ctx.beginPath()
      ctx.arc(x, y, 3.5, 0, Math.PI * 2)
      ctx.fill()
    }

    else if (id == 85) {
      ctx.fillStyle = white
      ctx.beginPath();
      ctx.arc(x + 15, y, 12, Math.PI, Math.PI / 2 * 3);
      ctx.arc(x + 15, y, 18, Math.PI / 2 * 3, Math.PI, true);
      ctx.fill();

      ctx.fillStyle = border
      ctx.fillRect(x - 3, y, 6, 1)
      ctx.fillRect(x + 14, y - 18, 1, 6)
    }

    else if (id == 86) {
      ctx.fillStyle = white
      ctx.beginPath()
      ctx.arc(x, y, 3.5, 0, Math.PI)
      ctx.lineTo(x - 3, y - 15)
      ctx.lineTo(x + 3, y - 15)
      ctx.fill()

      ctx.fillStyle = border
      ctx.fillRect(x - 3, y - 15, 6, 1)
    }

    else if (id == 87) {
      ctx.fillStyle = white
      ctx.fillRect(x - 3, y - 15, 6, 15)

      ctx.fillStyle = border
      ctx.fillRect(x - 3, y - 1, 6, 1)
      ctx.beginPath()
      ctx.arc(x, y - 15, 3.5, 0, Math.PI * 2)
      ctx.fill()
    }

    else if (id == 88) {
      ctx.fillStyle = white
      ctx.fillRect(x - 3, y - 15, 6, 30)
      ctx.fillRect(x - 15, y - 3, 30, 6)

      ctx.fillStyle = border
      ctx.fillRect(x - 3, y - 15, 6, 1)
      ctx.fillRect(x - 3, y + 14, 6, 1)
      ctx.fillRect(x + 14, y - 3, 1, 6)
      ctx.fillRect(x - 15, y - 3, 1, 6)

      ctx.fillRect(x - 3, y - 3, 6, 6)
    }

    else if (id == 89) {
      ctx.fillStyle = white
      ctx.fillRect(x - 15, y - 3, 30, 6)

      ctx.fillStyle = border
      ctx.fillRect(x + 14, y - 3, 1, 6)
      ctx.fillRect(x - 15, y - 3, 1, 6)

      ctx.beginPath()
      ctx.arc(x, y, 3.5, 0, Math.PI * 2)
      ctx.fill()
    }

    else if (id == 91) {
      ctx.fillStyle = tube
      ctx.fillRect(x - 15, y - 15, 30, 30)
      ctx.fillRect(x - 15, y - 15, 30, 30)

      ctx.fillStyle = border
      ctx.fillRect(x - 15, y - 15, 30, 1)
      ctx.fillRect(x - 15, y + 13, 30, 1)
    }

    else if (id == 92) {
      ctx.fillStyle = tube
      ctx.fillRect(x - 15, y - 15, 30, 15)
      ctx.fillRect(x - 15, y - 15, 30, 15)

      ctx.fillStyle = border
      ctx.fillRect(x - 15, y - 15, 30, 1)
      ctx.fillRect(x - 15, y - 1, 30, 1)
    }

    else if (id == 93 || id == 94) {
      ctx.lineWidth = 1
      ctx.strokeStyle = border
      ctx.beginPath()
      ctx.arc(x, y, 14, 0, Math.PI * 2)
      ctx.stroke()
    }

    else if (id == 95) {
      ctx.fillStyle = tube
      ctx.beginPath();
      ctx.arc(x + 30, y + 30, 60, Math.PI, Math.PI / 2 * 3);
      ctx.arc(x + 30, y + 30, 30, Math.PI / 2 * 3, Math.PI, true);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 30, y + 30, 60, Math.PI, Math.PI / 2 * 3);
      ctx.arc(x + 30, y + 30, 30, Math.PI / 2 * 3, Math.PI, true);
      ctx.fill();

      ctx.fillStyle = border
      ctx.fillRect(x - 30, y + 29, 30, 1)
      ctx.fillRect(x + 30, y - 30, 1, 30)
    }

    else if (id == 96) {
      ctx.strokeStyle = border
      ctx.lineWidth = 1
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2)
      ctx.stroke()

      ctx.fillStyle = tube
      ctx.beginPath();
      ctx.arc(x, y, 15, Math.PI, 0)
      ctx.lineTo(x + 15, y - 45)
      ctx.lineTo(x - 15, y - 45)
      ctx.fill()

      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI)
      ctx.lineTo(x - 15, y - 45)
      ctx.lineTo(x + 15, y - 45)
      ctx.fill()

      ctx.fillStyle = border
      ctx.fillRect(x - 15, y - 45, 30, 1)
    }

    else if (id == 97) {
      ctx.fillStyle = tube
      ctx.beginPath();
      ctx.arc(x, y, 15, Math.PI, 0)
      ctx.lineTo(x + 15, y - 45)
      ctx.lineTo(x - 15, y - 45)
      ctx.fill()

      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI)
      ctx.lineTo(x - 15, y - 45)
      ctx.lineTo(x + 15, y - 45)
      ctx.fill()

      ctx.fillStyle = border
      ctx.fillRect(x - 15, y - 45, 30, 1)

      ctx.strokeStyle = border
      ctx.lineWidth = 1
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2)
      ctx.stroke()
    }

    else if (id == 98) {
      ctx.fillStyle = lightgrass
      ctx.fillRect(x - 15, y - 15, 30, 30)

      ctx.fillStyle = darkgrass
      ctx.fillRect(x - 15, y - 15, 15, 15)
      ctx.fillRect(x, y, 15, 15)
    }

    else if (id == 101) {
      ctx.fillStyle = tree
      ctx.fillRect(x - 11, y - 11, 7, 7)
      ctx.fillRect(x - 11, y + 4, 7, 7)
      ctx.fillRect(x + 4, y - 11, 7, 7)
      ctx.fillRect(x + 4, y + 4, 7, 7)
    }

    else if (id == 103) {
      ctx.fillStyle = tree
      ctx.fillRect(x + 4, y - 11, 7, 7)
    }

    else {
      ctx.fillStyle = road
      //ctx.fillRect(x - 15, y - 15, 30, 30)
    }



    ctx.restore()
  }
}

function sineWave(x, y, width, height, invert) {
  ctx.moveTo(x, y)
  for (let i = 0; i < height; i++) {
    if (invert) {
      ctx.lineTo(x + Math.sin((i - height / 2) * Math.PI / height) * width / 2 + width / 2, y - i)
    } else {
      ctx.lineTo(x + Math.sin((i - height / 2) * Math.PI / height) * width / 2 + width / 2, y + i)
    }
  }
}