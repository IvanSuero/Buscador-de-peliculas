import { useEffect, useState, useRef, useCallback } from 'react'
import './App.css'
import { Movies } from './Components/Movies'
import { useMovies } from './hooks/useMovies'
import debounce from 'just-debounce-it'

function useSearch() {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true) //FLAG

  useEffect(() => {
    if(search === '') {
      if(isFirstInput.current){
        isFirstInput.current = search === ''
        return
      }
      setError('No se puede buscar una película vacía')
      return
    }

    if(search.match(/^\d+$/)) {
      setError('No se puede buscar una película con un número')
      return
    }

    if(search.length<3){
      setError('La busqueda debe tener al menos 3 caracteres')
      return
    }

    setError(null)
  }, [search])

  return {search, updateSearch, error}
}

function App() {
  const [sort, setSort] = useState(false)

  const { search, updateSearch, error } = useSearch()
  const { movies, loading, getMovies } = useMovies({ search, sort })

  const debouncedGetMovies = useCallback(
    debounce(search => {
      getMovies({ search })
    }, 300)
    , [getMovies]
  )

  const handleSort = () => {
    setSort(!sort)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({ search })
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch)
    debouncedGetMovies(newSearch)
  }

  return (
    <div className='page'>

      <header>
        <h1>Buscador de películas</h1>
        <form className='form' onSubmit={handleSubmit}>
          <input style={{
            border: '2px solid transparent',
            borderColor: error ? 'red': 'transparent'
          }} onChange={handleChange} value={search} name='query' type="text" placeholder='Avengers, Star Wars, The Matrix...' />
          <input type="checkbox" onChange={handleSort} checked={sort}/>
          <button type='submit'>Search</button>
        </form>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </header>
      
      <main>
        {
          loading ? <p>Loading ...</p> : <Movies movies={movies}/>
        }
      </main>

    </div>
  )
}

export default App
