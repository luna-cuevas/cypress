"use client";
import Hotjar from "@hotjar/browser";

const siteId = Number(process.env.NEXT_PUBLIC_HOTJAR_ID);
const hotjarVersion = 6;

Hotjar.init(siteId, hotjarVersion);
