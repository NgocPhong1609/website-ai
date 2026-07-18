<?php
$pdo = new PDO('mysql:host=127.0.0.1;dbname=du_an_tot_nghiep;charset=utf8mb4', 'root', '', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

echo "MIGRATIONS:\n";
$stmt = $pdo->query('select id, migration, batch from migrations order by id');
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo $row['id'] . '|' . $row['migration'] . '|' . $row['batch'] . "\n";
}

echo "\nTABLES:\n";
$stmt = $pdo->query("select table_name from information_schema.tables where table_schema='du_an_tot_nghiep' order by table_name");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo $row['table_name'] . "\n";
}

echo "\nUSERS COLUMNS:\n";
$stmt = $pdo->query("select column_name from information_schema.columns where table_schema='du_an_tot_nghiep' and table_name='users' order by ordinal_position");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo $row['column_name'] . "\n";
}

echo "\nCOURSES COLUMNS:\n";
$stmt = $pdo->query("select column_name from information_schema.columns where table_schema='du_an_tot_nghiep' and table_name='courses' order by ordinal_position");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo $row['column_name'] . "\n";
}
