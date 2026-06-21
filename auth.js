/*
  auth.js
  FirestoreでDiscord許可IDを管理する版
*/

const EMERGENCY_OWNER_IDS = [
  "984961103954055208", //Non
  "371500310792765460", //sogeum
  "710778017710080021", //てとたん
  "1430930578013687959" //貴婦人
];

const firebaseConfig = {
  apiKey: "AIzaSyD826LkOY5iKXH04agBlc9IPHpeBO4C6uM",
  authDomain: "svsv-54551.firebaseapp.com",
  projectId: "svsv-54551",
  storageBucket: "svsv-54551.firebasestorage.app",
  messagingSenderId: "948158589591",
  appId: "1:948158589591:web:53b3a4430d0629492597d2"
};

(async function checkDiscordLogin(){

  const currentPage =
    location.pathname.split("/").pop() || "index.html";

  const token =
    localStorage.getItem("discord_access_token");

  const userId =
    localStorage.getItem("discord_user_id");

  const username =
    localStorage.getItem("discord_username");

  if(!token || !userId){

    sessionStorage.setItem(
      "nextPage",
      currentPage
    );

    location.href = "login.html";
    return;
  }

  // 復旧用owner
  if(EMERGENCY_OWNER_IDS.includes(userId)){

    window.discordLoginUser = {
      id:userId,
      username:username || "",
      role:"owner",
      canManageUsers:true
    };

    return;
  }

  try{

    const appModule =
      await import(
        "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"
      );

    const firestoreModule =
      await import(
        "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
      );

    const app =
      appModule.initializeApp(firebaseConfig);

    const db =
      firestoreModule.getFirestore(app);

    const userRef =
      firestoreModule.doc(
        db,
        "allowedDiscordUsers",
        userId
      );

    const userSnap =
      await firestoreModule.getDoc(userRef);

    if(!userSnap.exists()){

      alert(
        "このDiscordアカウントは許可されていません。"
      );

      location.href = "index.html";
      return;
    }

    const userData = userSnap.data();

    if(userData.enabled !== true){

      alert(
        "このDiscordアカウントは無効化されています。"
      );

      location.href = "index.html";
      return;
    }

    window.discordLoginUser = {
      id:userId,
      username:username || "",
      role:userData.role || "member",
      canManageUsers:
        userData.canManageUsers === true
    };

  }
  catch(error){

    console.error(error);

    alert(
      "権限確認に失敗しました。"
    );

    location.href = "index.html";
  }

})();

function logoutDiscord(){

  localStorage.removeItem(
    "discord_access_token"
  );

  localStorage.removeItem(
    "discord_user_id"
  );

  localStorage.removeItem(
    "discord_username"
  );

  sessionStorage.removeItem(
    "nextPage"
  );

  location.href = "login.html";
}