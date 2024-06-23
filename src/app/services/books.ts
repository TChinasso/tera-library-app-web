import { AxiosResponse } from "axios";
import instance from "./axios"

export default {
  async getBooks(searchParams?: any) {
    return await instance.get<PaginatedResponse<Book>>('/books', {params: {...searchParams}})
  },
  async getBookById(id: any){
    return await instance.get<Book>(`/books/${id}`)
  }
}


interface PaginatedResponse<type> {
  data: type[],
  page: number,
  limit: number,
  totalItems: number
}

export interface Book {
  name: string;
  author: string;
  description: string;
  cover_picture: string;
  category: string;
  stock: string;
  users_who_liked: string[];
  _id: number
}