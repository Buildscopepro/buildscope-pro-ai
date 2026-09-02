import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import {supabase} from "./supabase";

export async function registerExpoPushToken(){
  const perm=await Notifications.requestPermissionsAsync();
  if(perm.status!=="granted") throw new Error("Notification permission denied");

  const projectId=Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;
  if(!projectId) throw new Error("EAS projectId is not configured");

  const token=(await Notifications.getExpoPushTokenAsync({projectId})).data;
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) throw new Error("User not authenticated");

  const {error}=await supabase.from("notification_devices").upsert({
    user_id:user.id,
    push_token:token,
    device:"expo",
    enabled:true,
    last_seen_at:new Date().toISOString()
  },{onConflict:"user_id,push_token"});
  if(error) throw error;
  return token;
}
