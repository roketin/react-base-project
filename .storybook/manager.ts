import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const theme = create({
  base: 'dark',
  brandTitle: 'roketin',
  brandImage:
    'https://cms.roketin.com/uploads/Elemen_Brand_Roketin_03_ee99155544.jpg',
  brandTarget: '_self',
});

addons.setConfig({
  theme,
});
