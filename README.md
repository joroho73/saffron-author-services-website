# Saffron Author Services

Static, multi-page website using the original logo, palette and Cormorant Garamond/Lato typography.

## Pages
- `index.html`: introduction, services overview and process.
- `services.html`: five services, quoting approach and FAQ.
- `books.html`: clearly labelled portfolio placeholders.
- `about.html`: John Howard biography and portrait placeholder.
- `contact.html`: validated enquiry form that prepares a mailto email, with a copyable fallback.

## Before launch
Replace book entries with confirmed titles, author names, contributions and authorised cover images. Replace the portrait placeholder when a photograph is available.

The contact form does not deliver email or store submissions. It opens the visitor's email app and displays a copyable draft. Direct delivery needs a configured backend/mail provider and an appropriate privacy notice. Do not relabel the button as Send until that integration exists.

The existing Google Analytics measurement ID is preserved. Existing hosting deployment remains `./deploy.sh` using the locally configured `saffron` SSH host. This branch has not been deployed to the custom domain.

## Checks
Run `node --check js/site.js`. Preview through a static web server and check navigation, FAQ expansion, required-field validation and email draft generation. No package installation or build is required.
