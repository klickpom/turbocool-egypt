<?php
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');

$html = file_get_contents(__DIR__ . '/index.html');
if ($html === false) {
  http_response_code(500);
  echo 'Missing index.html';
  exit;
}

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$path = ($path === null || $path === '') ? '/' : $path;
$path = preg_replace('#/+#', '/', $path);
if ($path !== '/') {
  $path = rtrim($path, '/') ?: '/';
}

$routesFile = __DIR__ . '/seo-routes.json';
$routes = is_file($routesFile) ? json_decode((string) file_get_contents($routesFile), true) : null;
$route = is_array($routes) && isset($routes[$path]) && is_array($routes[$path]) ? $routes[$path] : null;

if ($route && !empty($route['title']) && !empty($route['canonical'])) {
  $title = htmlspecialchars((string) $route['title'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
  $desc = htmlspecialchars((string) ($route['description'] ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
  $canonical = htmlspecialchars((string) $route['canonical'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

  $html = preg_replace('#<title>.*?</title>#s', '<title>' . $title . '</title>', $html, 1) ?? $html;
  $html = preg_replace('#<meta name="description" content="[^"]*"\s*/?>#', '<meta name="description" content="' . $desc . '" />', $html, 1) ?? $html;
  $html = preg_replace('#<link rel="canonical" href="[^"]*"\s*/?>#', '<link rel="canonical" href="' . $canonical . '" />', $html, 1) ?? $html;
  $html = preg_replace('#<meta property="og:title" content="[^"]*"\s*/?>#', '<meta property="og:title" content="' . $title . '" />', $html, 1) ?? $html;
  $html = preg_replace('#<meta property="og:description" content="[^"]*"\s*/?>#', '<meta property="og:description" content="' . $desc . '" />', $html, 1) ?? $html;
  $html = preg_replace('#<meta property="og:url" content="[^"]*"\s*/?>#', '<meta property="og:url" content="' . $canonical . '" />', $html, 1) ?? $html;
  $html = preg_replace('#<meta name="twitter:title" content="[^"]*"\s*/?>#', '<meta name="twitter:title" content="' . $title . '" />', $html, 1) ?? $html;
  $html = preg_replace('#<meta name="twitter:description" content="[^"]*"\s*/?>#', '<meta name="twitter:description" content="' . $desc . '" />', $html, 1) ?? $html;
}

echo $html;
