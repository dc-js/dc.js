/* jscs:disable validateQuoteMarks, maximumLineLength */
/* jshint -W109, -W101, -W098 */
function dateCleaner (e) {
    e.dd = d3.time.format.iso.parse(e.date);
}

function loadDateFixture () {
    var fixture = JSON.parse("[" +
        "{\"value\":\"44\",\"nvalue\":\"-4\",\"countrycode\":\"US\",\"state\":\"California\",\"status\":\"T\",\"id\":1,\"region\":\"South\",\"date\":\"2012-05-25T16:10:09Z\"}, " +
        "{\"value\":\"22\",\"nvalue\":\"-2\",\"countrycode\":\"US\",\"state\":\"Colorado\",\"status\":\"F\",\"id\":2,\"region\":\"West\",\"date\":\"2012-06-10T16:10:19Z\"}, " +
        "{\"value\":\"33\",\"nvalue\":\"1\",\"countrycode\":\"US\",\"state\":\"Delaware\",\"status\":\"T\",\"id\":3,\"region\":\"West\",\"date\":\"2012-08-10T16:20:29Z\"}, " +
        "{\"value\":\"44\",\"nvalue\":\"-3\",\"countrycode\":\"US\",\"state\":\"California\",\"status\":\"F\",\"id\":4,\"region\":\"South\",\"date\":\"2012-07-01T16:10:39Z\"}, " +
        "{\"value\":\"55\",\"nvalue\":\"-5\",\"countrycode\":\"CA\",\"state\":\"Ontario\",\"status\":\"T\",\"id\":5,\"region\":\"Central\",\"date\":\"2012-06-10T16:10:49Z\"}, " +
        "{\"value\":\"66\",\"nvalue\":\"-4\",\"countrycode\":\"US\",\"state\":\"California\",\"status\":\"F\",\"id\":6,\"region\":\"West\",\"date\":\"2012-06-08T16:10:59Z\"}, " +
        "{\"value\":\"22\",\"nvalue\":\"10\",\"countrycode\":\"CA\",\"state\":\"Ontario\",\"status\":\"T\",\"id\":7,\"region\":\"East\",\"date\":\"2012-07-10T16:10:09Z\"}, " +
        "{\"value\":\"33\",\"nvalue\":\"1\",\"countrycode\":\"US\",\"state\":\"Mississippi\",\"status\":\"F\",\"id\":8,\"region\":\"Central\",\"date\":\"2012-07-10T16:10:19Z\"}, " +
        "{\"value\":\"44\",\"nvalue\":\"2\",\"countrycode\":\"US\",\"state\":\"Mississippi\",\"status\":\"T\",\"id\":9,\"region\":\"Central\",\"date\":\"2012-08-10T16:30:29Z\"}, " +
        "{\"value\":\"55\",\"nvalue\":\"-3\",\"countrycode\":\"US\",\"state\":\"Oklahoma\",\"status\":\"F\",\"id\":10,\"region\":\"\",\"date\":\"2012-06-10T16:10:39Z\"}" +
        "]");

    fixture.forEach(dateCleaner);
    return fixture;
}

function loadDateFixture2 () {
    var fixture = JSON.parse(
        "[" +
            "{\"value\":\"11\",\"nvalue\":\"-4\",\"countrycode\":\"UK\",\"state\":\"Liverpool\",\"status\":\"T\",\"id\":11,\"region\":\"South\",\"date\":\"2012-05-25T16:20:09Z\"}, " +
            "{\"value\":\"76\",\"nvalue\":\"-1\",\"countrycode\":\"UK\",\"state\":\"London\",\"status\":\"F\",\"id\":12,\"region\":\"\",\"date\":\"2012-06-10T16:20:39Z\"}" +
            "]");

    fixture.forEach(dateCleaner);
    return fixture;
}

