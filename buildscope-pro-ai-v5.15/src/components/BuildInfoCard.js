import React from"react";
import{View,Text,StyleSheet}from"react-native";
import Constants from"expo-constants";

export default function BuildInfoCard(){
 return <View style={s.card}>
  <Text style={s.title}>Build Info</Text>
  <Text>App version: {Constants.expoConfig?.version||"unknown"}</Text>
  <Text>Runtime: {Constants.executionEnvironment||"unknown"}</Text>
  <Text>EAS Project ID: {Constants.easConfig?.projectId||Constants.expoConfig?.extra?.eas?.projectId||"not configured"}</Text>
 </View>;
}
const s=StyleSheet.create({card:{backgroundColor:"#fff",padding:14,borderRadius:14,borderWidth:1,borderColor:"#E4E8EF",margin:14},title:{fontWeight:"900",marginBottom:6}});
