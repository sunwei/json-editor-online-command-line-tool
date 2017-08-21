#!/usr/bin/env node --harmony

var program = require('commander');
var fs = require('fs');
var path = require('path');
var base64 = require('base-64');


program
  .arguments('<file>')
  .option('-u, --username <username>', 'The user to authenticate as')
  .option('-p, --password <password>', 'The user\'s password')
  .option('-b, --browser', 'Open the json file in the system browser')
  .action(function(file) {

    var lastSlash = file.lastIndexOf('/');
    var filename = '';
    var filePath = '';

    if(lastSlash === -1){
      filename = file;
      filePath = path.join(process.cwd(), filename);
    } else {
      filePath = path.resolve(file);
    }
    // var filename = lastSlash === -1 ? file : file.substring(lastSlash);
    //
    // var filePath = path.join(process.cwd(), path.resolve(file));

    console.log('Open file in the path:');
    console.log(filePath);

    fs.readFile(filePath, "utf8", function read(err, data) {
      if (err) {
        throw err;
      } else {
        var content = data;
        var encoded = base64.encode(content);

        var url = 'http://www.jsoneditoronline.cn/?data=' + encoded;

        console.log("If browser not opened in 5s, you also can copy the link below and paste it into browser address bar:");
        console.log('------======------');
        console.log(url);
        console.log('------======------');

        require('child_process').spawn('open', [url]);
      }
    });


  })
  .parse(process.argv);





