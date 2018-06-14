// Generated on 2015-11-06 using generator-v6 1.1.0
"use strict";

module.exports = function (grunt) {
    // Load grunt tasks automatically, when needed
    require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);

    // Time how long tasks take. Can help when optimizing build times
    require("time-grunt")(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({
        name: "ovh-angular-apiv7",
        srcDir: "./src",
        buildDir: "./.tmp",
        distDir: "./dist",
        docDir: "./docs",
        pkg: grunt.file.readJSON("package.json"),
        bower: grunt.file.readJSON("bower.json"),

        // Concatenation
        concat: {
            dist: {
                files: {
                    "<%= buildDir %>/<%= name %>.js": ["<%= srcDir %>/<%= name %>.module.js", "<%= srcDir %>/**/*.js", "!<%= srcDir %>/**/*.spec.js"]
                }
            }
        },

        // ngAnnotate
        ngAnnotate: {
            dist: {
                files: {
                    "<%= buildDir %>/<%= name %>.js": ["<%= buildDir %>/<%= name %>.js"]
                }
            }
        },

        // Copy files
        copy: {
            dist: {
                files: {
                    "<%= distDir %>/<%= name %>.js": ["<%= buildDir %>/<%= name %>.js"]
                }
            }
        },

        // Minify
        uglify: {
            js: {
                options: {
                    banner: "/*! <%= name %> - <%= grunt.template.today('yyyy-mm-dd') %> */\n"
                },
                files: {
                    "<%= distDir %>/<%= name %>.min.js": ["<%= buildDir %>/<%= name %>.js"]
                }
            }
        },

        // Clean
        clean: {
            all: {
                src: ["<%= buildDir %>", "<%= distDir %>", "<%= docDir %>"]
            }
        },

        watch: {
            eslint: {
                files: ["<%= srcDir %>/**/*.js"],
                tasks: ["eslint"]
            },
            karma: {
                files: ["<%= srcDir %>/**/*.js"],
                tasks: ["karma"]
            }
        },

        eslint: {
            files: ["<%= srcDir%>/**/*.js"],
            options: {
                quiet: true
            }
        },

        // Check complexity
        complexity: {
            generic: {
                src: ["<%= srcDir %>/**/*.js", "!<%= srcDir %>/**/*.spec.js"],
                options: {
                    errorsOnly: false,
                    cyclomatic: 12,
                    halstead: 45,
                    maintainability: 82
                }
            }
        },

        karma: {
            unit: {
                configFile: "karma.conf.js",
                singleRun: true
            }
        },

        // Documentation
        ngdocs: {
            options: {
                dest: "<%= docDir %>",
                html5Mode: false,
                title: "<%= name %>"
            },
            docs: {
                src: ["<%= srcDir %>/**/*.js", "!<%= srcDir %>/**/*.spec.js"],
                title: "docs"
            }
        },

        // DOCS connect
        connect: {
            docs: {
                options: {
                    port: 9090,
                    base: "docs/",
                    keepalive: true
                }
            }
        },

        // To release
        bump: {
            options: {
                commitFiles: ["-a"],
                files: ["package.json", "bower.json"],
                pushTo: "origin",
                updateConfigs: ["pkg", "bower"]
            }
        }
    });

    grunt.registerTask("default", ["build"]);
    grunt.task.renameTask("watch", "delta");
    grunt.registerTask("watch", ["build", "delta"]);

    grunt.registerTask("test", function () {
        grunt.task.run(["eslint", "complexity", "karma"]);
    });

    grunt.registerTask("build", ["clean", "concat", "ngAnnotate", "uglify", "copy:dist", "ngdocs"]);

    // Increase version number. Type = minor|major|patch
    grunt.registerTask("release", "Release", function () {
        var type = grunt.option("type");

        if (type && ~["patch", "minor", "major"].indexOf(type)) {
            grunt.task.run(["bump-only:" + type]);
        } else {
            grunt.verbose.or.write("You try to release in a weird version type [" + type + "]").error();
            grunt.fail.warn("Please try with --type=patch|minor|major");
        }
    });
};
