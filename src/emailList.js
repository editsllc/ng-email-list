//Copyright 2014 ERAS/Educational Research and Services
//See License File
//Written by Ryan Lee

'use strict';
/*jslint node:true, indent:2, nomen:true*/
/*globals angular*/

var EMAIL_REX = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;

module.exports = [function () {
  return {
    'restrict' : 'E',
    'require' : '?ngModel',
    'scope' : {
      'rejected' : '=rejected',
      'repeat' : '=repeat'
    },
    'replace' : true,
    'template' : '<textarea></textarea>',
    'link' : function ($scope, elem, attrs, model) {

      model.$validators.email = function (modelValue) {
        console.log(modelValue);
        if (modelValue === undefined) {
          return true;
        }
        $scope.rejected = [];
        angular.forEach(modelValue, function (email) {
          if (!EMAIL_REX.test(email)) {
            $scope.rejected.push(email);
          }
        });
        return $scope.rejected.length === 0;
      };

      if ($scope.repeat) {
        model.$validators.repeat = function (modelValue) {
          $scope.repeat = [];
          if (modelValue === undefined) {
            return true;
          }
          //TODO make this <IE9 compatable
          $scope.repeat = modelValue.filter(function (value, index, self) {
            return self.indexOf(value) !== index;
          });
          return $scope.repeat.length === 0;
        }
      }

      model.$parsers.push(function (value) {
        var parsed = value.split(',');
        angular.forEach(parsed, function (val, i) {
          parsed[i] = val.trim();
        });
        console.log(parsed);
        return parsed;
      });
    }
  };
}];
