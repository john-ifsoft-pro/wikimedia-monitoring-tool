const { from } = require('rxjs');
const API_URL =
  'https://api.wikimedia.org/service/lw/inference/v1/models/enwiki-damaging:predict ';
class LiftWingService {
  constructor() {}

  getDamagingScoreObservable(revId) {
    return from(
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rev_id: revId,
        }),
      }).then((response) => response.json())
    );
  }
}

module.exports = new LiftWingService();
