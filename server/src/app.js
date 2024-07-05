const wikiService = require('./WikiService')
const httpServer = require('./HttpServer')

wikiService.subscribeWiki();
httpServer.start();