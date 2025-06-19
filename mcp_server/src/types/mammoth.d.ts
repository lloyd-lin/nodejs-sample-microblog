declare module 'mammoth' {
  interface MammothResult {
    value: string;
    messages: Array<{
      type: string;
      message: string;
    }>;
  }

  interface MammothOptions {
    path?: string;
    buffer?: Buffer;
    transformDocument?: (document: any) => any;
    convertImage?: (image: any) => any;
    ignoreEmptyParagraphs?: boolean;
    includeDefaultStyleMap?: boolean;
    includeEmbeddedStyleMap?: boolean;
    styleMap?: string;
  }

  export function extractRawText(options: MammothOptions): Promise<MammothResult>;
  export function convertToHtml(options: MammothOptions): Promise<MammothResult>;
  export function convertToMarkdown(options: MammothOptions): Promise<MammothResult>;
} 