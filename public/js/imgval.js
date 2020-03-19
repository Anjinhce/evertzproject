var validExt = ".png, .gif, .jpeg ,.jpeg";
function imgExtValidate(fdata) {
 var filePath = fdata.value;
 var getFileExt = filePath.substring(filePath.lastIndexOf('.') + 1).toLowerCase();
 var pos = validExt.indexOf(getFileExt);
 if(pos < 0) {

    swal({
        title: "Image  Extention Error",
        text: "Allowed image .png, .gif, .jpeg, .jpg",
        icon: "error",
      });
      
 	
 	return false;
  } else {
  	return true;
  }
}




var maxSize = '1024';
function imgSizeValidate(fdata) {
	 if (fdata.files && fdata.files[0]) {
                var fsize = fdata.files[0].size/1024;
                if(fsize > maxSize) {

                    swal({
                        title: "Image Size Error",
                        text: "Maximum image size exceed, 1 MB file is allowed ",
                        icon: "error",
                      });
                       return false;
                } else {
                	return true;
                }
     }
 }


 