import React, { ComponentType } from "react";

type WithDefaultLayoutProps = {};

export function withDefaultLayout<P extends object>(
  Component: ComponentType<P>
) {
  return function WithDefaultLayout(props: P & WithDefaultLayoutProps) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <div className="w-[392px] h-full border bg-red-50">
          <Component {...props} />
        </div>
      </div>
    );
  };
}
