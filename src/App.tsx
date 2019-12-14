import React, { useState } from 'react';
import axios from 'axios';
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

  return (
    <Layout>
      <Header>medict</Header>
      <Content style={{ padding: '20px 50px' }}>
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
              {definitions?.map((def: any) => (
                <>
                  <dt key={def.meta.id}>{def.meta.id}</dt>
                  <dd>
                    {def.shortdef?.map((shortdef: string, idx: number) => (
                      <p key={idx}>{shortdef}</p>
                    ))}
                  </dd>
                </>
              ))}
            </dl>
          </Col>
        </Row>
      </Content>
      <Footer>i made this</Footer>
    </Layout>
  );
}

export default App;
