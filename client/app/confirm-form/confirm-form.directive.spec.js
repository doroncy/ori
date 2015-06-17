'use strict';

describe('Directive: confirmForm', function () {

  // load the directive's module and view
  beforeEach(module('oriApp'));
  beforeEach(module('app/confirm-form/confirm-form.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<confirm-form></confirm-form>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the confirmForm directive');
  }));
});