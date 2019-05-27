// as of grunt-contrib-jasmine 2.0.3, a reporter is included which assumes it is
// running in ?a thread? ?headless? and window.sendMessage must be defined
// faking the function allows to run the tests in the browser again
if(!window.sendMessage)
  window.sendMessage = function() {};
