<?php
$db = new PDO('mysql:host=127.0.0.1;dbname=du_an_tot_nghiep;charset=utf8mb4', 'root', '');
foreach (glob(__DIR__ . '/database/migrations/*.php') as $f) {
    $name = basename($f);
    $content = file_get_contents($f);
    preg_match_all('/Schema::(create|table)\(\s*["\']([^"\']+)["\']/', $content, $m);
    $tables = array_unique($m[2]);
    $exists = [];
    foreach ($tables as $table) {
        $stmt = $db->prepare('select 1 from information_schema.tables where table_schema = ? and table_name = ? limit 1');
        $stmt->execute(['du_an_tot_nghiep', $table]);
        $exists[$table] = $stmt->fetchColumn() ? 'Y' : 'N';
    }
    echo $name . ' | ' . implode(',', $tables) . ' | ' . implode(',', array_map(function($t, $v){ return "$t:$v"; }, array_keys($exists), $exists)) . "\n";
}
