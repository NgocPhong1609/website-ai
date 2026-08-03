<?php
$pdo = new PDO('mysql:host=127.0.0.1;dbname=du_an_tot_nghiep;charset=utf8mb4', 'root', '');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$hash = password_hash('Admin123!', PASSWORD_BCRYPT);
$now = date('Y-m-d H:i:s');
$stmt = $pdo->prepare('INSERT INTO users (name, email, email_verified_at, password, google_id, avatar_url, status, last_login_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
$stmt->execute(['Administrator', 'admin@mindnova.ai', $now, $hash, null, null, 'active', $now, $now, $now]);
$id = $pdo->lastInsertId();
$stmt2 = $pdo->prepare('INSERT INTO role_user (user_id, role_id) VALUES (?, ?)');
$stmt2->execute([$id, 1]);
echo "created user id=$id\n";
