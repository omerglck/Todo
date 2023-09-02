import axios from "axios";
import { useState, useRef } from "react";

const ListItem = ({ todo, todos, setTodos }) => {
  const [isEditing, setIsEditing] = useState(false);
  //* Ref kullanımı
  const inputRef = useRef();

  //! Elemanı ilk önce API'dan daha sonra ekrandan kaldırma
  const handleDelete = () => {
    axios.delete(`/todos/${todo.id}`).then(() => {
      //* API'dan silinen elemanı ekrandan kaldırma
      const filtred = todos.filter((item) => item.id !== todo.id);
      //* State'i güncelleme
      setTodos(filtred);
    });
  };

  //! isDone durumunu değiştirme
  const handleChange = (e) => {
    // isDone değerini tersine çevirme
    const updated = { ...todo, isDone: !todo.isDone };
    // API'ı güncelleme
    axios
      .put(`/todos/${todo.id}`, updated)
      // State'i güncelleme
      .then(() => {
        // dizideki id'sini bildiğimiz elemanı güncelleme
        const filtred = todos.map((item) =>
          item.id === updated.id ? updated : item
        );
        setTodos(filtred);
      });
  };

  //! Onay butonuna tıklanılırsa
  const handleEdit = () => {
    //* Objenin title değerini güncelleme
    const updated = { ...todo, title: inputRef.current.value };
    //* API'ı güncelleme
    axios
      .put(`todos/${updated.id}`, updated)
      //* State'i güncelleme
      .then(() => {
        // yeni bir dizi oluştur
        // güncellenmeyen bütün elemanları ekle
        // güncellenen elemanın eski hali yerine yenisini ekle
        const filtred = todos.map((item) =>
          item.id === updated.id ? updated : item
        );
        // state'i güncelle
        setTodos(filtred);
        // edit modal kapat
        setIsEditing(false);
      });
  };
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div className="d-flex gap-3">
        <input
          onChange={handleChange}
          type="checkbox"
          checked={todo.isDone}
          className="form-check-input"
        />
        <span>{todo.isDone ? "Tamamlandı" : "Devam Ediyor"}</span>
      </div>
      {/* Düzenleme modundaysa input değilse başlık bas */}
      {isEditing ? (
        <div className="d-flex gap-1">
          <input
            ref={inputRef}
            className="form-control shadow"
            defaultValue={todo.title}
          />
          <button onClick={handleEdit} className="btn btn-success shadow">
            Onayla
          </button>
        </div>
      ) : (
        <span>{todo.title}</span>
      )}

      <div className="btn-group">
        {isEditing ? (
          <button
            onClick={() => setIsEditing(false)}
            className="btn btn-secondary"
          >
            Vazgeç
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn btn-info">
            Düzenle
          </button>
        )}
        <button onClick={handleDelete} className="btn btn-danger">
          Sil
        </button>
      </div>
    </li>
  );
};

export default ListItem;
