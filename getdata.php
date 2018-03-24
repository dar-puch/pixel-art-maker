<?php
$dir = __DIR__ "/gallery";
$files = scandir($dir,1);
echo json_encode($files);
?>
