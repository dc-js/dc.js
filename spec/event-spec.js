describe('dc event engine', function() {
    describe('event execution', function() {
        var engine, trigger;
        beforeEach(function() {
            engine = dc.events;
            trigger = jasmine.createSpy("trigger");
        });

        it('event can be dispatched immediately', function() {
            engine.trigger(trigger);
            expect(trigger).toHaveBeenCalled();
        });

        it('event can be dispatched with delay', function() {
            engine.trigger(trigger, 100);
            expect(trigger).not.toHaveBeenCalled();
            jasmine.clock().tick(101);
            expect(trigger).toHaveBeenCalled();
        });

        it('multiple events dispatched with delay should be throttled', function() {
            var times = 0;
            var i = 0;

            /* jshint -W083 */
            while (i < 10) {
                engine.trigger(function() {
                    times++;
                }, 10);
                i++;
            }
            /* jshint +W083 */

            setTimeout(function() {
                expect(times).toEqual(1);
            }, 10);
        });
        afterEach(function() {
        });
    });
});


