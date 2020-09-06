const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//GET USERNAME AND ROOM FROM URL
const { username,room } = Qs.parse(location.search,{
  ignoreQueryPrefix:true
});

console.log(username,room);

const socket = io();
/*********************** peer js ************************/
// const videoGrid = document.getElementById('video-grid')
// var peer = new Peer(undefined,{
//   host:'/',
//   port:3001
// }); //peerjs
// const myVideo = document.createElement('video')
// myVideo.muted = true

// navigator.mediaDevices.getUserMedia({
//   video:true,
//   audio:true
// }).then(stream => {
//   addVideoStream(myVideo,stream)

//   peer.on('call', call => {
//     call.answer(stream)
//     const video = document.createElement('video')
//     call.on('stream', userVideoStream => {
//       addVideoStream(video,userVideoStream)
//     })
//   })

//   socket.on('roomUsers',({room,users}) => {
//     outputRoomName(room);
//     outputUsers(users);
//     connectToNewUser(users,stream)
//   });
// })

// peer.on('open', () => {
//   socket.emit('joinRoom',{ username,room });
// })

// function connectToNewUser(user,stream){
//   const call = peer.call(user,stream)
//   const video = document.createElement('video')
//   call.on('stream', userVideoStream => {
//     addVideoStream(video,userVideoStream)
//   })
//   call.on('close', () => {
//     video.remove()
//   })
// }

// function addVideoStream(video,stream){
//   video.srcObject = stream
//   video.addEventListener('loadedmetadata', () => {
//     video.play()
//   })
//   videoGrid.append(video)
// }

/************************ peer js **************************/

//JOIN CHATROOM
socket.emit('joinRoom',{ username,room });

//GET ROOM AND USERS
socket.on('roomUsers',({room,users}) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit
chatForm.addEventListener('submit',(e) => {
  e.preventDefault();

  //acceder al input donde se escribe el mensaje
  const msg = e.target.elements.msg.value;
  
  //emit message to server
  socket.emit('chatMessage',msg);

  //Clear input
  e.target.elements.msg.value = '';
});


//Output message from DOM
function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}


//ADD ROOM NAME TO DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

//ADD USERS TO DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}