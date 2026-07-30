<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$tables = DB::select('SHOW TABLES');
$dbName = config('database.connections.mysql.database');
$keyName = 'Tables_in_' . $dbName;

$output = "-- GuildHall Database Backup Dump\n";
$output .= "-- Exported on: " . date('Y-m-d H:i:s') . "\n";
$output .= "-- Database: " . $dbName . "\n\n";
$output .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

foreach ($tables as $tableObj) {
    $table = $tableObj->$keyName;
    $create = DB::select("SHOW CREATE TABLE `$table`")[0]->{'Create Table'};
    $output .= "DROP TABLE IF EXISTS `$table`;\n" . $create . ";\n\n";

    $rows = DB::table($table)->get();
    foreach ($rows as $row) {
        $arr = (array) $row;
        $cols = array_map(fn($c) => "`" . $c . "`", array_keys($arr));
        $vals = array_map(function($v) {
            if (is_null($v)) return 'NULL';
            return DB::getPdo()->quote($v);
        }, array_values($arr));
        $output .= "INSERT INTO `$table` (" . implode(', ', $cols) . ") VALUES (" . implode(', ', $vals) . ");\n";
    }
    $output .= "\n";
}

$output .= "SET FOREIGN_KEY_CHECKS=1;\n";

$targetPath = __DIR__ . '/database/guildhall_database_dump.sql';
file_put_contents($targetPath, $output);

echo "==================================================\n";
echo " SUCCESS: Database exported to database/guildhall_database_dump.sql\n";
echo " File Size: " . round(filesize($targetPath) / 1024, 2) . " KB\n";
echo "==================================================\n";
