import React from 'react';
import Modal from 'react-responsive-modal';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';
import { useTranslation } from './app-state';
import './DeleteAddressDialog.scss';
import {
  Button,
  IconButton
} from '@material-ui/core';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import {
  CancelOutlined,
  DeleteOutlined
} from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
      button: {
        margin: theme.spacing(1),
      },
    buttonWarning: {
      margin: theme.spacing(1),
      backgroundcolor: theme.palette.warning.main,
    },
  }),
);

const ColorButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700],
    },
  },
}))(Button);

interface DeleteAddressDialogParams {
  handleCancelDelete: (...args: any[]) => any,
  onDeleteAddress: (...args: any[]) => any,
  isDeleteModalOpen: boolean,
  isLoading: boolean,
}

export const DeleteAddressDialog: React.FC<DeleteAddressDialogParams> = (props) => {
  const { handleCancelDelete, onDeleteAddress, isDeleteModalOpen, isLoading } = props;

  const { t } = useTranslation();
  const classes = useStyles();

  return (
  <Modal open={isDeleteModalOpen} onClose={handleCancelDelete} classNames={{modal: 'addressdelete'}} showCloseIcon={false}>
    {
      (isLoading) ? <div className="epminiLoader --centered"/> : ('')
    }
    <div className={`addressdelete__content ${isLoading ? '--loading' : ''}`}>
      <div className="addressdelete__header">
        <h2 className="addressdelete__title">
          {t('delete-address')}
        </h2>
        <IconButton aria-label="close" onClick={handleCancelDelete} className={classes.margin}>
          <CancelOutlined fontSize="inherit" />
        </IconButton>
      </div>
      <div className="addressdelete__body">
        {t('delete-address-message')}
      </div>
      <div className="epform__group --btncontainer">
      <Button
            variant="outlined"
            className={classes.button}
            onClick={handleCancelDelete}
            color="primary"
            startIcon={< CancelOutlined />}
          > {t('cancel')}
        </Button>
        <ColorButton
            variant="contained"
            onClick={onDeleteAddress}
            disableElevation
            startIcon={< DeleteOutlined />}
            color="primary"
          > {t('delete')}
        </ColorButton>
      </div>
    </div>
  </Modal>
  )
};
