describe('dc event engine', () => {
    describe('event execution', () => {
        let engine, trigger;
        beforeEach(() => {
            engine = dc.events;
            trigger = jasmine.createSpy('trigger');
        });

        it('event can be dispatched immediately', () => {
            engine.trigger(trigger);
            expect(trigger).toHaveBeenCalled();
        });

        it('event can be dispatched with delay', () => {
            engine.trigger(trigger, 100);
            expect(trigger).not.toHaveBeenCalled();
            jasmine.clock().tick(101);
            expect(trigger).toHaveBeenCalled();
        });

        it('multiple events dispatched with delay should be throttled', () => {
            let times = 0;
            let i = 0;
            const increment = function () {
                times++;
            };

            while (i < 10) {
                engine.trigger(increment.bind(null), 10);
                i++;
            }
            jasmine.clock().tick(5);
            expect(times).toEqual(0);
            jasmine.clock().tick(5);
            expect(times).toEqual(1);
        });
        afterEach(() => {
        });
    });
});

