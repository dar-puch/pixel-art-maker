$(function() {
  let dir = "gallery/";
  let fileextension = ".png";
  let names = [];
  let restNames = [];
  let showed = false;
    const colorInput = $('#colorPicker');
    const widthInput = $('#input_width');
    const heightInput = $('#input_height');
    const resizeInput = $('#pixel_resize');
    let initialCellColor = 'rgba(0, 0, 0, 0)'; //set color for empty cells
    let containerWidth = $('.canvas').width();
    resizeInput.val('20'); //default values
    widthInput.val('10');
    heightInput.val('10');
    colorInput.val('rgba(0, 0, 0, 1)') //reset color picker

    let maxWidth = Math.floor(containerWidth/resizeInput.val());
    widthInput.attr({'max': maxWidth});
    $('#input_width').on('input', function(){
      if (widthInput.val() > maxWidth) {
        widthInput.val(maxWidth);
      }
    }); //set grid's max not larger than available space

    function cellResize(numCells, cellResize) {
      let maxCellSize = Math.floor(containerWidth/numCells);
      resizeInput.attr({'max': maxCellSize});
      if (cellResize <= maxCellSize) {
        $('td').css({'width': cellResize + 'px', 'height': cellResize + 'px'});
        $('tr').css({'height': cellResize + 'px'});
      }
      else {
        $('td').css({'width': maxCellSize + 'px', 'height': maxCellSize + 'px'});
        $('tr').css({'height': maxCellSize + 'px'});
      }
    } //prevent loosing cell's square shape


//make grid
  $('#sizePicker').submit(function makeGrid(evt) {
      evt.preventDefault(); //prevent page reload
      let width = widthInput.val();
      let height = heightInput.val();
      $('#pixel_canvas').empty();
      $('.info').empty();
      for (let i=1; i<=height; i++) {
        $('#pixel_canvas').append('<tr></tr>'); //make rows
      }
      for (let y=1; y<=width; y++){
        $('#pixel_canvas tr').append('<td class="clear"></td>'); //make cells
      }
      cellResize(widthInput.val(),resizeInput.val());
      $('#save').css('display', 'block');
  }); //end makeGrid

  //cellResize
  $('#pixel_resize').change(function() {
    cellResize(widthInput.val(),resizeInput.val())
  });
//end cellResize

  //coloring
  $('#pixel_canvas').on('click', 'td', function() {
    let pickerColor = colorInput.val();
    if($(this).hasClass('clear')) {
      $(this).css({'background-color': pickerColor});
      $(this).removeClass('clear');
    } //color cell only if it's clear
    else {
      $(this).addClass('clear');
      $(this).css({'background-color': ''}); // if colored, clear
    }
  }); //end of coloring

//continous
  let down = false;
  $('#pixel_canvas').mousedown(function(event){
    event.preventDefault();
    down = true;
  });
  $('#pixel_canvas').mouseup(function(){
    down = false;
      });

  $('#pixel_canvas').on('mouseenter', 'td', function() {
    if(down){ //colors only when mouse button is pressed
        let pickerColor = colorInput.val();
        if($(this).hasClass('clear')) {
          $(this).css({'background-color': pickerColor});
          $(this).removeClass('clear');
        } //color cell only if it's clear
        else {
          $(this).addClass('clear');
          $(this).css({'background-color': ''}); // if colored, clear
        }
    }

  }); //end continous

//save

$('#save').click(function(){
  let empty = function () {
    $('.info').fadeOut(2000);
    setTimeout(function(){$('.info').empty('text')}, 4000);
  };

  let info = function (text) {
    $('.info').fadeIn(2000);
    $('.info').text(text);

  }
  let imageTable = $('#pixel_canvas').html;
  console.log('imageTable: ' + imageTable);
    domtoimage.toPng(document.getElementById('pixel_canvas')).then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        $.post('img_save.php', {data: img.src});
setTimeout(empty, 5000);
info('Your image was succesfully saved to gallery');
$(".images").prepend("<div class='image-box'><img src='" + img.src + "'/></div>");
}).catch(function () {
  setTimeout(empty, 5000);
  info('Image could not be saved');
});

  }); //end save

//load images
function makeHtml(array, show) { //show parameter is for data-show attribute, which marks showed files (for show/hide functionality)
  let imagesHtml = "";
  for (let i=0; i<array.length; i++){
    imagesHtml = imagesHtml + "<div class='image-box' data-show='"+ show + "'><img src='" + dir + array[i] + "'/></div>"
  }
  return imagesHtml;
}

$.get("getdata.php", function(data){ //output of getdata.php is an array of file names as strings
  let added;
  files = JSON.parse(data);
   $.each(files, function (i, val) {
     if(i>1) { //we leave first two values as they are '.' and '..', not image files
      names.unshift(val); //add received filanames to an array
      }
});
//end each

if (names.length > 6){ //show only first 6 from array
  restNames = names.splice(6);
  $('#show').css('display', 'block');
}

  $(".images").append(makeHtml(names, 'names'))



$('#show').click(function(){ //when cliked 'show more', show the rest;
  if(showed === false){
  $(".images").append(makeHtml(restNames, 'restNames'));
  $('#show').text('Show less');
  showed = true;
  added = $('.image-box[data-show="restNames"]');
}
else {
  added.remove();
  showed = false;
  $('#show').text('Show more');
}
}) //end click

}); //end get



 //end load images

}); //end document.ready wrap
