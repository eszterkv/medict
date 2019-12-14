import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AutoComplete,
  Col,
  Input,
  Layout,
  Row,
  Typography,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import 'antd/dist/antd.less';

import DefList from './components/deflist';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const App: React.FC = () => {
  const [definitions, setDefinitions] = useState();

  useEffect(() => {
    const query = window?.location?.search;
    if (query)
      search(query.substr(3).replace(/:\d+$/, ''));
  }, []);

  function search(e: any) {
    const baseUrl = 'https://dictionaryapi.com/api/v3/references/medical/json/';
    const apiKey = process.env.REACT_APP_DICT_API_KEY;
    const term = typeof e === 'string' ? e : e?.target?.value;

    if (window?.location?.search !== term)
      window?.history?.pushState({ q: term }, term, `?q=${term}`);

    axios.get(`${baseUrl}${term}?key=${apiKey}`)
      .then(res => {
        setDefinitions(res.data);
      })
      .catch(console.log);
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header>
        <strong>
          <a href="/">medict</a>
        </strong>
      </Header>
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
            <DefList definitions={definitions} />
          </Col>
        </Row>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        <Text type="secondary">
          <small>
            Coded by <a href="https://eszter.space/">me</a>{' '}
            using the amazing <a href="https://dictionaryapi.com/">Merriam-Webster dictionary API</a>
          </small>
        </Text>
      </Footer>
    </Layout>
  );
}

export default App;
