export const baseTheme = {
  palette: {
    primary: {
      main: '#005aa0'
    },
    secondary: {
      main: '#5475a0'
    }
  },

  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained' as 'contained' | 'outlined' | 'text' | undefined
      }
    },
    MuiCardContent: {
      defaultProps: {
        sx: {
          '&:last-child': { paddingBottom: 2 }
        }
      }
    }
  }
}
