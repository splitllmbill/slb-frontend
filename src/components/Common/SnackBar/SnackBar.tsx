import { Snackbar, SnackbarContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CustomSnackbarProps {
    open: boolean;
    message: string;
    handleClose?: () => void; // Define onClose prop type
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({ open, message, handleClose }) => {

    return (
        <Snackbar
            style={{ marginTop: '20px' }}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            autoHideDuration={6000} 
            onClose={handleClose}
        >
            <SnackbarContent
                message={message}
                action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />
        </Snackbar>
    );
};

export default CustomSnackbar;
