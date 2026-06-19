import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function getCachedCollection(db, collectionName, cacheTimeMs = 600000){
  const cacheKey = "cache_" + collectionName;
  const timeKey = "cache_time_" + collectionName;

  const now = Date.now();
  const cached = localStorage.getItem(cacheKey);
  const cachedTime = Number(localStorage.getItem(timeKey) || 0);

  if(cached && now - cachedTime < cacheTimeMs){
    try{
      return JSON.parse(cached);
    }catch(e){
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(timeKey);
    }
  }

  const snapshot = await getDocs(collection(db, collectionName));

  const data = snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  }));

  localStorage.setItem(cacheKey, JSON.stringify(data));
  localStorage.setItem(timeKey, String(now));

  return data;
}

export function clearFirestoreCache(collectionName = null){
  if(collectionName){
    localStorage.removeItem("cache_" + collectionName);
    localStorage.removeItem("cache_time_" + collectionName);
    return;
  }

  Object.keys(localStorage).forEach(key=>{
    if(key.startsWith("cache_") || key.startsWith("cache_time_")){
      localStorage.removeItem(key);
    }
  });
}

export function getCacheAgeText(collectionName){
  const timeKey = "cache_time_" + collectionName;
  const cachedTime = Number(localStorage.getItem(timeKey) || 0);

  if(!cachedTime) return "未取得";

  const diffSec = Math.floor((Date.now() - cachedTime) / 1000);

  if(diffSec < 60) return diffSec + "秒前";
  return Math.floor(diffSec / 60) + "分前";
}