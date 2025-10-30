// Simple UI
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const sidePanel = document.getElementById("sidePanel");
  const overlay = document.getElementById("overlay");
  const closeBtn = document.getElementById("closeBtn");
  if (hamburger) hamburger.onclick = () => { sidePanel.classList.add("active"); overlay.classList.add("active"); };
  if (closeBtn) closeBtn.onclick = () => { sidePanel.classList.remove("active"); overlay.classList.remove("active"); };
  if (overlay) overlay.onclick = () => { sidePanel.classList.remove("active"); overlay.classList.remove("active"); };

  const audio = document.getElementById("liveAudio");
  if (audio) {
    document.getElementById("playBtn").onclick = () => audio.play();
    document.getElementById("pauseBtn").onclick = () => audio.pause();
    document.getElementById("volumeBtn").onclick = () => {
      audio.muted = !audio.muted;
      document.getElementById("volumeBtn").innerHTML = audio.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    };
  }

  setTimeout(startChat, 500); // wait for firebase
});

// Firebase chat + presence
function startChat() {
  const db = window.database;
  if (!db) return console.warn("Firebase DB not found");

  const chatRef = firebase.database().ref ? firebase.database().ref("freedomfm") : window.database.ref("freedomfm");
  const messagesRef = window.database.ref("freedomfm/chats");
  const presenceRef = window.database.ref("freedomfm/presence");

  const messagesEl = document.getElementById("chatMessages");
  const inputEl = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const listenersEl = document.getElementById("listenersCount");

  const username = "Guest" + Math.floor(Math.random() * 9000 + 1000);

  sendBtn.onclick = () => {
    const text = inputEl.value.trim();
    if (!text) return;
    window.database.ref("freedomfm/chats").push({ user: username, text, ts: Date.now() });
    inputEl.value = "";
  };

  messagesRef.limitToLast(50).on("child_added", snap => {
    const msg = snap.val();
    if (!msg) return;
    const el = document.createElement("div");
    el.className = "msg";
    const t = new Date(msg.ts);
    el.textContent = `[${t.getHours()}:${String(t.getMinutes()).padStart(2, "0")}] ${msg.user}: ${msg.text}`;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  });

  // Presence tracking
  const myId = "p_" + Math.random().toString(36).slice(2, 9);
  const myRef = presenceRef.child(myId);
  myRef.set({ ts: Date.now() });
  myRef.onDisconnect().remove();
  setInterval(() => myRef.update({ ts: Date.now() }), 20000);
  presenceRef.on("value", s => {
    const val = s.val() || {};
    const count = Object.keys(val).length;
    if (listenersEl) listenersEl.textContent = `👥 ${count} listeners online`;
  });
}
