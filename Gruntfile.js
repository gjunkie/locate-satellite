module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          colors: 'true'
        },
        src: ['test/index.js']
      }
    }
  });

  grunt.registerTask('default', 'mochaTest');
};
