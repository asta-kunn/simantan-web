const express = require("express");
const path = require("path");
const compression = require("compression");
const { createServer } = require("http");

const app = express();

const NODE_ENV = process.env.NODE_ENV || "develop";
const port = process.env.PORT ? Number(process.env.PORT) : 8080;

// Determine base path for static files based on NODE_ENV
let basePath = "/";
if (NODE_ENV === "develop") {
  basePath = "/develop";
} else if (NODE_ENV === "uat") {
  basePath = "/uat";
} else if (NODE_ENV === "master") {
  basePath = "/";
} 

// In CommonJS, __dirname is available globally
console.log({ __dirname, basePath, NODE_ENV, port });

app.use(compression());

// PWA-specific headers and middleware
app.use((req, res, next) => {
  // PWA headers
  if (req.url.endsWith('.webmanifest')) {
    res.setHeader('Content-Type', 'application/manifest+json');
  }
  
  // Service Worker headers
  if (req.url.endsWith('sw.js') || req.url.endsWith('registerSW.js')) {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
});

app.use(basePath, express.static(path.join(__dirname, "dist"), {
  // Set proper MIME types for PWA files
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.webmanifest')) {
      res.setHeader('Content-Type', 'application/manifest+json');
    }
  }
}));

app.use(basePath, express.static(path.join(__dirname, "public")));

app.use(basePath, function (req, res) {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const server = createServer(app);

server.listen(port, () => {
  console.log("server started on port " + port);
  console.log(
    `Access your app at https://simantan-5wc7q.ondigitalocean.app${basePath}`
  );
});
