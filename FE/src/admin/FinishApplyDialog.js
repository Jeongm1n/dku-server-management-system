import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FinishApplyDialog({ dialogInfo, setDialogInfo, setHostDialogOpen }) {
    return (
        <div>
            <Dialog open={dialogInfo.open || false} TransitionComponent={Transition} keepMounted>
                <DialogTitle>{dialogInfo.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogInfo.content}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setDialogInfo({ ...dialogInfo, open: false });
                            setHostDialogOpen(false);
                        }}
                        color="primary"
                    >
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
