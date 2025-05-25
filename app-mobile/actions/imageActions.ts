import { CONFIG } from "@/config";

interface ImageSendProps {
    uri : string,
}

export async function get_prediction({ uri }: ImageSendProps) {
    try {
        const formData = new FormData();
        
    
        formData.append("image", {
            uri: uri,
            name: uri.split('/').pop(),
            type: "image/jpeg"
        } as any);
        
        console.log("Sending request to:", `${CONFIG.backendUrl}/prediction_app`);
        console.log("With image:", uri);
        
        const response = await fetch(`${CONFIG.backendUrl}/prediction_app`, {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Server response error:", response.status, errorText);
            throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Data from backend:", data);
        return data;
    } catch (error) {
        console.error("Error in get_prediction:", error);
        throw error;
    }
}