function loadBoxPlotFixture () {
    return JSON.parse("[" +
        "{\"value\":\"44\",\"nvalue\":\"-4\",\"countrycode\":\"US\",\"state\":\"California\",\"status\":\"T\",\"id\":1,\"region\":\"South\",\"date\":\"2012-05-25T16:10:09Z\"}, " +
        "{\"value\":\"22\",\"nvalue\":\"-2\",\"countrycode\":\"US\",\"state\":\"Colorado\",\"status\":\"F\",\"id\":2,\"region\":\"West\",\"date\":\"2012-06-10T16:10:19Z\"}, " +
        "{\"value\":\"33\",\"nvalue\":\"1\",\"countrycode\":\"US\",\"state\":\"Delaware\",\"status\":\"T\",\"id\":3,\"region\":\"West\",\"date\":\"2012-08-10T16:20:29Z\"}, " +
        "{\"value\":\"44\",\"nvalue\":\"-3\",\"countrycode\":\"US\",\"state\":\"California\",\"status\":\"F\",\"id\":4,\"region\":\"South\",\"date\":\"2012-07-01T16:10:39Z\"}, " +
        "{\"value\":\"55\",\"nvalue\":\"-5\",\"countrycode\":\"US\",\"state\":\"Ontario\",\"status\":\"T\",\"id\":5,\"region\":\"Central\",\"date\":\"2012-06-10T16:10:49Z\"}, " +
        "{\"value\":\"66\",\"nvalue\":\"-4\",\"countrycode\":\"US\",\"state\":\"California\",\"status\":\"F\",\"id\":6,\"region\":\"West\",\"date\":\"2012-06-08T16:10:59Z\"}, " +
        "{\"value\":\"33\",\"nvalue\":\"10\",\"countrycode\":\"US\",\"state\":\"Ontario\",\"status\":\"T\",\"id\":7,\"region\":\"East\",\"date\":\"2012-07-10T16:10:09Z\"}, " +
        "{\"value\":\"33\",\"nvalue\":\"1\",\"countrycode\":\"US\",\"state\":\"Mississippi\",\"status\":\"F\",\"id\":8,\"region\":\"Central\",\"date\":\"2012-07-10T16:10:19Z\"}, " +
        "{\"value\":\"44\",\"nvalue\":\"2\",\"countrycode\":\"US\",\"state\":\"Mississippi\",\"status\":\"T\",\"id\":9,\"region\":\"Central\",\"date\":\"2012-08-10T16:30:29Z\"}, " +
        "{\"value\":\"1\",\"nvalue\":\"-12\",\"countrycode\":\"US\",\"state\":\"Washington\",\"status\":\"F\",\"id\":12,\"region\":\"\",\"date\":\"2012-06-10T16:10:39Z\"}, " +
        "{\"value\":\"144\",\"nvalue\":\"-3\",\"countrycode\":\"US\",\"state\":\"Massachusetts\",\"status\":\"T\",\"id\":15,\"region\":\"\",\"date\":\"2012-06-10T16:10:39Z\"}, " +
        "{\"value\":\"1\",\"nvalue\":\"-4\",\"countrycode\":\"CA\",\"state\":\"California\",\"statCA\":\"T\",\"id\":1,\"region\":\"South\",\"date\":\"2012-05-25T16:10:09Z\"}, " +
        "{\"value\":\"2\",\"nvalue\":\"-2\",\"countrycode\":\"CA\",\"state\":\"Colorado\",\"statCA\":\"F\",\"id\":2,\"region\":\"West\",\"date\":\"2012-06-10T16:10:19Z\"}, " +
        "{\"value\":\"3\",\"nvalue\":\"1\",\"countrycode\":\"CA\",\"state\":\"Delaware\",\"statCA\":\"T\",\"id\":3,\"region\":\"West\",\"date\":\"2012-08-10T16:20:29Z\"}" +
        "]");
}

