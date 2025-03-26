import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
  // define the part you're going to style
  root: {},

  tablist: {
    _light: {
      borderBottom: "1px",
      borderColor: "zinc.300",
    },

    _dark: {
      borderBottom: "1px",
      borderColor: "zinc.700",
    },
  },

  tab: {
    _light: {
      _selected: {
        fontWeight: "bold",
        color: "brand.600",
      },
    },

    _dark: {
      _selected: {
        fontWeight: "bold",
        color: "brand.600",
      },
    },
  },
  tabpanel: {},
});

// export the component theme
export const tabsTheme = defineMultiStyleConfig({ baseStyle });
