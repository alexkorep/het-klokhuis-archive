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

function appendSubDiv(num, text) {
  var div = document.createElement("div")
  div.style.paddingTop = "15px"
  div.id = 'subs' + num
  var t = document.createTextNode(text)
  div.appendChild(t);
  document.getElementById("subs-div").appendChild(div)
}

function parseSubtitles (text) {
  var lines = text.split('\n')
  subtitles = []
  for (var i = 2; i < lines.length; i += 4) {
    var number = lines[i]
    var timerange = lines[i + 1]
    var text = lines[i + 2]
    subtitles.push({
      timerange: timerange,
      text: text,
    })
    appendSubDiv(number, text)
  }
}

function subscribeVideoEvents () {
  var video = document.getElementsByTagName('video')[0]
  if (!video) {
    // Retry later
    setTimeout(subscribeVideoEvents, 20000)
    return
  }

  video.addEventListener("timeupdate", function() {
    var time = this.currentTime
    console.log(time)
  }, true);
}

console.log('loading subtitles...')
insertSubsDiv()
loadSubs()
subscribeVideoEvents()
console.log('done!')
