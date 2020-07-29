var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();
recognition.continuous = true;
let content = "";

recognition.onresult = async function (event) {
  console.log(event.results[event.results.length - 1][0].transcript);
  content += event.results[event.results.length - 1][0].transcript + "\n";
};

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
        recognition.start();
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
        download(content, 'extract.txt','UTF8')
        content = ""
        recognition.stop()
        saveRecording();
      }
    })

  }

}

function saveRecording() {

  Swal.fire({
  title: '<strong>Recording has been saved!</strong>',
  icon: 'success',
  html:
    `
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="ai-send-teams">
      <label class="form-check-label" for="ai-send-teams">
        Send to MS Teams?
      </label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="ai-send-outlook">
      <label class="form-check-label" for="ai-send-outlook">
        Send to Outlook?
      </label>
    </div>
    <a   class="generate-btn mt-5" onclick="generateMeetingNotes()" >Generate Meeting Notes</a>

    `,
  showCloseButton: true,
  showCancelButton: false,
  showConfirmButton : false ,
  focusConfirm: false,
  allowOutsideClick : false

})
}


function generateMeetingNotes() {

  var teamsCheck = $("#ai-send-teams").is(':checked');
  var outlookCheck =   $("#ai-send-outlook").is(':checked');

  if(teamsCheck){
    teamsCheck = 1;
  }else {
    teamsCheck = 0;
  }

  if(outlookCheck){
    outlookCheck = 1;
  }else {
    outlookCheck = 0;
  }

  var data = {
    "title":"Weekly Status Report Meeting",
    "to":"j.t.fabella.iii@accenture.com",
    "agenda":"Status of Secretary Kim work unit and other items or announcements",
    "notes":["Unit testing of requirement number 1 has been completed.","Code build of requirement number 2 started last July 27.","One outstanding issue with regards to third party integration.","Upcoming server upgrade on August 1 and 2."],
    "actions":["Unit testing of requirement number 1 – lead review in progress c/o Cherry.","Reach out to Tech team for third party integration issue c/o Jack.","Prepare prerequisites and post validation instructions for server upgrade."],
    "email":outlookCheck,
    "teams":teamsCheck
   };

    swalLoading("Generating meeting notes.. Please wait..")
    axios.post('https://prod-29.westus.logic.azure.com:443/workflows/d1de48e4562a45b38517262417b3e152/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=y1jVGpHfiwY702l9XgZDG6p6d84LDyEYjTXnOA4uULU' , data)
    .then(function (response) {
      console.log(response);
      if(response.status == '202'){
        swalSuccess("Meeting notes has been sent.");
      }else {
        swalError("An error occured. Please try again.")
      }
    }).catch(function (error) {

    });
}


function swalLoading(message) {
    let timerInterval
    swal.fire({
        title: '',
        html: '<div class="nv-swal-message-holder"><h5 class="text-dark">'+message+'</h5></div>',

        onBeforeOpen: function()  {
            Swal.showLoading()
        },
        allowOutsideClick : false
    }).then(function(response) {})
    $(".swal2-height-auto").removeClass();
}
function swalSuccess(message ) {
  var html ;
  html = '<div class="nv-swal-message-holder"><h5 class="text-dark">'+message+'</h5></div>';

    Swal.fire({
        allowOutsideClick : false ,
        allowEscapeKey : false ,
        icon : 'success' ,
        title: '',
        html: html
    })
      $(".swal2-height-auto").removeClass();
}
function download(data, filename, type) {
  var file = new Blob([data], {type: type});
  if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
      var a = document.createElement("a"),
              url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
      }, 0);
  }
}
