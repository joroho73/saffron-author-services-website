const form = document.querySelector('#enquiry-form');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const subject = 'Book enquiry: ' + (data.get('title') || data.get('service'));
  const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nBook: ${data.get('title') || 'Not yet titled'}\nHelp needed: ${data.get('service')}\n\n${data.get('message')}`;
  document.querySelector('#email-draft').value = body;
  document.querySelector('#email-fallback').hidden = false;
  document.querySelector('#form-status').textContent = 'Your email draft is ready. Send it from your email app to complete your enquiry. If it doesn’t open, copy the draft below.';
  window.location.href = `mailto:saffronauthorservices@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
