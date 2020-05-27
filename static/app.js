const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// const mimeTypes = {
//     '.html': 'text/html',
//     '.js': 'text/javascript',
//     '.css': 'text/css',
//     '.ico': 'image/x-icon',
//     '.png': 'image/png',
//     '.jpg': 'image/jpeg',
//     '.gif': 'image/gif',
//     '.svg': 'image/svg+xml',
//     '.json': 'application/json'
// };


const requestListener = function (req, res) {
    res.writeHead(200);
    res.write(req.url);
    let parsedUrl = url.parse(req.url, true);
    console.log(parsedUrl.query);
    res.end();
};

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer(requestListener);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});
