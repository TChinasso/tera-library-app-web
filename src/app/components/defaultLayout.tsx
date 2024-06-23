'use client';

import { Layout } from 'antd';

const { Header, Footer, Content } = Layout;

const AntdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <Header></Header>
      <Content style={{height: 'calc(100vh - 64px)'}}>{children}</Content>
    </Layout>
  );
};

export default AntdLayout;