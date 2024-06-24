'use client'
import booksService, { Book } from '@/services/books'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button, Card, Dropdown, Input, MenuProps, Pagination, Space, Typography } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import { HeartOutlined } from '@ant-design/icons';
const { Search } = Input;
import LikeButton from '../../components/likeButton/main';


export default function Page() {

  const router = useRouter()
  const searchParams = useSearchParams()
  const [data, setData] = useState<Book[]>([])
  let page = '1'
  const [search, setSearch] = useState('')
  let order = 'name'
  const [totalItems, setTotalItems] = useState(0)
  const [limit, setLimit] = useState(10)
  if (searchParams.get('page')) {
    page = searchParams.get('page') ?? '1'
  }
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
      const books = data.data
      books.forEach((book: Book, index) => {
        const isliked = isLikedBook(book)
        if (isliked) {
          books[index].users_who_liked.push('me')
        }
      })
      setData(books)
      page = String(data.page)
      setLimit(data.limit)
      setTotalItems(data.totalItems)
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
    await fetchBooks({ page: page })
    updateQueryParams()

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
        order = 'likes'
        fetchBooks({ order: 'likes' })
      }
    },
    {
      key: '2',
      label: 'Em estoque',
      onClick: () => {
        fetchBooks({ inStock: true, page: '1' })
      }
    },
    {
      key: '3',
      label: 'Ordem alfabética',
      onClick: () => {
        order = 'name'
        fetchBooks({ order: 'name' })
      }
    },
    {
      key: '4',
      label: 'Livros curtidos',
      onClick: async () => {
        await fetchBooks({ limit: 1000 })
        const myLikedBooks = data.filter(book => {
          return isLikedBook(book)
        })
        console.log(myLikedBooks)
        setData(myLikedBooks)
      }
    },
  ];
  const gotoBookPage = (book: Book) => {
    router.push(`/books/${book._id}`)
  }
  const handleLikeChange = (liked: Boolean, event: MouseEvent, book: Book) => {
    event.preventDefault()
    event.stopPropagation()
    if (!localStorage.getItem('likedBooks')) {
      localStorage.setItem('likedBooks', '')
    }
    let likedBooks: any = localStorage.getItem('likedBooks')
    likedBooks = likedBooks?.split(',')
    if (liked) {
      likedBooks.push(book._id)
      data.forEach((item: Book, index) => {
        if (item._id == book._id) {
          data[index].users_who_liked.push('me')
          console.log(data[index].users_who_liked)
        }
      })
      setData(data)
    } else {
      const index = likedBooks.indexOf(book._id)
      likedBooks.splice(index, 1)
      data.forEach((item: Book, index) => {
        if (item._id == book._id) {
          data[index].users_who_liked.splice(0, 1)
        }
      })
      setData(data)
    }
    likedBooks.join(',')
    localStorage.setItem('likedBooks', likedBooks)
    return true
  }
  const isLikedBook = (book: Book): boolean => {
    let likedBooks: any = localStorage.getItem('likedBooks')
    if (!likedBooks) return false
    likedBooks = likedBooks?.split(',')
    return likedBooks.some((bookId: string) => {
      return bookId === book._id
    })
  }
  return (
    <div className='container flex-col flex items-center' style={{ height: '100%' }}>
      <div className='flex items-center justify-between px-2' style={{ width: '100%' }}>
        <Search className='my-6 self-start mr-4' placeholder="Procure uum livro, autor ou categoria" onSearch={onSearch} style={{ width: 400 }} />
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
            <div key={book._id}
              onClick={() => gotoBookPage(book)}
            >
              <Card
                hoverable
                style={{ width: 240, height: 340 }}
                cover={<img alt="example" style={{ height: 200 }} src={book.cover_picture} />}
              >
                <div className="flex justify-between items-center">
                  <div className="title"><h2>{book.name}</h2>
                    <div className="col flex flex-col">
                      <span>{book.author}</span>
                      <span>{book.category}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">


                  </div>
                  <div className="col">
                    <LikeButton handleLikeChange={handleLikeChange} book={book} isLiked={isLikedBook(book)} />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className='my-6 pb-6'>
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