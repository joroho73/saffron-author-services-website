(() => {
  function initialiseContactForm() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("formStatus");

    if (!form || !status) return;

    const button = form.querySelector('button[type="submit"]');
    let sending = false;

    const showStatus = (message, success) => {
      status.textContent = message;
      status.className = `form-status ${success ? "success" : "error"}`;
    };

    const outcome = new URLSearchParams(window.location.search).get("enquiry");

    if (outcome === "sent") {
      showStatus(
        "Thank you. Your enquiry has been sent. I’ll be in touch soon.",
        true
      );
    } else if (outcome === "error") {
      showStatus(
        "Your enquiry could not be sent. Please try again or email saffronauthorservices@gmail.com.",
        false
      );
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (sending || !form.reportValidity()) return;

      sending = true;
      const originalLabel = button?.textContent;

      if (button) {
        button.disabled = true;
        button.textContent = "Sending…";
      }

      form.setAttribute("aria-busy", "true");
      status.textContent = "Sending your enquiry…";
      status.className = "form-status";

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: {
            Accept: "application/json",
          },
        });

        const result = await response.json();

        if (!response.ok || result.success !== true) {
          showStatus(
            result.message ||
              "Your enquiry could not be sent. Please email saffronauthorservices@gmail.com.",
            false
          );
          return;
        }

        showStatus(result.message, true);
        form.reset();

        // Track successful submissions without including personal details.
        try {
          if (typeof window.gtag === "function") {
            window.gtag("event", "contact_form_submit", {
              event_category: "contact",
              event_label: "Contact Form",
            });
          }
        } catch {
          // The enquiry was sent even if analytics failed.
        }
      } catch {
        showStatus(
          "We couldn’t confirm whether your enquiry was sent. Your text is still here. Please email saffronauthorservices@gmail.com if you need help.",
          false
        );
      } finally {
        sending = false;
        form.removeAttribute("aria-busy");

        if (button) {
          button.disabled = false;
          button.textContent = originalLabel;
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiseContactForm);
  } else {
    initialiseContactForm();
  }
})();