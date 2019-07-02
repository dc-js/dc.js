console.warn = function() {
    console.log.apply(console, ['would warn'].concat(arguments));
};