function loadColorFixture () {
    return JSON.parse("[" +
        "{\"colData\":\"1\", \"rowData\": \"1\", \"colorData\": \"1\"}," +
        "{\"colData\":\"1\", \"rowData\": \"1\", \"colorData\": \"1\"}," +
        "{\"colData\":\"1\", \"rowData\": \"2\", \"colorData\": \"2\"}," +
        "{\"colData\":\"1\", \"rowData\": \"2\", \"colorData\": \"2\"}," +
        "{\"colData\":\"2\", \"rowData\": \"1\", \"colorData\": \"3\"}," +
        "{\"colData\":\"2\", \"rowData\": \"1\", \"colorData\": \"3\"}," +
        "{\"colData\":\"2\", \"rowData\": \"2\", \"colorData\": \"4\"}," +
        "{\"colData\":\"2\", \"rowData\": \"2\", \"colorData\": \"4\"}" +
        "]");
}

function loadColorFixture2 () {
    return JSON.parse("[" +
        "{\"colData\":\"3\", \"rowData\": \"3\", \"colorData\": \"5\"}," +
        "{\"colData\":\"3\", \"rowData\": \"4\", \"colorData\": \"5\"}," +
        "{\"colData\":\"4\", \"rowData\": \"5\", \"colorData\": \"6\"}," +
        "{\"colData\":\"4\", \"rowData\": \"6\", \"colorData\": \"6\"}," +
        "{\"colData\":\"5\", \"rowData\": \"3\", \"colorData\": \"7\"}," +
        "{\"colData\":\"5\", \"rowData\": \"4\", \"colorData\": \"7\"}," +
        "{\"colData\":\"6\", \"rowData\": \"5\", \"colorData\": \"8\"}," +
        "{\"colData\":\"6\", \"rowData\": \"6\", \"colorData\": \"8\"}" +
        "]");
}

