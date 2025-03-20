const showToast = () => {
  const toast = document.getElementById('toast');
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
};

const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateName = (name) => {
  const nameRegex = /^[a-zA-Z0-9 .'-]+$/;
  return nameRegex.test(name);
};

const validateFormField = (input) => {
  const errorElement = input.nextElementSibling;
  let errorMessage = '';

  if (input.name === 'nameFirst' || input.name === 'nameLast') {
    if (!validateName(input.value)) {
      errorMessage = 'Name can only contain letters, numbers, periods, apostrophes, and hyphens.';
    }
  } else if (input.name === 'contactPhone') {
    if (!validatePhone(input.value)) {
      errorMessage = 'Phone number must be 10 digits (USA format).';
    }
  } else if (input.name === 'contactEmail') {
    if (!validateEmail(input.value)) {
      errorMessage = 'Please enter a valid email address.';
    }
  }

  if (errorMessage) {
    input.setAttribute('aria-invalid', 'true');
    if (!errorElement || !errorElement.classList.contains('error-message')) {
      const newErrorElement = document.createElement('span');
      newErrorElement.className = 'error-message';
      newErrorElement.textContent = errorMessage;
      newErrorElement.setAttribute('aria-live', 'polite');
      input.insertAdjacentElement('afterend', newErrorElement);
    } else {
      errorElement.textContent = errorMessage;
    }
  } else {
    input.setAttribute('aria-invalid', 'false');
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.remove();
    }
  }
};

const validateForm = (form) => {
  let isValid = true;

  form.querySelectorAll('.form-input').forEach((input) => {
    validateFormField(input);
    if (input.getAttribute('aria-invalid') === 'true') {
      isValid = false;
    }
  });

  console.log('Form is valid:', isValid);
  return isValid;
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const form = event.target;

  if (!validateForm(form)) {
    console.error('Form validation failed');
    return;
  }

  const formData = Array.from(new FormData(form)).map(([name, value]) => ({ name, value }));

  console.log('Submitting form data:', formData);

  try {
    const response = await fetch('https://0211560d-577a-407d-94ab-dc0383c943e0.mock.pstmn.io/submitform', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    console.log('Response status:', response.status);

    if (!response.ok) throw new Error('Submission failed');

    const result = await response.json();
    console.log('Submission successful:', result);

    showToast();
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Your submission is invalid, please try again.');
  }
};

const init = () => {
  const form = document.getElementById('dynamicForm');
  form.addEventListener('submit', handleSubmit);

  form.querySelectorAll('.form-input').forEach((input) => {
    input.addEventListener('blur', () => validateFormField(input));
  });
};

init();