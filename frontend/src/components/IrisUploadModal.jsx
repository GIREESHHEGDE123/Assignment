import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Modal, Button } from 'react-bootstrap';
import { useBlobStorage } from './useBlobStorage';

const IrisUploadModal = ({ show, handleClose, onUpload }) => {
    const webcamRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [captureError, setCaptureError] = useState(null);
    const [imageData, setImageData] = useState(null);
    const { uploadBlob } = useBlobStorage();
    const [showWebcam, setShowWebcam] = useState(true);

    const handleCapture = async () => {
        setCaptureError(null);
        try {
            const imageSrc = webcamRef.current.getScreenshot();
            setImageData(imageSrc);
            setShowWebcam(false);
        } catch (error) {
            console.error('Error capturing image:', error);
            setCaptureError('Failed to capture image from webcam.');
        }
    };

    const handleRetake = () => {
        setImageData(null);
        setShowWebcam(true);
    };


    const handleUpload = async () => {
        if (!imageData) {
            setCaptureError('Please capture an image first.');
            return;
        }

        setUploading(true);
        setCaptureError(null);
        try {
            const blob = await fetch(imageData).then(res => res.blob());
            const blobName = `${new Date().getTime()}-iris.jpg`;
            const uploadUrl = await uploadBlob(blobName, blob);
            onUpload(uploadUrl);
            handleClose();
            setImageData(null);
            setShowWebcam(true);
        } catch (error) {
            console.error('Error uploading image:', error);
            setCaptureError('Failed to upload image to Azure Storage.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Capture or Upload Iris Image</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {captureError && <div className="alert-message">{captureError}</div>}
                {showWebcam && <Webcam audio={false} ref={webcamRef} />}
                {showWebcam && <Button variant="primary mt-2" onClick={handleCapture} disabled={uploading}>
                    Capture Image
                </Button>}
                {imageData && (
                    <div className="mt-3">
                        <img src={imageData} alt="Captured Iris" style={{ maxWidth: '100%' }} />
                        <Button variant="secondary mt-2" onClick={handleRetake}>Retake</Button>
                    </div>
                )}
                {uploading && <p>Uploading...</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={uploading}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleUpload} disabled={uploading || !imageData}>
                    Upload Image
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default IrisUploadModal;