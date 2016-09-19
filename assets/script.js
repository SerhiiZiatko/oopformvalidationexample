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
  email: [{
    validatorName: 'isEmail'
  }],
};

sendButton.onclick = function(event) {
  var validator = new Validator();
  var fields = {
    name: nameInput.value,
    password: passwordInput.value,
    email: emailInput.value,
  };

  // validator.initialize(validationRules);
  // validator.validate(fields);

  if (validator.isValid) {
    event.preventDefault();
    alert('Данные сохранены!');
  } else {
    validator.errors.map(function(error) {
      // Если будет время напилим нормальный вывод ошибок
      console.log('Ошибка в поле %s: %s', error.fieldName, error.text);
    });
    alert('В введенных Вами данных присутствуют ошибки');
  }
}

function Validator() {
  this.isValid = true;
}
