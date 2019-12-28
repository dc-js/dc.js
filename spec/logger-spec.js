describe('dc.logger', () => {
    const message = 'Watch out for the bears';

    describe('logging a warning', () => {
        describe('when console.warn is defined', () => {
            beforeEach(() => {
                console.warn = function (msg) {};
                spyOn(console, 'warn');
                dc.logger.warn(message);
            });

            it('should log the message using console.warn', () => {
                expect(console.warn).toHaveBeenCalledWith(message);
            });
        });

        describe('when console.warn is not defined but console.log is', () => {
            beforeEach(() => {
                console.warn = undefined;
                spyOn(console, 'log');
                dc.logger.warn(message);
            });

            it('should log the message using console.log', () => {
                expect(console.log).toHaveBeenCalledWith(message);
            });
        });
    });

    describe('debug flag', () => {
        it('is off by default', () => {
            expect(dc.logger.enableDebugLog).toBeFalsy();
        });
    });

    describe('debug logging', () => {
        describe('when debugging is disabled', () => {
            beforeEach(() => {
                dc.logger.enableDebugLog = false;
                console.debug = function (msg) {};
                spyOn(console, 'debug');
                dc.logger.debug(message);
            });

            it('should log nothing', () => {
                expect(console.debug).not.toHaveBeenCalled();
            });
        });

        describe('when debugging is enabled', () => {
            beforeEach(() => {
                dc.logger.enableDebugLog = true;
            });

            describe('when console.debug is defined', () => {
                beforeEach(() => {
                    console.debug = function (msg) {};
                    spyOn(console, 'debug');
                    dc.logger.debug(message);
                });

                it('should log the message using console.debug', () => {
                    expect(console.debug).toHaveBeenCalledWith(message);
                });
            });

            describe('when console.debug is not defined', () => {
                beforeEach(() => {
                    console.debug = undefined;
                    spyOn(console, 'log');
                    dc.logger.debug(message);
                });

                it('should log the message using console.log', () => {
                    expect(console.log).toHaveBeenCalledWith(message);
                });
            });
        });
    });

    describe('warnOnce', () => {
        beforeEach(() => {
            spyOn(dc.logger, 'warn');
        });

        it('should warn only once for the same message', () => {
            dc.logger.warnOnce('Message 01');
            dc.logger.warnOnce('Message 01');

            expect(dc.logger.warn.calls.count()).toBe(1);
        });

        // Please remember that during run of the entire test suite warnOnce remembers messages.
        // So, ensure to use distinct messages in different test cases.
        it('should warn only once each for different messages', () => {
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
