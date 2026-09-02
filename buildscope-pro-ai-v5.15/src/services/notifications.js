import * as Notifications from "expo-notifications";

export async function requestNotificationPermission(){
 const p=await Notifications.requestPermissionsAsync();
 return p.granted||p.status==="granted";
}

export async function notifyConflict(title,body){
 const ok=await requestNotificationPermission();
 if(!ok) return false;
 await Notifications.scheduleNotificationAsync({
  content:{title,body},
  trigger:null
 });
 return true;
}