function loadIrisFixture () {
    return d3.csv.parse(
        "sepal_length,sepal_width,petal_length,petal_width,species\n" +
            "5.1,3.5,1.4,0.2,setosa\n" +
            "4.9,3,1.4,0.2,setosa\n" +
            "4.7,3.2,1.3,0.2,setosa\n" +
            "4.6,3.1,1.5,0.2,setosa\n" +
            "5,3.6,1.4,0.2,setosa\n" +
            "5.4,3.9,1.7,0.4,setosa\n" +
            "4.6,3.4,1.4,0.3,setosa\n" +
            "5,3.4,1.5,0.2,setosa\n" +
            "4.4,2.9,1.4,0.2,setosa\n" +
            "4.9,3.1,1.5,0.1,setosa\n" +
            "5.4,3.7,1.5,0.2,setosa\n" +
            "4.8,3.4,1.6,0.2,setosa\n" +
            "4.8,3,1.4,0.1,setosa\n" +
            "4.3,3,1.1,0.1,setosa\n" +
            "5.8,4,1.2,0.2,setosa\n" +
            "5.7,4.4,1.5,0.4,setosa\n" +
            "5.4,3.9,1.3,0.4,setosa\n" +
            "5.1,3.5,1.4,0.3,setosa\n" +
            "5.7,3.8,1.7,0.3,setosa\n" +
            "5.1,3.8,1.5,0.3,setosa\n" +
            "5.4,3.4,1.7,0.2,setosa\n" +
            "5.1,3.7,1.5,0.4,setosa\n" +
            "4.6,3.6,1,0.2,setosa\n" +
            "5.1,3.3,1.7,0.5,setosa\n" +
            "4.8,3.4,1.9,0.2,setosa\n" +
            "5,3,1.6,0.2,setosa\n" +
            "5,3.4,1.6,0.4,setosa\n" +
            "5.2,3.5,1.5,0.2,setosa\n" +
            "5.2,3.4,1.4,0.2,setosa\n" +
            "4.7,3.2,1.6,0.2,setosa\n" +
            "4.8,3.1,1.6,0.2,setosa\n" +
            "5.4,3.4,1.5,0.4,setosa\n" +
            "5.2,4.1,1.5,0.1,setosa\n" +
            "5.5,4.2,1.4,0.2,setosa\n" +
            "4.9,3.1,1.5,0.1,setosa\n" +
            "5,3.2,1.2,0.2,setosa\n" +
            "5.5,3.5,1.3,0.2,setosa\n" +
            "4.9,3.1,1.5,0.1,setosa\n" +
            "4.4,3,1.3,0.2,setosa\n" +
            "5.1,3.4,1.5,0.2,setosa\n" +
            "5,3.5,1.3,0.3,setosa\n" +
            "4.5,2.3,1.3,0.3,setosa\n" +
            "4.4,3.2,1.3,0.2,setosa\n" +
            "5,3.5,1.6,0.6,setosa\n" +
            "5.1,3.8,1.9,0.4,setosa\n" +
            "4.8,3,1.4,0.3,setosa\n" +
            "5.1,3.8,1.6,0.2,setosa\n" +
            "4.6,3.2,1.4,0.2,setosa\n" +
            "5.3,3.7,1.5,0.2,setosa\n" +
            "5,3.3,1.4,0.2,setosa\n" +
            "7,3.2,4.7,1.4,versicolor\n" +
            "6.4,3.2,4.5,1.5,versicolor\n" +
            "6.9,3.1,4.9,1.5,versicolor\n" +
            "5.5,2.3,4,1.3,versicolor\n" +
            "6.5,2.8,4.6,1.5,versicolor\n" +
            "5.7,2.8,4.5,1.3,versicolor\n" +
            "6.3,3.3,4.7,1.6,versicolor\n" +
            "4.9,2.4,3.3,1,versicolor\n" +
            "6.6,2.9,4.6,1.3,versicolor\n" +
            "5.2,2.7,3.9,1.4,versicolor\n" +
            "5,2,3.5,1,versicolor\n" +
            "5.9,3,4.2,1.5,versicolor\n" +
            "6,2.2,4,1,versicolor\n" +
            "6.1,2.9,4.7,1.4,versicolor\n" +
            "5.6,2.9,3.6,1.3,versicolor\n" +
            "6.7,3.1,4.4,1.4,versicolor\n" +
            "5.6,3,4.5,1.5,versicolor\n" +
            "5.8,2.7,4.1,1,versicolor\n" +
            "6.2,2.2,4.5,1.5,versicolor\n" +
            "5.6,2.5,3.9,1.1,versicolor\n" +
            "5.9,3.2,4.8,1.8,versicolor\n" +
            "6.1,2.8,4,1.3,versicolor\n" +
            "6.3,2.5,4.9,1.5,versicolor\n" +
            "6.1,2.8,4.7,1.2,versicolor\n" +
            "6.4,2.9,4.3,1.3,versicolor\n" +
            "6.6,3,4.4,1.4,versicolor\n" +
            "6.8,2.8,4.8,1.4,versicolor\n" +
            "6.7,3,5,1.7,versicolor\n" +
            "6,2.9,4.5,1.5,versicolor\n" +
            "5.7,2.6,3.5,1,versicolor\n" +
            "5.5,2.4,3.8,1.1,versicolor\n" +
            "5.5,2.4,3.7,1,versicolor\n" +
            "5.8,2.7,3.9,1.2,versicolor\n" +
            "6,2.7,5.1,1.6,versicolor\n" +
            "5.4,3,4.5,1.5,versicolor\n" +
            "6,3.4,4.5,1.6,versicolor\n" +
            "6.7,3.1,4.7,1.5,versicolor\n" +
            "6.3,2.3,4.4,1.3,versicolor\n" +
            "5.6,3,4.1,1.3,versicolor\n" +
            "5.5,2.5,4,1.3,versicolor\n" +
            "5.5,2.6,4.4,1.2,versicolor\n" +
            "6.1,3,4.6,1.4,versicolor\n" +
            "5.8,2.6,4,1.2,versicolor\n" +
            "5,2.3,3.3,1,versicolor\n" +
            "5.6,2.7,4.2,1.3,versicolor\n" +
            "5.7,3,4.2,1.2,versicolor\n" +
            "5.7,2.9,4.2,1.3,versicolor\n" +
            "6.2,2.9,4.3,1.3,versicolor\n" +
            "5.1,2.5,3,1.1,versicolor\n" +
            "5.7,2.8,4.1,1.3,versicolor\n" +
            "6.3,3.3,6,2.5,virginica\n" +
            "5.8,2.7,5.1,1.9,virginica\n" +
            "7.1,3,5.9,2.1,virginica\n" +
            "6.3,2.9,5.6,1.8,virginica\n" +
            "6.5,3,5.8,2.2,virginica\n" +
            "7.6,3,6.6,2.1,virginica\n" +
            "4.9,2.5,4.5,1.7,virginica\n" +
            "7.3,2.9,6.3,1.8,virginica\n" +
            "6.7,2.5,5.8,1.8,virginica\n" +
            "7.2,3.6,6.1,2.5,virginica\n" +
            "6.5,3.2,5.1,2,virginica\n" +
            "6.4,2.7,5.3,1.9,virginica\n" +
            "6.8,3,5.5,2.1,virginica\n" +
            "5.7,2.5,5,2,virginica\n" +
            "5.8,2.8,5.1,2.4,virginica\n" +
            "6.4,3.2,5.3,2.3,virginica\n" +
            "6.5,3,5.5,1.8,virginica\n" +
            "7.7,3.8,6.7,2.2,virginica\n" +
            "7.7,2.6,6.9,2.3,virginica\n" +
            "6,2.2,5,1.5,virginica\n" +
            "6.9,3.2,5.7,2.3,virginica\n" +
            "5.6,2.8,4.9,2,virginica\n" +
            "7.7,2.8,6.7,2,virginica\n" +
            "6.3,2.7,4.9,1.8,virginica\n" +
            "6.7,3.3,5.7,2.1,virginica\n" +
            "7.2,3.2,6,1.8,virginica\n" +
            "6.2,2.8,4.8,1.8,virginica\n" +
            "6.1,3,4.9,1.8,virginica\n" +
            "6.4,2.8,5.6,2.1,virginica\n" +
            "7.2,3,5.8,1.6,virginica\n" +
            "7.4,2.8,6.1,1.9,virginica\n" +
            "7.9,3.8,6.4,2,virginica\n" +
            "6.4,2.8,5.6,2.2,virginica\n" +
            "6.3,2.8,5.1,1.5,virginica\n" +
            "6.1,2.6,5.6,1.4,virginica\n" +
            "7.7,3,6.1,2.3,virginica\n" +
            "6.3,3.4,5.6,2.4,virginica\n" +
            "6.4,3.1,5.5,1.8,virginica\n" +
            "6,3,4.8,1.8,virginica\n" +
            "6.9,3.1,5.4,2.1,virginica\n" +
            "6.7,3.1,5.6,2.4,virginica\n" +
            "6.9,3.1,5.1,2.3,virginica\n" +
            "5.8,2.7,5.1,1.9,virginica\n" +
            "6.8,3.2,5.9,2.3,virginica\n" +
            "6.7,3.3,5.7,2.5,virginica\n" +
            "6.7,3,5.2,2.3,virginica\n" +
            "6.3,2.5,5,1.9,virginica\n" +
            "6.5,3,5.2,2,virginica\n" +
            "6.2,3.4,5.4,2.3,virginica\n" +
            "5.9,3,5.1,1.8,virginica"
    );
}

/* jscs:enable validateQuoteMarks, maximumLineLength */
/* jshint +W109, +W101, +W098 */
