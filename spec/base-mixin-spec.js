describe("dc.baseMixin", function () {
    var chart, dateDimension, dateValueGroup;
    beforeEach(function () {
        var data = crossfilter(loadDateFixture());
        dateDimension = data.dimension(function (d) {
            return d3.time.day(d.dd);
        });
        dateValueGroup = dateDimension.group().reduceSum(function (d) {
            return d.value;
        });

        chart = dc.baseMixin({})
            .options({
                dimension: dateDimension,
                group: dateValueGroup,
                transitionDuration: 0,
            });
    });

    describe('renderlets', function () {
        var firstRenderlet, secondRenderlet;
        beforeEach(function () {
            var expectedCallbackSignature = function (callbackChart) {
                expect(callbackChart).toBe(chart);
            };
            firstRenderlet = jasmine.createSpy().and.callFake(expectedCallbackSignature);
            secondRenderlet = jasmine.createSpy().and.callFake(expectedCallbackSignature);
            chart.renderlet(firstRenderlet);
            chart.renderlet(secondRenderlet);
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
                dc.baseMixin({}).group(dateValueGroup).render();
                throw new Error("That should've thrown");
            } catch (e) {
                expect(e instanceof dc.errors.InvalidStateException).toBeTruthy();
            }
        });

        it('should require group', function () {
            try {
                dc.baseMixin({}).dimension(dateDimension).render();
                throw new Error("That should've thrown");
            } catch (e) {
                expect(e instanceof dc.errors.InvalidStateException).toBeTruthy();
            }
        });
    });

    describe('anchoring chart to dom', function () {
        var id = "ele";
        describe('using a d3 node', function () {
            var div;
            describe('with an id', function () {
                beforeEach(function () {
                    div = d3.select("body").append("div").attr("id", id).node();
                    chart.anchor(div);
                });

                it('should return the node, when anchor is called', function () {
                    expect(chart.anchor()).toEqual(div);
                });

                it('should return the id, when anchorName is called', function () {
                    expect(chart.anchorName()).toEqual(id);
                });
            });

            describe('without an id', function () {
                beforeEach(function () {
                    div = d3.select("body").append("div").attr("class", "no-id").node();
                    chart.anchor(div);
                });

                it('should return the node, when anchor is called', function () {
                    expect(chart.anchor()).toEqual(div);
                });

                it('should return a numeric string, when anchorName is called', function () {
                    expect(dc.utils.isNumber(chart.anchorName())).toBeFalsy();
                    expect(chart.anchorName()).toMatch(/\d+/);
                });
            });
        });

        describe('using an id selector', function () {
            beforeEach(function () {
                d3.select("body").append("div").attr("id", id);
                chart.anchor('#' + id);
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
});
