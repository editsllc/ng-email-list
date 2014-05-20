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
    'template' : '<textarea><textarea>',
    'link' : function ($scope, elem, attrs, model) {

      model.$parsers.push(function (value) {
        var parsed = [];
        $scope.rejected = [];

        angular.forEach(value.split(','), function (email) {
          email = email.trim();
          if (EMAIL_REX.test(email)) {
            parsed.push(email);
          } else if (email !== '') {
            $scope.rejected.push(email);
          }
        });

        //Only check for repeats if the flag is set
        //TODO make this <IE9 compatable
        if (attrs.repeat) {
          $scope.repeat = [];
          $scope.repeat = parsed.filter(function (value, index, self) {
            return self.indexOf(value) !== index;
          });
        }
        return parsed;
      });

      //set the validity
      //email means there are invalid addresses
      //repeat means there are repeat addresses
      //invaild means there are either invaild or repeated addresses
      model.$parsers.push(function (value) {
        var error = value.length === 0;
        if ($scope.rejected.length !== 0) {
          model.$setValidity('email', false);
          error = true;
        } else {
          model.$setValidity('email', true);
        }
        if (attrs.repeat && $scope.repeat.length !== 0) {
          model.$setValidity('repeat', false);
          error = true;
        } else {
          model.$setValidity('repeat', true);
        }

        if (error) {
          model.$setValidity('emailList', false);
          return;
        }
        model.$setValidity('emailList', true);
        return value;
      });
    }
  };
}];
