var canvas = document.getElementById('output');
var img = document.getElementById('gif');
var context = canvas.getContext('2d');
var fps = 1000/60;
var centerX = canvas.width/2;
var centerY = canvas.height/2;


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

var text = getQueryVariable('text') || "Query Strings are Hard!";

function makeFrame(x,y) {
  context.fillStyle = 'rgb(255,255,255)';
  context.fillRect(0,0,canvas.width, canvas.height); //GIF can't do transparent so do white

  context.fillStyle = "rgb(200,0,0)";
  context.textAlign = "center";
  context.font = '48px Comic Sans';
  context.fillText(text, x, y);
}

var encoder = new GIFEncoder();
encoder.setRepeat(0);  //0  -> loop forever
                       //1+ -> loop n times then stop

encoder.setDelay(fps);

encoder.start();

makeFrame(centerX, centerY);
encoder.addFrame(context);

makeFrame(centerX-40,centerY-20);
encoder.addFrame(context);

makeFrame(centerX+90,centerY+10);
encoder.addFrame(context);

encoder.finish();
var binary_gif = encoder.stream().getData(); //notice this is different from the as3gif package!
var data_url = 'data:image/gif;base64,'+encode64(binary_gif);
encoder.finish();
img.src = data_url;


encoder.download("download.gif");
