    const firebaseConfig = {
	apiKey: "AIzaSyB83iL8yDS8OkPnKv8t9z3dOWuo5XuCUS0",
	authDomain: "dsuview.firebaseapp.com",
	databaseURL: "https://dsuview.firebaseio.com",
	projectId: "dsuview",
	storageBucket: "",
	messagingSenderId: "947813853337",
	appId: "1:947813853337:web:e148d807a2bf092b"
};


var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);   

var player;
var videos = new Array();
var videoIndex;
var videoIDs = new Array()
var cur;
var width;
var interval;

function changeOverlay(cur){
    $('#overTitle').text(videos[cur].title)
    $('#overChannel').text(videos[cur].channel)
    width = $('#overlay').width() + 40
    $('#overlay').css("left", -width)
}

function animateOverlay(){
    $('#overlay').animate({"left": 0});
    window.setTimeout(function() {
        $('#overlay').animate({left: -width});
    }, 3000)
       
}

function onPlayerStateChange(event){
    if (event.data == 0){
        videoIndex = player.getPlaylistIndex();
        window.clearInterval(interval)
        cur = player.getPlaylistIndex()
        changeOverlay(cur);
        animateOverlay()
        interval = window.setInterval(animateOverlay, 10000)
        if (videoIndex == videoIDs.length - 1){
            videos = new Array()
            videoIDs = new Array()
            db.collection("videos").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    videos.push(doc.data())
                    videoIDs.push(doc.data().url)
                })
            })    
        } else if (videoIndex == 0){
            player.loadPlaylist(videoIDs)
            player.setLoop(true)
            cur = 0
            changeOverlay(cur)
            animateOverlay()
        }
        
    }
}

function onPlayerReady(){
    player.cuePlaylist(videoIDs)
    player.setLoop(true)
    cur = 0;
    changeOverlay(cur);
}


$(document).ready(function() {
    

    firebase.initializeApp(firebaseConfig)
    db = firebase.firestore()
    

	var provider = new firebase.auth.OAuthProvider('microsoft.com')
	provider.setCustomParameters({
		tenant: 'cbb5b525-3b95-4d93-9417-4dbb3c89512e'
	})

	firebase.auth().getRedirectResult()
		.then(function (result) {
			if (result.user) {
				M.toast({ html: 'You have been successfully logged in.' })
			}
		})
		.catch(function (error) {
			M.toast({ html: `Error logging in, ${error}` })
        })
        
    firebase.auth().onAuthStateChanged(function (user) {
        if (user){
            db.collection("videos").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    videos.push(doc.data());
                    videoIDs.push(doc.data().url)
                })
                player = new YT.Player('player', {events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }}
                );
               interval = window.setInterval(animateOverlay, 10000)
            })
            
        } else {
            firebase.auth().signInWithRedirect(provider)
        }
    })
})



