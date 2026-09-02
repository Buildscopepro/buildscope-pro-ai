import React,{useMemo,useState}from"react";
import{SafeAreaView,ScrollView,View,Text,Pressable,StyleSheet,Alert}from"react-native";
import ProductionStatusPanel from"./ProductionStatusPanel";
import{releaseReadiness}from"../services/qaManifest";

const TESTS=[
 "Login / role permissions",
 "Create client + project",
 "Roof satellite measurement + takeoff",
 "Remodel takeoff",
 "Wall and ceiling finish schedule",
 "Real product search",
 "AI visualization with selected products",
 "Client approval / request changes",
 "Purchase list",
 "Proposal + PDF + signature",
 "Service request",
 "Payment Sheet",
 "Scheduling + weather",
 "Push notification",
 "Field Crew progress",
 "Client dashboard"
];

export default function ReleaseQaScreen({onClose}){
 const readiness=useMemo(()=>releaseReadiness(),[]);
 const[passed,setPassed]=useState({});
 const all=TESTS.every(x=>passed[x]);
 return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content}>
   <View style={s.top}><Text style={s.h}>Release QA</Text>{onClose&&<Pressable onPress={onClose}><Text style={s.close}>Close</Text></Pressable>}</View>
   <ProductionStatusPanel/>
   <View style={[s.banner,readiness.ready?s.good:s.warn]}>
     <Text style={s.bold}>{readiness.ready?"Configuration gate passed":"Configuration blockers remain"}</Text>
     {readiness.blockers.map(x=><Text key={x.key}>• {x.label}</Text>)}
   </View>

   <Text style={s.section}>Physical Android test checklist</Text>
   {TESTS.map(t=><Pressable key={t} style={s.row} onPress={()=>setPassed(x=>({...x,[t]:!x[t]}))}>
     <Text style={s.check}>{passed[t]?"✓":"○"}</Text><Text style={s.label}>{t}</Text>
   </Pressable>)}

   <View style={[s.banner,all?s.good:s.neutral]}>
     <Text style={s.bold}>{all?"✓ Device checklist complete":"Complete every physical-device test before production AAB."}</Text>
   </View>

   <Pressable style={s.btn} onPress={()=>Alert.alert(
     "Release gate",
     readiness.ready&&all
       ?"Configuration and local device checklist are complete. Continue to production AAB review."
       :"Do not release yet. Complete configuration and device QA first."
   )}><Text style={s.white}>Evaluate release gate</Text></Pressable>
 </ScrollView></SafeAreaView>
}
const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:"#F4F7FB"},content:{padding:16,paddingBottom:40},
 top:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},h:{fontSize:25,fontWeight:"900",color:"#10243E"},
 close:{color:"#1D5FD1",fontWeight:"900"},section:{fontSize:18,fontWeight:"900",marginTop:18,marginBottom:6},
 row:{flexDirection:"row",gap:10,alignItems:"center",backgroundColor:"#fff",padding:13,borderRadius:12,borderWidth:1,borderColor:"#E4E8EF",marginTop:7},
 check:{fontSize:22,color:"#1D5FD1"},label:{flex:1,color:"#172033"},banner:{padding:14,borderRadius:14,marginTop:12},
 good:{backgroundColor:"#EEF8F3"},warn:{backgroundColor:"#FFF2F0"},neutral:{backgroundColor:"#fff"},
 bold:{fontWeight:"900"},btn:{backgroundColor:"#1D5FD1",padding:15,borderRadius:14,alignItems:"center",marginTop:15},
 white:{color:"#fff",fontWeight:"900"}
});
