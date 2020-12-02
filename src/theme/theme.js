import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";

// colors
const primary = "#01579B";
const primaryLight = "#03A9F4";
const primaryDark = "#039BE5";
const secondary = "#263238";
const secondaryLight = "#4f5b62";
const secondaryDark = "000a12";
const white = "#ffffff";
const black = "#343a40";
const darkBlueGray = "#b3e5fc";
const darkBlack = "rgb(36, 40, 44)";
const background = "#ffffff";
const warningLight = "rgba(255,211,0)";
const warningMain = "rgba(254,46,46)";
const warningDark = "rgba(203,36,36)";

// border
const borderWidth = 2;
const borderColor = "rgba(0, 0, 0, 0.13)";

// breakpoints
const xl = 1920;
const lg = 1280;
const md = 960;
const sm = 600;
const xs = 0;

// spacing
const spacing = 8;

const theme = createMuiTheme({
  palette: {
    primary: { 
      main: primary,
      contrastText: "#fff",
    },
    primaryLight: { main: primaryLight },
    primaryDark: { main: primaryDark },
    secondary: { 
      main: secondary,
      contrastText: "#fff",
    },
    secondaryLight: { main: secondaryLight },
    secondaryDark: { main: secondaryDark },
    common: {
      black,
      darkBlack,
      white,
      darkBlueGray
    },
    warning: {
      light: warningLight,
      main: warningMain,
      dark: warningDark
    },
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
    background: {
      default: background
    },
    spacing
  },
  breakpoints: {
    // Define custom breakpoint values.
    // These will apply to Material-UI components that use responsive
    // breakpoints, such as `Grid` and `Hidden`. You can also use the
    // theme breakpoint functions `up`, `down`, and `between` to create
    // media queries for these breakpoints
    values: {
      xl,
      lg,
      md,
      sm,
      xs
    }
  },
  border: {
    borderColor: borderColor,
    borderWidth: borderWidth
  },
  overrides: {
    MuiExpansionPanel: {
      root: {
        position: "static"
      }
    },
    MuiTableCell: {
      root: {
        paddingLeft: spacing * 2,
        paddingRight: spacing * 2,
        borderBottom: `${borderWidth}px solid ${borderColor}`,
        [`@media (max-width:  ${sm}px)`]: {
          paddingLeft: spacing,
          paddingRight: spacing
        }
      }
    },
    MuiDivider: {
      root: {
        backgroundColor: borderColor,
        height: borderWidth
      }
    },
    MuiPrivateNotchedOutline: {
      root: {
        borderWidth: borderWidth
      }
    },
    MuiListItem: {
      divider: {
        borderBottom: `${borderWidth}px solid ${borderColor}`
      }
    },
    MuiDialog: {
      paper: {
        width: "100%",
        maxWidth: 430,
        marginLeft: spacing,
        marginRight: spacing
      }
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: darkBlack
      }
    },
    MuiExpansionPanelDetails: {
      root: {
        [`@media (max-width:  ${sm}px)`]: {
          paddingLeft: spacing,
          paddingRight: spacing
        }
      }
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: 'Roboto',
  },
  Button: {
    disableElevation: "True",
  }
});

export default responsiveFontSizes(theme);
