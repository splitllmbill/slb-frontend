import { ChangeEvent, useState } from 'react';
import { DashboardContainer, TableLikeRow, TableLikeRowItem } from '../../../App.styled';
import { Row, Col, Button } from 'react-bootstrap';
import dataService from '../../../services/DataService';
import { AiOutlineDoubleRight } from 'react-icons/ai';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useLocation } from 'react-router-dom';

const ShareBill = () => {
    const [selectedFile, setSelectedFile] = useState<File>();
    const [showTable, setShowTable] = useState<boolean>(false);
    const [showLoader, setShowLoader] = useState<boolean>(false);
    const [ocrOutput, setOcrOutput] = useState({
        items: [{ amount: 0, item_name: "", quantity: 1, slno: 1, total_amount: 0 }],
        tax: [{ amount: 0, percent: 0, type: "" }]
    });
    const location = useLocation();
    const users = location.state?.users || [];

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (selectedFile) {
            setShowLoader(true);
            setShowTable(false);
            try {
                const data = await dataService.fileUpload(selectedFile);
                setShowLoader(false);
                setOcrOutput(data.ocroutput);
                setShowTable(true);
            } catch (error) {
                console.error('Error uploading file:', error);
                setShowLoader(false);
            }
        } else {
            alert("Invalid file!");
        }
    };

    return (
        <DashboardContainer>
            <h2>Share a bill</h2>
            <p>Upload receipts, split expenses, and track shared costs effortlessly!</p>
            <br />
            <Row className="align-items-center">
                <Col xs={12} md={6}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </Col>
                {window.innerWidth <= 500 && (<><br /><br /></>)}
                <Col xs={12} md={6}>
                    <Button variant="secondary" onClick={handleUpload}>Upload</Button>
                </Col>
            </Row>
            <br />
            {showLoader && (<div className="d-flex justify-content-center align-items-center"><CircularProgress color="secondary" variant="indeterminate" /></div>)}
            {showTable && (
                <>
                    {ocrOutput.items.map((item, index) => (
                        <TableLikeRow key={index}>
                            <TableLikeRowItem>
                                <AiOutlineDoubleRight style={{ fontSize: window.innerWidth <= 500 ? 'large' : 'x-large' }} />
                            </TableLikeRowItem>
                            <div style={{ flex: '2' }}>
                                <TableLikeRowItem>
                                    <div><b>Item Name:</b> {item.item_name}</div>
                                    <div><b>Quantity:</b> {item.quantity}</div>
                                </TableLikeRowItem>
                            </div>
                            <div style={{ flex: '1' }}>
                                <div><b>Cost:</b> Rs. {item.total_amount}</div>
                            </div>
                            <div style={{ flex: '1', marginLeft: '10px', marginRight: 'auto' }}>
                                <Autocomplete
                                    id="disable-clearable"
                                    options={users}
                                    getOptionLabel={(option) => option.name}
                                    disableClearable
                                    renderInput={(params) => (
                                        <TextField {...params} placeholder="Enter the payee" />
                                    )}
                                />
                            </div>
                        </TableLikeRow>
                    ))}
                    {ocrOutput.tax.map((tax, index) => (
                        <TableLikeRow key={index}>
                            <TableLikeRowItem>
                                <AiOutlineDoubleRight style={{ fontSize: 'x-large' }} />
                            </TableLikeRowItem>
                            <div style={{ flex: '2' }}>
                                <div><b>Tax Type:</b> {tax.type}</div>
                                <div><b>Amount:</b> Rs. {tax.amount}</div>
                            </div>
                            <div style={{ flex: '1' }}>
                                <div><b>Percentage:</b> {tax.percent}%</div>
                            </div>
                            <div style={{ flex: '1', marginLeft: '10px', marginRight: 'auto' }}>
                                <Autocomplete
                                    id="disable-clearable"
                                    options={users}
                                    getOptionLabel={(option) => option.name}
                                    disableClearable
                                    renderInput={(params) => (
                                        <TextField {...params} placeholder="Enter the payee" />
                                    )}
                                />
                            </div>
                        </TableLikeRow>
                    ))}
                </>)}
        </DashboardContainer>
    );
};

export default ShareBill;
