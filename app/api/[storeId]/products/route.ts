import { NextResponse } from "next/server";
import {auth} from "@clerk/nextjs/server"
import prismadb from "@/lib/prismadb";

export async function POST(
    req:Request,
    {params}:{params: Promise<{storeId:string}>}
){
    try{
     const {userId}=await auth();
     const body=await req.json();

     const {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images,
        isFeatured,
        isArchived
     }=body;

      if (!userId) {
        return new NextResponse('Unauthenticated', {status: 401});}

      if (!name) {
        return new NextResponse('Name is required', {status: 400});
       }

       if (!images || !images.length) {
        return new NextResponse('Images are required', {status: 400});
       }

       if (!price) {
        return new NextResponse('Price is required', {status: 400});
       }

       if (!categoryId) {
        return new NextResponse('Category Id is required', {status: 400});
       }

       if (!colorId) {
        return new NextResponse('Color Id is required', {status: 400});
       }

       if (!sizeId) {
        return new NextResponse('Size Id is required', {status: 400});
       }

       const resolvedParams = await params;
       if(!resolvedParams.storeId){
        return new NextResponse('StoreId  is required', {status: 400});
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

       const product = await prismadb.product.create({
            data: {
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            isArchived,
            isFeatured,
            storeId: resolvedParams.storeId,
            images:{
                createMany:{
                    data: images.map((image:{url:string})=>({url: image.url}))
                }
            }
            }
        });

    return NextResponse.json(product);
} catch (error){
    console.log('[PRODUCTS_POST]',error);
    return new NextResponse("Internal error",{status:500});
}
};



export async function GET(
    req:Request,
    {params}:{params: Promise<{storeId:string}>}
){
    try{
        const {searchParams} =new URL (req.url);
        const categoryId=searchParams.get("categoryId") || undefined;
        const colorId=searchParams.get("colorId") || undefined;
        const sizeId=searchParams.get("sizeId") || undefined;
        const isfeatured=searchParams.get("isFeatured");

        const resolvedParams = await params;
       if(!resolvedParams.storeId){
        return new NextResponse('StoreId  is required', {status: 400});
       }

       const products = await prismadb.product.findMany({
            where:{
                storeId:resolvedParams.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isfeatured?true:undefined,
                isArchived:false
            },
            include:{
                images:true,
                category:true,
                color:true,
                size:true
            },
            orderBy:{
                createdAt:'desc'
            }
        });

    return NextResponse.json(products);
} catch (error){
    console.log('[PRODUCTS_GET]',error);
    return new NextResponse("Internal error",{status:500});
}
}