import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {ChipsOverlay} from './ChipsOverlay';
import {DeviceMockups} from './DeviceMockups';
import {SalmonBackground} from './SalmonBackground';
import {SceneClose} from './SceneClose';
import {SceneIntro} from './SceneIntro';

// Timeline (30fps, 540 frames = 18s):
//  Intro     0:00–0:06  Favicon + statement (continuous salmon)     0–180
//  Devices   0:06–0:16  MacBook + iPhone (hold through chips)       180–480
//  Chips     0:12–0:16  Stat pills overlay above devices          360–480
//  Close     0:16–0:18  Navbar logo + URL                           480–540
export const Nutriservice: React.FC = () => {
  const frame = useCurrentFrame();

  const overlayOpacity = interpolate(
    frame,
    [0, 90, 180, 360, 480],
    [0.2, 0.22, 0.3, 0.28, 0.35],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill>
      <SalmonBackground overlayOpacity={overlayOpacity} />
      <Sequence from={0} durationInFrames={180}>
        <SceneIntro />
      </Sequence>
      <Sequence from={180} durationInFrames={300}>
        <DeviceMockups />
      </Sequence>
      <Sequence from={360} durationInFrames={120}>
        <ChipsOverlay />
      </Sequence>
      <Sequence from={480} durationInFrames={60}>
        <SceneClose />
      </Sequence>
    </AbsoluteFill>
  );
};
