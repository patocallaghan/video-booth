import Ember from 'ember';

export default Ember.Controller.extend({
  upload: function(audio, video) {
    var fileName = 'test';
    var files = {};
    files.audio = {
      name: fileName + '.' + audio.blob.type.split('/')[1],
      type: audio.blob.type,
      contents: audio.dataURL
    };
    files.video = {
      name: fileName + '.' + video.blob.type.split('/')[1],
      type: video.blob.type,
      contents: video.dataURL
    };

    Em.$.ajax({
      type: "POST",
      url: 'http://localhost:8000/upload',
      data: JSON.stringify(files)
    }).then(function(_fileName) {
      console.log('fileStopped');
    });
  },
  actions: {
    stop: function(audio, video) {
      this.upload(audio, video);
    }
  }

});
