#!/usr/bin/env node --harmony

var program = require('commander');
var fs = require('fs');
var path = require('path');
var jsonPack = require('jsonpack');
var request = require('request');
var ProgressBar = require('progress');
var urlEncode = require('urlencode');
var rootURL = 'http://www.jsoneditoronline.cn/';
// var rootURL = 'http://localhost/';


var bar = new ProgressBar('  uploading [:bar] :rate/bps :percent :etas', {
  complete: '=',
  incomplete: ' ',
  width: 100,
  total: 20
});

function isUrl(fileString) {
  return fileString.indexOf('http://') === 0 || fileString.indexOf('https://') === 0;
}

function readJsonFile(file, cb) {
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
  console.log(filePath + '\n');

  fs.readFile(filePath, "utf8", function read(err, data) {
    if (err) {
      throw err;
    } else {
      cb(JSON.parse(data));
    }
  });
}

function storeMyJson(jsonData, cb) {
  request.post(
    'https://api.myjson.com/bins',
    { json: jsonData },
    function (error, response, body) {
      if (!error && response.statusCode == 201) {
        bar.update(1, {});
        console.log('\ncomplete\n');
        cb(body.uri);
      } else {
        console.log('\nFail, please retry later.\n');
      }
      clearInterval(timer);
    }
  );

  var timer = setInterval(function () {
    bar.tick(1, {});
    if (bar.complete) {
      clearInterval(timer);
    }
  }, 1000);
}

function printReminder(url) {
  console.log("If browser not opened in 5s, you also can copy the link below and paste it into browser address bar:");
  console.log('------======------');
  console.log(url);
  console.log('------======------');
}

program
  .arguments('<file>')
  .option('-w, --www', 'Store json file on internet, and open by url')
  .action(function(file) {

    if(isUrl(file)){
      var url = rootURL + '?url=' + file;
      printReminder(url);
      require('child_process').spawn('open', [url]);
      return;
    }

    if(program.www){
      readJsonFile(file, function (jsonObj) {
        storeMyJson(jsonObj, function (url) {
          var url = rootURL + '?url=' + url;
          printReminder(url);
          require('child_process').spawn('open', [url]);
        });
      });
    } else {
      readJsonFile(file, function (jsonObj) {
        var encoded = urlEncode(jsonPack.pack(jsonObj));
        var url = rootURL + '?data=' + encoded;

        if(url.length > 8192){
          storeMyJson(jsonObj, function (url) {
            url = rootURL + '?url=' + url;
            printReminder(url);
            require('child_process').spawn('open', [url]);
          });
        } else {
          printReminder(url);
          require('child_process').spawn('open', [url]);
        }

      });
    }
  })
  .parse(process.argv);





