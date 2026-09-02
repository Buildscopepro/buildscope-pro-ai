export function runtimeConfig(){
 return {
   supabaseConfigured:Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL&&process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
   backendConfigured:Boolean(process.env.EXPO_PUBLIC_BUILDSCOPE_API_URL),
   backendUrl:process.env.EXPO_PUBLIC_BUILDSCOPE_API_URL||null
 };
}
