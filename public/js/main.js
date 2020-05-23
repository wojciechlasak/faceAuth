const video = document.getElementById('player');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureButton = document.getElementById('capturebutton');

function convertToImageData(canvas) {
	return canvas.toDataURL('image/png');
};

const constraints = {
	video: true,
};

captureButton.addEventListener('click', () => {
	context.drawImage(video, 0, 0, canvas.width, canvas.height);
	var data = convertToImageData(canvas);
	console.log(data);
	document.getElementById('fileInput').value = data;
});


if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (error) {
      console.log("Something went wrong!");
    });
}

