<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Pin');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$file = __DIR__ . '/catalog-data.json';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function read_store($file) {
  if (!is_file($file)) {
    return ['ok' => true, 'payload' => null];
  }
  $raw = file_get_contents($file);
  $data = json_decode($raw, true);
  return is_array($data) ? $data : ['ok' => true, 'payload' => null];
}

function write_store($file, $payload) {
  $payload['updatedAt'] = (int) round(microtime(true) * 1000);
  $out = json_encode(['ok' => true, 'payload' => $payload], JSON_UNESCAPED_UNICODE);
  if ($out === false) {
    return false;
  }
  return file_put_contents($file, $out, LOCK_EX) !== false;
}

function valid_pin($pin) {
  $pin = strtolower(trim((string) $pin));
  return in_array($pin, ['turbo2026', '1234', 'admin'], true);
}

if ($method === 'GET') {
  $store = read_store($file);
  echo json_encode($store, JSON_UNESCAPED_UNICODE);
  exit;
}

if ($method !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'method']);
  exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'json']);
  exit;
}

$action = $data['action'] ?? 'save-catalog';
$store = read_store($file);
$current = is_array($store['payload'] ?? null) ? $store['payload'] : [
  'products' => [],
  'services' => [],
  'settings' => new stdClass(),
  'coupons' => [],
  'orders' => [],
];

if ($action === 'add-order') {
  $order = $data['order'] ?? null;
  if (!is_array($order) || empty($order['id'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'order']);
    exit;
  }
  $orders = is_array($current['orders'] ?? null) ? $current['orders'] : [];
  $orders = array_values(array_filter($orders, function ($item) use ($order) {
    return ($item['id'] ?? '') !== ($order['id'] ?? '');
  }));
  array_unshift($orders, $order);
  $current['orders'] = array_slice($orders, 0, 200);
  if (!write_store($file, $current)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'write']);
    exit;
  }
  echo json_encode(['ok' => true, 'updatedAt' => $current['updatedAt']]);
  exit;
}

$pin = $data['pin'] ?? ($_SERVER['HTTP_X_ADMIN_PIN'] ?? '');
if (!valid_pin($pin)) {
  http_response_code(401);
  echo json_encode(['ok' => false, 'error' => 'pin']);
  exit;
}

$payload = $data['payload'] ?? null;
if (!is_array($payload)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'payload']);
  exit;
}

$next = [
  'products' => is_array($payload['products'] ?? null) ? $payload['products'] : ($current['products'] ?? []),
  'services' => is_array($payload['services'] ?? null) ? $payload['services'] : ($current['services'] ?? []),
  'settings' => is_array($payload['settings'] ?? null) ? $payload['settings'] : ($current['settings'] ?? new stdClass()),
  'coupons' => is_array($payload['coupons'] ?? null) ? $payload['coupons'] : ($current['coupons'] ?? []),
  'orders' => is_array($payload['orders'] ?? null) ? $payload['orders'] : ($current['orders'] ?? []),
];

if (!write_store($file, $next)) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'write']);
  exit;
}

echo json_encode(['ok' => true, 'updatedAt' => $next['updatedAt']]);
