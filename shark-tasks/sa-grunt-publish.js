module.exports = function(grunt) {
    var RecordNewAssetsController = require('../controllers/metadata/RecordNewAssetsController');
    var LibraryOutputController = require('../controllers/output/LibraryOutputController.js');
    var DailyCountsController = require('../controllers/output/DailyCountsController.js');
    var Log = require('../utils/Log.js');

    // ==========================================================================
    // TASKS
    // ==========================================================================

    grunt.registerMultiTask('sa-publish', 'Publish Library', function() {
        var self = this;
        self.done = this.async();
        self.data = this.data;

        var onComplete = function(output) {
            if (output) {
                output.forEach( function(o) {
                    Log.prototype.log("Output", o.file);
                    grunt.file.write(o.file, o.data);
                });
            }
            self.done.apply();
        }

        switch (this.target) {
            case "library-output":
                Log.prototype.log("Grunt", "SA - Write Output Files");
                Log.prototype.addLineBreak();
                Log.prototype.log("Grunt", "Reading: " + self.data.assetslistFile);
                Log.prototype.addLineBreak();
                Log.prototype.log("Grunt", "Reading: " + self.data.sourceslistFile);
                Log.prototype.addLineBreak();
                self.data.assetslist = grunt.file.readJSON(self.data.assetslistFile);
                self.data.sourceslist = grunt.file.readJSON(self.data.sourceslistFile);
                new LibraryOutputController().process(this.data, onComplete);
                break;

            case "build-source-list":
                Log.prototype.log("Task", "SA - Write Output Files");
                Log.prototype.addLineBreak();
                Log.prototype.log("Grunt", "Reading: " + self.data.libraryFile);
                Log.prototype.addLineBreak();
                var lib = grunt.file.readJSON(self.data.libraryFile);
                var srcs = [];
                lib.sources.forEach( function(item) {
                    var src = {
                        label: item.label,
                        type: item.type,
                        url: item.url,
                        page: item.page,
                        id:  item.id,
                        thumb: item.thumb
                    };
                    srcs.push(src);
                });
                onComplete.apply(self, [ [{file: self.data.output, data: {"sources": srcs}}] ]);
                break;

            case "record-new-assets":
                Log.prototype.log("Task", "SA - Record New Assets");
                Log.prototype.addLineBreak();
                Log.prototype.log("Grunt", "Reading: " + self.data.assetslistFile);
                Log.prototype.addLineBreak();
                self.data.assetslist = grunt.file.readJSON(self.data.assetslistFile);
                new RecordNewAssetsController().process(this.data, onComplete);
                break;

            case "dailycounts":
                Log.prototype.log("Task", "SA - Produce Daily Counts Report");
                new DailyCountsController().process(this.data, onComplete);
                break;
        }
    });
};