function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  console.log('Query variable %s not found', variable);
}

var canvas = document.getElementById('output');
var img = document.getElementById('gif');
var download = document.getElementById('download');
var context = canvas.getContext('2d');
var fps = getQueryVariable('fps');
if(fps) {
  fps = parseInt(fps, 10);
} else {
  fps = 60;
}
var msPerFrame = 1000/fps;
var color = getQueryVariable('color') || "rgb(0,0,0)";
color = decodeURIComponent((color).replace(/\+/g, '%20'));

var centerX = canvas.width/2;
var centerY = canvas.height/2;
var text = getQueryVariable('text') || "Query Strings are Hard!";
text = decodeURIComponent((text).replace(/\+/g, '%20'));

// Set form fields from querystring vars.
var $text = document.getElementById('text');
var $fps = document.getElementById('fps');
var $color = document.getElementById('color');
var $colorButton = document.getElementById('colorButton');
$text.value = text;
$fps.value = fps;
$color.value = color;
var picker = new jscolor($colorButton);
picker.value = color;
picker.valueElement = $color;
picker.onFineChange = function(){ updateColor(picker); };
picker.fromString(color);
$colorButton.value = '';
$colorButton.innerHTML = '';

function makeFrame(x,y) {
  context.fillStyle = 'rgb(255,255,255)';
  context.fillRect(0,0,canvas.width, canvas.height); //GIF can't do transparent so do white

  context.fillStyle = color;
  context.textAlign = "center";
  context.font = '48px Comic Sans MS';
  context.fillText(text, x, y);
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function generateFramePositions(startX, startY, totalFrames) {
  totalFrames = totalFrames || 3;
  let framePositions = [];
  framePositions.push([startX, startY]);
  const maxDelta = 20;

  while(framePositions.length <= totalFrames) {
    let [newX, newY] = framePositions[framePositions.length-1];
    newX += getRandomArbitrary(-maxDelta, maxDelta);
    newY += getRandomArbitrary(-maxDelta, maxDelta);
    console.log("New x,y: ", {newX, newY})
    framePositions.push([newX, newY]);
  }

  return framePositions;
}

var encoder = new GIFEncoder();
encoder.setRepeat(0);  //0  -> loop forever
                       //1+ -> loop n times then stop

encoder.setDelay(msPerFrame);

const framePositions = generateFramePositions(centerX, centerY, 5);

encoder.start();

let i = 0;
let len = framePositions.length;
let currentFramePosition = null;
let x, y;

console.log(`Creating ${len} frames...`)
for(; i < len; i++) {
  [x, y] = framePositions[i];
  makeFrame(x, y);
  encoder.addFrame(context);
}

encoder.finish();

var binary_gif = encoder.stream().getData();
var data_url = 'data:image/gif;base64,'+encode64(binary_gif);
encoder.finish();
img.src = data_url;

download.onclick = function() {
  encoder.download("download.gif");
};

function updateColor(picker) {
  $color.value = picker.toRGBString();
}
