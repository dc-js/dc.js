document = require("jsdom").jsdom("<html><head></head><body></body></html>");
window = document.createWindow();
navigator = window.navigator;
CSSStyleDeclaration = window.CSSStyleDeclaration;

require("d3");
crossfilter = require("crossfilter");

jQuery = require("jquery")
json = jQuery.parseJSON("[" +
    "{\"age\":\"44\",\"countrycode\":\"US\",\"gender\":\"M\",\"id\":1,\"region\":\"South\",\"date\":\"2011-12-10T16:10:09Z\"}, " +
    "{\"age\":\"22\",\"countrycode\":\"US\",\"gender\":\"F\",\"id\":2,\"region\":\"West\",\"date\":\"2012-01-10T16:10:09Z\"}, " +
    "{\"age\":\"33\",\"countrycode\":\"US\",\"gender\":\"M\",\"id\":3,\"region\":\"West\",\"date\":\"2011-12-10T16:10:09Z\"}, " +
    "{\"age\":\"44\",\"countrycode\":\"US\",\"gender\":\"F\",\"id\":4,\"region\":\"South\",\"date\":\"2012-02-10T16:10:09Z\"}, " +
    "{\"age\":\"55\",\"countrycode\":\"CA\",\"gender\":\"M\",\"id\":5,\"region\":\"Central\",\"date\":\"2012-03-10T16:10:09Z\"}, " +
    "{\"age\":\"66\",\"countrycode\":\"US\",\"gender\":\"F\",\"id\":6,\"region\":\"West\",\"date\":\"2012-04-10T16:10:09Z\"}, " +
    "{\"age\":\"22\",\"countrycode\":\"CA\",\"gender\":\"M\",\"id\":7,\"region\":\"West\",\"date\":\"2012-05-10T16:10:09Z\"}, " +
    "{\"age\":\"33\",\"countrycode\":\"US\",\"gender\":\"F\",\"id\":8,\"region\":\"Central\",\"date\":\"2012-06-10T16:10:09Z\"}, " +
    "{\"age\":\"44\",\"countrycode\":\"US\",\"gender\":\"M\",\"id\":9,\"region\":\"Central\",\"date\":\"2012-06-10T16:10:09Z\"}, " +
    "{\"age\":\"55\",\"countrycode\":\"US\",\"gender\":\"F\",\"id\":10,\"region\":\"\",\"date\":\"2012-06-10T16:10:09Z\"}" +
    "]");

data = crossfilter(json)

ageDimension = data.dimension(function(d){return d.gender;});
ageGroup = ageDimension.group();

require("../dc");
