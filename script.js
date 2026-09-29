var video = document.getElementById('video');
var cameraShot = document.getElementById('camera-snapshot');
var canvasShot = document.getElementById('canvas');


if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true}).then(function(stream) {
        video.srcObject = stream;
        video.play()
    })
}

video.style.transform = 'scaleX(-1)';

document.getElementById('snap').addEventListener("click",function() {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d')
    
    canvas.style.transform = 'scaleX(-1)';
    canvas.width = 145;
    canvas.height = 101;
    canvas.className = 'canvas';
    canvas.style.margin = '0px 1.5px';
    context.save();

    cameraShot.appendChild(canvas);
    context.drawImage(video, 0, 0, 145, 101)
})