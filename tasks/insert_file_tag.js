/*
 * grunt-insert-file-tag
 * https://github.com/ig343/grunt-insert-file-tag
 *
 * Copyright (c) 2024 Ion Gireada
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerTask('insert_file_tag', 'Insert file contents into tagged locations in source files.', function(targetFile) {
    const fs = require('fs');
    const targetFilePath = targetFile || 'README.md';
    const timestamp = new Date().toISOString();

    try {
      let targetFileContent = fs.readFileSync(targetFilePath, 'utf8');
      const insertRegex = /<!--\s*::insert\s+file\s*=\s*"([^"]+)"\s*-->[\s\S]*?<!--\s*:\/insert\s*-->/i;
      const match = insertRegex.exec(targetFileContent);

      if (!match) {
        grunt.log.warn(`Insertion point not found in ${targetFilePath}`);
        return;
      }

      const insertFilePath = match[1];

      try {
        const insertContent = fs.readFileSync(insertFilePath, 'utf8');
        const updatedContent = targetFileContent.replace(
          insertRegex,
          `<!-- ::insert file="${insertFilePath}" -->\n<!-- Inserted on: ${timestamp} -->\n${insertContent}\n<!-- :/insert -->`
        );
        fs.writeFileSync(targetFilePath, updatedContent);
        grunt.log.ok(`${insertFilePath} inserted into ${targetFilePath}`);
      } catch (err) {
        grunt.log.error(`Error reading or inserting ${insertFilePath}:`, err);
      }

    } catch (err) {
      grunt.log.error(`Error processing ${targetFilePath}:`, err);
    }
  });

};
