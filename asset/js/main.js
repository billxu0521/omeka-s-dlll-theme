$(function() {
    $('#universeviewer').change(function() {
      var _check = $(this).prop('checked');
      console.log(_check);
      if(_check == true){
          $('.universal-viewer').css('display','block');
      }else{
          $('.universal-viewer').css('display','none');
      }
  });
});