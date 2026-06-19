const ALLOWED_DISCORD_USERS = [
  "984961103954055208"
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
'''

path = Path('/mnt/data/auth.js')
path.write_text(js, encoding='utf-8')
print(path)
