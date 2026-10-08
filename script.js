var video = document.getElementById('video');
var cameraShot = document.getElementById('camera-snapshot');

//get selected frame
document.querySelectorAll('.carousel .frame img').forEach(img => {
    img.addEventListener('click', () => {
        localStorage.setItem('selectedFrame', img.getAttribute('src'));
        window.location.href = 'snap.html';
    })
})

const selectedFrameSrc = localStorage.getItem('selectedFrame');
const frameImage = selectedFrameSrc ? new Image() : null;

if (frameImage) {
    frameImage.src = selectedFrameSrc;
}

const takenPhotos = [];

//camera
if (video && cameraShot) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true}).then(function(stream) {
        video.srcObject = stream;
        video.play()
    })
    }

    //mirror
    video.style.transform = 'scaleX(-1)';

    const slots = [
        {x: 5, y: 10, w: 232, h: 174},
        {x: 5, y: 184, w: 232, h: 174},
        {x: 5, y: 358, w: 232, h: 174},
        {x: 5, y: 532,w: 232, h: 174}
    ]

    let isCountingDown = false;

    document.getElementById('snap').addEventListener("click",function() {
        if (takenPhotos.length >= 4 || isCountingDown) return;

        isCountingDown = true;
        photoSequence();
    });

    function photoSequence() {
        if (takenPhotos.length >= 4) {
            isCountingDown = false;
            return;
        }

        let count=3;
        const timerDisplay = document.getElementById('timer');
        timerDisplay.innerText = count;

        const countdownInterval = setInterval(() => {
            count--;

            if (count>0) {
                timerDisplay.innerText = count;
            }

            else {
                clearInterval(countdownInterval);
                timerDisplay.innerText = '';

                takeSnapshot();

                if (takenPhotos.length < 4) {
                    setTimeout(() => {
                        photoSequence();
                    }, 1000);
                }
                else {
                    isCountingDown = false;
                }
            }
        }, 1000);
    };

    function takeSnapshot() {
        const snapshotCanvas = document.createElement('canvas');
        snapshotCanvas.width = video.videoWidth || 640;
        snapshotCanvas.height = video.videoHeight || 480;
        const snapContext = snapshotCanvas.getContext('2d');
        
        snapContext.translate(snapshotCanvas.width, 0);
        snapContext.scale(-1,1);
        snapContext.drawImage(video, 0, 0, snapshotCanvas.width, snapshotCanvas.height);

        takenPhotos.push(snapshotCanvas);

        renderFrameOverlay();
    };

    function renderFrameOverlay(){
        cameraShot.innerHTML = '';

        const stripCanvas = document.createElement('canvas');
        const ctx = stripCanvas.getContext('2d');

        stripCanvas.width = frameImage && frameImage.naturalWidth ? frameImage.naturalWidth : 145;
        stripCanvas.height = frameImage && frameImage.naturalHeight ? frameImage.naturalHeight: 370;

        takenPhotos.forEach((photoCanvas, index) => {
            if(slots[index]){
                const slot = slots[index];
                ctx.drawImage(photoCanvas, slot.x, slot.y, slot.w, slot.h)
            }
        });

        if(frameImage && frameImage.complete && frameImage.naturalWidth > 0) {
            ctx.drawImage(frameImage, 0, 0, stripCanvas.width, stripCanvas.height);
        }

        cameraShot.appendChild(stripCanvas);
    }
}