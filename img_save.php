<?php

   $img = $_POST['data'];
     $img=substr($img, strpos($img, ",")+1);

     $img=base64_decode($img);

      $file = 'gallery/'.date("YmdHis").'.png';

      if (file_put_contents($file, $img)) {
         echo "The canvas was saved as $file.";
      } else {
         echo 'The canvas could not be saved.';
      }



?>
