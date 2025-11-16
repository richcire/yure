"use client";

import { useState } from "react";

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    keyword: "",
    permalink: "",
    releaseDate: "",
    lyrics: "",
    artistInContent: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    return (
      formData.title.length > 0 &&
      formData.artist.length > 0 &&
      formData.permalink.length > 0 &&
      formData.lyrics.length > 0
    );
  };

  const handleOpen = () => {
    const autoPost = document.getElementById("autoPost");
    if (autoPost) {
      (autoPost as HTMLDialogElement).showModal();
    }
  };

  const handleClose = () => {
    const autoPost = document.getElementById("autoPost");
    if (autoPost) {
      (autoPost as HTMLDialogElement).close();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    console.log(formData);
  };

  return (
    <>
      <dialog id="autoPost">
        <p>Auto Post</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">제목</label>
            <input
              type="text"
              placeholder="제목"
              id="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="artist">아티스트</label>
            <input
              type="text"
              placeholder="아티스트"
              id="artist"
              value={formData.artist}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="artist">본문 내 아티스트</label>
            <textarea
              placeholder="본문 내 아티스트"
              id="artistInContent"
              value={formData.artistInContent}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="keyword">키워드</label>
            <input
              type="text"
              placeholder="키워드"
              id="keyword"
              value={formData.keyword}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="permalink">퍼마링크</label>
            <input
              type="text"
              placeholder="퍼마링크"
              id="permalink"
              value={formData.permalink}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="releaseDate">발매일</label>
            <input
              type="text"
              placeholder="발매일"
              id="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="lyrics">가사 원문</label>
            <textarea
              placeholder="가사 원문"
              id="lyrics"
              value={formData.lyrics}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md"
            disabled={!validateForm()}
          >
            {validateForm() ? "생성" : "모든 필드를 입력해주세요."}
          </button>
        </form>
        <button
          onClick={handleClose}
          className="bg-red-500 text-white p-2 rounded-md"
        >
          닫기
        </button>
      </dialog>
      <button onClick={handleOpen}>열기</button>
    </>
  );
}
