"use client";

import React, { useEffect } from "react";

const isReadyStateMatch = (expected) => {
  if (!expected) {
    return true;
  }
  if (typeof expected === "string" && document.readyState === expected) {
    return true;
  }
  return expected.indexOf(document.readyState) !== -1;
};

const useReadyStateEffect = (effect, deps = [], onState = "complete") => {
  useEffect(() => {
    const destructors = [
      () => document.removeEventListener("readystatechange", listener),
    ];
    
    const listener = () => {
      if (!isReadyStateMatch(onState)) {
        return;
      }
      const destructor = effect();
      if (destructor) {
        destructors.push(destructor);
      }
    };
    
    listener();
    document.addEventListener("readystatechange", listener);
    
    return () => destructors.forEach((d) => d());
  }, deps);
};

function VLibras({ forceOnload }) {
  useReadyStateEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
      script.async = true;
      const widgetUrl = `https://vlibras.gov.br/app`;
      
      script.onload = () => {
        new window.VLibras.Widget(widgetUrl);
        if (forceOnload) {
          window.onload();
        }
      };
      
      document.head.appendChild(script);
    },
    [forceOnload],
    "complete"
  );

  return (
    <div vw="true" className="enabled">
      <div vw-access-button="true" className="active" />
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper" />
      </div>
    </div>
  );
}

export default VLibras;