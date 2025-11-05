import cfonts from 'cfonts';

export function renderBanner() {
  cfonts.say('Roketin CLI', {
    font: '3d',
    align: 'left',
    colors: ['system'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
    gradient: false,
    independentGradient: true,
    transitionGradient: true,
    rawMode: false,
    env: 'node',
  });
}
