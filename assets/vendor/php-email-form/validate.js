(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;

      let action = `http://localhost:3030/api/booking/create`;

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      // FormData ni JSON formatga o‘giramiz
      let jsonObject = {};
      formData.forEach((value, key) => jsonObject[key] = value);

      php_email_form_submit(thisForm, action, jsonObject);
    });
  });

  function php_email_form_submit(thisForm, action, jsonData) {
    fetch(action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonData)
    })
      .then(response => response.json())
      .then(response => {
        console.log(response)
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (response.success == true) {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
        } else {
          throw new Error(response ? response : 'Form submission failed and no error message returned from: ' + action);
        }
        if (response.success) {
          return response.data.message;
        } else {
          throw new Error(`${response.error.message}`);
        }
      })
      .catch((error) => {
        console.log(error)
        displayError(thisForm, error);
      });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
