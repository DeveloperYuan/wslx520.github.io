const util = require('util');
require('child_process').spawn('clip').stdin.end(util.inspect("content_for_the_clipboard"));