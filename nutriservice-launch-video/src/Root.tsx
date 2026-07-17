import React from 'react';
import {Composition} from 'remotion';
import {Nutriservice} from './Nutriservice';

// 1080x1080 square, 30fps, 18 seconds = 540 frames.
export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Nutriservice"
        component={Nutriservice}
        durationInFrames={540}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
