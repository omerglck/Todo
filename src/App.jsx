import { useEffect, useState } from "react";
import axios from "axios";
import ListItem from "./components/ListItem";
import { v4 as id } from "uuid";
//! axios'un yapacağı isteklerin basURL'ini tanımlama
axios.defaults.baseURL = "http://localhost:3030";

function App() {
  const [todos, setTodos] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState();
  const [maxPage, setMaxPage] = useState();
  //API'a göndereceğimiz bilgiler
  const options = {
    _limit: 5,
    _page: page,
  };

  //* Bileşenin ekrana gelme anında ve sayfa değiştiğinde verileri çek
  useEffect(() => {
    axios
      .get("/todos", { params: options, timeout: 5000 }) //* 5 saniyelik bir zaman aşımı uygular.
      .then((res) => {
        const itemCount = Number(res.headers["x-total-count"]);

        // maximum sayfa sayını hesaplama
        const max = Math.ceil(itemCount / options._limit);
        setMaxPage(max);
        setTotalCount(itemCount);
        setTodos(res.data);
      })
      .catch((err) => console.log(err));
  }, [page]);

  //* Eleman ekleme Yeni Todo ekleme
  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target[0].value === "") {
      alert("Input alanı boş olamaz");
      return;
    }

    //* Gönderilecek(eklenecek) olan todoyu hazırlama
    const newTodo = {
      id: id(),
      title: e.target[0].value,
      date: new Date(),
      isDone: false,
    };
    // todo'yu api'a ekleme
    axios
      .post("/todos", newTodo)
      // todo'yu state'e ekleme
      .then(() => {
        // eğer ki sayfada max sayıda eleman bulunuyorsa
        // kullanııyı son sayfaya yönlendir.
        if (todos.length == options._limit) {
          // eğer ki son sayfa doluysa son sayfanın bir fazlasına
          // son sayfa dolu değilse son sayfaya yönlendir.
          setPage(totalCount % options._limit === 0 ? maxPage + 1 : maxPage);
          return;
        }

        setTodos([...todos, newTodo]);
      });

    //* Inputu temizleme
    e.target[0].value = "";
  };
  return (
    <div className="container my-4">
      <h2 className="text-center">Yapılacaklar</h2>
      <form onSubmit={handleSubmit} className="d-flex gap-3 my-4">
        <input type="text" className="form-control" />
        <button className="btn btn-primary">Ekle</button>
      </form>
      {/* api'dan gelen cevabı beklerken */}
      {!todos && <h3>Yükleniyor...</h3>}

      {/* api'dan cevap geldikten sonra çalışır */}
      <ul className="list-group">
        {todos?.map((todo) => (
          <ListItem
            key={todo.id}
            todo={todo}
            todos={todos}
            setTodos={setTodos}
          />
        ))}
      </ul>
      <div className="d-flex justify-content-between my-4">
        <button
          disabled={page <= 1}
          onClick={() => {
            if (page > 1) {
              setPage(page - 1);
            }
          }}
          className="btn btn-primary w-25"
        >
          Geri
        </button>
        <p className="fs-5 fw-bolder">{page}</p>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === maxPage}
          className="btn btn-primary w-25"
        >
          İleri
        </button>
      </div>
    </div>
  );
}

export default App;
