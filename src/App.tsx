import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {
  AutoComplete,
  Col,
  Input,
  Layout,
  Row,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import 'antd/dist/antd.less';

const { Header, Content, Footer } = Layout;

const illustrationUrl = 'https://merriam-webster.com/assets/mw/static/art/dict/';

const App: React.FC = () => {
  const [definitions, setDefinitions] = useState();

  function search(e: any) {
    const baseUrl = 'https://dictionaryapi.com/api/v3/references/medical/json/';
    const apiKey = process.env.REACT_APP_DICT_API_KEY;
    const term = e?.target?.value;

    axios.get(`${baseUrl}${term}?key=${apiKey}`)
      .then(res => {
        setDefinitions(res.data);
      })
      .catch(console.log);
  }

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
    <Layout>
      <Header>medict</Header>
      <Content style={{ padding: '20px 30px' }}>
        <Row align="middle" justify="center">
          <Col xs={24} md={12}>
            <AutoComplete
              style={{ width: '100%' }}
              options={[]}
              onSelect={search}
              onSearch={() => {}}
            >
              <Input
                size="large"
                suffix={<SearchOutlined />}
                placeholder="Search term…"
                onPressEnter={search}
              />
            </AutoComplete>
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
          </Col>
        </Row>
      </Content>
      <Footer>i made this</Footer>
    </Layout>
  );
}

const Img = styled.img`
  max-width: 100%;
`;

const Figcaption = styled.figcaption``;

export default App;
