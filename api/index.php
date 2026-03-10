<?php
define('LARAVEL_START', microtime(true));

// Paths relative to Hostinger structure (locally: ../backend)
$autoload = __DIR__.'/../backend/vendor/autoload.php';
$bootstrap = __DIR__.'/../backend/bootstrap/app.php';

if (!file_exists($autoload)) {
    die("Bridge Error: Autoload file not found at $autoload");
}

require $autoload;
$app = require_once $bootstrap;

$request = Illuminate\Http\Request::capture();

// FORCE Laravel to see the /api prefix by clearing the auto-detected BaseUrl
// This makes the PathInfo include "/api/..." which matches the 'api' routes
$request->setBaseUrl('');

$app->handleRequest($request);
