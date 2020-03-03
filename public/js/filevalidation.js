var validExt = ".png, .gif, .jpeg, .jpg, .pdf, .doc, .docx, .txt";
function fileExtValidate(fdata) {
 var filePath = fdata.value;
 var getFileExt = filePath.substring(filePath.lastIndexOf('.') + 1).toLowerCase();
 var pos = validExt.indexOf(getFileExt);
 if(pos < 0) {

    swal({
        title: "File Extention Error",
        text: "Allowed Files .png, .gif, .jpeg, .jpg, .pdf, .doc, .docx, .txt",
        icon: "error",
      });
      
 	
 	return false;
  } else {
  	return true;
  }
}




var maxSize = '1024';
function fileSizeValidate(fdata) {
	 if (fdata.files && fdata.files[0]) {
                var fsize = fdata.files[0].size/1024;
                if(fsize > maxSize) {

                    swal({
                        title: "File Size Error",
                        text: "Maximum file size exceed, 1 MB file is allowed ",
                        icon: "error",
                      });
                       return false;
                } else {
                	return true;
                }
     }
 }


 