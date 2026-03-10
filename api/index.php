<?php
define('LARAVEL_START', microtime(true));

$basePath = __DIR__ . '/../backend';
$autoload = $basePath . '/vendor/autoload.php';
$bootstrap = $basePath . '/bootstrap/app.php';

if (!file_exists($autoload)) {
    die("Bridge Error: Autoload file not found at $autoload");
}

// Override SCRIPT_NAME so Symfony computes BaseUrl='' and PathInfo='/api/...'
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = __DIR__ . '/index.php';

require $autoload;
$app = require_once $bootstrap;

$app->handleRequest(Illuminate\Http\Request::capture());
