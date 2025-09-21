import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET (
    req:Request,
    {params}: {params: {storeId:string, billboardId:string }}
){
    try{

        const resolvedParams = await params;
        if (!resolvedParams.billboardId){
            return new NextResponse("Billboard is required",{status:400});

        }

        const billboard=await prismadb.billboard.findUnique({
            where:{
                id:resolvedParams.billboardId
            }});

        return NextResponse.json(billboard);

    } catch(error){
      console.log('[BILLBOARD_GET]',error);
      return new NextResponse("internal error",{status:500});
}
};


export async function PATCH (
    req:Request,
    {params}: {params: {storeId:string,billboardId:string}}
){
    try{
        const {userId}=await auth();
        const body=await req.json();

        const {label,imageUrl} =body;

        if (!userId){
            return new NextResponse("Unauthenticated",{status:401});
        }

        if (!label){
            return new NextResponse("label is required",{status:400});
        }

        if (!imageUrl){
            return new NextResponse("Image URL is required",{status:400});
        }
        
        const resolvedParams = await params;
        if (!resolvedParams.billboardId){
            return new NextResponse("Billboard is required",{status:400});

        }

        const storeByUserId=await prismadb.store.findFirst({
        where:{
            id:resolvedParams.storeId,
            userId
        }
       });

       if (!storeByUserId){
        return new NextResponse("Unauthorized", {status:403})
       }

        const billboard=await prismadb.billboard.updateMany({
            where:{
                id:resolvedParams.billboardId,
            },
            data:{
                label,
                imageUrl
            }
        });

        return NextResponse.json(billboard);

    } catch(error){
      console.log('[BILLBOARD_PATCH]',error);
      return new NextResponse("internal error",{status:500});
}
};


export async function DELETE (
    req:Request,
    {params}: {params: {storeId:string, billboardId:string }}
){
    try{
        const {userId}=await auth();


        if (!userId){
            return new NextResponse("Unauthenticated",{status:401});
        }

        const resolvedParams = await params;
        if (!resolvedParams.billboardId){
            return new NextResponse("Billboard is required",{status:400});

        }

        
        const storeByUserId=await prismadb.store.findFirst({
        where:{
            id:resolvedParams.storeId,
            userId
        }
       });

       if (!storeByUserId){
        return new NextResponse("Unauthorized", {status:403})
       }

        const billboard=await prismadb.billboard.deleteMany({
            where:{
                id:resolvedParams.billboardId
            }});

        return NextResponse.json(billboard);

    } catch(error){
      console.log('[BILLBOARD_DELETE]',error);
      return new NextResponse("internal error",{status:500});
}
};

