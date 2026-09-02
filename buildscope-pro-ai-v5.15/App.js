import React from "react";
import {StripeProvider} from "@stripe/stripe-react-native";
import AppCore from "./AppCore";
import AppErrorBoundary from "./src/components/AppErrorBoundary";

const stripeKey=process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY||"";

export default function App(){
  const core=<AppErrorBoundary><AppCore/></AppErrorBoundary>;
  if(!stripeKey) return core;
  return <StripeProvider publishableKey={stripeKey} urlScheme="buildscopeproai">
    {core}
  </StripeProvider>;
}
