$(document).ready(function () {
  
  
  /*
  Getting info about projects and appending into page(bad realization,sorry)
  */
  $.get('main/controllers/handler.php', {
    getProjects: 1
  }).done(function (responce) {
    let resp = JSON.parse(responce);
    resp.forEach(element => {
      $('.wrapper').append(
        `<div id="project_` + element.id + `" class="col s12 m12">
          <div id="` + element.id + `" class="card hoverable">
            <span class="card-title">` + element.name + `
              <button id="add_` + element.id + `" class="add_photos waves-effect waves-light btn-floating btn-small"><i class="material-icons">add</i></button>
              <form hidden="true"  id="photos_` + element.id + `" method="post" enctype="multipart/form-data">
              <div class="file-field input-field">
                <div class="btn">
                  <span>File</span>
                  <input type="file" id="file" multiple >
                </div>
                <div class="file-path-wrapper">
                  <input class="file-path validate" type="text" placeholder="Upload one or more files">
                </div>
              </div>
            <input type="submit" value="Save" id="` + element.id + `" class="sendPhotos modal-close waves-effect waves-green  green darken-2 btn-small"></input>
            </form>
            </span>
            <div id="errors_` + element.id + `"></div>
            <a id="view_` + element.id + `" class="view_photos left green darken-2 waves-effect waves-green btn-small">
              View photos
            </a>
            
        <div id="images_` + element.id + `"  class="card-content  row  photo_wrapper">
            
            
        </div>
        <div class="card-action">
            <span>Created:` + element.created + `</span>
            <a id="` + element.id + `" class="delete_project right"><i class="material-icons">
                    delete
                </i></a>
        </div>
    </div>
    </div>`)
    });
  })



  /*
  Initializing Materialize components, See: https://materializecss.com/getting-started.html
  */
  $('.materialboxed').materialbox();
  $('.modal').modal();


  /*
  Show form for uploading images
  */
  $(document).on("click", '.add_photos', function () {
    let id = $(this).attr('id')
    $('#photos_'+id.split('_')[1]).show()
    $('#' + id).hide()
  })


  /*
  Sending photos using form data
  */
  $(document).on("click", ".sendPhotos", function (e) {
    e.preventDefault();
    let id = $(this).attr('id')
    var data = new FormData($('#photos_'+id));
    $.each($('#photos_'+id)[0][0].files, function (i, file) {
      data.append('file-' + i, file);
    });
    data.append("addPhotos", id)
    $.ajax({
      type: "POST",
      url: 'main/controllers/handler.php',
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST',
    }).then(function(responce){
      let error = ''
      if(isNaN(responce)){
        $('#errors_'+id).append(`<p class="flow-text">Error:`+JSON.parse(responce).join(',')+`- duplicating files</p>`)
      }
    })
    /*
    UI manipulatios
    */
    $('#photos_'+id).hide();
    $('#add_'+id).show();
    $('#view_'+id).show();
    $('#images_'+id).empty();
  });




  /*
  Deleting Photo
  */
  $(document).on('click', '.delete_photo', function(){
    let id = $(this).attr('id');
    $.post('main/controllers/handler.php', {
      contentType: "application/json; charset=utf-8",
      deletePhoto: id.split('_')[1],
      project_id : $(this).parent().parent().parent().attr('id').split('_')[1]
    });
    $(this).parent().parent().remove();
  })



  /*
  Sending request to get list of photos, then  appending to wrapper
  */
  $(document).on('click','.view_photos',function(){
    let id = $(this).attr('id').split('_')[1]
    $.get('main/controllers/handler.php',
    {getPhotos:id}).done(function(responce){
      if(!isNaN(responce)){
        $('#images_'+id).append(`<p class="red">No Photos Found</p>`)
      }else{
        JSON.parse(responce).forEach(element =>{
        $('#images_'+id).append(`
        <div class="card col s6 m4 l2">
          <div class="card-image" >
              <img class=" materialboxed"   src="`+ element.path +`">
          </div>
          <div class="card-action">
            <a id="photo_`+element.id+`" class="delete_photo">
                <i class="material-icons">
                  delete_forever
                </i>
            </a></div>
        </div>
        `)
        })
      }
      $(document).ready($('.materialboxed').materialbox())
    })
    
    $(this).hide();
  })


  /*
  Sending info about new project
  */
  $('#sendProject').click(function () {
    let date = new Date();
    let data = {
      name: $('#project_name').val(),
      created: date.toISOString()
    }
    $.post('main/controllers/handler.php', {
      contentType: "application/json; charset=utf-8",
      addProject: JSON.stringify(data)
    })
    location.reload();
  })



  /*
  Deleting project
  */
  $(document).on('click', '.delete_project', function () {
    let id = $(this).attr('id')
    $.post('main/controllers/handler.php', {
      contentType: "application/json; charset=utf-8",
      deleteProject: id
    })
    $('#project_' + id).remove()
  });
});