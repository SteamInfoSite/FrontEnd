package kr.ac.ync.Movie.service;

import kr.ac.ync.Movie.domain.Movie;
import kr.ac.ync.Movie.dto.MovieRequestDto;
import kr.ac.ync.Movie.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MovieService {

    private final MovieRepository movieRepository;

    // 1. Create
    @Transactional
    public Movie savedMovie(MovieRequestDto dto) {
        // 비즈니스 로직 및 DTO -> Entity 변환을 Service에서 담당
        Movie movie = dto.toEntity();
        return movieRepository.save(movie);
    }
    // 2. Read (전체 목록 조회)
    public List<Movie> findAllMovies(){
        return movieRepository.findAll();
    }

    // 2-2. Read (단건 상세 조회)
    public Movie findMovieById(Long id){
        return movieRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당 영화가 존재하지 않습니다. id = " + id));
    }

    // 3. Update
    @Transactional
    public Movie updateMovie(Long id, MovieRequestDto dto){
        Movie movie = movieRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("해당 영화가 존재하지 않습니다. id = " + id));

        movie.setTitle(dto.getTitle());
        movie.setPosterUrl(dto.getPosterUrl());
        movie.setPopular(dto.isPopular());

        return movie;
    }

    @Transactional
    public void deleteMovie(Long id) {
        Movie movie = movieRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("해당 영화가 존재하지 않습니다. id = " + id));
        movieRepository.delete(movie);
    }
}