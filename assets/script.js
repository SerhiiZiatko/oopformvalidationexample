var sendButton = document.getElementById('sendButton');

var nameInput = document.getElementById('name');
var passwordInput = document.getElementById('password');
var emailInput = document.getElementById('email');

var validationRules = {
  name: [{
    validatorName: 'length',
    props: {
      max: 15,
      min: 3,
    }
  }],
  // {
  //   validatorName: 'onlyLetters',
  // }],
  password: [{
    validatorName: 'length',
    props: {
      max: 15,
      min: 6,
    }
  }],
  email: [
  // {
  //   validatorName: 'isEmail'
  // }
  ]
};

sendButton.onclick = function(event) {
  event.preventDefault();
  var validator = new Validator();
  var fields = {
    name: nameInput.value,
    password: passwordInput.value,
    email: emailInput.value,
  };

  validator.initialize(validationRules);
  validator.validate(fields);

  if (validator.isValid) {
    alert('Данные сохранены!');
  } else {

    // validator.errors.map(function(error) {
      // Если будет время напилим нормальный вывод ошибок
      // console.log('Ошибка в поле %s: %s', error.fieldName, error.text);
    // });
    alert('В введенных Вами данных присутствуют ошибки');
  }
}

function Validator(rules) {
  this.isValid = true;

  this.validators = {
    length: LengthValidator
  };

  this.initialize = function(rules) {
    this.rules = rules;
  }

  this.validate = function(fields) {
    var self = this;
    var fieldNames = Object.keys(fields); // ['name', 'password', 'email']

    fieldNames.map(function(fieldName) {
      self.rules[fieldName].map(function(validatorDescription) {
        var LocalValidator = self.validators[validatorDescription.validatorName];
        var validatorProps = validatorDescription.props;
        var validator = new LocalValidator(validatorProps);
        var isValid = validator.validate(fieldName, fields[fieldName]);
        self.isValid = self.isValid && isValid;
      });
    });

    return this.isValid;
  }
}

function BaseValidator() {}

BaseValidator.prototype.validate = function() {
  throw new Error('Should be implemented');
}

BaseValidator.prototype.error = 'Error';
BaseValidator.prototype.validationProps = {};

function LengthValidator(validationProps) {
  this.validationProps = validationProps;
}

LengthValidator.prototype = Object.create(BaseValidator.prototype);
LengthValidator.prototype.constructor = LengthValidator;

LengthValidator.prototype.validate = function(fieldName, field) {
  if ( field.length < this.validationProps.min || field.length > this.validationProps.max ) {
    console.log('Ошибка в поле ' + fieldName + ' ' +this.error());
    return false;
  } else {
    return true;
  }
}

LengthValidator.prototype.error = function() {
  return new Error('Длинна должна быть между ' + this.validationProps.min + ' и ' + this.validationProps.max + ' символами ');
}

