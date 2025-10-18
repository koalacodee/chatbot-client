import { ReactNode } from "react";

export default function SmartText({ children }: { children: ReactNode }) {
  return (
    <p dir="auto" style={{ unicodeBidi: "plaintext" }}>
      {children}
    </p>
  );
}
