import http from 'http';
let app = require('./server').default;

const fs = require('fs');
const server = http.createServer(app);
let currentApp = app;
const PORT = process.env.PORT || 3000;
server
  .listen(PORT, () => { 
    console.log(`🚀 gg started ${PORT}`);
  })
  .on('error', error => {
     console.log("error",error);
  });

  
if (module.hot) {
   console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');

    try {
      app = require('./server').default;
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      console.error(error);
    } 
  });
}
