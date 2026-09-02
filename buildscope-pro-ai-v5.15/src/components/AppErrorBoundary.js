import React from "react";
import {SafeAreaView,View,Text,Pressable,StyleSheet} from "react-native";

export default class AppErrorBoundary extends React.Component{
  state={error:null};
  static getDerivedStateFromError(error){return {error};}
  componentDidCatch(error,info){console.error("BuildScope runtime error",error,info);}
  render(){
    if(!this.state.error) return this.props.children;
    return <SafeAreaView style={s.safe}>
      <View style={s.card}>
        <Text style={s.title}>BuildScope encountered an error</Text>
        <Text style={s.body}>{String(this.state.error?.message||this.state.error)}</Text>
        <Text style={s.note}>The error is contained so the app does not silently fail. Restart after correcting configuration or report this during QA.</Text>
        <Pressable style={s.btn} onPress={()=>this.setState({error:null})}><Text style={s.white}>Try again</Text></Pressable>
      </View>
    </SafeAreaView>;
  }
}
const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:"#F4F7FB",justifyContent:"center",padding:20},
 card:{backgroundColor:"#fff",borderRadius:16,padding:18,borderWidth:1,borderColor:"#E4E8EF"},
 title:{fontSize:21,fontWeight:"900",color:"#10243E"},body:{marginTop:10,color:"#B42318"},
 note:{marginTop:10,color:"#667085",lineHeight:20},
 btn:{marginTop:14,backgroundColor:"#1D5FD1",padding:14,borderRadius:12,alignItems:"center"},
 white:{color:"#fff",fontWeight:"900"}
});
