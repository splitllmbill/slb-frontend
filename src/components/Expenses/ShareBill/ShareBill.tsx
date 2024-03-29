import { ChangeEvent,  useState } from 'react';
import { DashboardContainer } from '../../../App.styled';

const ShareBill = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        // Handle the upload logic here, you can use selectedFile state
        console.log("File uploaded:", selectedFile);
        // You can send the selectedFile to the server for further processing
    };

    return (
        <DashboardContainer>
            <h2>Share a bill</h2>
            <p>Upload receipts, split expenses, and track shared costs effortlessly!</p>
            <br />
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />
            <button onClick={handleUpload}>Upload</button>
        </DashboardContainer>
    );
};

export default ShareBill;
