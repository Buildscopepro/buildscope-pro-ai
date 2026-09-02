import React,{useState}from"react";
import{View,Text,TextInput,Pressable,ScrollView,StyleSheet,Alert}from"react-native";
import{searchRealProducts}from"../services/backendGateway";

export default function ProductSearchPanel({category,onSelect}){
 const[q,setQ]=useState(""),[items,setItems]=useState([]),[busy,setBusy]=useState(false);
 async function search(){
  if(!q.trim())return;
  try{
   setBusy(true);
   const r=await searchRealProducts({query:q.trim(),category});
   setItems(r.products||[]);
  }catch(e){Alert.alert("Product search",String(e.message||e))}
  finally{setBusy(false)}
 }
 return <View style={s.wrap}>
  <Text style={s.title}>Real Product Search</Text>
  <View style={s.row}><TextInput style={s.input} value={q} onChangeText={setQ} placeholder={`Search ${category||"product"}`}/>
  <Pressable style={s.btn} onPress={search}><Text style={s.btnText}>{busy?"…":"Search"}</Text></Pressable></View>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
   {items.map(p=><Pressable key={p.productId} style={s.card} onPress={()=>onSelect?.(p)}>
    <Text style={s.name}>{p.name}</Text>
    <Text>{[p.brand,p.model||p.sku].filter(Boolean).join(" • ")}</Text>
    <Text>{p.retailerName||"Retailer"}</Text>
    <Text>{p.price!=null?`$${Number(p.price).toFixed(2)}`:"Price unavailable"}</Text>
    <Text style={s.status}>{p.availability||"unknown"}</Text>
   </Pressable>)}
  </ScrollView>
 </View>
}
const s=StyleSheet.create({
 wrap:{marginTop:12},title:{fontWeight:"900",fontSize:17},
 row:{flexDirection:"row",gap:8,marginTop:8},input:{flex:1,borderWidth:1,borderColor:"#E4E8EF",borderRadius:12,padding:12},
 btn:{backgroundColor:"#1D5FD1",paddingHorizontal:15,borderRadius:12,justifyContent:"center"},btnText:{color:"#fff",fontWeight:"900"},
 card:{width:220,padding:13,borderWidth:1,borderColor:"#E4E8EF",borderRadius:14,marginRight:9,marginTop:10},
 name:{fontWeight:"900"},status:{marginTop:5,color:"#667085"}
});
