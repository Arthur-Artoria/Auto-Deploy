import {
  OptionsObject,
  ProviderContext,
  SnackbarKey,
  SnackbarMessage,
  SnackbarOrigin,
  useSnackbar,
  VariantType
} from 'notistack';

type WrappedEnqueueSnackbar = {
  [v in VariantType]: (
    message: SnackbarMessage,
    options?: OptionsObject
  ) => SnackbarKey;
};

const wrapEnqueueSnackbar = (
  enqueueSnackbar: ProviderContext['enqueueSnackbar'],
  anchorOrigin: SnackbarOrigin
): WrappedEnqueueSnackbar => {
  const variants: VariantType[] = [
    'default',
    'error',
    'info',
    'success',
    'warning'
  ];

  return Object.fromEntries(
    variants.map((variant) => [
      variant,
      (message: SnackbarMessage, options?: OptionsObject) =>
        enqueueSnackbar(message, { variant, anchorOrigin, ...options })
    ])
  ) as WrappedEnqueueSnackbar;
};

export const useToast = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const anchorOrigin: SnackbarOrigin = {
    horizontal: 'center',
    vertical: 'top'
  };
  return {
    closeSnackbar,
    enqueueSnackbar: wrapEnqueueSnackbar(enqueueSnackbar, anchorOrigin)
  };
};
