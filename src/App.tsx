import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AutoComplete,
  Col,
  Input,
  Layout,
  Radio,
  Row,
  Typography,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import 'antd/dist/antd.less';

import DefList from './components/deflist';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const App: React.FC = () => {
  const APIs: any = {
    standard: {
      baseUrl: 'https://dictionaryapi.com/api/v3/references/collegiate/json/',
      key: process.env.REACT_APP_DICT_API_KEY,
    },
    medical: {
      baseUrl: 'https://dictionaryapi.com/api/v3/references/medical/json/',
      key: process.env.REACT_APP_DICT_API_KEY_MED,
    },
  };

  const [api, setApi] = useState(APIs[localStorage?.getItem('medict-api') || 'standard']);
  const [definitions, setDefinitions] = useState();
  const [error, setError] = useState();

  useEffect(searchFromUrlParams, [api]);

  useEffect(() => {
    setError(null);
  }, [api, definitions]);

  function search(e: any) {
    const term = typeof e === 'string' ? e : e?.target?.value;

    if (window?.location?.search !== term)
      window?.history?.pushState({ q: term }, term, `?q=${term}`);

    axios.get(`${api.baseUrl}${term}?key=${api.key}`)
      .then(res => {
        setDefinitions(res.data);
      })
      .catch(setError);
  }

  function searchFromUrlParams() {
    const query = window?.location?.search;
    if (query)
      search(query.substr(3).replace(/:\d+$/, ''));
  }

  function switchDict(e: any) {
    setApi(APIs[e.target.value]);
    localStorage.setItem('medict-api', e.target.value);
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header>
        <h3>
          <a href="/">medict</a>
        </h3>
        <Radio.Group
          onChange={switchDict}
          defaultValue={localStorage.getItem('medict-api') || 'standard'}
        >
          <Radio.Button value="standard">Standard</Radio.Button>
          <Radio.Button value="medical">Medical</Radio.Button>
        </Radio.Group>
      </Header>
      <Content style={{ padding: '80px 30px 20px' }}>
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
            {error && `Something went wrong: ${error.message}`}
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
