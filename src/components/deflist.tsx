import React from 'react';
import styled from 'styled-components';
import { Collapse } from 'antd';

const illustrationUrl = 'https://merriam-webster.com/assets/mw/static/art/dict/';
const { Panel } = Collapse;

interface DefListProps {
  definitions: any[] | null;
}

const DefList: React.FC<DefListProps> = ({ definitions }) => {
  function parseEntry(text: string = ''): any {
    if (Array.isArray(text))
      return parseEntry(text[0]?.[0]?.[1] || '');

    return text
      .replace(/^\{bc\}/, '')
      .replace(/( )?\{bc\}/g, ': ')
      .replace(/( )?\{dx\}/g, '<br /><small>')
      .replace(/( )?\{\/dx\}/g, '</small>')
      .replace(/(?:\{(?:sx|dxt|a_link|d_link|et_link|i_link|mat)\|)([\w\s.,:+-]+)(?:[|])?([\w\s.,:+-]+)?(?:\|)?(?:\d+)?\}/g, (_, text, href) =>
        `<a href="?q=${href || text}">${text}</a>`
      )
      .replace(/(?:\{it\})([\w\s.,:+-]+)(?:\{\/it\})/g, (_, text) => `<em>${text}</em>`)
      .replace(/(?:\{)(\/)?(inf|sup)(\})/g, (_, slash, tag) =>
        `<${slash || ''}${tag === 'sup' ? 'sup' : 'sub'}>`
      )
    ;
  }

  function parseCaption(text: string = '') {
    return text
      .replace(/(?:\{it\})([\w\s.,:+-]+)(?:\{\/it\} )/g, (_, text) => `<br /><em>${text}</em> `)
  }

  return (
    <StyledCollapse bordered={false} defaultActiveKey={[0]}>
      {definitions && definitions.filter((def: any) => typeof def !== 'string').length > 0
        ? definitions.map((definition: any, idx: number) => (
          <Panel key={idx} header={
            <dt>
              {definition.meta?.id} <Italic>{definition.fl}</Italic>
            </dt>
          }>
            <dd>
              {definition.def?.map((def: any, idx: number) => (
                <div key={idx}>
                  {def.sseq.map((sseq: any, idx: number) => (
                    <div key={idx}>
                      {sseq.map((sense: any, idx: number) => (
                        <Sense key={idx}>
                          {sense?.[1]?.sn && <strong>{sense[1].sn}<br /></strong>}
                          <div dangerouslySetInnerHTML={{ __html: parseEntry(sense?.[1]?.dt?.[0]?.[1]) }} />
                        </Sense>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
              {definition.art && (
                <figure>
                  <Img src={`${illustrationUrl}${definition.art.artid}.gif`} alt="" />
                  <Figcaption>
                    <div dangerouslySetInnerHTML={{ __html: parseCaption(definition.art.capt) }} />
                  </Figcaption>
                </figure>
              )}
            </dd>
          </Panel>
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
      )}
    </StyledCollapse>
  );
}

const Img = styled.img`
  max-width: 100%;
`;

const Italic = styled.em`
  @import url('https://fonts.googleapis.com/css?family=Noto+Serif:400i&display=swap');
  font-family: 'Noto Serif';
  margin-left: 2px;
  opacity: .75;
`;

const Figcaption = styled.figcaption`
  font-size: 15px;
`;

const Sense = styled.div`
  margin-bottom: 8px;
`;

const StyledCollapse = styled(Collapse)`
  margin-top: 20px;
`;

export default DefList;
