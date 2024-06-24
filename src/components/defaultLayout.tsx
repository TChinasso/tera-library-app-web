'use client';

import { Button, Layout, ConfigProvider, theme as antdTheme, FloatButton } from 'antd';
import { useThemeStore } from '@/store/main'
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
const { Header, Content } = Layout;

const AntdLayout = ({ children }: { children: React.ReactNode }) => {
  const { defaultAlgorithm, darkAlgorithm } = antdTheme;
  const { isDarkMode, setDarkMode } = useThemeStore()
  const router = useRouter()
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
      <FloatButton
      shape="square"
      type="primary"
      style={{ right: 24 }}
      icon={<PlusOutlined />}
      onClick={() => router.push('books/new')}
    />
    </Layout>
    </ConfigProvider>
  );
};

export default AntdLayout;