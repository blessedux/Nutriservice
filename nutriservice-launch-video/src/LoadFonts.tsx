import {loadFont as loadIBMPlexSans} from '@remotion/google-fonts/IBMPlexSans';
import {loadFont as loadIBMPlexMono} from '@remotion/google-fonts/IBMPlexMono';

const {fontFamily: sansFamily} = loadIBMPlexSans('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

const {fontFamily: monoFamily} = loadIBMPlexMono('normal', {
  weights: ['400', '500', '600'],
  subsets: ['latin'],
});

export const loadedFonts = {
  sans: sansFamily,
  mono: monoFamily,
};
