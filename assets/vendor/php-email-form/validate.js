(function () {
  "use strict";

  const url = 'http://localhost:3030'

  let selectTableForm = document.querySelectorAll('.select-table-form')
  let forms = document.querySelectorAll('.php-email-form');
  let tablesContainer = document.getElementById('tables')
  let bookingForm = document.getElementById('bookingForm')
  bookingForm.style.display = 'none'
  let next2Container = document.getElementById('next2-container')
  next2Container.style.display = 'none'

  selectTableForm.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;

      let action = `${url}/api/booking/availability`;

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      let jsonObject = {};
      formData.forEach((value, key) => jsonObject[key] = value);

      select_table_form_submit(thisForm, action, jsonObject);
    });
  });

  function select_table_form_submit(thisForm, action, jsonData) {
    fetch(action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonData)
    })
      .then(response => response.json())
      .then(response => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (response.success == true) {
          document.getElementById('booking-form').style.display = 'none'
          renderTables(response.data.available_stols, response.data.allStolsLength)
          next2Container.style.display = ''
          thisForm.reset();
        } else {
          throw new Error(response.error.message);
        }
      })
      .catch((error) => {
        displayError(thisForm, error);
      });
  }

  function renderTables(availableTables, allStolsLength) {
    tablesContainer.innerHTML = "";
    availableTables.forEach(tableId => {
      let div = document.createElement("div");
      div.classList.add("table-box", "available");
      div.dataset.id = tableId;
      div.textContent = `${tableId}`;
      div.addEventListener("click", function () {
        document.querySelectorAll(".table-box").forEach(t => t.classList.remove("selected"));
        div.classList.add("selected");
        bookingForm.style.display = "block";
        bookingForm.querySelector("input[name='table_id']").value = tableId;
      });
      tablesContainer.appendChild(div);
    });
  }

  $(document).on('click', '.available', function () {
    $('.table-box').removeClass('selected');
    $(this).addClass('selected');
    $('#next').removeAttr('disabled')
  });

  function transferDataToSecondForm(data) {
    Object.keys(data).forEach(key => {
      let input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = data[key];
      secondForm.appendChild(input);
    });
    let tableInput = document.createElement("input");
    tableInput.type = "hidden";
    tableInput.name = "table_id";
    secondForm.appendChild(tableInput);
  }

  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;

      let action = `${url}/api/booking/create`;

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

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
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (response.success == true) {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
        } else {
          throw new Error(response.error.message);
        }
      })
      .catch((error) => {
        displayError(thisForm, error);
      });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();