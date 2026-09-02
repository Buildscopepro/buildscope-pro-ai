import React,{useMemo,useState}from"react";
import{SafeAreaView,ScrollView,View,Text,TextInput,Pressable,StyleSheet,Alert,Image}from"react-native";
import * as ImagePicker from"expo-image-picker";
import MapView,{Marker,Polygon}from"react-native-maps";
import{calculateRoof}from"./src/services/measure";
import{baseRoofTakeoff}from"./src/services/takeoff";
import{CONSOLIDATED_CATALOG}from"./src/data/catalog";
import{priceTakeoff,estimateTotals}from"./src/services/estimateConsolidated";
import{pricingTiers}from"./src/services/pricingOptions";
import{calcRemodelTakeoff}from"./src/services/remodelTakeoff";
import{takeoffToLines,summarize}from"./src/services/remodelEstimate";
import{buildVisualizationRequest}from"./src/services/visualization";
import ReleaseQaScreen from "./src/components/ReleaseQaScreen";

const C={navy:"#10243E",blue:"#1D5FD1",bg:"#F4F7FB",card:"#fff",text:"#172033",muted:"#667085",border:"#E4E8EF"};
const money=n=>`$${Number(n||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;

function Roofing(){
 const[points,setPoints]=useState([]),[pitch,setPitch]=useState(6),[waste,setWaste]=useState(10),[system,setSystem]=useState("Shingles");
 const[ridge,setRidge]=useState("80"),[eave,setEave]=useState("180"),[rake,setRake]=useState("120"),[valley,setValley]=useState("40"),[labor,setLabor]=useState("6500"),[extras,setExtras]=useState("1200");
 const m=useMemo(()=>calculateRoof({points,pitch,waste}),[points,pitch,waste]);
 const t=useMemo(()=>baseRoofTakeoff({system,orderSqFt:m.orderFt2,ridgeLf:+ridge||0,eaveLf:+eave||0,rakeLf:+rake||0,valleyLf:+valley||0}),[system,m,ridge,eave,rake,valley]);
 const lines=useMemo(()=>priceTakeoff(t.lines,CONSOLIDATED_CATALOG),[t]);
 const totals=useMemo(()=>estimateTotals(lines,labor,extras),[lines,labor,extras]);
 return <View>
  <Text style={s.section}>🏠 Roofing</Text>
  <MapView style={s.map} initialRegion={{latitude:28.5383,longitude:-81.3792,latitudeDelta:.003,longitudeDelta:.003}} mapType="satellite" onPress={e=>setPoints(v=>[...v,e.nativeEvent.coordinate])}>
   {points.map((p,i)=><Marker key={i} coordinate={p}/>)}
   {points.length>=3&&<Polygon coordinates={points} strokeWidth={3}/>}
  </MapView>
  <View style={s.row}>{["Shingles","Standing Seam","5V","Multi-Rib","PBR"].map(x=><Pressable key={x} style={[s.chip,system===x&&s.on]} onPress={()=>setSystem(x)}><Text>{x}</Text></Pressable>)}</View>
  <Text style={s.big}>{m.squares.toFixed(2)} squares</Text>
  {[["Ridge LF",ridge,setRidge],["Eave LF",eave,setEave],["Rake LF",rake,setRake],["Valley LF",valley,setValley]].map(([p,v,set])=><TextInput key={p} style={s.input} value={v} onChangeText={set} keyboardType="numeric" placeholder={p}/>)}
  {lines.map(x=><View key={x.key} style={s.line}><Text>{x.label}</Text><Text style={s.bold}>{x.qty} {x.unit} • {money(x.totalPrice)}</Text></View>)}
  <TextInput style={s.input} value={labor} onChangeText={setLabor} keyboardType="numeric" placeholder="Labor"/>
  <TextInput style={s.input} value={extras} onChangeText={setExtras} keyboardType="numeric" placeholder="Extras"/>
  <View style={s.card}><Text style={s.title}>Roofing Estimate</Text><Text>Internal {money(totals.internalCost)}</Text><Text style={s.big}>Customer {money(totals.customerPrice)}</Text></View>
 </View>
}

function Remodel(){
 const[m,setM]=useState({wallWidth:"40",wallHeight:"10",openingsArea:"120",sidingWaste:"10",soffitLf:"120",gutterLf:"180",copingLf:"40",lumber2x4:"20",lumber2x6:"10",lumber1x2:"8",lumber1x4:"12",floorWidth:"20",floorLength:"15",floorWaste:"10",cabinets:"10",countertopLf:"24",tileSqFt:"120",vanity:"1"});
 const[labor,setLabor]=useState("5000"),[extras,setExtras]=useState("800");
 const takeoff=useMemo(()=>calcRemodelTakeoff(m),[m]);
 const lines=useMemo(()=>takeoffToLines(takeoff,CONSOLIDATED_CATALOG),[takeoff]);
 const totals=useMemo(()=>summarize(lines,labor,extras),[lines,labor,extras]);
 const field=(k,p)=><TextInput style={s.input} value={m[k]} onChangeText={v=>setM(x=>({...x,[k]:v}))} keyboardType="numeric" placeholder={p}/>;
 return <View>
  <Text style={s.section}>🛠 Remodelación</Text>
  <Text style={s.sub}>Siding / Exterior</Text>
  {field("wallWidth","Wall width ft")}{field("wallHeight","Wall height ft")}{field("openingsArea","Windows/doors area ft²")}{field("sidingWaste","Siding waste %")}
  {field("soffitLf","Soffit LF")}{field("gutterLf","Gutters / Canales LF")}{field("copingLf","Coping LF")}
  <Text style={s.sub}>Framing / Lumber</Text>
  {field("lumber2x4","2x4 pieces")}{field("lumber2x6","2x6 pieces")}{field("lumber1x2","1x2 pieces")}{field("lumber1x4","1x4 pieces")}
  <Text style={s.sub}>Flooring / Kitchen / Bathroom</Text>
  {field("floorWidth","Floor width ft")}{field("floorLength","Floor length ft")}{field("floorWaste","Floor waste %")}
  {field("cabinets","Cabinet units")}{field("countertopLf","Countertop LF")}{field("tileSqFt","Tile ft²")}{field("vanity","Vanity units")}
  <Text style={s.section}>Material Takeoff</Text>
  {lines.map(x=><View key={x.key} style={s.line}><Text>{x.label}</Text><Text style={s.bold}>{x.qty} {x.unit} • {money(x.totalPrice)}</Text></View>)}
  <TextInput style={s.input} value={labor} onChangeText={setLabor} keyboardType="numeric" placeholder="Labor"/>
  <TextInput style={s.input} value={extras} onChangeText={setExtras} keyboardType="numeric" placeholder="Extras"/>
  <View style={s.card}><Text style={s.title}>Remodel Estimate</Text><Text>Internal {money(totals.internalCost)}</Text><Text style={s.big}>Customer {money(totals.customerPrice)}</Text></View>
 </View>
}

function Visualize(){
 const[photo,setPhoto]=useState(null),[space,setSpace]=useState("Kitchen"),[notes,setNotes]=useState("");
 async function pick(camera=false){
  const perm=camera?await ImagePicker.requestCameraPermissionsAsync():await ImagePicker.requestMediaLibraryPermissionsAsync();
  if(!perm.granted)return Alert.alert("Permission required");
  const r=camera?await ImagePicker.launchCameraAsync({mediaTypes:["images"],quality:.8}):await ImagePicker.launchImageLibraryAsync({mediaTypes:["images"],quality:.8});
  if(!r.canceled)setPhoto(r.assets[0].uri);
 }
 function prepare(){
  if(!photo)return Alert.alert("Select a photo first");
  const req=buildVisualizationRequest({projectId:"CURRENT_PROJECT",spaceType:space,sourceUri:photo,styleNotes:notes});
  Alert.alert("AI visualization request prepared",`${req.spaceType} • ${req.status}`);
 }
 return <View>
  <Text style={s.section}>🤖 Visualización IA</Text>
  <Text style={s.muted}>Captura una foto y prepara la transformación visual para enseñársela al cliente.</Text>
  <View style={s.row}>{["Kitchen","Bathroom","Flooring","Siding","Roofing"].map(x=><Pressable key={x} style={[s.chip,space===x&&s.on]} onPress={()=>setSpace(x)}><Text>{x}</Text></Pressable>)}</View>
  <Pressable style={s.secondary} onPress={()=>pick(true)}><Text style={s.secondaryText}>📷 Camera</Text></Pressable>
  <Pressable style={s.secondary} onPress={()=>pick(false)}><Text style={s.secondaryText}>🖼 Gallery</Text></Pressable>
  {photo&&<Image source={{uri:photo}} style={s.photo}/>}
  <TextInput style={[s.input,{minHeight:90}]} value={notes} onChangeText={setNotes} multiline placeholder="Ej. cocina moderna blanca, quartz, piso claro..."/>
  <Pressable style={s.primary} onPress={prepare}><Text style={s.primaryText}>Prepare AI visualization</Text></Pressable>
  <View style={s.note}><Text style={s.muted}>v4.6 prepara la solicitud y la foto. La generación IA real requiere conectar un proveedor/modelo de imágenes en la fase de producción.</Text></View>
 </View>
}

function AppCoreMain(){
 const[tab,setTab]=useState("roofing");
 return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content}>
  <Text style={s.logo}>BuildScope Pro AI</Text><Text style={s.h1}>v4.6 Complete Workflows</Text>
  <View style={s.tabs}>{[["roofing","🏠 Roofing"],["remodel","🛠 Remodel"],["visual","🤖 AI Visual"]].map(([k,l])=><Pressable key={k} style={[s.tab,tab===k&&s.on]} onPress={()=>setTab(k)}><Text>{l}</Text></Pressable>)}</View>
  {tab==="roofing"?<Roofing/>:tab==="remodel"?<Remodel/>:<Visualize/>}
 </ScrollView></SafeAreaView>
}

const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:C.bg},content:{padding:18,paddingBottom:40},logo:{fontSize:27,fontWeight:"900",color:C.navy},
 h1:{fontSize:23,fontWeight:"900",color:C.text,marginTop:12},tabs:{flexDirection:"row",gap:7,marginTop:14,flexWrap:"wrap"},
 tab:{padding:10,borderRadius:20,borderWidth:1,borderColor:C.border,backgroundColor:C.card},on:{borderColor:C.blue,backgroundColor:"#EAF1FF"},
 section:{fontSize:20,fontWeight:"900",marginTop:20,marginBottom:6,color:C.text},sub:{fontSize:16,fontWeight:"900",marginTop:15,color:C.navy},
 muted:{color:C.muted,lineHeight:20},map:{height:300,borderRadius:14,marginTop:10},row:{flexDirection:"row",flexWrap:"wrap",gap:7,marginTop:9},
 chip:{paddingVertical:8,paddingHorizontal:11,borderRadius:18,borderWidth:1,borderColor:C.border,backgroundColor:C.card},
 input:{backgroundColor:C.card,borderWidth:1,borderColor:C.border,borderRadius:12,padding:13,fontSize:16,marginTop:8},
 line:{backgroundColor:C.card,padding:13,borderRadius:12,borderWidth:1,borderColor:C.border,marginTop:7,flexDirection:"row",justifyContent:"space-between",gap:10},
 bold:{fontWeight:"900"},card:{backgroundColor:C.card,padding:15,borderRadius:15,borderWidth:1,borderColor:C.border,marginTop:10},
 title:{fontWeight:"900",fontSize:17,color:C.navy},big:{fontSize:23,fontWeight:"900",color:C.blue,marginTop:6},
 primary:{backgroundColor:C.blue,padding:15,borderRadius:14,alignItems:"center",marginTop:14},primaryText:{color:"#fff",fontWeight:"900"},
 secondary:{backgroundColor:C.card,padding:14,borderRadius:14,alignItems:"center",marginTop:9,borderWidth:1,borderColor:C.blue},secondaryText:{color:C.blue,fontWeight:"900"},
 photo:{width:"100%",height:280,borderRadius:14,marginTop:10,resizeMode:"contain",backgroundColor:"#111"},
 note:{backgroundColor:C.card,padding:14,borderRadius:14,borderWidth:1,borderColor:C.border,marginTop:16}
});

export default function AppCore(){
 const[qa,setQa]=React.useState(false);
 if(qa)return <ReleaseQaScreen onClose={()=>setQa(false)}/>;
 return <View style={{flex:1}}>
   <AppCoreMain/>
   <Pressable onPress={()=>setQa(true)} style={{
     position:"absolute",right:14,bottom:84,backgroundColor:"#10243E",
     paddingVertical:9,paddingHorizontal:12,borderRadius:20
   }}>
     <Text style={{color:"#fff",fontWeight:"900"}}>QA</Text>
   </Pressable>
 </View>;
}
