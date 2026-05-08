import type { Metadata } from "next";

import GooeySearchDemo from "@/21st-publish/gooey-search/demos/default/code.demo";

export const metadata: Metadata = {
  title: "Demo — Gooey Search",
  robots: { index: false, follow: false },
};

export default function GooeySearchDemoPage() {
  return <GooeySearchDemo />;
}
