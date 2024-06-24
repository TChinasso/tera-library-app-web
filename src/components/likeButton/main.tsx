import React, { useState, FC } from 'react';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import './LikeButton.css';
import { Book } from '@/services/books';
import { useThemeStore } from '@/store/main';
type LikeButtonProps = {
  handleLikeChange: (liked: boolean, event: MouseEvent, book: Book) => void,
  isLiked: boolean,
  book: Book
}
const LikeButton: FC<LikeButtonProps> = ({ handleLikeChange, isLiked, book }) => {
  const [liked, setLiked] = useState(isLiked);
  const [animateLike, setANimateLike] = useState(false);
  const { isDarkMode } = useThemeStore()

  const handleLike = (event: any) => {
    setLiked(!liked);
    setANimateLike(!liked);
    handleLikeChange(!liked, event, book)
  };



  if (isDarkMode) {
    return (
      <HeartFilled style={{ color: liked ? '#FF0000' : 'white' }} className={`like-button ${animateLike ? 'liked' : ''}`} onClick={(event) => { handleLike(event) }} />
    );
  } else {
    return (
      <HeartFilled style={{ color: liked ? '#FF0000' : 'black' }} className={`like-button ${animateLike ? 'liked' : ''}`} onClick={(event) => { handleLike(event) }} />
    );
  }
};

export default LikeButton;