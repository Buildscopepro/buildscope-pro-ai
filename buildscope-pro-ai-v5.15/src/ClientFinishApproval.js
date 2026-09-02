import React,{useMemo,useState}from"react";
import{View,Text,TextInput,Pressable,StyleSheet,Alert,ScrollView}from"react-native";
import{approvalReadiness,submitClientApproval}from"./services/clientApproval";

export default function ClientFinishApproval({projectId,designId,finishes=[]}){
 const[name,setName]=useState(""),[notes,setNotes]=useState("");
 const ready=useMemo(()=>approvalReadiness(finishes),[finishes]);
 async function decide(decision){
  if(!name.trim())return Alert.alert("Client name required");
  try{
   await submitClientApproval(projectId,designId,finishes,decision,name.trim(),notes.trim());
   Alert.alert("Saved",decision==="approved"?"Design and finishes approved.":"Client decision saved.");
  }catch(e){Alert.alert("Approval",String(e.message||e))}
 }
 return <ScrollView contentContainerStyle={s.wrap}>
  <Text style={s.h}>Client Finish Schedule</Text>
  {finishes.map(f=><View key={f.id} style={s.card}>
   <Text style={s.title}>{f.room_name} • {f.surface}</Text>
   <Text>{f.product_name}</Text>
   <Text>{[f.brand,f.model||f.sku,f.color,f.finish].filter(Boolean).join(" • ")}</Text>
   <Text>{f.quantity} {f.unit} • {f.match_status.toUpperCase()}</Text>
   <Text>{f.retailer_name||"Where to buy pending"}</Text>
  </View>)}
  <View style={[s.status,ready.ready?s.ok:s.warn]}>
   <Text style={s.bold}>{ready.ready?"✓ Ready for client approval":"⚠ Product resolution required"}</Text>
   {ready.issues.map((x,i)=><Text key={i}>{x}</Text>)}
  </View>
  <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Client name"/>
  <TextInput style={[s.input,{minHeight:90}]} value={notes} onChangeText={setNotes} multiline placeholder="Client notes / requested changes"/>
  <Pressable style={s.primary} onPress={()=>decide("approved")}><Text style={s.white}>Approve design + finishes</Text></Pressable>
  <Pressable style={s.secondary} onPress={()=>decide("changes_requested")}><Text style={s.blue}>Request changes</Text></Pressable>
 </ScrollView>
}
const s=StyleSheet.create({
 wrap:{padding:18},h:{fontSize:24,fontWeight:"900"},card:{padding:14,borderWidth:1,borderColor:"#E4E8EF",borderRadius:14,marginTop:9},
 title:{fontWeight:"900"},status:{padding:14,borderRadius:14,marginTop:14},ok:{backgroundColor:"#EEF8F3"},warn:{backgroundColor:"#FFF7E8"},
 bold:{fontWeight:"900"},input:{borderWidth:1,borderColor:"#E4E8EF",borderRadius:12,padding:13,marginTop:9},
 primary:{backgroundColor:"#1D5FD1",padding:15,borderRadius:14,alignItems:"center",marginTop:12},white:{color:"#fff",fontWeight:"900"},
 secondary:{padding:15,borderRadius:14,alignItems:"center",marginTop:8,borderWidth:1,borderColor:"#1D5FD1"},blue:{color:"#1D5FD1",fontWeight:"900"}
});
