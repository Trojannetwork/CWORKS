/* === Contact Form — Validation + Submit Handling === */
/* TODO: Replace the submit handler with a real form endpoint
   (e.g. Formspree: https://formspree.io, or a custom backend).
   Current fallback: shows a success confirmation state in the UI. */

(function () {
  const forms = document.querySelectorAll('#contact-form, #explore-contact-form');
  if (!forms.length) return;

  forms.forEach(form => {
    const formId = form.id;
    const submitBtn = form.querySelector('button[type="submit"]');
    const successMsg = document.getElementById(formId === 'contact-form' ? 'form-success' : 'es-form-success');

    function showError(input, message) {
      const existing = input.parentNode.querySelector('.field-error');
      if (existing) existing.remove();

      const error = document.createElement('span');
      error.className = 'field-error';
      error.textContent = message;
      input.parentNode.appendChild(error);
      input.classList.add('input-error');
    }

    function clearError(input) {
      const existing = input.parentNode.querySelector('.field-error');
      if (existing) existing.remove();
      input.classList.remove('input-error');
    }

    function validateField(input) {
      const value = input.value.trim();

      if (input.required && !value) {
        showError(input, 'This field is required.');
        return false;
      }

      if (input.type === 'email' && value) {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(value)) {
          showError(input, 'Please enter a valid email address.');
          return false;
        }
      }

      clearError(input);
      return true;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let valid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

      inputs.forEach(input => {
        if (!validateField(input)) valid = false;
      });

      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value.trim() && !validateField(emailField)) {
        valid = false;
      }

      if (!valid) return;

      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';

      // Simulate submission — replace with real fetch() call to your endpoint
      // fetch('YOUR_FORM_ENDPOINT', { method: 'POST', body: new FormData(form) })
      setTimeout(() => {
        form.reset();
        form.style.display = 'none';
        if (successMsg) {
          successMsg.style.display = 'block';
        }
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 800);
    });

    // Live validation on blur
    form.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('blur', () => {
        if (input.value.trim() || input.required) {
          validateField(input);
        }
      });
    });
  });
})();
