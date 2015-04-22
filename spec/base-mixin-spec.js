describe("dc.baseMixin", function () {
    var chart, dimension, group, addFilterHandler, removeFilterHandler, hasFilterHandler, resetFilterHandler;

    beforeEach(function () {
        var data = crossfilter(loadDateFixture());
        dimension = data.dimension(function (d) {
            return d3.time.day.utc(d.dd);
        });
        group = dimension.group().reduceSum(function (d) {
            return d.value;
        });

        chart = dc.baseMixin({})
            .options({
                dimension: dimension,
                group: group,
                transitionDuration: 0
            });
        addFilterHandler = chart.addFilterHandler();
        hasFilterHandler = chart.hasFilterHandler();
        removeFilterHandler = chart.removeFilterHandler();
        resetFilterHandler = chart.resetFilterHandler();
    });

    describe('renderlets', function () {
        var firstRenderlet, secondRenderlet, thirdRenderlet,
            third = 'renderlet.third';
        beforeEach(function () {
            var expectedCallbackSignature = function (callbackChart) {
                expect(callbackChart).toBe(chart);
            };
            firstRenderlet = jasmine.createSpy().and.callFake(expectedCallbackSignature);
            secondRenderlet = jasmine.createSpy().and.callFake(expectedCallbackSignature);
            thirdRenderlet = jasmine.createSpy().and.callFake(expectedCallbackSignature);
            chart.renderlet(firstRenderlet);
            chart.renderlet(secondRenderlet);
            chart.on(third, thirdRenderlet);
        });

        it('should execute each renderlet after a render', function () {
            chart.render();
            expect(firstRenderlet).toHaveBeenCalled();
            expect(secondRenderlet).toHaveBeenCalled();
        });

        it('should execute each renderlet after a redraw', function () {
            chart.redraw();
            expect(firstRenderlet).toHaveBeenCalled();
            expect(secondRenderlet).toHaveBeenCalled();
        });

        it('should execute a named renderlet after a render', function () {
            chart.render();
            expect(thirdRenderlet).toHaveBeenCalled();
        });

        it('should execute a named renderlet after a redraw', function () {
            chart.redraw();
            expect(thirdRenderlet).toHaveBeenCalled();
        });

        it('should remove a named renderlet expect no call after a redraw', function () {
            chart.on(third);
            chart.redraw();
            expect(secondRenderlet).toHaveBeenCalled();
            expect(thirdRenderlet).not.toHaveBeenCalled();
        });

        it('should remove a named renderlet and expect no call after a redraw', function () {
            chart.on(third);
            chart.render();
            expect(secondRenderlet).toHaveBeenCalled();
            expect(thirdRenderlet).not.toHaveBeenCalled();
        });
    });

    describe('event listeners', function () {
        describe('on render', function () {
            var preRenderSpy, postRenderSpy;
            beforeEach(function () {
                var expectedCallbackSignature = function (callbackChart) {
                    expect(callbackChart).toBe(chart);
                };

                preRenderSpy = jasmine.createSpy().and.callFake(expectedCallbackSignature);
                postRenderSpy = jasmine.createSpy().and.callFake(expectedCallbackSignature);

                chart.on('preRender', preRenderSpy);
                chart.on('postRender', postRenderSpy);
                chart.render();
            });

            it('should execute the preRender callback', function () {
                expect(preRenderSpy).toHaveBeenCalled();
            });

            it('should execute the postRender callback', function () {
                expect(postRenderSpy).toHaveBeenCalled();
            });
        });

        describe('on filter double', function () {
            var filterSpy, filterSpy2, filter;
            beforeEach(function () {
                filter = "1";

                var expectedCallbackSignature = function (callbackChart, callbackFilter) {
                    expect(callbackChart).toBe(chart);
                    expect(callbackFilter).toEqual(filter);
                };

                filterSpy = jasmine.createSpy().and.callFake(expectedCallbackSignature);
                filterSpy2 = jasmine.createSpy().and.callFake(expectedCallbackSignature);
                chart.on("filtered.one", filterSpy);
                chart.on("filtered.two", filterSpy2);
            });

            it('should execute first callback after setting through #filter', function () {
                chart.filter(filter);
                expect(filterSpy).toHaveBeenCalled();
            });

            it('should execute second callback after setting through #filter', function () {
                chart.filter(filter);
                expect(filterSpy2).toHaveBeenCalled();
            });

            it('should not execute callback after reading from #filter', function () {
                chart.filter();
                expect(filterSpy).not.toHaveBeenCalled();
            });
        });

        describe('on filter', function () {
            var filterSpy, filter;
            beforeEach(function () {
                filter = "1";

                var expectedCallbackSignature = function (callbackChart, callbackFilter) {
                    expect(callbackChart).toBe(chart);
                    expect(callbackFilter).toEqual(filter);
                };

                filterSpy = jasmine.createSpy().and.callFake(expectedCallbackSignature);
                chart.on("filtered", filterSpy);
            });

            it('should execute callback after setting through #filter', function () {
                chart.filter(filter);
                expect(filterSpy).toHaveBeenCalled();
            });

            it('should not execute callback after reading from #filter', function () {
                chart.filter();
                expect(filterSpy).not.toHaveBeenCalled();
            });
        });

        describe('on redraw', function () {
            var preRedrawSpy, postRedrawSpy;
            beforeEach(function () {
                var expectedCallbackSignature = function (callbackChart) {
                    expect(callbackChart).toBe(chart);
                };

                preRedrawSpy = jasmine.createSpy().and.callFake(expectedCallbackSignature);
                postRedrawSpy = jasmine.createSpy().and.callFake(expectedCallbackSignature);

                chart.on("preRedraw", preRedrawSpy);
                chart.on("postRedraw", postRedrawSpy);
                chart.redraw();
            });

            it('should execute the preRedraw callback', function () {
                expect(preRedrawSpy).toHaveBeenCalled();
            });

            it('should execute the postRedraw callback', function () {
                expect(postRedrawSpy).toHaveBeenCalled();
            });
        });
    });

    describe('validations', function () {

        it('should require dimension', function () {
            try {
                dc.baseMixin({}).group(group).render();
                throw new Error("That should've thrown");
            } catch (e) {
                expect(e instanceof dc.errors.InvalidStateException).toBeTruthy();
            }
        });

        it('should require group', function () {
            try {
                dc.baseMixin({}).dimension(dimension).render();
                throw new Error("That should've thrown");
            } catch (e) {
                expect(e instanceof dc.errors.InvalidStateException).toBeTruthy();
            }
        });
    });

    describe('anchoring chart to dom', function () {
        var id;

        beforeEach(function () {
            id = "chart-id";
        });

        describe('using a d3 node', function () {
            var anchorDiv;

            beforeEach(function () {
                anchorDiv = d3.select("body").append("div").attr("id", id).node();
                chart.anchor(anchorDiv);
            });

            it('should register the chart', function () {
                expect(dc.hasChart(chart)).toBeTruthy();
            });

            it('should return the node, when anchor is called', function () {
                expect(chart.anchor()).toEqual(anchorDiv);
            });

            it('should return the id, when anchorName is called', function () {
                expect(chart.anchorName()).toEqual(id);
            });

            describe('without an id', function () {
                beforeEach(function () {
                    d3.select("#" + id).remove();
                    anchorDiv = d3.select("body").append("div").attr("class", "no-id").node();
                    chart.anchor(anchorDiv);
                });

                it('should return the node, when anchor is called', function () {
                    expect(chart.anchor()).toEqual(anchorDiv);
                });

                it('should return a valid, selectable id', function () {
                    // see http://stackoverflow.com/questions/70579/what-are-valid-values-for-the-id-attribute-in-html
                    expect(chart.anchorName()).toMatch(/^[a-zA-Z][a-zA-Z0-9_:.-]*$/);
                });

            });
        });

        describe('using an id selector', function () {
            beforeEach(function () {
                d3.select("body").append("div").attr("id", id);
                chart.anchor('#' + id);
            });

            it('should add the dc chart class to its parent div', function () {
                expect(chart.root().classed("dc-chart")).toBeTruthy();
            });

            it('should return the id selector when anchor is called', function () {
                expect(chart.anchor()).toEqual('#' + id);
            });

            it('should return the id when anchorName is called', function () {
                expect(chart.anchorName()).toEqual(id);
            });
        });
    });

    describe('calculation of dimensions', function () {
        beforeEach(function () {
            chart.anchor('#dimensionTest');
        });

        describe('when set to a falsy', function () {
            beforeEach(function () {
                chart.width(null).height(null).render();
            });

            it('should set the height to the default', function () {
                expect(chart.height()).toEqual(200);
            });

            it('should set the width to the default', function () {
                expect(chart.width()).toEqual(200);
            });

            describe('with minimums set', function () {
                beforeEach(function () {
                    chart.minHeight(234).minWidth(976).render();
                });

                it('should set the height to the minimum', function () {
                    expect(chart.height()).toEqual(234);
                });

                it('should set the width to the minimum', function () {
                    expect(chart.width()).toEqual(976);
                });
            });
        });

        describe('when set with a number', function () {
            beforeEach(function () {
                chart.width(300).height(301).render();
            });

            it("should set the height", function () {
                expect(chart.height()).toEqual(301);
            });

            it("should set the width", function () {
                expect(chart.width()).toEqual(300);
            });
        });

        describe('when set to a callback function', function () {
            var setterSpy;
            beforeEach(function () {
                setterSpy = jasmine.createSpy().and.returnValue(800);
                chart.width(setterSpy).render();
            });

            it('should not execute callback before width() is called', function () {
                expect(setterSpy).not.toHaveBeenCalled();
            });

            it('should ask the callback for the width', function () {
                expect(chart.width()).toEqual(800);
            });
        });
    });

    describe('filter handling', function () {
        var filter, notFilter;
        beforeEach(function () {
            // 1 && 0 should handle most cases.  Could be true/false booleans...
            filter = 1;
            notFilter = 0;
            chart.addFilterHandler(addFilterHandler);
            chart.hasFilterHandler(hasFilterHandler);
            chart.removeFilterHandler(removeFilterHandler);
            chart.resetFilterHandler(resetFilterHandler);
            chart.filterAll();
        });
        it('with the default hasFilterHandler', function () {
            chart.filter(filter);
            expect(chart.hasFilter(filter)).toBeTruthy();
            expect(chart.hasFilter(notFilter)).toBeFalsy();
        });
        it('with a truthy hasFilterHandler', function () {
            chart.filter(filter);
            chart.hasFilterHandler(function () { return true; });
            expect(chart.hasFilter(filter)).toBeTruthy();
            expect(chart.hasFilter(notFilter)).toBeTruthy();
        });
        it('with a falsy hasFilterHandler', function () {
            chart.filter(filter);
            chart.hasFilterHandler(function () { return false; });
            expect(chart.hasFilter(filter)).toBeFalsy();
            expect(chart.hasFilter(notFilter)).toBeFalsy();
        });
        it('with the default addFilterHandler', function () {
            chart.filter(filter);
            expect(chart.hasFilter(filter)).toBeTruthy();
            expect(chart.filters().length).toEqual(1);
        });
        it('with a noop addFilterHandler', function () {
            chart.addFilterHandler(function (filters, filter) {
                return filters;
            });
            chart.filter(filter);
            expect(chart.hasFilter(filter)).toBeFalsy();
            expect(chart.hasFilter(notFilter)).toBeFalsy();
            expect(chart.filters().length).toEqual(0);
        });
        it('with a static addFilterHandler', function () {
            chart.addFilterHandler(function (filters, filter) {
                filters.push(notFilter);
                return filters;
            });
            chart.filter(filter);
            expect(chart.hasFilter(filter)).toBeFalsy();
            expect(chart.hasFilter(notFilter)).toBeTruthy();
            expect(chart.filters().length).toEqual(1);
        });
        it('with the default removeFilterHandler', function () {
            chart.filter(filter);
            chart.filter(notFilter);
            expect(chart.filters().length).toEqual(2);
            chart.filter(filter);
            expect(chart.hasFilter(filter)).toBeFalsy();
            expect(chart.hasFilter(notFilter)).toBeTruthy();
            expect(chart.filters().length).toEqual(1);
            chart.filter(notFilter);
            expect(chart.hasFilter(filter)).toBeFalsy();
            expect(chart.hasFilter(notFilter)).toBeFalsy();
            expect(chart.filters().length).toEqual(0);
        });
        it('with a noop removeFilterHandler', function () {
            chart.filter(filter);
            chart.filter(notFilter);
            chart.removeFilterHandler(function (filters, filter) {
                return filters;
            });
            expect(chart.filters().length).toEqual(2);
            chart.filter(filter);
            expect(chart.hasFilter(filter)).toBeTruthy();
            expect(chart.hasFilter(notFilter)).toBeTruthy();
            expect(chart.filters().length).toEqual(2);
            chart.filter(notFilter);
            expect(chart.hasFilter(filter)).toBeTruthy();
            expect(chart.hasFilter(notFilter)).toBeTruthy();
            expect(chart.filters().length).toEqual(2);
        });
        it('with a shift removeFilterHandler', function () {
            chart.filter(filter);
            chart.filter(notFilter);
            chart.removeFilterHandler(function (filters, filter) {
                if (filters.length > 0) {
                    filters.shift();
                }
                return filters;
            });
            expect(chart.filters().length).toEqual(2);
            chart.filter(notFilter);
            expect(chart.hasFilter(filter)).toBeFalsy();
            expect(chart.hasFilter(notFilter)).toBeTruthy();
            expect(chart.filters().length).toEqual(1);
            chart.filter(notFilter);
            expect(chart.hasFilter(filter)).toBeFalsy();
            expect(chart.hasFilter(notFilter)).toBeFalsy();
            expect(chart.filters().length).toEqual(0);
        });
        it('with the default resetFilterHandler', function () {
            chart.filter(filter);
            chart.filter(notFilter);
            chart.filter(null);
            expect(chart.hasFilter(filter)).toBeFalsy();
            expect(chart.hasFilter(notFilter)).toBeFalsy();
            expect(chart.filters().length).toEqual(0);
        });
        it('with a noop resetFilterHandler', function () {
            chart.filter(filter);
            chart.filter(notFilter);
            chart.resetFilterHandler(function (filters) {
                return filters;
            });
            chart.filter(null);
            expect(chart.hasFilter(filter)).toBeTruthy();
            expect(chart.hasFilter(notFilter)).toBeTruthy();
            expect(chart.filters().length).toEqual(2);
        });
        it('with a shift resetFilterHandler', function () {
            chart.filter(filter);
            chart.filter(notFilter);
            chart.resetFilterHandler(function (filters) {
                filters.shift();
                return filters;
            });
            chart.filter(null);
            expect(chart.hasFilter(filter)).toBeFalsy();
            expect(chart.hasFilter(notFilter)).toBeTruthy();
            expect(chart.filters().length).toEqual(1);
            chart.filter(null);
            expect(chart.hasFilter(filter)).toBeFalsy();
            expect(chart.hasFilter(notFilter)).toBeFalsy();
            expect(chart.filters().length).toEqual(0);
        });
    });
});
