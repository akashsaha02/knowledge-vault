declare module "next/types.js" {
  export type {
    Metadata,
    MetadataRoute,
    ResolvedMetadata,
    ResolvingMetadata,
    ResolvedViewport,
    ResolvingViewport,
    Viewport,
  } from "next/dist/lib/metadata/types/metadata-interface";
}

declare module "next/server.js" {
  export * from "next/dist/server/web/exports/index";
}

declare module "next/server" {
  export * from "next/dist/server/web/exports/index";
}

declare module "next/link" {
  export { default } from "next/dist/client/link";
  export * from "next/dist/client/link";
}

declare module "next/navigation" {
  export * from "next/dist/client/components/navigation";
}

declare module "next/headers" {
  export * from "next/dist/api/headers";
}

declare module "next/script" {
  export { default } from "next/dist/client/script";
  export * from "next/dist/client/script";
}

declare module "next/image" {
  export { default } from "next/dist/shared/lib/image-external";
  export * from "next/dist/shared/lib/image-external";
}

declare module "next/dynamic" {
  export { default } from "next/dist/shared/lib/dynamic";
  export * from "next/dist/shared/lib/dynamic";
}

declare module "next" {
  import next from "next/dist/server/next";
  export default next;
  export * from "next/dist/types";
}
