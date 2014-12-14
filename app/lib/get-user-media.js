function errorCallback(error) {
  console.log(JSON.stringify(error));
}

navigator.getUserMedia  = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

export default function captureUserMedia(successCallback) {

  var config = {
    audio: true,
    video: {
      mandatory: {
        minWidth: 1280,
        minHeight: 720
      }
    }
  };
  navigator.getUserMedia(config, successCallback, errorCallback);
}
