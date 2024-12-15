import React, { ComponentType } from "react";

type WithDefaultLayoutProps = {};

export function withDefaultLayout<P extends object>(
  Component: ComponentType<P>
) {
  return function WithDefaultLayout(props: P & WithDefaultLayoutProps) {
    return (
      <div className="h-screen w-full flex justify-center">
        <div className="w-[392px] h-full border bg-white overflow-scroll p-4 ">
          <Component {...props} />
        </div>
      </div>
    );
  };
}
