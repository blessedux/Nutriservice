import React from 'react';
import {Img, OffthreadVideo, staticFile} from 'remotion';

type Props = {
  // Full CSS transform string — caller controls entrance spring +
  // continuous floaty drift by composing translate/rotate/scale here.
  transform: string;
  opacity: number;
  screenSrc?: string;
  screenVideoSrc?: string;
};

export const MacBookMockup: React.FC<Props> = ({
  transform,
  opacity,
  screenSrc = macBookDefaultScreen,
  screenVideoSrc,
}) => {
  return (
    <div style={{transform, opacity, transformStyle: 'preserve-3d'}}>
      <div
        style={{
          width: 900,
          padding: '22px 22px 34px',
          borderRadius: 22,
          background: 'linear-gradient(155deg, #3a3f45, #15181c 60%, #0a0c0e)',
          boxShadow: '0 60px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        <div
          style={{
            position: 'relative',
            borderRadius: 8,
            overflow: 'hidden',
            background: '#000',
            aspectRatio: '16 / 10',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#1c1f22',
              border: '1px solid #333',
              zIndex: 2,
            }}
          />
          {screenVideoSrc ? (
            <OffthreadVideo
              src={screenVideoSrc}
              style={{width: '100%', height: '100%', objectFit: 'cover'}}
              muted
            />
          ) : (
            <Img
              src={screenSrc}
              style={{width: '100%', height: '100%', objectFit: 'cover'}}
            />
          )}
        </div>
        <div
          style={{
            marginTop: 14,
            height: 14,
            borderRadius: '0 0 10px 10px',
            background: 'linear-gradient(180deg, #2a2d31, #1a1c1f)',
          }}
        />
      </div>
    </div>
  );
};

export const macBookDefaultScreen = staticFile('screenshots/home.png');
export const macBookScrollVideo = staticFile('screenshots/homepage-scroll.webm');
