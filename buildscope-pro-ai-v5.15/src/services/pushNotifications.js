import * as Notifications from "expo-notifications";
import {Platform} from "react-native";
import {supabase} from "./supabase";

Notifications.setNotificationHandler({
 handleNotification:async()=>({
  shouldShowBanner:true,
  shouldShowList:true,
  shouldPlaySound:true,
  shouldSetBadge:false
 })
});

export async function registerDeviceForNotifications(){
 const permission=await Notifications.requestPermissionsAsync();
 if(permission.status!=="granted") return {granted:false};

 if(Platform.OS==="android"){
  await Notifications.setNotificationChannelAsync("jobs",{
   name:"Job reminders",
   importance:Notifications.AndroidImportance.HIGH
  });
 }
 return {granted:true};
}

export async function savePushToken(token,device="mobile"){
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) throw new Error("User not authenticated");
 const {error}=await supabase.from("notification_devices").upsert({
  user_id:user.id,push_token:token,device,enabled:true,last_seen_at:new Date().toISOString()
 },{onConflict:"user_id,push_token"});
 if(error) throw error;
}

export async function scheduleLocalJobReminder({title,body,date,projectId}){
 return Notifications.scheduleNotificationAsync({
  content:{title,body,data:{projectId}},
  trigger:{type:Notifications.SchedulableTriggerInputTypes.DATE,date}
 });
}
