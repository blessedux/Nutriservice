import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile} from 'remotion';
import {palette} from './palette';

type Props = {
  /** Dark vignette over the salmon video for text legibility (0 = none). */
  overlayOpacity?: number;
};

export const salmonVideoSrc = staticFile('background/salmon-sequence.webm');

export const SalmonBackground: React.FC<Props> = ({overlayOpacity = 0.35}) => {
  return (
    <>
      <AbsoluteFill>
        <OffthreadVideo
          src={salmonVideoSrc}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
          muted
        />
      </AbsoluteFill>
      {overlayOpacity > 0 ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 40%, ${palette.bgDeep}cc, ${palette.bgNear}ee)`,
            opacity: overlayOpacity,
          }}
        />
      ) : null}
    </>
  );
};
