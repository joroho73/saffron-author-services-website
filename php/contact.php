<?php
// Keep this file at /php/contact.php. Do not add output before <?php.
function respond($success, $message, $status = 200)
{
    header('Cache-Control: no-store');
    if (strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false) {
        http_response_code($status);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['success' => $success, 'message' => $message]);
    } else {
        // Standard form posts must not leave visitors on the PHP endpoint.
        $outcome = $success ? 'sent' : 'error';
        header('Location: /contact.html?enquiry=' . $outcome . '#formStatus', true, 303);
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(false, 'Please submit the contact form.', 405);
}

function field($key, $limit)
{
    $value = $_POST[$key] ?? '';
    if (!is_string($value) || preg_match('//u', $value) !== 1) {
        respond(false, 'Please check the form fields and try again.', 422);
    }
    $value = trim($value);
    $length = function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : preg_match_all('/./us', $value);
    if ($length > $limit) {
        respond(false, 'One of the fields is too long. Please shorten it and try again.', 422);
    }
    return $value;
}

$name = field('name', 100);
$email = field('email', 200);
$title = field('title', 200);
$service = field('service', 200);
$message = field('message', 5000);

if ($name === '' || $email === '' || $message === '') {
    respond(false, 'Please complete your name, email address and message.', 422);
}
if (preg_match('/[\r\n]/', $email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Please enter a valid email address.', 422);
}

$to = 'saffronauthorservices@gmail.com';
$subject = 'New SAS website enquiry';
$body = "New enquiry from the Saffron Author Services website\n\n"
    . "Name: $name\nEmail: $email\n"
    . 'Book title: ' . ($title !== '' ? $title : 'Not yet titled') . "\n"
    . "Help needed: $service\n\nMessage:\n$message\n";
$headers = [
    'From: Saffron Author Services <no-reply@saffronauthorservices.com>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
];

// Preserve the hosting mail setup that is already working.
$sent = @mail($to, $subject, $body, implode("\r\n", $headers));
if ($sent) {
    respond(true, 'Thank you. Your enquiry has been sent. I’ll be in touch soon.');
}
error_log('Saffron contact form: mail() returned false.');
respond(false, 'Sorry, your enquiry could not be sent. Please email saffronauthorservices@gmail.com.', 500);
