let player;


function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}


function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: 'oaJIkGhAf7U', // public test video
    playerVars: {
      autoplay: 1,
      mute: 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  console.log('YouTube player is ready');
}

function onPlayerStateChange(event) {
  console.log('Player state changed:', event.data);
}
