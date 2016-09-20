var sendButton = document.getElementById('sendButton');

var nameInput = document.getElementById('name');
var passwordInput = document.getElementById('password');
var emailInput = document.getElementById('email');
var phoneInput = document.getElementById('phone');
var statusBar = document.getElementById('statusBar');

var errorNodeHolders = {
  nameErrors: document.getElementById('nameErrors'),
  passwordErrors: document.getElementById('passwordErrors'),
  emailErrors: document.getElementById('emailErrors'),
  phoneErrors: document.getElementById('phoneErrors'),
}

var validationRules = {
  name: [{
    validatorName: 'length',
    props: {
      max: 15,
      min: 3,
    }
  },
  {
    validatorName: 'onlyLetters',
  }],
  password: [{
    validatorName: 'length',
    props: {
      max: 15,
      min: 6,
    }
  }],
  email: [
  {
    validatorName: 'isEmail'
  },
  {
    validatorName: 'length',
    props: {
      max: 20,
      min: 8,
    }
  }],
  phone: [{
    validatorName: 'length',
    props: {
      exactLength: 11,
    }
  }]
};

sendButton.onclick = function(event) {
  event.preventDefault();
  var validator = new Validator();
  var fields = {
    name: nameInput.value,
    password: passwordInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
  };

  var fieldNames = Object.keys(fields);

  validator.initialize(validationRules);
  validator.validate(fields);

  fieldNames.map(function(fieldName) {
    errorNodeHolders[fieldName + 'Errors'].innerHTML = '';
  });

  statusBar.innerHTML = '';

  if (validator.isValid) {
    statusBar.innerHTML = "Отправлено успешно";
  } else {
    statusBar.innerHTML = "В введенных данных присутствуют ошибки";
    fieldNames.map(function(fieldName) {
      validator.errors[fieldName].map(function(error) {
        var errorNode = document.createElement('LI');
        errorNode.innerHTML = error;
        errorNodeHolders[fieldName + 'Errors'].appendChild(errorNode);
      });
    });
  }
}

function Validator(rules) {
  this.isValid = true;
  this.errors = {};

  this.validators = {
    length: LengthValidator,
    onlyLetters: OnlyLettersValidator,
    isEmail: IsEmailValidator,
  };

  this.initialize = function(rules) {
    this.rules = rules;
  }

  this.validate = function(fields) {
    var self = this;
    var fieldNames = Object.keys(fields); // ['name', 'password', 'email']

    fieldNames.map(function(fieldName) {
      self.errors[fieldName] = [];
      self.rules[fieldName].map(function(validatorDescription) {
        var LocalValidator = self.validators[validatorDescription.validatorName];
        var validatorProps = validatorDescription.props;
        var validator = new LocalValidator(validatorProps);
        var isValid = validator.validate(fieldName, fields[fieldName]);

        if (!isValid) {
          self.errors[fieldName].push(validator.error());
        }

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
  if (this.validationProps.exactLength) {
    if (field.length !== this.validationProps.exactLength) {
      return false;
    }
    return true;
  }

  if ( field.length < this.validationProps.min || field.length > this.validationProps.max ) {
    return false;
  }
  return true;
}

LengthValidator.prototype.error = function() {
  if (this.validationProps.exactLength) {
    return new Error('Длинна должна быть равна ' + this.validationProps.exactLength + ' символов ');
  }
  return new Error('Длинна должна быть между ' + this.validationProps.min + ' и ' + this.validationProps.max + ' символами ');
}

function OnlyLettersValidator() {};

OnlyLettersValidator.prototype = Object.create(BaseValidator.prototype);
OnlyLettersValidator.prototype.constructor = OnlyLettersValidator;

OnlyLettersValidator.prototype.validate = function(fieldName, fieldValue) {
  if (!(/^[a-zа-я]+$/i.test(fieldValue))) {
    return false;
  } 
  return true;
}

OnlyLettersValidator.prototype.error = function() {
  return new Error('Строка должна содержать только буквы');
}

function IsEmailValidator() {};

IsEmailValidator.prototype = Object.create(BaseValidator.prototype);
IsEmailValidator.prototype.constructor = IsEmailValidator;

IsEmailValidator.prototype.validate = function(fieldName, fieldValue) {
  if (!(/(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/i.test(fieldValue))) {
    return false;
  } 
  return true;
}

IsEmailValidator.prototype.error = function() {
  return new Error('Не валидный email');
}
