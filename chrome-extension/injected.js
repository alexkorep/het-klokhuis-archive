var subtitles = []

function insertSubsDiv () {
  //alert('11')
  var parent = document.getElementsByClassName('videoplayer-and-metadata')[0]
  //var insertBefore = document.getElementsByClassName('player-info')[0]

  // Create subs
  var div = document.createElement("div")
  //div.style.padding = "10px"
  div.style.height = '250px'
  div.style.overflowY = 'scroll'
  div.style.fontSize = '24px'
  div.style.lineHeight = 1.3
  div.id = 'subs-div'
  div.className = 'content-column full'
  //var t = document.createTextNode("Subs will be here")
  //div.appendChild(t);

  //document.getElementsByClassName('column-player-info')[0].innerHTML = 'https://tt888.omroep.nl/tt888/VPWON_1225329'
  parent.insertBefore(div, parent.children[1]);
}

function getSubtitlesUrl () {
  var components = window.location.href.split('/')
  var filename = components.pop()
  return 'https://tt888.omroep.nl/tt888/' + filename
}

function scrollTo (subtitleId) {
  var topPos = document.getElementById('inner-element').offsetTop;
  document.getElementById('container').scrollTop = topPos - 10;
}

function loadSubs () {
  var xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        parseSubtitles(this.responseText)
      } else {
        document.getElementById("subs-div").innerHTML = 'Error loading subtitles'
      }
    }
  }
  xhttp.open("GET", getSubtitlesUrl(), true)
  xhttp.send()
}

function appendSubDiv(text, id) {
  var div = document.createElement("div")
  div.style.paddingTop = "15px"
  div.id = id
  var t = document.createTextNode(text)
  div.appendChild(t);
  document.getElementById("subs-div").appendChild(div)
}

function timeToSeconds(time) {
  var a = time.split(':'); // split it at the colons
  var seconds = (+a[0])*60*60 + (+a[1])*60 + (+a[2])
  return seconds
}

function parseSubtitles (text) {
  var lines = text.split('\n')
  subtitles = []
  for (var i = 2; i < lines.length; i += 4) {
    var number = lines[i]
    var timerange = lines[i + 1]
    if (timerange) {
      var timeElements = timerange.split(' --> ')
      var text = lines[i + 2]
      var id = 'subs' + number
      subtitles.push({
        begin: timeToSeconds(timeElements[0]),
        end: timeToSeconds(timeElements[1]),
        text: text,
        id: id,
      })
      appendSubDiv(text, id)
    }
  }
  console.log(subtitles)
}

function boldSubtitle(time) {
  for (var i = 0; i < subtitles.length; i++) {
    var sub = subtitles[i]

    // Make default color
    var subElement = document.getElementById(sub.id)
    subElement.style.color = ''

    if (sub.begin <= time && time <= sub.end) {
      console.log(sub.id)

      // Make it green
      var subElement = document.getElementById(sub.id)
      subElement.style.color = 'green'

      // Scroll to element
      var topPos = document.getElementById(sub.id).offsetTop;
      document.getElementById('subs-div').scrollTop = topPos - 50;
    }
  }
}

var video = null

function subscribeVideoEvents () {
  var videoElem = document.getElementsByTagName('video')[0]
  if (!videoElem) {
    // Retry later
    return
  }

  if (video == videoElem) {
    // We have already subscribed to this element, ignote
    return
  }

  video = videoElem
  video.addEventListener("timeupdate", function() {
    var time = this.currentTime
    console.log(time)
    boldSubtitle(time)
  }, true);
}

console.log('loading subtitles...')
insertSubsDiv()
loadSubs()
//subscribeVideoEvents()
setInterval(subscribeVideoEvents, 2000)
console.log('done!')
