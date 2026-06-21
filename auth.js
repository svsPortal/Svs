const ALLOWED_DISCORD_USERS = [
  "984961103954055208", //Non
  "371500310792765460", //sogeum
  "710778017710080021", //てとたん
  "1430930578013687959" //貴婦人
];

(function checkDiscordLogin(){

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

  if(
    ALLOWED_DISCORD_USERS.length > 0 &&
    !ALLOWED_DISCORD_USERS.includes(userId)
  ){
    alert("このDiscordアカウントには管理ページの権限がありません。");

    localStorage.removeItem("discord_access_token");
    localStorage.removeItem("discord_user_id");
    localStorage.removeItem("discord_username");

    location.href = "index.html";
    return;
  }

  window.discordLoginUser = {
    id:userId,
    username:username || ""
  };

})();

function logoutDiscord(){
  localStorage.removeItem("discord_access_token");
  localStorage.removeItem("discord_user_id");
  localStorage.removeItem("discord_username");

  location.href = "login.html";
}
