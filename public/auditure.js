  $( document ).ready(function() {
    auth_code = "Zjk0ZmE3NzktMWQ4ZS00NzVmLWJjYTQtMDM0NWUxM2JkZDZhOmY2ODA3M2U0ZjFmYTcwODdjOWQ4MmQwYw==";
    accessToken = "415d948e3186d5837bbd79f2";
    searchPMP("water");
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
    var audioTag = $("<audio controls><source id='audiotag1' type='audio/mp3'" +
      "src='"+audioFile+"'></audio>");
    $("#sandbox-container").append(audioTag);
  }
      