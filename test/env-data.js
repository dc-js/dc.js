json = jQuery.parseJSON("[" +
    "{\"value\":\"44\",\"countrycode\":\"US\",\"state\":\"California\",\"status\":\"T\",\"id\":1,\"region\":\"South\",\"date\":\"2012-05-25T16:10:09Z\"}, " +
    "{\"value\":\"22\",\"countrycode\":\"US\",\"state\":\"Colorado\",\"status\":\"F\",\"id\":2,\"region\":\"West\",\"date\":\"2012-06-10T16:10:19Z\"}, " +
    "{\"value\":\"33\",\"countrycode\":\"US\",\"state\":\"Delaware\",\"status\":\"T\",\"id\":3,\"region\":\"West\",\"date\":\"2012-08-10T16:20:29Z\"}, " +
    "{\"value\":\"44\",\"countrycode\":\"US\",\"state\":\"California\",\"status\":\"F\",\"id\":4,\"region\":\"South\",\"date\":\"2012-07-01T16:10:39Z\"}, " +
    "{\"value\":\"55\",\"countrycode\":\"CA\",\"state\":\"Ontario\",\"status\":\"T\",\"id\":5,\"region\":\"Central\",\"date\":\"2012-06-10T16:10:49Z\"}, " +
    "{\"value\":\"66\",\"countrycode\":\"US\",\"state\":\"California\",\"status\":\"F\",\"id\":6,\"region\":\"West\",\"date\":\"2012-06-08T16:10:59Z\"}, " +
    "{\"value\":\"22\",\"countrycode\":\"CA\",\"state\":\"Ontario\",\"status\":\"T\",\"id\":7,\"region\":\"East\",\"date\":\"2012-07-10T16:10:09Z\"}, " +
    "{\"value\":\"33\",\"countrycode\":\"US\",\"state\":\"Mississippi\",\"status\":\"F\",\"id\":8,\"region\":\"Central\",\"date\":\"2012-07-10T16:10:19Z\"}, " +
    "{\"value\":\"44\",\"countrycode\":\"US\",\"state\":\"Mississippi\",\"status\":\"T\",\"id\":9,\"region\":\"Central\",\"date\":\"2012-08-10T16:30:29Z\"}, " +
    "{\"value\":\"55\",\"countrycode\":\"US\",\"state\":\"Oklahoma\",\"status\":\"F\",\"id\":10,\"region\":\"\",\"date\":\"2012-06-10T16:10:39Z\"}" +
    "]");

json.forEach(function(e) {
    e.dd = d3.time.format.iso.parse(e.date);
});

data = crossfilter(json);

groupAll = data.groupAll();

dateFormat = d3.time.format("%Y-%m-%d");

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
statusMultiGroup = statusGroup.reduce(
    //add
    function(p, v) {
        ++p.count;
        p.value += +v.value;
        return p;
    },
    //remove
    function(p, v) {
        --p.count;
        p.value -= +v.value;
        return p;
    },
    //init
    function() {
        return {count:0, value:0};
    }
);

regionDimension = data.dimension(function(d) {
    return d.region;
});
regionGroup = regionDimension.group();

dateDimension = data.dimension(function(d) {
    return d3.time.day(d.dd);
});
dateGroup = dateDimension.group();
dateValueSumGroup = dateDimension.group().reduceSum(function(d){return d.value;});
dateIdSumGroup = dateDimension.group().reduceSum(function(d){return d.id;});

stateDimension = data.dimension(function(d){return d.state;});
stateValueSumGroup = stateDimension.group().reduceSum(function(d){return d.value;});

resetAllFilters = function() {
    valueDimension.filterAll();
    countryDimension.filterAll();
    statusDimension.filterAll();
    regionDimension.filterAll();
    dateDimension.filterAll();
    stateDimension.filterAll();
};

resetBody = function(){
    jQuery("body").html('');
};
