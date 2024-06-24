'use client';

import { Button, Layout, ConfigProvider, theme as antdTheme } from 'antd';
import { Typography } from 'antd';
import { useState, createContext } from 'react';
import { useThemeStore } from '@/store/main'
const { Title } = Typography;
const { Header, Footer, Content } = Layout;

const AntdLayout = ({ children }: { children: React.ReactNode }) => {
  const { defaultAlgorithm, darkAlgorithm } = antdTheme;
  const { isDarkMode, setDarkMode } = useThemeStore()
  const handleClick = () => {
    setDarkMode(!isDarkMode);
  }
  return (
    <ConfigProvider theme={{algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm}}>
      <Layout>
      <Header>
        <div className='flex justify-between items-center'>
        <h1 style={{fontSize: 24, fontWeight: 800}} className='text-white'>Tera library</h1>
        <Button onClick={handleClick}>toggle theme</Button>
        </div>
      </Header>
      <Content className='pb-2' style={{height: 'calc(100vh - 64px)', overflow: 'auto'}}>{children}</Content>
    </Layout>
    </ConfigProvider>
  );
};

export default AntdLayout;