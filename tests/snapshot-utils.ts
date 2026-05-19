const normalizeGeneratedIds = (markup: string) => markup
  .replace(/id="ds-(input|textarea|checkbox|radio|switch)-[a-f0-9-]+"/g, 'id="ds-$1-<id>"')
  .replace(/for="ds-(input|textarea|checkbox|radio|switch)-[a-f0-9-]+"/g, 'for="ds-$1-<id>"')
  .replace(/aria-describedby="([^"]+)"/g, (_match, value: string) => {
    const normalized = value
      .replace(/ds-(input|textarea)-[a-f0-9-]+-(helper|error|counter|footer)/g, 'ds-$1-<id>-$2');

    return `aria-describedby="${normalized}"`;
  })
  .replace(/id="ds-(input|textarea)-[a-f0-9-]+-(helper|error|counter|footer)"/g, 'id="ds-$1-<id>-$2"');

const normalizeLitMarkers = (markup: string) => markup.replace(/<!--\?lit\$[0-9$]+\$-->/g, '');

const normalizeWhitespace = (markup: string) => markup
  .replace(/\n\s+/g, '\n')
  .trim();

export const serializeShadowRoot = (element: Element & { shadowRoot: ShadowRoot | null }) => {
  const markup = element.shadowRoot?.innerHTML ?? '';
  return normalizeWhitespace(normalizeGeneratedIds(normalizeLitMarkers(markup)));
};
