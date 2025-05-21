let currentSong = new Audio();
let play = document.querySelector("#play")
let forward = document.querySelector("#forward")
let back = document.querySelector("#back")
let hamburgur = document.querySelector(".hamburgur")
let currFolder;
let songs;


function secondsTOminutes (seconds){
    if(isNaN(seconds) || seconds <0){
        return " "
    }
    const min = Math.floor(seconds/60)
    const remainsec = Math.floor(seconds%60)

    const formatmin = String(min).padStart(2, '0')
    const formatsec = String(remainsec).padStart(2, '0')

    return `${formatmin}:${formatsec}`
}


async function getSongs(folder){
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5050/${folder}/`)
    let response = await a.text();
   

    let div = document.createElement("div")
    div.innerHTML = response
    let as= div.getElementsByTagName("a")
    

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`${folder}/`)[1].replaceAll("%20", " ").replaceAll("128-", " ").replace(".mp3", " ").replace("128", " ").replace("Kbps", " "))
        }
    }
    
    // Show all songs on playlists.
    let songList = document.querySelector(".section_2").getElementsByTagName("ul")[0]
    songList.innerHTML = ""
    for (const song of songs) {
    songList.innerHTML = songList.innerHTML + `<li>
                            <img src="img/music.svg" alt="">
                            <div>
                            ${song}
                            </div>
                        </li>`
    }

    let x= Array.from(document.querySelector(".section_2").getElementsByTagName("li"))[0]
    Display(x)

    // Play the song
    Array.from(document.querySelector(".section_2").getElementsByTagName("li")).forEach(element => {
    element.addEventListener("click", e=>{
    playMusic(element.getElementsByTagName("div")[0].innerHTML.trim())
    colorChange(Array.from(document.querySelector(".section_2").getElementsByTagName("li")))
    element.style.backgroundColor = "grey"
    play.innerHTML = `<img src="img/pause.svg" alt="">`
    Display(element)
    })
    })
}


const playMusic = (track, pause = false) =>{
    currentSong.src = `${currFolder}/128-` + track + " 128 Kbps.mp3"
    if(!pause){
    currentSong.play()
    }
    play.innerHTML = `<img src="img/pause.svg" alt="">`
    document.querySelector(".section_2").getElementsByTagName("li")[0].style.backgroundColor = "grey"
} 

const colorChange = (li)=>{
    li.forEach(element =>{
        if(element.style.backgroundColor == "grey"){
            element.style.backgroundColor = "#242424"
        }
    })
}

const Display = (e)=>{
    let div = document.createElement("div")
    div.innerHTML= e.innerHTML
    document.querySelector(".song_essentials").innerHTML = div.innerHTML
    document.querySelector(".song_essentials").style.backgroundColor = "#242424"
}


//Automatic card addition 
async function displayAlbums(){
    let b = await fetch(`http://127.0.0.1:5050/songs/`)
    let response = await b.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors= div.getElementsByTagName("a")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if(e.href.includes("/songs/")){
            let folder = e.href.split("/").slice(4)[0]
            let b = await fetch(`http://127.0.0.1:5050/songs/${folder}/info.json`)
            let json = await b.json();
            let cardContainer = document.querySelector(".foot")
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                                    <a>
                                        <div class="img"><img
                                                src="songs/${folder}/cover.jpg"
                                                alt="">
                                        </div>
                                        <div class="artist">
                                            <span class="span_1">${json.title}</span>
                                            <span class="span_2">${json.Description}</span>
                                        </div>
                                        <div class="play_button">
                                            <img src="img/play.svg" alt="">
                                        </div>
                                    </a>
                                </div>`
        }
    }
    

    //CARD EVENT LISTNER
    Array.from(document.querySelectorAll(".card")).forEach(e=> {
    e.addEventListener("click", async e=> {
        songs = await getSongs(`/songs/${e.currentTarget.dataset.folder}`)
        if(a==10){
        Array.from(document.querySelector(".section_2").getElementsByTagName("li")).forEach(e=>{
          e.style.visibility = "visible"
        })
    }   
      playMusic(document.querySelector(".section_2").getElementsByTagName("li")[0].getElementsByTagName("div")[0].innerHTML.trim())
    })
    })


    let a=5;
//Ham Burgur functionality
hamburgur.addEventListener("click", ()=>{
   let toexpand = document.querySelector(".section_2").getElementsByTagName("ul").item(0)
   if(a == "5"){
   toexpand.style.animation = "0.5s ease-in 0s 1 forwards running name"
   Array.from(document.querySelector(".section_2").getElementsByTagName("li")).forEach(element => {
    element.style.animation = "3s ease-in 0s 1 forwards running show"
    })
    hamburgur.src = "img/cross.svg"
   a = 10}


   else{
    toexpand.style.animation = "0.5s ease-in 0s 1 forwards running back"
    Array.from(document.querySelector(".section_2").getElementsByTagName("li")).forEach(element => {
        element.style.animation = "0.2s ease-in 0s 1 forwards running hide"})
    hamburgur.src = "img/hamburgur.svg"
    a = 5}
})
}




//MAIN FUNCTION
async function main(){

await getSongs(`/songs/First`)

playMusic(songs[0].trim(), true) 


//Display all albums
displayAlbums()


//Play, forward, back buttons functionality

//Play
play.addEventListener("click", e=>{
    if(currentSong.src != ""){
    if(currentSong.paused == true){
        currentSong.play()
        play.innerHTML = `<img src="img/pause.svg" alt="">`
    }
    else{
        currentSong.pause()
        play.innerHTML = `<img src="img/play.svg" alt="">`
    }
}
})

//Forward
forward.addEventListener("click", e=>{
    let arr =Array.from(document.querySelector(".section_2").getElementsByTagName("li"))
    
    for(let i=0; i<arr.length; i++){
        let tocompare = arr[i].getElementsByTagName("div")[0].innerHTML.trim()
        let toforward = currentSong.src.split(`${currFolder}/`)[1].replaceAll("%20", " ").replaceAll("128-", " ").replace(".mp3", " ").replace("128", " ").replace("Kbps", " ").trim()
        if(toforward === tocompare){   
            play.innerHTML = `<img src="img/pause.svg" alt="">`
            playMusic(arr[i+1].getElementsByTagName("div")[0].innerHTML.trim())
            colorChange(arr)
            arr[i+1].style.backgroundColor = "grey"
            Display(arr[i+1])
            break
        }
    }
})

//Reverse
back.addEventListener("click", e=>{
    let arr =Array.from(document.querySelector(".section_2").getElementsByTagName("li"))
    for(let i=1; i<arr.length; i++){
        let tocompare = arr[i].getElementsByTagName("div")[0].innerHTML.trim()
        let toforward = currentSong.src.split(`${currFolder}/`)[1].replaceAll("%20", " ").replaceAll("128-", " ").replace(".mp3", " ").replace("128", " ").replace("Kbps", " ").trim()
        if(toforward === tocompare){  
            play.innerHTML = `<img src="img/pause.svg" alt="">`
            playMusic(arr[i-1].getElementsByTagName("div")[0].innerHTML.trim())
            colorChange(arr) 
            arr[i-1].style.backgroundColor = "grey"
            Display(arr[i-1])
            break
        }
    }
})


// Event listner for timeupdate
currentSong.addEventListener("timeupdate", ()=>{
       document.querySelector(".time").innerHTML = `${secondsTOminutes(currentSong.currentTime)}/${secondsTOminutes(currentSong.duration)}`
       document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 +"%"
})

//For seekbar
// offset tells the position of the mouse inside the element where the event happend
// getBoundingClientRect contains elements actual width, height, distance from left and top of viewport, Here we take actual width of element.
document.querySelector(".seekbar").addEventListener("click", e=>{
    let p = (e.offsetX/e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = p +"%"
    currentSong.currentTime = ((currentSong.duration) * p)/100
})


//Controlling volume
document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
    currentSong.volume = parseInt((e.target.value))/100
})


let previous
//Mute 
document.querySelector(".volume").getElementsByTagName("img")[0].addEventListener("click",(e)=>{
         let game=  document.querySelector(".volume").getElementsByTagName("img")[0]
         console.log(previous)
         if(game.src == "http://127.0.0.1:5050/img/volume.svg"){
            currentSong.volume = 0
            game.src = "http://127.0.0.1:5050/img/mute.svg"
            previous = document.querySelector(".volume").getElementsByTagName("input")[0].value
            document.querySelector(".volume").getElementsByTagName("input")[0].value = 0;
            }
        else{
            document.querySelector(".volume").getElementsByTagName("input")[0].value = previous
            currentSong.volume =  document.querySelector(".volume").getElementsByTagName("input")[0].value/100
            game.src = "http://127.0.0.1:5050/img/volume.svg"
        }
            
})


}



main()









