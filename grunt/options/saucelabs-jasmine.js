module.exports = {
	 all: {
        options: {
            urls: ['http://localhost:8888/spec/'],
            tunnelTimeout: 5,
            build: process.env.TRAVIS_JOB_ID,
            concurrency: 3,
            browsers: [
                {
                    browserName: 'firefox',
                    version: '25',
                    platform: 'linux'
                },
                {
                    browserName: 'safari',
                    version: '7',
                    platform: 'OS X 10.9'
                },
                {
                    browserName: 'internet explorer',
                    version: '10',
                    platform: 'WIN8'
                }
            ],
            testname: '<%= conf.pkg.name %>.js'
        }
    }
};
