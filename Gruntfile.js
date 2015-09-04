module.exports = function (grunt) {
    //require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        bower: {
            install: {
                options: {
                    install: true,
                }
            },
            target: {
                rjsConfig: 'src/config.js'
            }
        },
        bowerRequirejs: {
            target: {
                rjsConfig: 'build/config.js',
                options: {
                //    baseUrl: './'
                }
            }
        },
        /*babel: {
            options: {
                sourceMap: true,
                modules: "amd"
            },
            dist: {
                files: {
                    'dist/main.js': 'src/*',
                    //'dist/parse.js': 'src/parse.js',
                }
            }
        },*/
        shell: {
            dirs: {
              command: "mkdir -p build dist"
            },
            babel: {
                command: "node node_modules/babel/bin/babel.js --stage 0 --modules amd --out-dir build src"
            }
        },
        requirejs: {
            compile: {
                options: {
                    name: "main",
                    baseUrl: "build",
                    mainConfigFile: "build/config.js",
                    out: "dist/main.js",
                    preserveLicenseComments: false,
                    generateSourceMaps: true,
                    optimize: "none"
                }
            }
        },
        copy: {
            main: {
                src: "src/index.html",
                dest: "dist/index.html"
            }
        },
        watch: {
            quick: {
                files: ["src/**.js"],
                tasks: ["quick"],
                options: {
                    spawn: false,
                    atBegin: true,
                    debounceDelay: 10
                }
            }
        }
    });

    //grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-bower-requirejs');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask('full', [
        'bower',
        'shell',
        'bowerRequirejs',
        'requirejs'
    ]);

    grunt.registerTask('quick', [
        'shell',
        'bowerRequirejs'
    ]);

    grunt.registerTask('default', ['quick']);

    //grunt.registerTask('watch', ['watch:quick']);
};
