import {useEffect, useState} from 'react';
import axios from 'axios';


export default function useBookSerach(query, pageNumber) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [books, setBooks] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [end, setEnd] = useState(false);

    // remove old books list when we search for new books
    useEffect(() => { 
        setBooks([]);
    }, [query]);

    // get books title from the api and handle errors 
    useEffect(() => {
        setLoading(true);
        setError(false);
        setEnd(false);
        let cancle;
        axios({
            method: 'GET',
            url: 'http://openlibrary.org/search.json',
            params: { q: query, page: pageNumber },
            cancelToken: new axios.CancelToken(c => cancle = c) // axios way to cancel old requesets when tring to call new request.
        }).then(res => {
            // console.log(res.data.docs);
            setBooks(prevBooks => {
                return [...new Set([...prevBooks, ...res.data.docs.map(b => b.title)])]
            })
            setHasMore(res.data.docs.length > 0);
            setLoading(false);
            setEnd(res.data.docs.length === 0);
        }).catch(e => { // catch the error if cancle and ignore it
            if(axios.isCancel(e)) return;
            setError(true);
        })
        return () => cancle();
    }, [query, pageNumber])

  return ( { loading, error, books, hasMore, end } )
}
