EmailJS setup
=================

1. Create an account at https://www.emailjs.com/ and log in.
2. Add an email service (e.g., Gmail, SMTP) and note the `service_id` (example: `service_xxx`).
3. Create two templates (one for contact, one for newsletter) and note each `template_id` (example: `template_contact`, `template_newsletter`).
   - Template variables used in the code: `from_name`, `phone`, `message`, `email`.
4. Get your `user_id` (also called public key) from the EmailJS dashboard.
5. Edit `index.php` and replace `YOUR_EMAILJS_USER_ID` with your `user_id`.
6. Edit `js/custom.js` and replace `YOUR_EMAILJS_SERVICE_ID`, `YOUR_CONTACT_TEMPLATE_ID`, and `YOUR_NEWSLETTER_TEMPLATE_ID` with the values from steps 2-3.
7. Optional: test in browser and verify emails are delivered. Check EmailJS logs for delivery status.

Security note: these values are public keys used by EmailJS to allow client-side sends. Do not embed secret SMTP credentials in client-side code.
