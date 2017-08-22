#!/usr/bin/env node --harmony

var program = require('commander');
var fs = require('fs');
var path = require('path');
var base64 = require('base-64');
var rootURL = 'http://www.jsoneditoronline.cn/';


function isUrl(fileString) {
  return fileString.indexOf('http://') === 0 || fileString.indexOf('https://') === 0;
}

program
  .arguments('<file>')
  .option('-u, --username <username>', 'The user to authenticate as')
  .option('-p, --password <password>', 'The user\'s password')
  .option('-b, --browser', 'Open the json file in the system browser')
  .action(function(file) {

    if(isUrl(file)){
      var url = rootURL + '?url=' + file;
      require('child_process').spawn('open', [url]);
      return;
    }

    var lastSlash = file.lastIndexOf('/');
    var filename = '';
    var filePath = '';

    if(lastSlash === -1){
      filename = file;
      filePath = path.join(process.cwd(), filename);
    } else {
      filePath = path.resolve(file);
    }


    console.log('Open file in the path:');
    console.log(filePath);

    fs.readFile(filePath, "utf8", function read(err, data) {
      if (err) {
        throw err;
      } else {
        var content = data;
        var encoded = base64.encode(content);

        var url = rootURL + '?data=' + encoded;

        console.log("If browser not opened in 5s, you also can copy the link below and paste it into browser address bar:");
        console.log('------======------');
        console.log(url);
        console.log('------======------');

        require('child_process').spawn('open', [url]);
      }
    });


  })
  .parse(process.argv);





