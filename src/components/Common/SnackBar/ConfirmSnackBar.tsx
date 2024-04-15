import { Snackbar, SnackbarContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { Flex } from '../../../App.styled';

interface ConfirmSnackbarProps {
    open: boolean;
    message: string;
    handleSetConfirmation: () => void;
    handleClose: () => void;
}

const ConfirmSnackbar: React.FC<ConfirmSnackbarProps> = ({ open, message, handleSetConfirmation, handleClose }) => {

    return (
        <Snackbar
            style={{ marginTop: '20px' }}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            onClose={() => handleClose()}
            autoHideDuration={null}
        >
            <SnackbarContent
                message={message}
                action={
                    <>
                        <Flex>
                            <CheckIcon fontSize="small" style={{color:"lawngreen"}} onClick={() => handleSetConfirmation()} />
                            <CloseIcon fontSize="small" style={{color:"red"}}  onClick={() => handleClose()} />
                        </Flex>
                    </>
                }
            />
        </Snackbar>
    );
};

export default ConfirmSnackbar;
