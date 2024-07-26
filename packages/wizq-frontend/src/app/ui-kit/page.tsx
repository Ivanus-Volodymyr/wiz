'use client';
import React from 'react';
import AccessAlarm from '@mui/icons-material/AccessAlarm';
import Button from '../../components/common/Button';
import IconsArticle from './IconsArticle';

// list the class names explicitly so Tailwind adds them to the build
const bg = [
  'bg-main-primary',
  'bg-main-primary-darker',
  'bg-main-secondary',
  'bg-accent-white',
  'bg-accent-yellow',
  'bg-accent-red',
  'bg-accent-green',
  'bg-label-white',
  'bg-label-disable',
  'bg-label-disable-light',
  'bg-fill-background',
  'bg-fill-border',
  'bg-state-active-fill',
  'bg-state-error',
  'bg-state-success',
  'bg-hover-primary',
  'bg-hover-secondary',
  'bg-hover-proceed',
];
const text = ['text-sm', 'text-base', 'test-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-6xl'];

const UiElementsPage = () => {
  return (
    <div className="p-2">
      <style jsx>{`
        article {
          margin-top: 30px;
        }
      `}</style>
      <h1 className="text-2xl mb-4">Ui Elements</h1>
      <article>
        <h2 className="text-xl mb-2">Colors</h2>
        <div className="text-xs">
          {bg.map((className) => (
            <div key={className} className="inline-block p-4 w-48 text-center align-middle">
              <div className={`${className} w-24 h-24 inline-block`}></div>
              <br />
              <code>{className}</code>
              <br />
              <code>text-{className.replace('bg-', '')}</code>
              <br />
              <code>border-{className.replace('bg-', '')}</code>
            </div>
          ))}
        </div>
      </article>
      <article>
        <h2 className="text-xl mb-2">Typography</h2>
        <div>
          {text.map((className) => (
            <div key={className} className="inline-block p-4 w-32 text-center align-middle">
              <div className={`${className} inline-block`}>Text</div>
              <br />
              <code>{className}</code>
            </div>
          ))}
        </div>
      </article>
      <article>
        <h2 className="text-xl mb-2">Buttons (normal, icon, loading, disabled)</h2>
        <div>
          {(['primary', 'secondary', 'success'] as const).map((color) => {
            return [false, true].map((outline) => {
              return (
                <div key={color + String(outline)}>
                  <Button color={color} outline={outline} className="m-1">
                    {color}
                  </Button>
                  <Button color={color} outline={outline} className="m-1">
                    <AccessAlarm className="mr-2" />
                    {color}
                  </Button>
                  <Button color={color} isLoading outline={outline} className="m-1">
                    {color}
                  </Button>
                  <Button color={color} disabled outline={outline} className="m-1">
                    {color}
                  </Button>
                  <br />
                  <code>{`<Button color="${color}" outline={${String(outline)}}>${color}</Button>`}</code>
                </div>
              );
            });
          })}
        </div>
      </article>
      <article>
        <h2 className="text-xl mb-2">Icons</h2>
        <IconsArticle />
      </article>
    </div>
  );
};

export default UiElementsPage;
