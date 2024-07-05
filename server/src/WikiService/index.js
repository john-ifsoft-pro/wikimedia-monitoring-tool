const { Subject } = require('rxjs');
const WikiFilters = require('./filters');
const EventSource = require('eventsource');

const WIKI_URL = 'https://stream.wikimedia.org/v2/stream/recentchange';

class WikiService {
  wikiSubject = new Subject();

  constructor() {
    this.eventSource = null;
  }

  subscribeWiki() {
    this.eventSource = new EventSource(WIKI_URL);
    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.wikiSubject.next(data);
    };
  }

  unsubscribeWiki() {
    this.eventSource.close();
  }

  getWikiObservable(filterOptions) {
    const wiki$ = this.wikiSubject.asObservable();

    const filters = [];

    if (filterOptions.domain)
      filters.push(WikiFilters.domainFilter(filterOptions.domain));

    if (filterOptions.namespace)
      filters.push(WikiFilters.namespaceFilter(parseInt(filterOptions.namespace)));

    if (filterOptions.bot)
      filters.push(WikiFilters.botFilter(filterOptions.bot === 'true'));

    if (filterOptions.title)
      filters.push(WikiFilters.titleFilter(filterOptions.title));

    if (filterOptions.minor)
      filters.push(WikiFilters.minorFilter(filterOptions.minor));

    return wiki$.pipe(...filters);
  }
}

module.exports = new WikiService();
