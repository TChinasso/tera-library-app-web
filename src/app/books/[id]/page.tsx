'use client'
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Popconfirm, message } from 'antd';
import booksService, { Book } from '@/services/books'
import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined } from '@ant-design/icons';




export default function Page({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<Book | null>(null)
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [form] = Form.useForm();
  const { id } = params;
  const router = useRouter()

  const deleteBook = async (book: Book | null) => {
    if (!book) return
    try {
      await booksService.deleteBook(book?._id)
      message.success('Book deleted successfuly')
      router.replace('/books')
    } catch (error) {
      message.error('Failed on book deleting.')
      console.error(error)
    }
  }
  useEffect(() => {
    const getBookById = async () => {
      if (id === 'new') return
      try {
        const response = await booksService.getBookById(params.id)
        setBook(response.data)
        form.setFieldsValue(response.data);
      } catch (error) {
        console.error(error)
      }
    }

    getBookById()
  }, [id, form])

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };
  /* eslint-enable no-template-curly-in-string */
  const updateBook = async (payload: any) => {
    try {
      setLoadingUpdate(true)
      const response = await booksService.updateBook({ ...book, ...payload })
      message.success('Book updated successfuly')
      router.replace('/books')
    } catch (error) {
      message.error('Failed on book updating.')
      console.error(error)
    } finally {
      setLoadingUpdate(false)
    }
  }
  const createBook = async (payload: any) => {
    try {
      setLoadingUpdate(true)
      const response = await booksService.createBook({...payload })
      message.success('Book created successfuly')
      router.replace('/books')
    } catch (error) {
      message.error('Failed on book creating.')
      console.error(error)
    } finally {
      setLoadingUpdate(false)
    }
  }
  const onFinish = async (values: any) => {
    if (book?._id) {
      await updateBook(values)
    } else {
      await createBook(values)
    }
  };

  return (
    <div className='container flex items-center flex-col px-6 py-6'>
      <div className='self-start my-4'><Button onClick={() => router.back()} type='text'><ArrowLeftOutlined />Voltar</Button></div>
      <Form
        layout='vertical'
        name="nest-messages"
        onFinish={onFinish}
        style={{ maxWidth: 600, width: '100%' }}
        validateMessages={validateMessages}
        form={form}
        className='col-span-12'
      >
        <Form.Item name='name' label="Nome" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name='author' label="Autor" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name='cover_picture' label="Foto de capa">
          <Input />
        </Form.Item>
        <Form.Item name='category' label="Categoria">
          <Input />
        </Form.Item>
        <Form.Item name='stock' label="Quantidade em estoque">
          <InputNumber />
        </Form.Item>
        <Form.Item name='description' label="Descriçao">
          <Input.TextArea rows={10} />
        </Form.Item>
        <div className='flex justify-between'>
          <Popconfirm
            title="Delete the book"
            description="Are you sure to delete this book?"
            onConfirm={() => deleteBook(book)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>

          <Button disabled={loadingUpdate} type="primary" htmlType="submit">
            {book?._id ? 'Atualizar' : 'Adicionar'}
          </Button>
        </div>
      </Form>
    </div>
  )
}