var aws = require('aws-sdk');
var helpers = require('./helpers');
var response = helpers.response;
var error = helpers.error;
var getParameterByName = helpers.getParameterByName;

module.exports = function(req, res){
  var filename = getParameterByName('file_name', req.url.toString());
  var filetype = getParameterByName('file_type', req.url.toString());

  var name = filename.split('.')[0];
  var ext = filename.split('.')[1];
  name += '_' + Date.now();
  name += '.' + ext;
  filename = name;

  aws.config.update({accessKeyId: AWS_ACCESS_KEY , secretAccessKey: AWS_SECRET_KEY });
    var s3 = new aws.S3(); 
    
    var s3_params = { 
        Bucket: S3_BUCKET, 
        Key: filename, 
        Expires: 60, 
        ContentType: filetype, 
        ACL: 'public-read'
    }; 
    s3.getSignedUrl('putObject', s3_params, function(err, data){ 
        if(err){ 
            error(err, res);
        }
        else{
          response({
            signed_request: data,
            url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+filename,
          }, res);
      } 
    });
}