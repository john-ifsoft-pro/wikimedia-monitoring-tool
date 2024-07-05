const express = require('express');
const cors = require('cors');
const { of } = require('rxjs');
const { mergeMap, map, tap } = require('rxjs/operators');
const WikiService = require('../WikiService');
const LiftWingService = require('../LiftWingService');

const SERVER_PORT = 4000;

class HttpServer {
  constructor() {
    this.app = express();

    this.setupMiddlewares();
    this.setupRoutes();
  }

  setupMiddlewares() {
    this.app.use(cors());
  }

  setupRoutes() {
    this.app.get('/events', (req, res) => {
      const params = req.query;
      const filter = {
        domain: params.domain,
        namespace: params.namespace,
        bot: params.bot,
        title: params.title,
        anonymous: params.anonymous,
      };

      res.writeHead(200, {
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      });

      const wikiObservable = WikiService.getWikiObservable(filter);
      const enrichedObservable = wikiObservable.pipe(
        mergeMap((data) => {
          if (data.type !== 'edit') return of(data);

          return LiftWingService.getDamagingScoreObservable(data.revision.new)
                  .pipe(map((scoringData) => ({ ...data, scoringData })));
        })
      );

      const subscription = enrichedObservable.subscribe((data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      });

      res.on('close', () => {
        res.end();
        subscription.unsubscribe();
      });
    });
  }

  start() {
    this.app.listen(SERVER_PORT, () => {
      console.log(`Server running on http://localhost:${SERVER_PORT}`);
    });
  }
}

module.exports = new HttpServer();
