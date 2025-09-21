"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ImagePlus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onChangeMany?: (values: string[]) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
   disabled,
   onChange,
   onChangeMany,
   onRemove,
   value
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [uploading, setUploading] = useState(false);
  
    useEffect(() => {
      setIsMounted(true);
    }, []);
    
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            
            if (response.ok) {
                const data = await response.json();
                onChange(data.url);
            } else {
                console.error('Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };
  
    if (!isMounted) {
      return null;
    }

    return(
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) =>(
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                                <Trash className="h-4 w-4"/>
                            </Button>
                        </div>
                        <Image 
                        fill
                        className="object-cover"
                        alt="Image"
                        src={url}
                        />
                    </div>
                ) )}
            </div> 
            <div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={disabled || uploading}
                    style={{ display: 'none' }}
                    id="image-upload"
                />
                <Button
                    type="button"
                    disabled={disabled || uploading}
                    variant="secondary"
                    onClick={() => document.getElementById('image-upload')?.click()}
                >
                    <ImagePlus className="h-4 w-4 mr-2"/>
                    {uploading ? 'Uploading...' : 'Upload an Image'}
                </Button>
            </div>
        </div>
    )
};

 export default ImageUpload;