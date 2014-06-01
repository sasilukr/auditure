  $( document ).ready(function() {

    auth_code = "Zjk0ZmE3NzktMWQ4ZS00NzVmLWJjYTQtMDM0NWUxM2JkZDZhOmY2ODA3M2U0ZjFmYTcwODdjOWQ4MmQwYw==";
    accessToken = "415d948e3186d5837bbd79f2";

    $( "#searchButton" ).click(function() {
        var searchTerm = document.getElementById('searchme').value;
        console.log("Searching for " + searchTerm);
        //PMP api
        searchPMP(searchTerm);

        //instagram api
        $.ajax({
          url       :   'https://api.instagram.com/v1/tags/' + searchTerm + '/media/recent?client_id=4aaadeb36d09416d8e81253ad0bdb661&count=20&callback=?',
          dataType  :   'json', 
          success   :   function(data){
            $('#blindify-list').empty();
            for(var i=0; i < data['data'].length; i++){
              $('#blindify-list').append('<li><img src="'+ data['data'][i]['images']['standard_resolution']['url']+'"></li>');
            } 
            console.log("added instagram images");

            $('#blindify').blindify({
              numberOfBlinds: 20,
              margin: 1,
              gapHeight: 0,
              animationSpeed: 600,
              delayBetweenSlides: 150,
              orientation: 'vertical',
              width: 640,
              height: 640
            });
          }
        });
      });
  });

  function getAccessToken() {
    $.ajax({
    url: 'https://api-pilot.pmp.io/auth/access_token',
    type: 'POST',
    dataType: 'json',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + auth_code},
    success: function(data) {
      console.log("Updated Note " + JSON.stringify(data));
    },
    error: function (error) {
      console.log("Error getting access token" + JSON.stringify(error));
    }});
  }

  function searchPMP(key) {
    var pmpURL = "https://api-pilot.pmp.io/docs?limit=10&text="+key+"&profile=audio";
    $.ajax({
    url: pmpURL,
    dataType: 'json',
     headers: {
      "Content-Type": "application/vnd.pmp.collection.doc+json",
      "Authorization": "Bearer " + accessToken},
    success: function(data) {
      console.log("PMP Search Response" + (data));

      var audioDocUrl = data.links.item[0].href;
      getAudio(audioDocUrl);
    },
    error: function (error) {
      console.log("Error searching pmp" + JSON.stringify(error));
    }});
  }

  function getAudio(audioUrl) {
    // audioUrl = "https://api-pilot.pmp.io/docs/be8ba3b2-dfe2-4caa-8dc6-f1927fd3a148";
    $.ajax({
    url: audioUrl,
    dataType: 'json',
    headers: {
      "Content-Type": "application/vnd.pmp.collection.doc+json",
      "Authorization": "Bearer " + accessToken},
    success: function(data) {
      var title = data.attributes.title;
      var description = data.attributes.description;
      console.log("Title " + title);
      console.log("Description " + description);
      $("#audioTitle").text(title);
      $("#audioDescription").text(description);
      var audioUrl = data.links.enclosure[0].meta.api.href;
      console.log("Audio Doc Link:" + audioUrl);
      downloadAudioDoc(audioUrl);
    },
    error: function (error) {
      console.log("Error getting audio" + JSON.stringify(error));
    }});
  }

  function downloadAudioDoc(audioUrl) {
    $.ajax({
    url: audioUrl,
    dataType: 'jsonp',
    success: function(data) {
      console.log("working");
      var keys = Object.keys(data);
      console.log("Key " + keys);
      var audioFile = data[keys[0]].podcast.http_file_path;
      console.log("Audio File Link:" + audioFile);
      createAudioTag(audioFile);
    },
    error: function (error) {
      console.log("Error getting audio" + JSON.stringify(error));
    }});

  }

  function createAudioTag(audioFile){
    // audioFile = "http://play.publicradio.org/pmp/d/podcast/marketplace/segments/2014/05/19/marketplace_segment1_20140519_64.mp3";
    var audioTag = $("<audio controls autoplay preload class='mejs-player' src='"+audioFile+"'>"+
      // "<source id='audiotag1' type='audio/mp3' src='"+audioFile+"'>"+
      "</audio>");
    $("#sandbox-container").empty();
    $("#sandbox-container").append(audioTag);
    $('audio').mediaelementplayer({
      features: ['playpause','progress','volume'],
      audioWidth: 340
    });
  }
      