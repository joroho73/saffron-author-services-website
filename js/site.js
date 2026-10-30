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

// Track link clicks in Google Analytics.
document.addEventListener("click", (event) => {
  const link = event.target.closest("a");

  if (!link || typeof window.gtag !== "function") return;

  const href = link.getAttribute("href");

  // Ignore empty links and jumps within the current page.
  if (!href || href.startsWith("#")) return;

  const url = new URL(href, window.location.href);
  const book = link.closest("article.book");

  let linkType = "internal";

  if (url.protocol === "mailto:") {
    linkType = "email";
  } else if (url.protocol === "tel:") {
    linkType = "phone";
  } else if (url.hostname !== window.location.hostname) {
    linkType = "external";
  }

  window.gtag("event", "site_link_click", {
    link_text:
      link.dataset.trackLabel ||
      link.textContent.trim() ||
      link.querySelector("img")?.alt ||
      link.getAttribute("aria-label") ||
      "Unnamed link",
    link_url: url.href,
    link_type: linkType,
    page_path: window.location.pathname,
    book_title: book?.querySelector("h2")?.textContent.trim() || undefined,
  });
});
