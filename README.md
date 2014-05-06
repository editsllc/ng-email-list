ng-email-list
=============

A directive that listens on a textarea and validates emails.

##Installation

Currently only browserfiy (CommonJs) is supported.

```
  npm install ng-email-list
```

Register the directive.

```
  myApp.directives('emailList', require('ng-email-list'));
```

##Usage

```
<email-list ng-model=”emails”></email-list>
```

Optional Usage:

```
<email-list ng-model="model" rejected="rejects" repeat="repeats"></email-list>
```

###Model

Model will be set with an array of valid email address. If the repeat option is specified, it will not contain repeats. If you update the array, the textarea will not change. (If there is interest I'll implement or merge in a pull request.)

###Rejected (Optional)

An array of invalid email addresses. Perfect for displaying more useful error messages.

###Repeat (Optional)

An array of repeated email addresses. Perfect for displaying more useful error messages. **WARNING:** This feature is not <IE9 compatible.

###Form Validity

If you use the email-list with angulars form validity you get access to the following options: `email`, `repeat`, and `invalid`.

The `email` error is set if there are one or more invalid emails.

The `repeat` error is set if there are one or repeated emails. This error will only be set if you set the repeat property. **WARNING:** This feature is not <IE9 compatible.

The `invalid` error is set if there are invalid or repeated emails. Repeated emails are only check if the repeated property is set.

##Error Handling

You can display human friendly error messages in the following manner:

```
<form name="myForm">
  <email-list name="list" ng-model="emails" rejected="rejects" repeat="repeats"></email-list>
  <div ng-show="inviteForm.list.$error.emailList">
      <p>The email list is invalid!</p>
  </div>
  <div ng-show="inviteForm.list.$error.email">
      <p ng-show="rejects.length === 1">The following email is invalid {{rejects[0]}}</p>
    <p ng-show="rejects.length > 1">The following emails are invalid: {{rejects.join(', ')}}</p>
  </div>
  <div ng-show="inviteForm.list.$error.repeat">
      <p ng-show="repeats.length === 1">The following email is repeated:{{repeats[0]}}</p>
      <p ng-show="repeats.length > 1">The following emails are repeated:{{repeats.join(', ')}}</p>
  </div>
</form>
```
