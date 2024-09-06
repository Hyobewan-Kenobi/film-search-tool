"use client"
import { useState } from 'react';
import Image from 'next/image'

export default function Home() {
  const [id, setId] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [error, setError] = useState(null)
  const [isImageError, setIsImageError] = useState<boolean>(false);

  const fetchMovie = async ()=>{
    const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY
    const url = `http://www.omdbapi.com/?t=${id}&plot=full&apikey=${apiKey}`

    try {
      const response = await fetch(url);
      if (!response.ok){
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json();
      setMovieData(data)
      setError(null)
    } catch (error: any) {
      setError(error.message);
      setMovieData(null)
    }

  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      fetchMovie();
    }
  };

  const isPosterValid = (poster: string) => poster !== 'N/A';
  
  return (
    <div>
      <h1 className='font-bold text-4xl pt-4 flex flex-col justify-center items-center'>🎥 Film Search</h1>
      <div className='flex flex-col justify-center items-center border-2 border-blue-500 max-w-[400px] mx-auto mt-4 p-6 rounded-xl mb-4'>
        <p className="pb-4 text-center">Look up a movie or TV series, powered by OMDb API</p>
        <div className='flex gap-2'>
          <input
            type="text"
            placeholder="Enter Title of Film"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={handleKeyPress}
            className="rounded-full border-0 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
          />
          <button className="rounded-full bg-blue-500 text-white font-bold px-4 py-2 text-l hover:bg-blue-700" onClick={fetchMovie}>Get Movie Info</button>
        </div>
        

        {error && <p className='pt-6' style={{ color: 'red' }}>{error}</p>}
        {movieData && (
          <div>
            {isPosterValid(movieData.Poster) && !isImageError ? (
              <Image
                src={movieData.Poster}
                width={200}
                height={300}
                alt="film poster"
                className="py-4 mx-auto"
                onError={() => setIsImageError(true)} // Handle broken images
              />
            ) : (
              <p className='py-4 text-red-500'>Image not available</p>
            )}
            <div className='flex flex-col gap-2'>
              <p>Title: {movieData.Title}</p>
              <p>Released Date: {movieData.Released}</p>
              <p>Type: {movieData.Type}</p>
              <p>Country: {movieData.Country}</p>
              <p>Genre: {movieData.Genre}</p>
              <p>Director: {movieData.Director}</p>
              <p>Writer: {movieData.Writer}</p>
              <p>Actors: {movieData.Actors}</p>
              <p>{movieData.Plot}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
