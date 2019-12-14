import React from 'react';
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
  return (
    <Layout>
      <Header>medict</Header>
      <Content style={{ padding: '20px 50px' }}>
        <Row align="middle" justify="center">
          <Col xs={24} md={12}>
            <AutoComplete
              style={{ width: '100%' }}
              options={[]}
              onSelect={() => {}}
              onSearch={() => {}}
            >
              <Input
                size="large"
                suffix={<SearchOutlined />}
                placeholder="Search term…"
              />
            </AutoComplete>
          </Col>
        </Row>
      </Content>
      <Footer>i made this</Footer>
    </Layout>
  );
}

export default App;
