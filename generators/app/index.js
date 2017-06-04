'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const fs = require('fs');
const path = require('path');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.green('Blank Canvas') + ' generator!'
    ));

    const prompts = [
      {
        name: 'name',
        message: 'Your name (for the LICENSE)',
        required: true,
        default: 'Change Me'
      },
      {
        name: 'project',
        message: 'Project name (for package.json)?',
        required: true,
        default: 'Change Me'
      },
      {
        type: 'list',
        name: 'database',
        message: 'Would you like to use Knex?',
        choices: [
          {
            name: 'yes',
            value: 'knex'
          },
          {
            name: 'no',
            value: null
          }
        ],
        default: 'no'
      },
      {
        when: function(response) {
          if(response.database) {
            return response.database;
          }
        },
        name: 'databaseName',
        message: 'What is your database name?'
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  generatePackageDotJson() {
    const readFilePath = path.join(
      __dirname, 'templates', '_example.package.json');
    const writeFilePath = path.join(
      __dirname, 'templates', 'package.json');
    fs.readFile(readFilePath, (err, data) => {
      if (err) {
        throw err;
      }
      const jsonObject = JSON.parse(data);
      const sansSpaces = (this.props.project).replace(/\s/g, '');
      jsonObject.name = sansSpaces;
      if (this.props.database) {
        if (this.props.database === 'knex') {
          jsonObject.dependencies.knex = '^0.11.10';
          jsonObject.dependencies.pg = '6.1.0';
        }
      }
      const stringifiedObject = JSON.stringify(jsonObject, null, 2);
      fs.writeFile(writeFilePath, stringifiedObject, (err, data) => {
        if (err) {
          throw err;
        }
        this.fs.copy(
          this.templatePath('package.json'),
          this.destinationPath('package.json')
        );
      });
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath('.env'),
      this.destinationPath('.env')
    );
    this.fs.copy(
      this.templatePath('dot-gitignore'),
      this.destinationPath('.gitignore')
    );
    this.fs.copyTpl(
      this.templatePath('LICENSE'),
      this.destinationPath('LICENSE'),
      {
        year: (new Date()).getFullYear(),
        name: this.props.name
      }
    );
  }

  writingFolders() {
    this.fs.copy(
      this.templatePath('src/'),
      this.destinationPath('src/')
    );
    this.fs.copy(
      this.templatePath('test/'),
      this.destinationPath('test/')
    );
  }

  createDatabase() {
      if (this.props.database) {
        if (this.props.database === 'knex') {
          this.fs.copyTpl(
            this.templatePath('knexfile.js'),
            this.destinationPath('knexfile.js'),
            {
              database: this.props.databaseName
            }
          );
          this.fs.copy(
            this.templatePath('app.js'),
            this.destinationPath('app.js')
          );
          this.fs.copyTpl(
            this.templatePath('_db.connection.knex.js'),
            this.destinationPath('src/server/db/knex.js')
          );
        }
      }
    }

  // install() {
  //   this.installDependencies();
  // }
};
