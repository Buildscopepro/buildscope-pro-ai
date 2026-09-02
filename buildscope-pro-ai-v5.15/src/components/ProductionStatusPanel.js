import React,{useEffect,useState}from"react";
import{View,Text,Pressable,StyleSheet,ActivityIndicator}from"react-native";
import{checkProductionHealth}from"../services/productionHealth";

export default function ProductionStatusPanel(){
 const[data,setData]=useState(null),[busy,setBusy]=useState(false);
 async function refresh(){
  try{setBusy(true);setData(await checkProductionHealth())}
  finally{setBusy(false)}
 }
 useEffect(()=>{refresh()},[]);
 const Row=({name,ok})=><View style={s.row}><Text>{name}</Text><Text style={ok?s.ok:s.bad}>{ok?"READY":"NOT READY"}</Text></View>;
 return <View style={s.card}>
  <Text style={s.title}>Production Status</Text>
  {busy&&!data?<ActivityIndicator/>:<>
   <Row name="Supabase client" ok={Boolean(data?.supabaseConfigured)}/>
   <Row name="Backend URL" ok={Boolean(data?.backendConfigured)}/>
   <Row name="Backend health" ok={Boolean(data?.backendHealth)}/>
   <Row name="Providers / secrets" ok={Boolean(data?.backendReady)}/>
  </>}
  <Pressable style={s.btn} onPress={refresh}><Text style={s.blue}>Refresh status</Text></Pressable>
 </View>
}
const s=StyleSheet.create({
 card:{backgroundColor:"#fff",padding:14,borderRadius:14,borderWidth:1,borderColor:"#E4E8EF",margin:14},
 title:{fontWeight:"900",fontSize:17,color:"#10243E",marginBottom:8},
 row:{flexDirection:"row",justifyContent:"space-between",paddingVertical:5},
 ok:{fontWeight:"900",color:"#16845B"},bad:{fontWeight:"900",color:"#B42318"},
 btn:{marginTop:8,padding:10,alignItems:"center"},blue:{color:"#1D5FD1",fontWeight:"900"}
});
