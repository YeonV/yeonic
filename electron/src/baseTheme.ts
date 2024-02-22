export const baseTheme = {
  palette: {
    primary: {
      main: '#005aa0'
    },
    secondary: {
      main: '#FFDC0F'
    }
  },

  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained' as 'contained' | 'outlined' | 'text' | undefined
      }
    }
  }
}
