import Ember from 'ember';
import getUserMedia from 'video-booth/lib/get-user-media';

export default Ember.Component.extend({
  video: null,
  audioRecorder: null,
  videoRecorder: null,
  isRecording: false,
  stopVideo: function() {
    this.get('audioRecorder').stopRecording(function() {
      this.get('videoRecorder').stopRecording(Em.run.bind(this, this.processVideo));
    }.bind(this));
  },
  processVideo: function() {
    var audioRecorder = this.get('audioRecorder');
    var videoRecorder = this.get('videoRecorder');
    audioRecorder.getDataURL(function(audioDataURL) {
      var audio = {
        blob: audioRecorder.getBlob(),
        dataURL: audioDataURL
      };
      videoRecorder.getDataURL(function(videoDataURL) {
        var video = {
          blob: videoRecorder.getBlob(),
          dataURL: videoDataURL
        };
        this.sendAction('stopRecording', audio, video);
      }.bind(this));
    }.bind(this));
  },
  setupCamera: function(shouldRecordStream) {
    this.get('video').removeAttribute('src');
    getUserMedia(function(stream) {
      this.setupVideoElement(stream);
      if(shouldRecordStream) {
        this.recordVideo(stream);
      }
    }.bind(this));
  },
  setupVideoElement: function(stream) {
    var videoElement = this.get('video');
    videoElement.src = window.URL.createObjectURL(stream);
    videoElement.play();
    videoElement.muted = true;
    videoElement.controls = false;
  },
  recordVideo: function(stream) {
    var audioConfig = {};
    audioConfig.onAudioProcessStarted = function() {
      this.get('videoRecorder').startRecording();
    }.bind(this);

    this.set('audioRecorder', RecordRTC(stream, audioConfig));
    this.set('videoRecorder', RecordRTC(stream, {
      type: 'video'
    }));
    this.get('audioRecorder').startRecording();
  },
  actions: {
    stop: function() {
      this.set('isRecording', false);
      this.stopVideo();
    },
    record: function() {
      this.set('isRecording', true);
      this.setupCamera(true);
    }
  },
  didInsertElement: function() {
    this.set('video', this.$('video')[0]);
    this.setupCamera(false);
  }
});
