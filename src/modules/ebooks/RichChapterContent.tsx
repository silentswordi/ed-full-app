import React, { useEffect, useRef, useState } from 'react';
import { getEbookAsset } from './ebookDb';
import { highlightTextSegments } from './ebookSearch';
import { BookDirection } from './types';

interface InlineAssetFigureProps {
  assetKey: string;
  alt?: string;
  refreshKey?: number;
}

export const InlineAssetFigure: React.FC<InlineAssetFigureProps> = ({
  assetKey,
  alt = 'تصویر کتاب',
  refreshKey = 0,
}) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!assetKey) return;
    let active = true;
    let objectUrl: string | null = null;

    getEbookAsset(assetKey)
      .then((blob) => {
        if (!active || !blob || blob.size === 0) return;
        objectUrl = URL.createObjectURL(blob);
        setImgUrl(objectUrl);
      })
      .catch(() => {
        // Ignore missing asset
      });

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [assetKey, refreshKey]);

  if (!imgUrl) return null;

  return (
    <figure className="my-4 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center">
      <img
        src={imgUrl}
        alt={alt}
        loading="lazy"
        className="max-w-full h-auto rounded-lg bg-white mx-auto"
      />
    </figure>
  );
};

interface RichTopicHtmlViewProps {
  htmlContent: string;
  dir: BookDirection;
  fontSizeClass: string;
  highlightQuery?: string;
  onRendered?: () => void;
}

export const RichTopicHtmlView: React.FC<RichTopicHtmlViewProps> = ({
  htmlContent,
  dir,
  fontSizeClass,
  highlightQuery,
  onRendered,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [renderedHtml, setRenderedHtml] = useState(htmlContent);

  useEffect(() => {
    let active = true;
    const createdUrls: string[] = [];

    const hydrateAssets = async () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      // Resolve all data-ebook-asset images / SVG <image> elements from IndexedDB
      const assetNodes = Array.from(doc.querySelectorAll('[data-ebook-asset]'));
      for (const node of assetNodes) {
        const key = node.getAttribute('data-ebook-asset');
        if (!key) continue;
        try {
          const blob = await getEbookAsset(key);
          if (!active) return;
          if (blob) {
            const url = URL.createObjectURL(blob);
            createdUrls.push(url);
            if (node.tagName.toLowerCase() === 'img') {
              node.setAttribute('src', url);
            } else {
              node.setAttribute('href', url);
              node.setAttribute('xlink:href', url);
            }
          }
        } catch {
          // ignore missing asset
        }
      }

      // Highlight matched search text inside text nodes safely
      const q = highlightQuery?.trim();
      if (q) {
        const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
        const textNodes: Text[] = [];
        let current = walker.nextNode();
        while (current) {
          const parentTag = current.parentElement?.tagName.toLowerCase();
          if (parentTag !== 'script' && parentTag !== 'style' && current.textContent?.trim()) {
            textNodes.push(current as Text);
          }
          current = walker.nextNode();
        }

        for (const tn of textNodes) {
          const segs = highlightTextSegments(tn.textContent || '', q);
          if (segs.some((s) => s.highlight)) {
            const frag = doc.createDocumentFragment();
            for (const seg of segs) {
              if (seg.highlight) {
                const mark = doc.createElement('mark');
                mark.setAttribute('data-reader-match', 'true');
                mark.className =
                  'bg-amber-200/90 dark:bg-amber-500/35 text-slate-950 dark:text-amber-100 rounded px-0.5 font-semibold';
                mark.textContent = seg.text;
                frag.appendChild(mark);
              } else {
                frag.appendChild(doc.createTextNode(seg.text));
              }
            }
            tn.parentNode?.replaceChild(frag, tn);
          }
        }
      }

      if (active) {
        setRenderedHtml(doc.body.innerHTML);
      }
    };

    hydrateAssets();

    return () => {
      active = false;
      for (const u of createdUrls) {
        URL.revokeObjectURL(u);
      }
    };
  }, [htmlContent, highlightQuery]);

  useEffect(() => {
    if (onRendered) {
      onRendered();
    }
  }, [renderedHtml, onRendered]);

  return (
    <div
      ref={containerRef}
      dir={dir}
      className={`ebook-rich-content ${dir === 'ltr' ? 'text-left' : 'text-right'} ${fontSizeClass} text-slate-800 dark:text-slate-200 space-y-3 break-words
        [&_h1]:text-[1.22em] [&_h1]:font-extrabold [&_h1]:text-[#0b4f8a] dark:[&_h1]:text-sky-300 [&_h1]:border-b-[3px] [&_h1]:border-[#4b7bb5]/85 dark:[&_h1]:border-sky-500/65 [&_h1]:pb-1.5 [&_h1]:mt-6 [&_h1]:mb-3
        [&_h2]:text-[1.14em] [&_h2]:font-extrabold [&_h2]:text-[#0b4f8a] dark:[&_h2]:text-sky-300 [&_h2]:border-b-[3px] [&_h2]:border-[#4b7bb5]/85 dark:[&_h2]:border-sky-500/65 [&_h2]:pb-1.5 [&_h2]:mt-6 [&_h2]:mb-3
        [&_h3]:text-[1.06em] [&_h3]:font-bold [&_h3]:text-[#0f5b99] dark:[&_h3]:text-sky-400 [&_h3]:border-b-2 [&_h3]:border-[#5b87bd]/65 dark:[&_h3]:border-sky-500/45 [&_h3]:pb-1 [&_h3]:mt-5 [&_h3]:mb-2
        [&_h4]:text-[1.02em] [&_h4]:font-bold [&_h4]:text-[#0f5b99] dark:[&_h4]:text-sky-400 [&_h4]:border-b [&_h4]:border-[#5b87bd]/45 dark:[&_h4]:border-sky-500/35 [&_h4]:pb-1 [&_h4]:mt-4 [&_h4]:mb-1.5
        [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:my-4 [&_img]:mx-auto [&_img]:border [&_img]:border-slate-200 dark:[&_img]:border-slate-700 [&_img]:bg-white
        [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:my-4 [&_svg]:mx-auto
        [&_figure]:my-4 [&_figure]:p-3 [&_figure]:rounded-xl [&_figure]:bg-slate-50 dark:[&_figure]:bg-slate-950/60 [&_figure]:border [&_figure]:border-slate-200 dark:[&_figure]:border-slate-800
        [&_figcaption]:text-xs [&_figcaption]:font-semibold [&_figcaption]:text-[#0b4f8a] dark:[&_figcaption]:text-sky-300 [&_figcaption]:mt-2 [&_figcaption]:text-center
        [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-xs sm:[&_table]:text-sm [&_table]:block [&_table]:overflow-x-auto
        [&_th]:border [&_th]:border-slate-300 dark:[&_th]:border-slate-700 [&_th]:bg-slate-100 dark:[&_th]:bg-slate-800 [&_th]:px-3 [&_th]:py-2 [&_th]:font-bold
        [&_td]:border [&_td]:border-slate-200 dark:[&_td]:border-slate-800 [&_td]:px-3 [&_td]:py-2
        [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:ps-6 [&_ol]:space-y-1.5
        [&_p]:my-2.5 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:rounded-xl [&_blockquote]:bg-slate-100/70 dark:[&_blockquote]:bg-slate-800/60`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
