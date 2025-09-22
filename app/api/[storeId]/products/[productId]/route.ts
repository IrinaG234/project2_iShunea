import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET (
    req:Request,
    {params}: {params: Promise<{productId:string}> }
){
    try{
        const resolvedParams = await params;

        if (!resolvedParams.productId){
            return new NextResponse("Product is required",{status:400});

        }

        const product=await prismadb.product.findUnique({
            where:{
                id:resolvedParams.productId
            },
        include:{
            images:true,
            category:true,
            color:true,
            size:true
        }});

        return NextResponse.json(product);

    } catch(error){
      console.log('[PRODUCT_GET]',error);
      return new NextResponse("internal error",{status:500});
}
};


export async function PATCH (
    req:Request,
    {params}: {params: Promise<{storeId:string,productId:string}>}
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
       if(!resolvedParams.productId){
        return new NextResponse('ProductId  is required', {status: 400});
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

         await prismadb.product.update({
            where:{
                id:resolvedParams.productId,
            },
            data:{
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images:{
                    deleteMany:{

                    }
                },
                isFeatured,
                isArchived
            }
        });

        const product = await prismadb.product.update({
            where:{
                id:resolvedParams.productId
            },
            data:{
                images:{
                    createMany:{
                        data: images.map((image:{url:string})=>({url: image.url}))
                    }

                }
            }
        })

        return NextResponse.json(product);

    } catch(error){
      console.log('[PRODUCT_PATCH]',error);
      return new NextResponse("internal error",{status:500});
}
};


export async function DELETE (
    req:Request,
    {params}: {params: Promise<{storeId:string, productId:string}> }
){
    try{
        const {userId}=await auth();
        const resolvedParams = await params;

        if (!userId){
            return new NextResponse("Unauthenticated",{status:401});
        }

        if (!resolvedParams.productId){
            return new NextResponse("Product is required",{status:400});

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

        const product=await prismadb.product.deleteMany({
            where:{
                id:resolvedParams.productId
            }});

        return NextResponse.json(product);

    } catch(error){
      console.log('[PRODUCT_DELETE]',error);
      return new NextResponse("internal error",{status:500});
}
};

