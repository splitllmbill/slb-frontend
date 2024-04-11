import { Alert } from 'react-bootstrap';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';

interface FriendLinkProps {
    friendCode: string;
    dismissable: boolean;
}

const FriendLink: React.FC<FriendLinkProps> = ({ friendCode, dismissable }) => {

    const appTitle = import.meta.env.VITE_APP_TITLE;

    const handleCopyToClipboard = (text: string, type: string) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    alert('Copied ' + type + ' to clipboard!');
                })
                .catch((err) => {
                    console.error('Failed to copy: ', err);
                    fallbackCopyTextToClipboard(text,type);
                });
        } else {
            fallbackCopyTextToClipboard(text,type);
        }
    };
    
    function fallbackCopyTextToClipboard(text: string, type: string) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            alert('Copied ' + type + ' code to clipboard!');
        } catch (err) {
            console.error('Failed to copy ', err);
        }
        document.body.removeChild(textArea);
    }

    const getFriendLink = (code: string) => {
        return `${location.origin}/add-friend/${code}`
    }

    return (
        <Alert variant='primary' style={{ width: '100%' }} dismissible={dismissable}>
            Share this unique friend code <a style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => handleCopyToClipboard(friendCode, 'friend code')}>{friendCode} </a> or this friend link 
            <Tooltip title="Share Friend Link">
                <IconButton
                    size="small"
                    style={{ width: 'auto', height: 'auto', paddingTop: '3px' }}
                    onClick={() => handleCopyToClipboard(getFriendLink(friendCode), 'friend link')}
                >
                    <InsertLinkOutlinedIcon style={{ color: 'royalblue' }} />
                </IconButton>
            </Tooltip>
            with friends who want to add you on {appTitle} !
        </Alert>
    );
};

export default FriendLink;
