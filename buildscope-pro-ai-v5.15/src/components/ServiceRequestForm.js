import React,{useState}from"react";
import{View,Text,TextInput,Pressable,StyleSheet,Alert}from"react-native";
import{createServiceRequest}from"../services/serviceRequests";

export default function ServiceRequestForm(){
 const[name,setName]=useState(""),[phone,setPhone]=useState(""),[email,setEmail]=useState(""),
 [address,setAddress]=useState(""),[type,setType]=useState("Roofing"),[desc,setDesc]=useState("");
 async function submit(){
  if(!name.trim()||!address.trim())return Alert.alert("Name and address required");
  try{
   await createServiceRequest({clientName:name.trim(),phone,email,address:address.trim(),serviceType:type,description:desc});
   Alert.alert("Request received","Your service request has been submitted.");
   setDesc("");
  }catch(e){Alert.alert("Service request",String(e.message||e))}
 }
 return <View style={s.wrap}>
  <Text style={s.h}>Request Service</Text>
  <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Client name"/>
  <TextInput style={s.input} value={phone} onChangeText={setPhone} placeholder="Phone"/>
  <TextInput style={s.input} value={email} onChangeText={setEmail} placeholder="Email"/>
  <TextInput style={s.input} value={address} onChangeText={setAddress} placeholder="Project address"/>
  <TextInput style={s.input} value={type} onChangeText={setType} placeholder="Roofing / Remodeling / Siding..."/>
  <TextInput style={[s.input,{minHeight:90}]} value={desc} onChangeText={setDesc} multiline placeholder="Tell us what you need"/>
  <Pressable style={s.btn} onPress={submit}><Text style={s.white}>Submit Request</Text></Pressable>
 </View>
}
const s=StyleSheet.create({
 wrap:{padding:18},h:{fontSize:24,fontWeight:"900"},input:{borderWidth:1,borderColor:"#E4E8EF",borderRadius:12,padding:13,marginTop:9},
 btn:{backgroundColor:"#1D5FD1",padding:15,borderRadius:14,alignItems:"center",marginTop:12},white:{color:"#fff",fontWeight:"900"}
});
