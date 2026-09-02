import React,{useState}from"react";
import{Pressable,Text,Alert}from"react-native";
import{useStripe}from"@stripe/stripe-react-native";
import{createStripeIntent}from"../services/stripePayments";

export default function PaymentSheetButton({paymentRequestId,merchantName="BuildScope Pro AI"}){
  const{initPaymentSheet,presentPaymentSheet}=useStripe();
  const[busy,setBusy]=useState(false);

  async function pay(){
    try{
      setBusy(true);
      const intent=await createStripeIntent(paymentRequestId);
      const init=await initPaymentSheet({
        merchantDisplayName:merchantName,
        paymentIntentClientSecret:intent.clientSecret
      });
      if(init.error) throw new Error(init.error.message);

      const shown=await presentPaymentSheet();
      if(shown.error) throw new Error(shown.error.message);

      Alert.alert("Payment submitted","BuildScope will confirm payment from the server.");
    }catch(e){Alert.alert("Payment",String(e.message||e))}
    finally{setBusy(false)}
  }
  return <Pressable onPress={pay} disabled={busy}
    style={{backgroundColor:"#1D5FD1",padding:15,borderRadius:14,alignItems:"center"}}>
    <Text style={{color:"#fff",fontWeight:"900"}}>{busy?"Processing…":"Pay securely"}</Text>
  </Pressable>
}
