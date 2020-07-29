var isStarted = false;
function processRecording(action) {
  var type = $("#ai-listen-type").val();

  if(action == 'start'){

    Swal.fire({
      title: '',
      text: "Are you sure you want to start recording?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, start recording!'
    }).then((result) => {
      if (result.value) {
        isStarted = true;
        $("#ai-start-btn").hide();
        $("#ai-stop-btn").show();

      }
    })
  }else {
    Swal.fire({
      title: '',
        text: "Are you sure you want to stop recording?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, stop recording!'
    }).then((result) => {
      if (result.value) {
        isStarted = false;
        $("#ai-start-btn").show();
        $("#ai-stop-btn").hide();
      }
    })

  }

}
