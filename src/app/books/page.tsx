'use client'
import booksService, { Book } from '@/app/services/books'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button, Card, Dropdown, Input, MenuProps, Pagination, Space, Typography } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import { HeartOutlined } from '@ant-design/icons';
const { Meta } = Card;
const { Search } = Input;
export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [data, setData] = useState<Book[]>([])
  const [page, setPage] = useState<string>('1')
  const [search, setSearch] = useState('')
  const [order, setOrder] = useState('id')
  const [totalItems, setTotalItems] = useState(0)
  const [limit, setLimit] = useState(10)
  const fetchBooks = async (searchParams?: any) => {
    try {
      const payload = {
        order: order,
        page: page,
        limit: limit,
        search: search,
        ...searchParams
      }
      const { data } = await booksService.getBooks(payload)
      setData(data.data)
      setPage(String(data.page))
      setTotalItems(data.totalItems)
      console.log(page, 'page')
    } catch (error) {
      console.error(error)
    } finally {
      updateQueryParams()
    }
  }
  useEffect(() => {
    fetchBooks()
  }, [])

  const onSearch: SearchProps['onSearch'] = (value) => {
    setSearch(value)
    fetchBooks({ search: value })
  }
  const pageChange = async (page: number) => {
    return await fetchBooks({ page: page })
  }

  const updateQueryParams = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page);
    newParams.set('order', String(order));
    newParams.set('limit', String(limit));
    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Melhores Avaliados',
      onClick: () => {
        setOrder('likes')
        fetchBooks({ order: 'likes' })
      }
    },
    {
      key: '2',
      label: 'Em estoque',
      onClick: () => {
        fetchBooks({ inStock: true })
      }
    },
    {
      key: '3',
      label: 'Ordem alfabética',
      onClick: () => {
        setOrder('name')
        fetchBooks({ order: 'name' })
      }
    },
    {
      key: '4',
      label: 'Livros curtidos',
      onClick: async () => {
        await fetchBooks({ limit: 1000 })
        const myLikedBooks = data.filter(book => {

        })
        setData(myLikedBooks)
      }
    },
  ];
  const gotoBookPage = (book: Book) => {
    router.push(`/books/${book._id}`)
  }
  return (
    <div className='container flex-col flex items-center' style={{ height: '100%' }}>
      <div className='flex items-center'>
        <Search className='my-6 self-start' placeholder="Procure uum livro, autor ou categoria" onSearch={onSearch} style={{ width: 400 }} />
        <Dropdown
          menu={{
            items,
            selectable: true,
            defaultSelectedKeys: ['3'],
          }}
        >
          <Button>Filtros</Button>
        </Dropdown>
      </div>
      <div className='grow'>
        <div className="flex flex-wrap justify-center items-start gap-6">
          {data?.map((book, index) => (
            <div key={index}
              onClick={() => gotoBookPage(book)}
            >
              <Card
                hoverable
                style={{ width: 240, height: 340 }}
                cover={<img alt="example" style={{ height: 200 }} src={book.cover_picture} />}
              >
                <div className="title"><h2>{book.name}</h2></div>
                <div className="flex justify-between">
                  <div className="col flex flex-col">
                    <span>{book.author}</span>
                    <span>{book.category}</span>
                  </div>
                  <div className="col">
                    {book.users_who_liked.length}
                    <HeartOutlined />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className='my-6'>
        <Pagination
          total={totalItems}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} books`}
          defaultPageSize={limit}
          defaultCurrent={Number(page)}
          onChange={pageChange}
        />
      </div>
    </div>

  )
}