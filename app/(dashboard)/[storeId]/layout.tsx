import {auth} from "@clerk/next.js";
import {redirect} from "next/navigation"



export default async function DashboardLayout({
    children,
    params
}:{
    children:React.ReactNode;
    params:{storeId:string}
}){
    const {userId}=auth()

    if(!userId){
        redirect('/sign-in')
    }
}