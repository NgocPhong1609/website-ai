<?php $pdo = new PDO('mysql:host=127.0.0.1', 'root', '210606'); $pdo->exec('CREATE DATABASE IF NOT EXISTS du_an_testing;'); echo 'Testing database created.\n';
