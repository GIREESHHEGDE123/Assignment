import { BlobServiceClient } from "@azure/storage-blob";

export const useBlobStorage = () => {
    const blobServiceUrl = import.meta.env.VITE_AZURE_BLOB_SERVICE_URL; // e.g., "https://<your-storage-account>.blob.core.windows.net"
    const sasToken = import.meta.env.VITE_AZURE_SAS_TOKEN; // SAS Token starting with `?sv=...`
    const containerName = import.meta.env.VITE_AZURE_CONTAINER_NAME || "iris-images";
    console.log(blobServiceUrl,sasToken,containerName)
    const uploadBlob = async (blobName, file) => {
        if (!blobServiceUrl || !sasToken) {
            throw new Error("Blob Service URL or SAS Token is missing.");
        }

        try {
            // Create a BlobServiceClient using the SAS URL
            const blobServiceClient = new BlobServiceClient(`${blobServiceUrl}`);

            // Get a reference to the container
            const containerClient = blobServiceClient.getContainerClient(containerName);

            // Get a reference to the blob
            const blobClient = containerClient.getBlockBlobClient(blobName);

            // Upload the file
            const uploadResponse = await blobClient.uploadData(file, {
                blobHTTPHeaders: { blobContentType: file.type }, // Set MIME type
            });

            console.log("Upload response:", uploadResponse);

            // Return the URL of the uploaded blob
            return blobClient.url;
        } catch (error) {
            console.error("Error uploading to Azure Blob Storage:", error);
            throw new Error(`Failed to upload to Azure Blob Storage: ${error.message}`);
        }
    };

    return { uploadBlob };
};
