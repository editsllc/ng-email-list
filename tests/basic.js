//Copyright 2015 ERAS/Educational Research and Services
//See License file
//Written by Ryan Lee

'use strict';
/*jslint node:true, indent:2, nomen:true*/
/*globals describe, it, beforeEach, afterEach, inject*/

var assert = require('assert');
var angular = require('angular');
var mocks = require('angular-mocks');
var ngEmail = require('../src/common.js');

describe('Email-List', function () {
  var cc, rs, scope, template, makeTest;

  beforeEach(angular.mock.module('ng-email-list'));
  beforeEach(angular.mock.inject(function ($compile, $rootScope) {
    cc = $compile;
    rs = $rootScope;
  }));

  afterEach(function () {
    scope = undefined;
    template = undefined;
  });

  makeTest = function (input, repeat) {
    scope = rs.$new();
    var html = '<ng-email-list ng-model="emails" rejected="rejected" ng-model-options="{allowInvalid : true}"></ng-email-list>';
    if (repeat) {
      html = '<ng-email-list ng-model="emails" rejected="rejected" repeat="repeats" ng-model-options="{allowInvalid : true}"></ng-email-list>';
      scope.repeats = [];
    }
    template = cc(html)(scope);
    template.val(input);
    template.triggerHandler('input');
    scope.$digest();
  };

  it('should compile the directive', function () {
    makeTest();
    assert.equal(template.prop('tagName'), 'TEXTAREA');
  });
   
  it('should validite on one valid email', function () {
    makeTest('test@test.com');
    assert.equal(scope.emails.length, 1);
    assert.equal(scope.emails[0], 'test@test.com');
    assert(template.hasClass('ng-valid'), 'ng-valid should be set');
  });

  it('should validate on two valid emails', function () {
    makeTest('test@test.com, test2@test.com');
    assert.equal(scope.emails.length, 2);
    assert.equal(scope.emails[0], 'test@test.com');
    assert.equal(scope.emails[1], 'test2@test.com');
    assert(template.hasClass('ng-valid'), 'ng-valid class is not set');
  });

  it('should invalidate on one invalid email', function () {
    makeTest('invalid');
    assert(template.hasClass('ng-invalid-email'), 'invalid-email is not set');
    assert(template.hasClass('ng-invalid'), 'invalid should be set');
    assert.equal(scope.rejected.length, 1);
    assert.equal(scope.rejected[0], 'invalid');
    assert.equal(scope.emails.length, 1);
    assert.equal(scope.emails[0], 'invalid');
  });

  it('should invalidate on two invalid emails', function () {
    makeTest('invalid, invalid2');
    assert(template.hasClass('ng-invalid-email'), 'invalid-email is not set');
    assert(template.hasClass('ng-invalid'), 'invalid should be set');
    assert.equal(scope.rejected.length, 2);
    assert.equal(scope.rejected[0], 'invalid');
    assert.equal(scope.emails.length, 2);
    assert.equal(scope.emails[0], 'invalid');
  });

  it('should invalidate on mixed emails', function () {
    makeTest('invalid, test@test.com');
    assert(template.hasClass('ng-invalid-email'), 'invalid-email is not set');
    assert(template.hasClass('ng-invalid'), 'invalid should be set');
    assert.equal(scope.rejected.length, 1);
    assert.equal(scope.rejected[0], 'invalid');
    assert.equal(scope.emails.length, 2);
    assert.equal(scope.emails[0], 'invalid');
    assert.equal(scope.emails[1], 'test@test.com');
  });

  it('should clear the invalid error', function () {
    makeTest('invalid, test@test.com');
    assert(template.hasClass('ng-invalid-email'), 'invalid-email is not set');
    assert(template.hasClass('ng-invalid'), 'invalid should be set');
    template.val('test@test.com');
    template.triggerHandler('input');
    scope.$digest();
    assert(template.hasClass('ng-valid'), 'ng-valid class should be set');
    assert(!template.hasClass('ng-invalid'), 'invalid should not be set');
  });

  it('should validate with repeated emails', function () {
    makeTest('test@test.com, test@test.com');
    assert(template.hasClass('ng-valid'), 'valid should be set');
    assert.equal(scope.emails.length, 2);
    assert.equal(scope.emails[0], 'test@test.com');
    assert.equal(scope.emails[1], 'test@test.com');
  });

  it('should invalidate with repeate option and repeated emails', function () {
    makeTest('test@test.com, test@test.com', true);
    assert(template.hasClass('ng-invalid-repeat'), 'ng-invaild-repeat should be set');
    assert(!template.hasClass('ng-invalid-email'), 'ng-invalid-email should not be set');
    assert(template.hasClass('ng-invalid'), 'ng-invalid should be set');
    assert.equal(scope.repeats.length, 1);
    assert.equal(scope.repeats[0], 'test@test.com');
    assert.equal(scope.emails.length, 2);
    assert.equal(scope.emails[0], 'test@test.com');
    assert.equal(scope.emails[1], 'test@test.com');
  });

  it('should clear the repeate error', function () {
    makeTest('test@test.com, test@test.com', true);
    assert(template.hasClass('ng-invalid-repeat'), 'invalid-email is not set');
    assert(template.hasClass('ng-invalid'), 'invalid should be set');
    template.val('test@test.com, test@test2.com');
    template.triggerHandler('input');
    scope.$digest();
    assert(template.hasClass('ng-valid'), 'ng-valid class should be set');
    assert(!template.hasClass('ng-invalid'), 'invalid should not be set');
  });
});
