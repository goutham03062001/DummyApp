import { Alert } from "react-native";
import React,{useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RazorpayCheckout from 'react-native-razorpay';
import axios from "axios";
const BACKEND_API_URL="";
async function CreateOrder(){
    const[loading,setLoading] = useState(false);
    const[currentOrderId,setCurrentOrderId] = useState(null);
    // const body = {receiptName:}
    const currentUserName = "Goutham" //getUsername dynamically
    const body = {receiptName : currentUserName};
    const config ={
      headers:{
        "Content-Type":"application/json"
      }
    }
      try {
      setLoading(true);
      const response = await axios.post(BACKEND_API_URL+"/api/razorpay/makeNewPayment",body,config);
      if(response.data){
        setLoading(false);
        async function setTimeOutFunction(){
          setTimeout(()=>{
          
            return setCurrentOrderId(response.data.id)
          },2000);
          await AsyncStorage.setItem("currentOrderId",response.data.id);
          await AsyncStorage.setItem("currentOrderId1",currentOrderId);
        }
          setTimeOutFunction();
          const thresholdAmount = 1000;
          var options = {
            description: 'Demo Payment App',
            image: require("./assets/icon.png"),
            currency: 'INR',
            key: 'rzp_live_J89zrEvhSQ2i1m',
            amount: thresholdAmount*100,
            name: 'Demo App',
            order_id: response.data.id,//Replace this with an order_id created using Orders API.
            prefill: {
              email:"gouthamp0306@gmail.com",
              contact: "+911232",
              name: "Goutham",
              address : "5-3 "
            },
            theme: {color: '#53a20e'}
          }
          RazorpayCheckout.open(options).then((data) => {
            // handle success
            alert(`Success: ${data.razorpay_payment_id}`);
           alert(`Order: ${data.razorpay_order_id}`);
            setTimeout(()=>{
            // updateAuthorization(data.razorpay_payment_id,userEmail,userId,userMobile,data,userName,response.data.id,data.razorpay_order_id)
        
            },2000);
            
          }).catch((error) => {
            setLoading(false);
            Alert.alert("Error ",error.description)
        
          });
      }
      else{
        return Alert.alert("Error Occurred","Error occurred while creating payment order");
      }
      } catch (error) {
        return Alert.alert("Error Occurred",error.message)
      }
  
    }