const { filter } = require('rxjs/operators');

module.exports = {
  domainFilter: (domain) => {
    return filter((data) => data.meta.domain === domain);
  },

  namespaceFilter: (namespace) => {
    return filter((data) => data.namespace === namespace);
  },

  botFilter: (isBot) => {
    return filter((data) => data.bot === isBot);
  },

  titleFilter: (title) => {
    return filter((data) => new RegExp(title, 'ig').test(data.title));
  },

  minorFilter: (isMinor) => {
    return filter((data) => data.minor === isMinor);
  },
};
