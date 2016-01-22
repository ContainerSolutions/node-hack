/*
 * Demo NodeJS app with a RCE vulnerability.
 */

// Important sloppiness here: Not using "var fs", thus making it globally visible
fs = require("fs");
yaml = require("js-yaml");
http = require("http");
connect = require("connect");
serveStatic = require("serve-static");
finalhandler = require("finalhandler");
multiparty = require("multiparty");

http.createServer(function(req, res) {

  if (req.method == "GET") {
    // serve GET requests from the "public/" directory
    serveStatic("public")(req, res, finalhandler(req, res));

  } else if (req.method == "POST") {
    // consider POST requests as uploads

    var form = new multiparty.Form({ "uploadDir": "/tmp/uploads" });
    form.parse(req, function(err, fields, files) {

      // fetch uploaded YAML file
      var userYaml = fs.readFileSync(files["yaml"][0].path, "utf8");

      // check YAML for validity, show error message of invalid
      try {
        yaml.load(userYaml);
      } catch (e) {
        userYaml = "Invalid YAML!";
      }

      // load template for showing YAML with syntax highlighting...
      var html = fs.readFileSync("public/pretty.html", "utf8");
      // ... and replace placeholder with uploaded YAML
      html = html.replace("<!-- pretty-yaml-here -->", userYaml)

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    });
  }
}).listen(1337);

console.log("running...");
