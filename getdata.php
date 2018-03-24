<?php
$dir = __DIR__."/gallery";
$files = scandir($dir);
echo json_encode($files);
?>
