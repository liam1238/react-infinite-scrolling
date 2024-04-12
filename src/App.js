import React, { useState, useRef, useCallback } from 'react';
import useBookSerach from './useBookSerach';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  
  const {
    books,
    hasMore,
    loading,
    error,
    end
  } = useBookSerach(query, pageNumber);

  const observer = useRef(); // null by default
  const lastBookElementRef = useCallback(node => {
    if (loading) return; // dont call the api again and again
    if (observer.current) observer.current.disconnect()

    // when we see the last book element in the bottom of the list, we save it and now we know to use the paggination
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1);
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore]);


  function handleSearch (e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <div style={{padding: "10px", textAlign: "center"}}>
      <h1>Books List Search Engine</h1>
      <input style={{padding: "10px", width: "250px", fontSize: "larger", border: "1px solid #05a", borderRadius: "12px", marginBottom: "10px"}} 
        type="text" value={query} onChange={handleSearch}></input>
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return <div ref={lastBookElementRef} key={book} style={{marginBottom: "10px"}}>{book}</div>
        } else {
          return <div key={book} style={{marginBottom: "10px"}}>{book}</div>
        }
      })}
      <div style={{fontWeight: "bold", marginBottom: "10px"}}>{loading && 'Loading...'}</div>
      <div style={{fontWeight: "bold"}}>{end && (query !== '') && 'THE END!'}</div>
      <div>{error && 'Error'}</div>
    </div>
  );
}

export default App;
