import React from 'react';
import styled from 'styled-components';

const illustrationUrl = 'https://merriam-webster.com/assets/mw/static/art/dict/';

interface DefListProps {
  definitions: any[] | null;
}

const DefList: React.FC<DefListProps> = ({ definitions }) => {
  function parseEntry(text: string) {
    return text
      .replace(/^\{bc\}/, '')
      .replace(/( )?\{bc\}/g, ': ')
      .replace(/( )?\{dx\}/g, '<br /><small>')
      .replace(/( )?\{\/dx\}/g, '</small>')
      .replace(/(?:\{sx\|)([\w\s]+)(?:[|])([\w\s]+)\|\}/g, (_, text, href) =>
        `<a href="?q=${href}">${text}</a>`
      )
      .replace(/(?:\{it\})([\w\s.,:+-]+)(?:\{\/it\})/g, (_, text) => `<em>${text}</em>`)
    ;
  }

  return (
    <dl>
      {definitions && definitions.filter((def: any) => typeof def !== 'string').length > 0
        ? definitions.map((definition: any) => (
          <>
            <dt key={definition.meta?.id}>
              {definition.meta?.id} <em>{definition.fl}</em>
            </dt>
            <dd>
              {definition.def?.map((def: any, idx: number) => (
                <div key={idx}>
                  {def.sseq.map((sseq: any, idx: number) => (
                    <div key={idx}>
                      {sseq.map((sense: any, idx: number) => (
                        <div key={idx}>
                          <strong>{sense?.[1]?.sn}</strong><br />
                          <div dangerouslySetInnerHTML={{ __html: parseEntry(sense?.[1]?.dt?.[0]?.[1]) }} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
              {definition.art && (
                <figure>
                  <Img src={`${illustrationUrl}${definition.art.artid}.gif`} alt="" />
                  <Figcaption>
                    <div dangerouslySetInnerHTML={{ __html: parseEntry(definition.art.capt) }} />
                  </Figcaption>
                </figure>
              )}
            </dd>
          </>
        )
      ) : definitions && (
        <div>
          <p>No definition found.</p>
          {definitions?.length && (
            <>
              <p>Did you mean:</p>
              <ul>
                {definitions.map((def: string) => (
                  <li key={def}>
                    <a href={`?q=${def}`}>{def}</a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )
    }
  </dl>
  );
}

const Img = styled.img`
  max-width: 100%;
`;

const Figcaption = styled.figcaption``;

export default DefList;
