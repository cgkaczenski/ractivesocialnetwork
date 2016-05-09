var ContentModel = require('../models/Content');

module.exports = Ractive.extend({
  template: require('../../tpl/home'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  data:{
  	posting: true
  },
  onrender: function() {
    if(userModel.isLogged()) {
    	var file_input = window.document.getElementById("file_input");
    	var formData = new FormData();
			var model = new ContentModel();
			var self = this;

			file_input.onchange = function(){
		    var files = self.find('input[type="file"]').files;
		    if (files.length > 0){
		      var file = files[0];
		    }
		    if (file.size < 200){
		      model.upload(file, function(url){
		      	formData.append('photoUrl', url);
		      });
		    } else {
		      window.alert("Please choose an image under 200 bytes");
		    }
		  }

			this.on('post', function() {
			  formData.append('text', this.get('text'));
			  model.create(formData, function(error, result) {
			    self.set('text', '');
			    if(error) {
			      self.set('error', error.error);
			    } else {
			      self.set('error', false);
			      self.set('success', 'The post is saved  successfully.<br />What about adding another one?');
			      getPosts();
			    }
			  });
			});

			var getPosts = function() {
		        model.fetch(function(err, result) {
		          if(!err) {
		            self.set('posts', result.posts);
		          }
		        });
	    };
	    getPosts();
		} else {
			this.set('posting', false);
		}
  }
});