import { themeConfig } from '../../config.js';
const changeThemes = {
  id: 'changeThemes',
  label: 'themeSwitcher',
  defaultTheme: themeConfig.theme,
  options: [
    {
      themeName: 'themedefault',
      buttonColor: '#ffffff',
      textColor: '#323332'
    }
  ]
};
const topbarTheme = {
  id: 'topbarTheme',
  label: 'themeSwitcher.Topbar',
  defaultTheme: themeConfig.topbar,
  options: [
    {
      themeName: 'themedefault',
      buttonColor: '#ffffff',
      textColor: '#323332'
    }
  ]
};
const sidebarTheme = {
  id: 'sidebarTheme',
  label: 'themeSwitcher.Sidebar',
  defaultTheme: themeConfig.sidebar,
  options: [
    {
      themeName: 'themedefault',
      buttonColor: '#323332',
      backgroundColor: undefined,
      textColor: '#788195',
      contextStack: {
        currentContextColor: '#9ca8bd',
        contextColor: '#788195'
      }
    }
  ]
};
const layoutTheme = {
  id: 'layoutTheme',
  label: 'themeSwitcher.Background',
  defaultTheme: themeConfig.layout,
  options: [
    {
      themeName: 'themedefault',
      buttonColor: '#ffffff',
      backgroundColor: '#F1F3F6',
      textColor: undefined
    }
  ]
};
const customizedThemes = {
  changeThemes,
  topbarTheme,
  sidebarTheme,
  layoutTheme
};
export function getCurrentTheme(attribute, themeName) {
  let selectedTheme = {};
  customizedThemes[attribute].options.forEach(theme => {
    if (theme.themeName === themeName) {
      selectedTheme = theme;
    }
  });
  return selectedTheme;
}
export default customizedThemes;
