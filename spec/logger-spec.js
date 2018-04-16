describe('dc.logger', function () {
    var message = 'Watch out for the bears';

    describe('logging a warning', function () {
        describe('when console.warn is defined', function () {
            beforeEach(function () {
                console.warn = function (msg) {};
                spyOn(console, 'warn');
                dc.logger.warn(message);
            });

            it('should log the message using console.warn', function () {
                expect(console.warn).toHaveBeenCalledWith(message);
            });
        });

        describe('when console.warn is not defined but console.log is', function () {
            beforeEach(function () {
                console.warn = undefined;
                spyOn(console, 'log');
                dc.logger.warn(message);
            });

            it('should log the message using console.log', function () {
                expect(console.log).toHaveBeenCalledWith(message);
            });
        });
    });

    describe('debug flag', function () {
        it('is off by default', function () {
            expect(dc.logger.enableDebugLog).toBeFalsy();
        });
    });

    describe('debug logging', function () {
        describe('when debugging is disabled', function () {
            beforeEach(function () {
                dc.logger.enableDebugLog = false;
                console.debug = function (msg) {};
                spyOn(console, 'debug');
                dc.logger.debug(message);
            });

            it('should log nothing', function () {
                expect(console.debug).not.toHaveBeenCalled();
            });
        });

        describe('when debugging is enabled', function () {
            beforeEach(function () {
                dc.logger.enableDebugLog = true;
            });

            describe('when console.debug is defined', function () {
                beforeEach(function () {
                    console.debug = function (msg) {};
                    spyOn(console, 'debug');
                    dc.logger.debug(message);
                });

                it('should log the message using console.debug', function () {
                    expect(console.debug).toHaveBeenCalledWith(message);
                });
            });

            describe('when console.debug is not defined', function () {
                beforeEach(function () {
                    console.debug = undefined;
                    spyOn(console, 'log');
                    dc.logger.debug(message);
                });

                it('should log the message using console.log', function () {
                    expect(console.log).toHaveBeenCalledWith(message);
                });
            });
        });
    });

    describe('deprecate', function () {
        var dummy, wrappedFn;

        beforeEach(function () {
            dummy = {
                origFn: function () {
                }
            };
            spyOn(dummy, 'origFn');
            spyOn(dc.logger, 'warn');

            wrappedFn = dc.logger.deprecate(dummy.origFn, 'origFn is deprecated');
        });
        it('should call deprecated function and issue a warning', function () {
            wrappedFn('a');
            expect(dummy.origFn).toHaveBeenCalledWith('a');
            expect(dc.logger.warn).toHaveBeenCalled();
        });
        it('should warn for one deprecated function only once', function () {
            wrappedFn();
            wrappedFn();
            expect(dummy.origFn.calls.count()).toBe(2);
            expect(dc.logger.warn.calls.count()).toBe(1);
        });
    });

    describe('warnOnce', function () {
        beforeEach(function () {
            spyOn(dc.logger, 'warn');
        });

        it('should warn only once for the same message', function () {
            dc.logger.warnOnce('Message 01');
            dc.logger.warnOnce('Message 01');

            expect(dc.logger.warn.calls.count()).toBe(1);
        });

        // Please remember that during run of the entire test suite warnOnce remembers messages.
        // So, ensure to use distinct messages in different test cases.
        it('should warn only once each for different messages', function () {
            dc.logger.warnOnce('Message 02');
            dc.logger.warnOnce('Message 03');
            dc.logger.warnOnce('Message 02');
            dc.logger.warnOnce('Message 03');

            expect(dc.logger.warn.calls.count()).toBe(2);
            expect(dc.logger.warn.calls.argsFor(0)).toEqual(['Message 02']);
            expect(dc.logger.warn.calls.argsFor(1)).toEqual(['Message 03']);
        });
    });
});
