json = jQuery.parseJSON("[" +
    "{\"value\":\"44\",\"countrycode\":\"US\",\"status\":\"T\",\"id\":1,\"region\":\"South\",\"date\":\"2012-05-25T16:10:09Z\"}, " +
    "{\"value\":\"22\",\"countrycode\":\"US\",\"status\":\"F\",\"id\":2,\"region\":\"West\",\"date\":\"2012-06-10T16:10:09Z\"}, " +
    "{\"value\":\"33\",\"countrycode\":\"US\",\"status\":\"T\",\"id\":3,\"region\":\"West\",\"date\":\"2012-08-10T16:10:09Z\"}, " +
    "{\"value\":\"44\",\"countrycode\":\"US\",\"status\":\"F\",\"id\":4,\"region\":\"South\",\"date\":\"2012-07-01T16:10:09Z\"}, " +
    "{\"value\":\"55\",\"countrycode\":\"CA\",\"status\":\"T\",\"id\":5,\"region\":\"Central\",\"date\":\"2012-06-10T16:10:09Z\"}, " +
    "{\"value\":\"66\",\"countrycode\":\"US\",\"status\":\"F\",\"id\":6,\"region\":\"West\",\"date\":\"2012-06-08T16:10:09Z\"}, " +
    "{\"value\":\"22\",\"countrycode\":\"CA\",\"status\":\"T\",\"id\":7,\"region\":\"East\",\"date\":\"2012-07-10T16:10:09Z\"}, " +
    "{\"value\":\"33\",\"countrycode\":\"US\",\"status\":\"F\",\"id\":8,\"region\":\"Central\",\"date\":\"2012-07-10T16:10:09Z\"}, " +
    "{\"value\":\"44\",\"countrycode\":\"US\",\"status\":\"T\",\"id\":9,\"region\":\"Central\",\"date\":\"2012-08-10T16:10:09Z\"}, " +
    "{\"value\":\"55\",\"countrycode\":\"US\",\"status\":\"F\",\"id\":10,\"region\":\"\",\"date\":\"2012-06-10T16:10:09Z\"}" +
    "]");
data = crossfilter(json);

groupAll = data.groupAll();

valueDimension = data.dimension(function(d) {
    return d.value;
});
valueGroup = valueDimension.group();

countryDimension = data.dimension(function(d) {
    return d.countrycode;
});
countryGroup = countryDimension.group();

statusDimension = data.dimension(function(d) {
    return d.status;
});
statusGroup = statusDimension.group();

regionDimension = data.dimension(function(d) {
    return d.region;
});
regionGroup = statusDimension.group();

dateDimension = data.dimension(function(d) {
    return d3.time.day(d3.time.format.iso.parse(d.date));
});
dateGroup = dateDimension.group();

resetAllFilters = function() {
    valueDimension.filterAll();
    countryDimension.filterAll();
    statusDimension.filterAll();
    regionDimension.filterAll();
    dateDimension.filterAll();
};
