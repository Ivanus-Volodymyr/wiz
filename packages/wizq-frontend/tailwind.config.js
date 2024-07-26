/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html,mdx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      main: {
        primary: '#017EFF',
        secondary: '#0D1835',
        'primary-darker': '#10488A',
        hover: '#006DDE',
        active: '#004A96',
      },
      accent: {
        white: '#FFFFFF',
        yellow: '#EEB93E',
        red: '#ED4756',
        green: '#34BE6D',
      },
      label: {
        white: '#FFFFFF',
        disableBG: '#EDEDED',
        disable: '#808B95',
        'disable-light': '#EDEDED',
      },
      state: {
        activeFill: '#D9D9D9',
        error: '#ED4756',
        success: '#34BE6D',
        'active-fill': '#D9D9D9',
      },
      fill: {
        background: '#FAFAFA',
        border: '#DBDBDB',
      },
      hover: {
        primary: '#85C1FF',
        secondary: '#6E7486',
        proceed: '#85D8A7',
      },
      content: {
        primary: '#0D1835',
        secondary: '#3E4B6D',
        tertiary: '#B8C5D1',
        disabled: '#E2E7EC',
        informative: '#006DDE',
        positive: '#6FD79A',
        negative: '#ED4756',
        warning: '#EEB93E',
        warm: '#F2F4F8',
      },
      background: {
        default: '#FFFFFF',
        subtleNeutral: '#F9FAFB',
      },
      border: {
        default: '#CDD6EC',
        neutral: '#0D1835',
      },
    },
    fontSize: {
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px',
      '4xl': '32px',
      '5xl': '48px',
      '6xl': '64px',
    },
    extend: {
      fontFamily: {
        karla: ['Karla', 'latin'],
        montserrat: ['Montserrat', 'latin'],
      },
    },
  },
  plugins: [],
};
