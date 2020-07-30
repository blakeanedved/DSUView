import { useState, useEffect } from "react";

const useGlobalStyleSheet = (id: string) => {
  const [stylesheet, setStylesheet] = useState<CSSStyleSheet>();
  const [sheetMounted, setSheetMounted] = useState(false);
  const [rules, setRules] = useState<{
    [name: string]: { index: number; rule: string };
  }>({});

  const addRule = (name: string, rule: string) => {
    if (!rules[name]) {
      rules[name] = {
        index: stylesheet?.insertRule(rule) || -1,
        rule,
      };
      setRules(rules);
    }
  };

  const updateRule = (name: string, rule: string) => {
    if (rules[name]) {
      stylesheet?.removeRule(rules[name].index);
      delete rules[name];
    }
    rules[name] = {
      index: stylesheet?.insertRule(rule) || -1,
      rule,
    };
    setRules(rules);
  };

  const removeRule = (name: string) => {
    if (rules[name]) {
      stylesheet?.removeRule(rules[name].index);
      delete rules[name];
      setRules(rules);
    }
  };

  useEffect(() => {
    const tempStylesheet: HTMLStyleElement = document.createElement("style");
    tempStylesheet.id = id;
    document.head.appendChild(tempStylesheet);
    setTimeout(() => {
      if (tempStylesheet.sheet) {
        setStylesheet(tempStylesheet.sheet as any);
        setSheetMounted(true);
      }
    }, 1);

    return () => {
      document.head.removeChild(tempStylesheet);
    };
  }, []);

  return { addRule, updateRule, removeRule, sheetMounted };
};

export default useGlobalStyleSheet;
