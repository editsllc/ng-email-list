//Copyright 2015 ERAS/Educational Research and Services
//Reproduction of this material strictly prohibited.
//Written by Ryan Lee

'use strict';
/*jslint node:true, indent:2, nomen:true*/
/*globals angular*/

var angular = require('angular');
module.exports = angular
  .module('ng-email-list', [])
  .directive('ngEmailList', require('./emailList.js'));
