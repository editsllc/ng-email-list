//Copyright 2014 ERAS/Educational Research and Services
//See License File
//Written by Ryan Lee

'use strict';
/*jslint node:true, indent:2, nomen:true*/
/*globals angular*/

var EMAIL_REX = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;

module.exports = ['$timeout', function ($timeout) {
  return {
    'restrict' : 'E',
    'require' : '?ngModel',
    'scope' : {
      'rejected' : '=rejected',
      'repeat' : '=repeat'
    },
    'template' : '<textarea ng-model="raw"><textarea>',
    'link' : function ($scope, elem, attrs, model) {
      var parsed, reject, repeat, parseFn, debounce;
      $scope.raw = '';

      //set the validity
      //email means there are invalid addresses
      //repeat means there are repeat addresses
      //invaild means there are either invaild or repeated addresses
      model.$parsers.unshift(function (value) {
        var error = false;
        if (reject.length !== 0) {
          model.$setValidity('email', false);
          error = true;
        }
        if (attrs.repeat && repeat.length !== 0) {
          model.$setValidity('repeat', false);
          error = true;
        }
        if (error) {
          model.$setValidity('emailList', false);
          return;
        }
        model.$setValidity('emailList', true);
        return true;
      });

      //function that parses the raw string
      parseFn = function () {
        parsed = [];
        reject = [];
        repeat = [];

        //check if each email is valid
        angular.forEach($scope.raw.split(','), function (email, i) {
          email = email.trim();
          if (EMAIL_REX.test(email)) {
            parsed.push(email);
          } else if (email !== '') {
            reject.push(email);
          }
        });

        if (attrs.rejected) {
          $scope.rejected = reject;
        }

        //Only check for repeats if the flag is set
        //TODO make this <IE9 compatable
        if (attrs.repeat) {
          repeat = parsed.filter(function (value, index, self) {
            return self.indexOf(value) !== index;
          });
          //check if the email is repeated
          $scope.repeat = repeat;
        }

        model.$setViewValue(parsed);
      };
      
      //watch the isolate scope and debounce the input
      //TODO make the debounce adjustable from parameters
      $scope.$watch('raw', function () {
        if (debounce) {
          $timeout.cancel(debounce);
        }
        debounce = $timeout(function () {
          debounce = undefined;
          parseFn();
        }, 1000);
      });
    }
  };
}];
