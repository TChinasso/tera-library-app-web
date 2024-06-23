'use client'
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber } from 'antd';
import booksService, { Book } from '@/app/services/books'
import { useRouter, useSearchParams } from 'next/navigation';




export default function Page({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<Book | any>()
  const [form] = Form.useForm();
  const { id } = params;

  const deleteBook = async() => {
    try{
      const response = await booksService.deleteBook(book._id)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    const getBookById = async () => {
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

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <div>
      <Form
        layout='vertical'
        name="nest-messages"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        validateMessages={validateMessages}
        form={form}
      >
        <Form.Item name='name' label="Nome" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name='author' label="Autor" rules={[{ type: 'email' }]}>
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
        <Form.Item name='description' label="Descriçao" rules={[{ type: 'number', min: 0, max: 99 }]}>
          <Input.TextArea rows={10} />
        </Form.Item>
        <div className='flex justify-between'>
          <Button type="primary" danger onClick={() => deleteBook(book)}>
            Deletar
          </Button>
          <Button type="primary" htmlType="submit">
            {book._id ? 'Atualizar' : 'Adicionar'}
          </Button>
        </div>
      </Form>
    </div>
  )
}